import { Navigate } from '@tanstack/react-router';
import { useAuthContext } from '@/contexts/AuthContext';
import type { User } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: User['role'][];
  redirectTo?: string;
}

/**
 * Protected Route Component
 * 
 * Usage:
 * <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/auth'
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    const roleDashboard = {
      ADMIN: '/admin-dashboard',
      STAFF: '/staff-dashboard',
      CUSTOMER: '/customer-dashboard',
    }[user.role];

    return <Navigate to={roleDashboard || '/'} />;
  }

  return <>{children}</>;
}
