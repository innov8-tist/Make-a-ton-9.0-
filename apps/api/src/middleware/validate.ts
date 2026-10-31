import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/app-error.js';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodType, part: RequestPart = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const fields = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path.join('.'), [issue.message]]),
      );
      next(new AppError('VALIDATION_ERROR', 400, 'Request validation failed', fields));
      return;
    }
    (req as unknown as Record<RequestPart, unknown>)[part] = result.data;
    next();
  };
}
