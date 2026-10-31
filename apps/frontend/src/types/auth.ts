export interface SignInFormData {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface PasswordResetResult {
  message: string;
  /** Only returned by the dev mock when the API is unavailable. */
  devToken?: string;
}

export type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}
