import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  WEB_URL: z.string().url(),
  SESSION_TTL_MIN: z.coerce.number().int().positive(),
  SESSION_ABSOLUTE_HOURS: z.coerce.number().int().positive(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  COOKIE_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.message}`);
}

export const env = parsed.data;
