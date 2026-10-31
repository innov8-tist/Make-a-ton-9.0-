import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(9, 'Password must be more than 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[^\w\s]/, 'Password must contain a special character');

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Email must be valid').transform((email) => email.toLowerCase()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email must be valid').transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
});

export const createStaffSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Email must be valid').transform((email) => email.toLowerCase()),
  password: passwordSchema,
  role: z.enum(['STAFF'], { errorMap: () => ({ message: 'Only STAFF role can be created' }) }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Email must be valid').transform((email) => email.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
