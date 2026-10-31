import type { RequestHandler } from 'express';
import { createHash } from 'node:crypto';
import { AppError } from '../lib/app-error.js';
import { db } from '../lib/db.js';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    let token = req.cookies.session;
    
    if (!token) {
      const authHeader = req.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new AppError('UNAUTHORIZED', 401, 'Authentication required');
    }

    const tokenHash = hashToken(token);
    const session = await db.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError('UNAUTHORIZED', 401, 'Invalid or expired session');
    }

    if (!session.user.isActive) {
      throw new AppError('UNAUTHORIZED', 401, 'Account is inactive');
    }

    await db.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('UNAUTHORIZED', 401, 'Authentication failed'));
    }
  }
};
