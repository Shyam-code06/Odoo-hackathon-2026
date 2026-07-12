import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, Settings as SettingsIcon, Calendar, User, Bell } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import { NotificationDropdown } from '@/components/navigation/NotificationDropdown';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { USER_ROLE_LABELS } from '@/constants';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { setIsMobileMenuOpen } = useLayout();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Generate dynamic breadcrumb segments based on route pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, idx) => {
    const to = `/${pathSegments.slice(0, idx + 1).join('/')}`;
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return { to, label };
  });

  // Global Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const roleLabel = user ? (USER_ROLE_LABELS[user.role] || user.role) : '';

  return (
    <>
      <header
        className="sticky top-0 z-30 w-full select-none bg-white/80 backdrop-blur-md border-b border-subtle h-16 flex items-center justify-between px-6 transition-all duration-300 shadow-premium-sm"
        role="banner"
      >
        {/* Mobile Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-brand-bg-secondary rounded-lg md:hidden text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Dynamic Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="hidden sm:flex items-center text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-brand-primary transition-colors uppercase tracking-wider">
              TransitOps
            </Link>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={crumb.to} className="flex items-center">
                  <span className="mx-2 text-slate-300 font-light select-none">/</span>
                  {isLast ? (
                    <span className="text-slate-800 font-bold tracking-tight">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.to} className="hover:text-brand-primary transition-colors uppercase tracking-wider">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              );
            })}
            {breadcrumbs.length === 0 && (
              <div className="flex items-center">
                <span className="mx-2 text-slate-300 font-light">/</span>
                <span className="text-slate-800 font-bold uppercase tracking-wider">Overview</span>
              </div>
            )}
          </nav>
        </div>

        {/* Right widgets */}
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400 pr-3 border-r border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dayjs().format('ddd, MMM DD')}</span>
          </div>

          {/* Global Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-bg-secondary border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-400 hover:bg-white hover:border-slate-300 transition-all cursor-pointer group"
            aria-label="Open global search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 ml-2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Bell */}
          <NotificationDropdown />

          {/* User Profile dropdown */}
          {user && (
            <Dropdown>
              <DropdownTrigger>
                <div
                  className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer group"
                  role="button"
                  aria-label="Open profile menu"
                  tabIndex={0}
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                    className="group-hover:ring-2 group-hover:ring-brand-primary/20 transition-shadow"
                  />
                  <div className="hidden lg:block text-left select-none">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold mt-0.5">{roleLabel}</p>
                  </div>
                </div>
              </DropdownTrigger>

              <DropdownMenu align="right" className="w-56">
                {/* Profile header */}
                <div className="px-4 py-3 border-b border-subtle select-none text-left">
                  <p className="text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</p>
                  <div className="mt-2">
                    <Badge variant="info" size="sm" className="capitalize">
                      {roleLabel}
                    </Badge>
                  </div>
                </div>

                <DropdownItem icon={User} onClick={() => navigate('/profile')}>
                  My Profile
                </DropdownItem>
                <DropdownItem icon={Bell} onClick={() => navigate('/notifications')}>
                  Notifications
                </DropdownItem>
                <DropdownItem icon={SettingsIcon} onClick={() => navigate('/settings')}>
                  System Settings
                </DropdownItem>

                <div className="border-t border-subtle my-1" />

                <DropdownItem icon={LogOut} variant="danger" onClick={handleLogout}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar;
