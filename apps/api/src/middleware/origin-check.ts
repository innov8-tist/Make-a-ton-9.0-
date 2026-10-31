import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../lib/app-error.js';

export const originCheck: RequestHandler = (req, _res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  if (req.get('Origin') !== env.WEB_URL || req.get('X-Requested-With') !== 'bl-web') {
    next(new AppError('ORIGIN_REJECTED', 403, 'Request origin rejected'));
    return;
  }
  next();
};
