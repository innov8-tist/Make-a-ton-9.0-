import { useState, useCallback } from 'react';
import type { SignInFormData, SignUpFormData, User } from '@/types/auth';
import { authService } from '@/lib/auth-service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.signIn(data);
      setUser(user);
      return user;
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
      const user = await authService.signUp(data);
      setUser(user);
      return user;
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
      await authService.signOut();
      setUser(null);
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
