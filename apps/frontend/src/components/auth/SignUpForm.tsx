'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { SignUpFormData } from '@/types/auth';
import { authService } from '@/lib/auth-service';

interface SignUpFormProps {
  onToggle: () => void;
}

export default function SignUpForm({ onToggle }: SignUpFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.signUp(data);
      
      // Role-based redirect (signup creates CUSTOMER by default)
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
      const message = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
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
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          {...register('name', { required: 'Name is required' })}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-red-500">{String(errors.name.message)}</p>}
      </div>

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
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 9, message: 'Password must be more than 8 characters' },
            validate: {
              hasUpperCase: (value) => /[A-Z]/.test(value) || 'Password must contain an uppercase letter',
              hasLowerCase: (value) => /[a-z]/.test(value) || 'Password must contain a lowercase letter',
              hasSpecialChar: (value) => /[^\w\s]/.test(value) || 'Password must contain a special character',
            },
          })}
          disabled={isLoading}
        />
        {errors.password && <p className="text-sm text-red-500">{String(errors.password.message)}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          disabled={isLoading}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{String(errors.confirmPassword.message)}</p>}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="agreeToTerms"
          {...register('agreeToTerms', { required: 'You must agree to the terms' })}
          disabled={isLoading}
        />
        <Label htmlFor="agreeToTerms" className="text-sm font-normal cursor-pointer leading-tight">
          I agree to the{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            terms of service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
            privacy policy
          </a>
        </Label>
      </div>
      {errors.agreeToTerms && <p className="text-sm text-red-500">{String(errors.agreeToTerms.message)}</p>}

      <Button type="submit" className="w-full" disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
