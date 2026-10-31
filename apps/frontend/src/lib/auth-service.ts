import type {
  SignInFormData,
  SignUpFormData,
  AuthResponse,
  PasswordResetResult,
} from '@/types/auth';
import { authDevMock } from '@/lib/auth-dev-mock';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * The auth API does not implement the password reset endpoints yet, so dev
 * builds fall back to a local mock and production builds surface a real error.
 */
async function postWithDevFallback<T>(
  path: string,
  body: unknown,
  fallback: () => T,
  failureMessage: string,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    if (import.meta.env.DEV) return fallback();
    throw new Error(failureMessage);
  }

  if ([404, 405, 501].includes(response.status)) {
    if (import.meta.env.DEV) return fallback();
    throw new Error(failureMessage);
  }

  if (!response.ok) throw new Error(failureMessage);

  return response.json() as Promise<T>;
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(data: SignInFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Sign in failed');
    }

    return response.json();
  },

  /**
   * Sign up with email and password
   */
  async signUp(data: SignUpFormData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Sign up failed');
    }

    return response.json();
  },

  async requestPasswordReset(email: string): Promise<PasswordResetResult> {
    return postWithDevFallback(
      '/auth/forgot-password',
      { email },
      () => authDevMock.requestPasswordReset(email),
      'We could not reach the password reset service. Please try again.',
    );
  },

  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
    return postWithDevFallback(
      '/auth/reset-password',
      { token, password: newPassword },
      () => authDevMock.resetPassword(token, newPassword),
      'We could not reach the password reset service. Please try again.',
    );
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await fetch(`${API_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return response.json();
  },
};
