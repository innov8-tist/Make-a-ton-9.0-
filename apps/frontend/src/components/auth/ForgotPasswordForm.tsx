'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { authService } from '@/lib/auth-service';
import type { ForgotPasswordFormData } from '@/types/auth';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
  onOpenResetLink: (token: string) => void;
}

export default function ForgotPasswordForm({
  onBackToSignIn,
  onOpenResetLink,
}: ForgotPasswordFormProps) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }: ForgotPasswordFormData) => {
    setError(null);
    try {
      const result = await authService.requestPasswordReset(email);
      setSentTo(email);
      if (result.devToken) setDevToken(result.devToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send the reset link.');
    }
  };

  if (sentTo) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          If an account exists for{' '}
          <span className="font-medium text-foreground">{sentTo}</span>, a reset
          link is on its way. The link expires in 30 minutes.
        </p>

        {devToken && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
            <p className="font-medium text-amber-900">Development mode</p>
            <p className="mt-1 text-amber-800">No email service is connected yet.</p>
            <button
              type="button"
              onClick={() => onOpenResetLink(devToken)}
              className="mt-2 font-medium text-primary hover:text-primary/80"
            >
              Continue to reset password
            </button>
          </div>
        )}

        <Button type="button" variant="outline" className="w-full" size="lg" onClick={onBackToSignIn}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email address</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="your@email.com"
          {...register('email', { required: 'Email is required' })}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-sm text-red-500">{String(errors.email.message)}</p>}
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
            Sending link...
          </>
        ) : (
          'Send reset link'
        )}
      </Button>

      <button
        type="button"
        onClick={onBackToSignIn}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to sign in
      </button>
    </form>
  );
}
