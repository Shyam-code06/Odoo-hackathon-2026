import { Bell, X, ArrowRight, Wrench, Route, Fuel, Users, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/hooks/useLayout';
import { Dropdown, DropdownTrigger, DropdownMenu } from '@/components/ui/Dropdown';
import { cn } from '@/utils';

const CATEGORY_ICONS = {
  maintenance: Wrench,
  dispatch: Route,
  finance: Fuel,
  drivers: Users,
  vehicles: Truck,
};

const CATEGORY_COLORS = {
  maintenance: 'text-brand-secondary bg-amber-50 border-amber-100',
  dispatch: 'text-brand-primary bg-blue-50 border-blue-100',
  finance: 'text-brand-success bg-green-50 border-green-100',
  drivers: 'text-brand-purple bg-purple-50 border-purple-100',
  vehicles: 'text-brand-danger bg-rose-50 border-rose-100',
};

/**
 * Enhanced notification dropdown with category icons and link to notification center.
 */
export function NotificationDropdown() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification
  } = useLayout();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <Dropdown>
      <DropdownTrigger>
        {({ isOpen }) => (
          <button
            className={cn(
              'p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-bg-secondary rounded-lg transition-colors relative cursor-pointer',
              isOpen && 'bg-brand-bg-secondary text-brand-primary'
            )}
            aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-danger text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white select-none pulse-dot">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </DropdownTrigger>

      <DropdownMenu align="right" className="w-80 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-subtle select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Operational Alerts</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-danger text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllNotificationsAsRead();
              }}
              className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-72 overflow-y-auto divide-y divide-subtle">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const Icon = CATEGORY_ICONS[item.category] || Bell;
              const colorClass = CATEGORY_COLORS[item.category] || 'text-slate-500 bg-slate-50 border-slate-100';

              return (
                <div
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={cn(
                    'p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 cursor-pointer text-left relative group',
                    item.isUnread && 'bg-blue-50/10'
                  )}
                >
                  {/* Unread dot */}
                  {item.isUnread && (
                    <span className="absolute top-4 right-3.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                  )}

                  {/* Category icon */}
                  <div className={cn('p-1.5 rounded-lg border shrink-0 mt-0.5', colorClass)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 space-y-0.5 pr-6 select-none">
                    <p className={cn('text-[11px] leading-snug', item.isUnread ? 'font-bold text-slate-800' : 'font-semibold text-slate-700')}>
                      {item.title}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                      {item.description}
                    </p>
                    <span className="inline-block text-[9px] text-slate-400 font-semibold pt-0.5">
                      {item.time}
                    </span>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(item.id);
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 absolute right-2 top-3 cursor-pointer"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-8 px-4 text-center flex flex-col items-center justify-center select-none">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-350 mb-2">
                <Bell className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-[11px] font-bold text-slate-700">All caught up!</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
                No pending alerts or dispatch updates.
              </p>
            </div>
          )}
        </div>

        {/* Footer — link to notifications page */}
        <div className="border-t border-subtle bg-slate-50/60">
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold text-brand-primary hover:text-blue-700 hover:bg-blue-50/40 transition-colors cursor-pointer"
          >
            View All Notifications
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}

export default NotificationDropdown;
