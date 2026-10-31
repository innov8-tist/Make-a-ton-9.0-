'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import type { SignInFormData } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';

interface SignInFormProps {
  onToggle: () => void;
  onForgotPassword: () => void;
}

export default function SignInForm({ onToggle, onForgotPassword }: SignInFormProps) {
  const { signIn, signOut, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
      role: 'CUSTOMER',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setSelectionError(null);
    try {
      const response = await signIn(data);
      const role = response.user.role.toUpperCase();
      if (role !== data.role) {
        await signOut();
        setSelectionError(`This account is not registered as ${data.role.toLowerCase()}.`);
        return;
      }
      if (role === 'ADMIN') await navigate({ to: '/dashboard/admin' });
      else if (role === 'STAFF') await navigate({ to: '/dashboard/staff' });
      else if (role === 'CUSTOMER') await navigate({ to: '/dashboard/customer' });
    } catch {
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Login as</Label>
        <Select
          id="role"
          aria-label="Choose login role"
          disabled={isLoading}
          {...register('role', { required: 'Choose your login role' })}
        >
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="CUSTOMER">Customer</option>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
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
      {(selectionError || error) && (
        <p className="text-sm text-red-500">{selectionError ?? error}</p>
      )}

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
          className="text-sm text-primary hover:text-primary/80 font-medium"
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

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
