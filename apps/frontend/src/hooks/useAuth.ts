import { useState, useCallback } from 'react';
import type { SignInFormData, SignUpFormData, AuthResponse } from '@/types/auth';
import { authService } from '@/lib/auth-service';

export function useAuth() {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signIn(data);
      setUser(response.user);
      localStorage.setItem('brightloop-user', JSON.stringify(response.user));
      if (response.token) localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signUp(data);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('brightloop-user', JSON.stringify(response.user));
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('brightloop-user');
      await authService.signOut();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    isAuthenticated: !!user,
  };
}
