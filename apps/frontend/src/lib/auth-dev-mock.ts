import type { AuthResponse, PasswordResetResult, SignInFormData } from '@/types/auth';

const STORE_KEY = 'brightloop.dev-password-resets';
const TOKEN_TTL_MINUTES = 30;
const MIN_PASSWORD_LENGTH = 8;

interface DevResetToken {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

function readTokens(): DevResetToken[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as DevResetToken[]) : [];
  } catch {
    return [];
  }
}

function writeTokens(tokens: DevResetToken[]): void {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(tokens));
  } catch {
    // Only the dev mock depends on this store, so a failure is not fatal.
  }
}

/**
 * Stands in for the unimplemented reset endpoints so the flow is testable
 * before the API exists. Never used in production builds.
 */
export const authDevMock = {
  signIn(data: SignInFormData): AuthResponse {
    const accounts = [
      { email: 'admin@brightloop.com', password: 'Admin@123', role: 'ADMIN', name: 'Admin User' },
      { email: 'staff@brightloop.com', password: 'Staff@123', role: 'STAFF', name: 'Staff User' },
      { email: 'customer@brightloop.com', password: 'Customer@123', role: 'CUSTOMER', name: 'Customer User' },
    ] as const;
    const account = accounts.find(
      (entry) => entry.email === data.email.trim().toLowerCase() && entry.password === data.password,
    );
    if (!account) throw new Error('Invalid demo email or password');

    return {
      user: { id: accounts.indexOf(account) + 1, email: account.email, name: account.name, role: account.role },
      token: `demo-${account.role.toLowerCase()}-token`,
    };
  },
  requestPasswordReset(email: string): PasswordResetResult {
    const now = Date.now();
    const token = crypto.randomUUID();
    const tokens = readTokens().filter(
      (entry) => entry.email !== email && entry.expiresAt > now,
    );
    tokens.push({ token, email, expiresAt: now + TOKEN_TTL_MINUTES * 60_000, used: false });
    writeTokens(tokens);

    return {
      message: 'If an account exists for that email, a reset link is on its way.',
      devToken: token,
    };
  },

  resetPassword(token: string, password: string): PasswordResetResult {
    const record = readTokens().find((entry) => entry.token === token);

    if (!record) {
      throw new Error('This reset link is invalid. Request a new one.');
    }
    if (record.used) {
      throw new Error('This reset link has already been used. Request a new one.');
    }
    if (record.expiresAt < Date.now()) {
      throw new Error('This reset link has expired. Request a new one.');
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const tokens = readTokens().map((entry) =>
      entry.token === token ? { ...entry, used: true } : entry,
    );
    writeTokens(tokens);

    return { message: 'Your password has been reset. You can sign in now.' };
  },
};
