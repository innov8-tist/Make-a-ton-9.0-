import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { env } from '../../config/env.js';
import { AppError } from '../../lib/app-error.js';
import { db } from '../../lib/db.js';
import { addEmailJob } from '../../lib/queue.js';
import { logger } from '../../lib/logger.js';
import type {
  SignupInput,
  LoginInput,
  CreateStaffInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './schema.js';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  const salt = parts[1];
  const storedKey = parts[2];
  
  if (!salt || !storedKey) return false;

  const derived = await scryptAsync(password, salt, 64) as Buffer;
  const stored = Buffer.from(storedKey, 'hex');
  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function registerCustomer(input: SignupInput) {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('EMAIL_ALREADY_EXISTS', 409, 'An account with this email already exists', {
      email: ['Email is already registered'],
    });
  }

  const passwordHash = await hashPassword(input.password);

  const user = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    await tx.customer.create({
      data: {
        userId: user.id,
        contactName: input.name,
        email: input.email,
      },
    });

    return user;
  });

  return user;
}

export async function createLoginSession(
  input: LoginInput,
  metadata: { ip?: string | undefined; userAgent?: string | undefined },
) {
  const user = await db.user.findUnique({ where: { email: input.email } });
  
  if (!user || !user.isActive || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password');
  }

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_MIN * 60 * 1000);
  const session = await db.session.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });

  return { session, token, user };
}

export async function createStaffUser(input: CreateStaffInput, adminId: number) {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('EMAIL_ALREADY_EXISTS', 409, 'An account with this email already exists', {
      email: ['Email is already registered'],
    });
  }

  const passwordHash = await hashPassword(input.password);

  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'STAFF',
      createdById: adminId,
      mustChangePassword: true,
    },
  });

  return user;
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const user = await db.user.findUnique({ where: { email: input.email } });
  
  // Always return success to prevent email enumeration
  if (!user || !user.isActive) {
    logger.warn({ email: input.email }, 'Password reset requested for non-existent or inactive user');
    return { success: true };
  }

  // Delete any existing unused reset tokens for this user
  await db.passwordReset.deleteMany({
    where: { userId: user.id, usedAt: null },
  });

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  // Queue password reset email
  try {
    await addEmailJob({
      type: 'password-reset',
      email: user.email,
      token,
    });
    logger.info({ email: user.email }, 'Password reset email queued successfully');
  } catch (error) {
    logger.error({ error, email: user.email }, 'Failed to queue password reset email');
    throw new AppError('EMAIL_QUEUE_FAILED', 500, 'Failed to send password reset email. Please try again later.');
  }

  // Return token only in development for testing
  if (env.NODE_ENV === 'development') {
    return { success: true, token, email: user.email };
  }

  return { success: true };
}

export async function resetPassword(input: ResetPasswordInput) {
  const tokenHash = hashToken(input.token);
  
  const resetRecord = await db.passwordReset.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
    throw new AppError('INVALID_TOKEN', 400, 'Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(input.password);

  await db.$transaction([
    db.user.update({
      where: { id: resetRecord.userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
        mustChangePassword: false,
      },
    }),
    db.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
    db.session.deleteMany({
      where: { userId: resetRecord.userId },
    }),
  ]);

  // Queue password changed confirmation email (non-blocking)
  addEmailJob({
    type: 'password-changed',
    email: resetRecord.user.email,
    name: resetRecord.user.name,
  }).catch((error: unknown) => {
    logger.error({ error, email: resetRecord.user.email }, 'Failed to queue password changed email');
  });

  return { success: true };
}
