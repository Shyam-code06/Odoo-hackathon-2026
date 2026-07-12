import { useState } from 'react';
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
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/navigation/Sidebar';
import Navbar from '@/components/navigation/Navbar';
import { cn } from '@/utils';

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
};

export function ProtectedLayout() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/vehicles', label: 'Vehicles', icon: 'Truck' },
    { path: '/drivers', label: 'Drivers', icon: 'Users' },
    { path: '/trips', label: 'Trips', icon: 'Route' },
    { path: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
    { path: '/fuel', label: 'Fuel Registry', icon: 'Fuel' },
    { path: '/expenses', label: 'Expenses', icon: 'DollarSign' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ];

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

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

  // 2. Auth redirect if unauthorized
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-brand-bg font-sans">
      {/* Standard desktop sidebar */}
      <Sidebar />

      {/* Main dashboard frame wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Navbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="container-layout">
            <AnimatePresence mode="wait">
              {/* Force Framer Motion transitions to trigger on route changes */}
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* 3. Mobile Slide-Over Drawer navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Sidebar drawer body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-brand-sidebar text-slate-300 flex flex-col z-50 shadow-2xl md:hidden"
            >
              {/* Header drawer close section */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white">
                    T
                  </div>
                  <span className="font-bold text-white tracking-wide text-lg">TransitOps</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-slate-800 text-white shadow-sm border-l-4 border-brand-primary" 
                          : "hover:bg-slate-800/50 hover:text-slate-100"
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0 text-slate-400" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Profile / Logout footer */}
              <div className="p-4 border-t border-slate-700/50 bg-slate-900/40">
                {user && (
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-950/20 hover:text-rose-400 transition-colors cursor-pointer"
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
