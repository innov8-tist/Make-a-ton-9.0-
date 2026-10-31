export type StoredRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export function getStoredUser(): { role: string } | null {
  const value = localStorage.getItem('brightloop-user');
  if (!value) return null;

  try {
    return JSON.parse(value) as { role: string };
  } catch {
    localStorage.removeItem('brightloop-user');
    return null;
  }
}

export function dashboardPathForRole(role: string): string | null {
  const normalizedRole = role.toUpperCase();
  if (normalizedRole === 'ADMIN') return '/dashboard/admin';
  if (normalizedRole === 'STAFF') return '/dashboard/staff';
  if (normalizedRole === 'CUSTOMER') return '/dashboard/customer';
  return null;
}
