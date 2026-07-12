import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, Settings as SettingsIcon, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '@/hooks/useAuth';
import { useLayout } from '@/hooks/useLayout';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@/components/ui/Dropdown';
import { NotificationDropdown } from '@/components/navigation/NotificationDropdown';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { setIsMobileMenuOpen } = useLayout();
  const navigate = useNavigate();

  // Generate dynamic breadcrumb segments based on route pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, idx) => {
    // Reconstruct segment link path
    const to = `/${pathSegments.slice(0, idx + 1).join('/')}`;
    // Humanize segment name
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return { to, label };
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full select-none bg-white/70 backdrop-blur-md border-b border-subtle h-16 flex items-center justify-between px-6 transition-all duration-300 shadow-premium-sm">
      {/* Mobile Hamburger menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-brand-bg-secondary rounded-lg md:hidden text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Open mobile drawer navigation"
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
                  <span className="text-slate-800 font-bold tracking-tight">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.to} 
                    className="hover:text-brand-primary transition-colors uppercase tracking-wider"
                  >
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

      {/* Center/Right widgets */}
      <div className="flex items-center gap-4">
        {/* Current Date Display */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-450 pr-2 border-r border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{dayjs().format('dddd, MMM DD, YYYY')}</span>
        </div>

        {/* Global Search Bar (Focus Expanding) */}
        <div className="relative hidden md:block w-48 focus-within:w-64 transition-all duration-300">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search console..."
            className="w-full text-xs pl-8.5 pr-4 py-2 bg-brand-bg-secondary rounded-lg border border-slate-200/80 focus:border-brand-primary focus:bg-white focus:outline-none transition-all placeholder-slate-400"
            aria-label="Global search"
          />
        </div>

        {/* Dynamic Notification Dropdown bell */}
        <NotificationDropdown />

        {/* Quick action button placeholder */}
        <div className="hidden sm:block">
          <Badge variant="primary" className="text-[10px] font-bold border-blue-100/60 uppercase">
            Hackathon Mode
          </Badge>
        </div>

        {/* User Profile dropdown */}
        {user && (
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer group">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="sm"
                  className="group-hover:ring-2 group-hover:ring-brand-primary/20 transition-shadow"
                />
                <div className="hidden lg:block text-left select-none">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold mt-0.5">{user.role}</p>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu align="right" className="w-56">
              {/* Header profile details */}
              <div className="px-4 py-3 border-b border-subtle select-none text-left">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</p>
                <div className="mt-2">
                  <Badge variant="info" size="sm" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>
              
              {/* Menu items */}
              <DropdownItem 
                icon={SettingsIcon} 
                onClick={() => navigate('/settings')}
              >
                System Settings
              </DropdownItem>
              
              <div className="border-t border-subtle my-1" />
              
              <DropdownItem 
                icon={LogOut} 
                variant="danger" 
                onClick={handleLogout}
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </header>
  );
}

export default Navbar;
