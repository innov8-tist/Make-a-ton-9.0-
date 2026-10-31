'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/auth-service';
import type { ResetPasswordFormData } from '@/types/auth';

interface ResetPasswordFormProps {
  token: string | null;
  onResetComplete: () => void;
  onRequestNewLink: () => void;
}

export default function ResetPasswordForm({
  token,
  onResetComplete,
  onRequestNewLink,
}: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');

  if (!token) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          This reset link is missing its token. It may be malformed, or it was already used.
        </p>
        <Button type="button" className="w-full" size="lg" onClick={onRequestNewLink}>
          Request a new link
        </Button>
      </div>
    );
  }

  const onSubmit = async ({ password: nextPassword }: ResetPasswordFormData) => {
    setError(null);
    try {
      await authService.resetPassword(token, nextPassword);
      // A reset invalidates the current session, so drop the stored token.
      localStorage.removeItem('token');
      onResetComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not reset your password.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{String(errors.password.message)}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-new-password">Confirm new password</Label>
        <Input
          id="confirm-new-password"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{String(errors.confirmPassword.message)}</p>
        )}
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
        {isSubmitting ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset password'
        )}
      </Button>

      <button
        type="button"
        onClick={onRequestNewLink}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Use a different link
      </button>
    </form>
  );
}
