import { Queue, Worker, type Job, type ConnectionOptions } from 'bullmq';
import { env } from '../config/env.js';
import { logger } from './logger.js';

// Redis connection configuration
const connection: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

// Email job data types
export interface PasswordResetEmailJob {
  type: 'password-reset';
  email: string;
  token: string;
}

export interface PasswordChangedEmailJob {
  type: 'password-changed';
  email: string;
  name: string;
}

export type EmailJob = PasswordResetEmailJob | PasswordChangedEmailJob;

// Create email queue
export const emailQueue = new Queue<EmailJob>('email', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000, // Keep up to 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
});

// Add email job to queue
export async function addEmailJob(jobData: EmailJob, options?: { priority?: number; delay?: number }) {
  try {
    const job = await emailQueue.add(jobData.type, jobData, {
      priority: options?.priority,
      delay: options?.delay,
    });
    
    logger.info({ jobId: job.id, type: jobData.type, email: jobData.email }, 'Email job added to queue');
    return job;
  } catch (error) {
    logger.error({ error, jobData }, 'Failed to add email job to queue');
    throw error;
  }
}

// Create email worker (processes jobs)
export function createEmailWorker() {
  const worker = new Worker<EmailJob>(
    'email',
    async (job: Job<EmailJob>) => {
      logger.info({ jobId: job.id, type: job.data.type, email: job.data.email }, 'Processing email job');

      // Dynamically import email module to avoid circular dependencies
      const { sendPasswordResetEmail, sendPasswordChangedEmail } = await import('./email.js');

      try {
        switch (job.data.type) {
          case 'password-reset':
            await sendPasswordResetEmail(job.data.email, job.data.token);
            break;
          
          case 'password-changed':
            await sendPasswordChangedEmail(job.data.email, job.data.name);
            break;
          
          default:
            throw new Error(`Unknown email job type: ${(job.data as any).type}`);
        }

        logger.info({ jobId: job.id, type: job.data.type, email: job.data.email }, 'Email job completed successfully');
      } catch (error) {
        logger.error(
          { error, jobId: job.id, type: job.data.type, email: job.data.email },
          'Email job failed'
        );
        throw error; // BullMQ will handle retry logic
      }
    },
    {
      connection,
      concurrency: 5, // Process up to 5 emails concurrently
      limiter: {
        max: 10, // Maximum 10 jobs
        duration: 1000, // Per 1 second (rate limiting)
      },
    }
  );

  // Worker event handlers
  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Email worker: Job completed');
  });

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err }, 'Email worker: Job failed');
  });

  worker.on('error', (err) => {
    logger.error({ error: err }, 'Email worker: Worker error');
  });

  return worker;
}

// Graceful shutdown
export async function closeQueue() {
  try {
    await emailQueue.close();
    logger.info('Email queue closed');
  } catch (error) {
    logger.error({ error }, 'Error closing email queue');
  }
}

export async function closeWorker(worker: Worker) {
  try {
    await worker.close();
    logger.info('Email worker closed');
  } catch (error) {
    logger.error({ error }, 'Error closing email worker');
  }
}
