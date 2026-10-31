import type { RequestHandler } from 'express';
import { env } from '../../config/env.js';
import { createLoginSession, registerCustomer, type LoginInput, type SignupInput } from './service.js';

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const user = await registerCustomer(req.body as SignupInput);
    res.status(201).json({
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { session, token, user } = await createLoginSession(req.body as LoginInput, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.cookie('session', token, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: 'lax',
      expires: session.expiresAt,
      path: '/',
    });

    res.status(200).json({
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    next(error);
  }
};
