import type { RequestHandler } from 'express';
import type { UserRole } from '@prisma/client';
import { AppError } from '../lib/app-error.js';

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    // @ts-expect-error - user is added by requireAuth middleware
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new AppError('UNAUTHORIZED', 401, 'Authentication required'));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError('FORBIDDEN', 403, 'Insufficient permissions'));
    }

    next();
  };
}
