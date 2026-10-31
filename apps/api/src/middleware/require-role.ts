import type { RequestHandler } from 'express';
import { AppError } from '../lib/app-error.js';

export function requireRole(_role: string): RequestHandler {
  return (_req, _res, next) => {
    next(new AppError('NOT_IMPLEMENTED', 501, 'Role authorization is not implemented'));
  };
}
