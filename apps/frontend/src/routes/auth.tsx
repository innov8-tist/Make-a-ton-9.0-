import { createFileRoute } from '@tanstack/react-router';
import AuthPage from '@/components/auth/AuthPage';

interface AuthSearch {
  mode?: 'forgot' | 'reset';
  token?: string;
}

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode: search.mode === 'forgot' || search.mode === 'reset' ? search.mode : undefined,
    token: typeof search.token === 'string' && search.token.length > 0 ? search.token : undefined,
  }),
  component: AuthPage,
});
