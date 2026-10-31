import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1),
  SESSION_TTL_MIN: z.coerce.number().int().positive().default(1440),
  SESSION_ABSOLUTE_HOURS: z.coerce.number().int().positive().default(168),
  COOKIE_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true').default('false'),
  RESEND_API_KEY: z.string().min(1),
  FROM_EMAIL: z.string().email().default('noreply@notifications.naveenravi.dev'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  COMPANY_NAME: z.string().default('Shastri Designs'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

export const env = parsed.data;
