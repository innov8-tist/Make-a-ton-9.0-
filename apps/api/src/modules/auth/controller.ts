import type { RequestHandler } from 'express';
import { env } from '../../config/env.js';
import {
  createLoginSession,
  registerCustomer,
  createStaffUser,
  requestPasswordReset,
  resetPassword,
  listStaffUsers,
} from './service.js';
import type {
  LoginInput,
  SignupInput,
  CreateStaffInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './schema.js';

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

export const createStaff: RequestHandler = async (req, res, next) => {
  try {
    const adminId = req.user!.id;
    const user = await createStaffUser(req.body as CreateStaffInput, adminId);
    res.status(201).json({
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listStaff: RequestHandler = async (_req, res, next) => {
  try {
    const staff = await listStaffUsers();
    res.status(200).json({
      data: {
        staff: staff.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          createdById: user.createdById,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await requestPasswordReset(req.body as ForgotPasswordInput);
    
    if (env.NODE_ENV === 'development' && result.token) {
      res.status(200).json({
        message: 'Password reset email sent',
        data: { token: result.token, email: result.email },
      });
    } else {
      res.status(200).json({
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler: RequestHandler = async (req, res, next) => {
  try {
    await resetPassword(req.body as ResetPasswordInput);
    res.status(200).json({
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};
