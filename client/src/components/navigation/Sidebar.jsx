import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  DollarSign, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils';

// Icon mapper helper
const iconMap = {
  LayoutDashboard: LayoutDashboard,
  Truck: Truck,
  Users: Users,
  Route: Route,
  Wrench: Wrench,
  Fuel: Fuel,
  DollarSign: DollarSign,
  BarChart3: BarChart3,
  Settings: Settings,
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
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
    await logout();
    navigate('/login');
  };

  return (
    <motion.aside
      className={cn(
        "hidden md:flex flex-col h-screen text-slate-300 bg-brand-sidebar shrink-0 relative transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white shrink-0">
            T
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-white tracking-wide text-lg"
            >
              Transit<span className="text-brand-primary">Ops</span>
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-slate-800 text-white shadow-sm border-l-4 border-brand-primary -ml-1 pl-2.5" 
                  : "hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-brand-primary" : "text-slate-400 group-hover:text-slate-300"
                  )} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {/* Collapsed Tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Session Info / Profile */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/40">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
              <p className="text-xs text-slate-500 capitalize truncate">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-950/20 hover:text-rose-400 transition-colors group cursor-pointer",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          aria-label="Log Out"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-400" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>

      {/* Collapse Trigger Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-700 transition-colors z-40"
        aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
}

export default Sidebar;
