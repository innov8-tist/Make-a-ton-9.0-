import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { db } from './lib/db.js';
import { logger } from './lib/logger.js';
import { createEmailWorker, closeQueue, closeWorker } from './lib/queue.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { authRouter } from './modules/auth/routes.js';
import { billingRouter } from './modules/billing/routes.js';
import { customersRouter } from './modules/customers/routes.js';
import { discountsRouter } from './modules/discounts/routes.js';
import { invoicesRouter } from './modules/invoices/routes.js';
import { paymentsRouter } from './modules/payments/routes.js';
import { plansRouter } from './modules/plans/routes.js';
import { productsRouter } from './modules/products/routes.js';
import { reportsRouter } from './modules/reports/routes.js';
import { subscriptionsRouter } from './modules/subscriptions/routes.js';
import { taxesRouter } from './modules/taxes/routes.js';
import { templatesRouter } from './modules/templates/routes.js';
import { usersRouter } from './modules/users/routes.js';

export const app = express();

// CORS configuration - must be before other middleware
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const api = express.Router();
api.get('/health', async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    const { emailQueue } = await import('./lib/queue.js');
    const redisClient = await emailQueue.client;
    await redisClient.ping();
    
    res.status(200).json({ 
      data: { 
        status: 'ok',
        database: 'connected',
        redis: 'connected'
      } 
    });
  } catch (error) {
    logger.warn({ err: error }, 'Health check failed');
    res.status(503).json({ 
      error: { 
        code: 'SERVICE_UNAVAILABLE', 
        message: 'Service partially unavailable' 
      } 
    });
  }
});

api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/customers', customersRouter);
api.use('/products', productsRouter);
api.use('/plans', plansRouter);
api.use('/templates', templatesRouter);
api.use('/subscriptions', subscriptionsRouter);
api.use('/taxes', taxesRouter);
api.use('/discounts', discountsRouter);
api.use('/invoices', invoicesRouter);
api.use('/payments', paymentsRouter);
api.use('/billing', billingRouter);
api.use('/reports', reportsRouter);

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
const server = app.listen(port, () => logger.info({ port }, 'API server listening'));

// Initialize email worker
logger.info('Starting email worker...');
const emailWorker = createEmailWorker();
logger.info('Email worker started successfully');

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutdown signal received, starting graceful shutdown...');
  
  // Stop accepting new connections
  server.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    // Close email worker and queue
    await closeWorker(emailWorker);
    await closeQueue();
    
    // Close database connection
    await db.$disconnect();
    logger.info('Database connection closed');
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during graceful shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
