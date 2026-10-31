'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { SignInFormData } from '@/types/auth';
import { authService } from '@/lib/auth-service';

interface SignInFormProps {
  onToggle: () => void;
  onForgotPassword: () => void;
}

export default function SignInForm({ onToggle, onForgotPassword }: SignInFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.signIn(data);
      
      // Role-based redirect
      switch (user.role) {
        case 'ADMIN':
          navigate({ to: '/admin-dashboard' });
          break;
        case 'STAFF':
          navigate({ to: '/staff-dashboard' });
          break;
        case 'CUSTOMER':
          navigate({ to: '/customer-dashboard' });
          break;
        default:
          navigate({ to: '/' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register('email', { required: 'Email is required' })}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{String(errors.email.message)}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password', { required: 'Password is required' })}
          disabled={isLoading}
        />
        {errors.password && <p className="text-sm text-red-500">{String(errors.password.message)}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" {...register('remember')} disabled={isLoading} />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Remember for 30 days
          </Label>
        </div>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
