import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/require-auth.js';
import { requireRole } from '../../middleware/require-role.js';
import {
  login,
  signup,
  createStaff,
  listStaff,
  forgotPassword,
  resetPasswordHandler,
} from './controller.js';
import {
  loginSchema,
  signupSchema,
  createStaffSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './schema.js';

export const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), signup);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);
authRouter.post('/staff', requireAuth, requireRole('ADMIN'), validate(createStaffSchema), createStaff);
authRouter.get('/staff', requireAuth, requireRole('ADMIN'), listStaff);
