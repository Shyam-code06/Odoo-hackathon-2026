import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export function PublicLayout() {
  const { isAuthenticated, loading } = useAuth();

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-brand-bg gap-4">
        <motion.div
          className="w-12 h-12 border-4 border-brand-bg-secondary border-t-brand-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
        />
        <p className="text-sm font-medium text-slate-500 tracking-wide">Initializing TransitOps...</p>
      </div>
    );
  }

  // 2. Redirect authenticated users to home dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-screen min-h-screen bg-brand-bg flex items-center justify-center overflow-x-hidden">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
