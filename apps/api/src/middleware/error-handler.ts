import type { ErrorRequestHandler } from 'express';
import { AppError } from '../lib/app-error.js';
import { logger } from '../lib/logger.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.status).json({
      error: { code: error.code, message: error.message, ...(error.fields && { fields: error.fields }) },
    });
    return;
  }

  logger.error({ err: error }, 'Unhandled request error');
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
};
