import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Role-Based Access Control Guard component
 * Redirects unauthenticated users to `/login`, and unauthorized users to `/unauthorized`.
 */
export function RoleGuard({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-brand-bg gap-4 select-none">
        <div className="w-12 h-12 border-4 border-brand-bg-secondary border-t-brand-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 tracking-wide">Validating session...</p>
      </div>
    );
  }

  // 1. Redirect to login if unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Redirect to unauthorized if role does not match
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleGuard;
