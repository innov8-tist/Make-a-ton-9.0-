'use client';

import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import AuthLayout from './AuthLayout';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import type { AuthMode } from '@/types/auth';

const COPY: Record<AuthMode, { title: string; subtitle: string }> = {
  signin: {
    title: 'Welcome back',
    subtitle: 'Please enter your details to sign in',
  },
  signup: {
    title: 'Create account',
    subtitle: 'Please enter your details to get started',
  },
  forgot: {
    title: 'Reset your password',
    subtitle: 'Enter your email and we will send you a reset link',
  },
  reset: {
    title: 'Choose a new password',
    subtitle: 'Enter the new password you want to use for your account',
  },
};

export default function AuthPage() {
  const search = useSearch({ from: '/auth' });
  const [mode, setMode] = useState<AuthMode>(
    search.mode ?? (search.token ? 'reset' : 'signin'),
  );
  const [resetToken, setResetToken] = useState<string | null>(search.token ?? null);
  const [notice, setNotice] = useState<string | null>(null);

  const goTo = (next: AuthMode) => {
    setNotice(null);
    setMode(next);
  };

  const copy = COPY[mode];

  return (
    <AuthLayout title={copy.title} subtitle={copy.subtitle}>
      {notice && mode === 'signin' && (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {notice}
        </p>
      )}

      {mode === 'signin' && (
        <SignInForm onToggle={() => goTo('signup')} onForgotPassword={() => goTo('forgot')} />
      )}

      {mode === 'signup' && <SignUpForm onToggle={() => goTo('signin')} />}

      {mode === 'forgot' && (
        <ForgotPasswordForm
          onBackToSignIn={() => goTo('signin')}
          onOpenResetLink={(token) => {
            setResetToken(token);
            setMode('reset');
          }}
        />
      )}

      {mode === 'reset' && (
        <ResetPasswordForm
          token={resetToken}
          onRequestNewLink={() => {
            setResetToken(null);
            goTo('forgot');
          }}
          onResetComplete={() => {
            setResetToken(null);
            setNotice('Your password has been reset. Sign in with your new password.');
            setMode('signin');
          }}
        />
      )}
    </AuthLayout>
  );
}
