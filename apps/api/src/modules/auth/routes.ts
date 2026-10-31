import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { login, signup } from './controller.js';
import { loginSchema, signupSchema } from './service.js';

export const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), signup);
authRouter.post('/login', validate(loginSchema), login);
