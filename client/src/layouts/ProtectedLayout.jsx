import { Navigate, Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  X, 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  UserCog
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import Sidebar from '@/components/navigation/Sidebar';
import Navbar from '@/components/navigation/Navbar';
import { NAV_ITEMS } from '@/constants';
import { cn } from '@/utils';

// Lucide icon mapping catalog
const iconMap = {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  DollarSign,
  BarChart3,
  Settings,
  UserCog,
};

export function ProtectedLayout() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useLayout();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  // 1. Session Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-brand-bg gap-4 select-none">
        <motion.div
          className="w-12 h-12 border-4 border-brand-bg-secondary border-t-brand-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
        />
        <p className="text-sm font-medium text-slate-500 tracking-wide">Initializing TransitOps...</p>
      </div>
    );
  }

  // 2. Redirect to auth if unauthenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Filter mobile drawer navigation items by user role
  const allowedNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return false;
    return item.allowedRoles ? item.allowedRoles.includes(user.role) : true;
  });

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-brand-bg font-sans">
      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Main content viewport frame */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Fixed Top Navbar */}
        <Navbar />

        {/* Independent scrollable page area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="container-layout">
            {/* Animated page outlet transition */}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.99, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Slide-Over Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Sliding Drawer body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-brand-sidebar text-slate-350 flex flex-col z-50 shadow-2xl md:hidden select-none"
            >
              {/* Header section */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white">
                    T
                  </div>
                  <span className="font-bold text-white tracking-wide text-md">TransitOps</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {allowedNavItems.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const hasChildren = !!item.children;

                  if (hasChildren) {
                    const filteredChildren = item.children.filter(
                      (c) => !c.allowedRoles || (user && c.allowedRoles.includes(user.role))
                    );

                    if (filteredChildren.length === 0) return null;

                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-450 uppercase tracking-wider select-none mt-4 first:mt-0">
                          <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                          <span>{item.label}</span>
                        </div>
                        <div className="pl-4 space-y-1">
                          {filteredChildren.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) => cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors duration-150",
                                isActive 
                                  ? "bg-slate-800 text-white border-l-2 border-brand-primary" 
                                  : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                              )}
                            >
                              <span>{child.label}</span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors duration-150",
                        isActive 
                          ? "bg-slate-800 text-white border-l-4 border-brand-primary" 
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0 text-slate-450" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Profile section footer */}
              <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
                {user && (
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="overflow-hidden text-left">
                      <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                      <p className="text-[10px] text-slate-550 capitalize mt-0.5 truncate">{user.role}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-rose-950/20 hover:text-rose-400 transition-colors cursor-pointer"
                  aria-label="Log Out"
                >
                  <LogOut className="w-5 h-5 shrink-0 text-slate-400" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProtectedLayout;
