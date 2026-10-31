import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { AppError } from '../../lib/app-error.js';
import { db } from '../../lib/db.js';

const scryptAsync = promisify(scrypt);

const passwordSchema = z
  .string()
  .min(9, 'Password must be more than 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[^\w\s]/, 'Password must contain a special character');

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Email must be valid').transform((email) => email.toLower()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email must be valid').transform((email) => email.toLower()),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64) as Buffer;
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  const derived = await scryptAsync(password, parts[1], 64) as Buffer;
  const stored = Buffer.from(parts[2], 'hex');
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

  return db.$transaction(async (tx) => {
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
