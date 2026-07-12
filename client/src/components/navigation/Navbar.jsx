import { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, Menu, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Navbar({ onMobileMenuToggle }) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Generate dynamic breadcrumbs from path
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, idx) => {
    const to = `/${pathSegments.slice(0, idx + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { to, label };
  });

  return (
    <header className="h-16 border-b border-subtle bg-white flex items-center justify-between px-6 sticky top-0 z-30 shadow-premium-sm">
      {/* Breadcrumbs & Mobile Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 hover:bg-brand-bg-secondary rounded-lg md:hidden text-slate-600 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumbs" className="hidden sm:flex items-center text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-brand-primary transition-colors">
            TransitOps
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <Fragment key={crumb.to}>
              <span className="mx-2.5 text-slate-300 font-light">/</span>
              <span 
                className={
                  idx === breadcrumbs.length - 1 
                    ? "text-slate-800 font-semibold" 
                    : "hover:text-brand-primary transition-colors"
                }
              >
                {crumb.label}
              </span>
            </Fragment>
          ))}
          {breadcrumbs.length === 0 && (
            <>
              <span className="mx-2.5 text-slate-300 font-light">/</span>
              <span className="text-slate-800 font-semibold">Overview</span>
            </>
          )}
        </nav>
      </div>

      {/* Global Dashboard Controls */}
      <div className="flex items-center gap-4">
        {/* Search Bar Placeholder */}
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search records, drivers, trips..."
            className="w-full text-xs pl-9 pr-4 py-2 bg-brand-bg-secondary rounded-lg border border-slate-200/80 focus:border-brand-primary focus:bg-white focus:outline-none transition-all"
            aria-label="Search records"
          />
        </div>

        {/* Notifications Icon Button */}
        <button
          className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-bg-secondary rounded-lg transition-colors relative"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-danger ring-2 ring-white"></span>
        </button>

        {/* Support Help Center */}
        <button
          className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-bg-secondary rounded-lg transition-colors hidden sm:block"
          aria-label="Help Center"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Mini profile widget */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
