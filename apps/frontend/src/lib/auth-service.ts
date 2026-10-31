import type {
  SignInFormData,
  SignUpFormData,
  AuthResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  User,
} from '@/types/auth';
import axiosInstance from '@/lib/axios';

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(data: SignInFormData): Promise<User> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email: data.email,
      password: data.password,
    });

    return response.data.data.user;
  },

  /**
   * Sign up with email and password
   */
  async signUp(data: SignUpFormData): Promise<User> {
    const response = await axiosInstance.post<AuthResponse>('/auth/signup', {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return response.data.data.user;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ForgotPasswordResponse> {
    const response = await axiosInstance.post<ForgotPasswordResponse>('/auth/forgot-password', {
      email,
    });

    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    const response = await axiosInstance.post<ResetPasswordResponse>('/auth/reset-password', {
      token,
      password: newPassword,
    });

    return response.data;
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  },

  /**
   * Get current user (if endpoint exists)
   */
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<AuthResponse>('/auth/me');
    return response.data.data.user;
  },
};
