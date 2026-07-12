import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  LogOut,
  ChevronDown,
  FileText,
  AreaChart,
  Target,
  UserCog
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { Tooltip } from '@/components/ui/Tooltip';
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
  FileText,
  AreaChart,
  Target,
  UserCog,
};

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, setIsSidebarCollapsed } = useLayout();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Keep track of parent categories manually expanded or collapsed by the user
  const [manuallyExpanded, setManuallyExpanded] = useState({});

  const handleToggleParent = (label) => {
    if (isSidebarCollapsed) {
      // Auto-expand sidebar if clicked while collapsed
      setIsSidebarCollapsed(false);
      setManuallyExpanded((prev) => ({ ...prev, [label]: true }));
    } else {
      setManuallyExpanded((prev) => {
        const item = NAV_ITEMS.find((n) => n.label === label);
        const hasActiveChild = item?.children?.some((child) => pathname.startsWith(child.path)) || false;
        const currentVal = prev[label] !== undefined ? prev[label] : hasActiveChild;
        return { ...prev, [label]: !currentVal };
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filter menu items by user role clearance
  const allowedNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return false;
    return item.allowedRoles ? item.allowedRoles.includes(user.role) : true;
  });

  return (
    <motion.aside
      className={cn(
        "hidden md:flex flex-col h-screen text-slate-350 bg-brand-sidebar shrink-0 relative transition-all duration-300 z-40 select-none shadow-premium-lg",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white shrink-0">
            T
          </div>
          {!isSidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-white tracking-wide text-md"
            >
              Transit<span className="text-brand-primary">Ops</span>
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {allowedNavItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const hasChildren = !!item.children;

          // Calculate expanded state: check if manually toggled, else fallback to active child detection
          const isExpanded = hasChildren && (
            manuallyExpanded[item.label] !== undefined
              ? manuallyExpanded[item.label]
              : item.children.some((child) => pathname.startsWith(child.path))
          );

          // Check if parent contains any active child path for styling
          const isParentActive = hasChildren && item.children.some((c) => pathname.startsWith(c.path));

          // 1. Render Nested Dropdown Category
          if (hasChildren) {
            const filteredChildren = item.children.filter(
              (c) => !c.allowedRoles || (user && c.allowedRoles.includes(user.role))
            );

            if (filteredChildren.length === 0) return null;

            return (
              <div key={item.label} className="space-y-1">
                {isSidebarCollapsed ? (
                  /* Tooltip selection when collapsed */
                  <Tooltip content={item.label} position="right" className="w-full">
                    <button
                      onClick={() => handleToggleParent(item.label)}
                      className={cn(
                        "flex items-center justify-center w-full px-3 py-2.5 rounded-lg transition-colors cursor-pointer group hover:bg-slate-800/40",
                        isParentActive ? "bg-slate-800 text-brand-primary" : "text-slate-400"
                      )}
                    >
                      <Icon className="w-5 h-5 group-hover:text-white transition-transform duration-200 group-hover:scale-105" />
                    </button>
                  </Tooltip>
                ) : (
                  /* Standard accordion drawer */
                  <>
                    <button
                      onClick={() => handleToggleParent(item.label)}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-slate-800/40 hover:text-white transition-colors cursor-pointer group",
                        isParentActive ? "text-white" : "text-slate-400"
                      )}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isParentActive ? "text-brand-primary" : "text-slate-450 group-hover:text-slate-350")} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown 
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-250 text-slate-500", 
                          isExpanded && "rotate-180"
                        )} 
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="overflow-hidden pl-4 pr-1 space-y-1"
                        >
                          {filteredChildren.map((child) => {
                            const ChildIcon = iconMap[child.icon] || Route;
                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) => cn(
                                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all duration-200",
                                  isActive
                                    ? "bg-slate-800/80 text-white border-l-2 border-brand-primary -ml-0.5 pl-2"
                                    : "hover:bg-slate-800/30 text-slate-400 hover:text-slate-200"
                                )}
                              >
                                <ChildIcon className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                                <span className="truncate">{child.label}</span>
                              </NavLink>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            );
          }

          // 2. Render Normal Link Row
          const linkItem = (
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 group relative text-slate-400",
                isSidebarCollapsed ? "justify-center" : "justify-start",
                isActive 
                  ? "bg-slate-800 text-white border-l-4 border-brand-primary -ml-1 pl-2.5 shadow-sm" 
                  : "hover:bg-slate-800/40 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-brand-primary" : "text-slate-450 group-hover:text-slate-350"
                  )} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );

          return isSidebarCollapsed ? (
            <Tooltip key={item.path} content={item.label} position="right" className="w-full">
              {linkItem}
            </Tooltip>
          ) : (
            <div key={item.path}>{linkItem}</div>
          );
        })}
      </nav>

      {/* User Session Profile & LogOut */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        {!isSidebarCollapsed && user && (
          <div className="flex items-center gap-3 mb-4 px-2 select-none">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="overflow-hidden text-left">
              <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 capitalize tracking-wide font-semibold mt-0.5 truncate">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-rose-950/20 hover:text-rose-400 transition-colors group cursor-pointer",
            isSidebarCollapsed ? "justify-center" : "justify-start"
          )}
          aria-label="Log Out"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-400" />
          {!isSidebarCollapsed && <span>Log Out</span>}
        </button>
      </div>

      {/* Sidebar Collapse Toggle Trigger */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-slate-700 transition-colors z-50"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
}

export default Sidebar;
