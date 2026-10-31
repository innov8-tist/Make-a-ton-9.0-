import type { RequestHandler } from 'express';
import { AppError } from '../lib/app-error.js';

export const requireAuth: RequestHandler = (_req, _res, next) => {
  next(new AppError('NOT_IMPLEMENTED', 501, 'Authentication is not implemented'));
};
