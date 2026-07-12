import { Bell, X } from 'lucide-react';
import { useLayout } from '@/hooks/useLayout';
import { Dropdown, DropdownTrigger, DropdownMenu } from '@/components/ui/Dropdown';
import { cn } from '@/utils';

/**
 * Reusable notification dropdown panel for general logs and alerts
 */
export function NotificationDropdown() {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification 
  } = useLayout();

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <Dropdown>
      <DropdownTrigger>
        {({ isOpen }) => (
          <button
            className={cn(
              "p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-bg-secondary rounded-lg transition-colors relative cursor-pointer",
              isOpen && "bg-brand-bg-secondary text-brand-primary"
            )}
            aria-label="Notifications logs"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-danger text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white select-none">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </DropdownTrigger>

      <DropdownMenu align="right" className="w-80 p-0 overflow-hidden">
        {/* Dropdown Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-subtle select-none">
          <span className="text-xs font-bold text-slate-800">Operational Alerts</span>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markAllNotificationsAsRead();
              }}
              className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content Panel */}
        <div className="max-h-72 overflow-y-auto divide-y divide-subtle">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={cn(
                  "p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 cursor-pointer text-left relative group",
                  item.isUnread && "bg-blue-50/10"
                )}
              >
                {/* Unread circle indicator */}
                {item.isUnread && (
                  <span className="absolute top-4.5 right-4 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                )}

                <div className="flex-1 space-y-1 pr-3 select-none">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal">
                    {item.description}
                  </p>
                  <span className="inline-block text-[9px] text-slate-400 font-semibold pt-0.5">
                    {item.time}
                  </span>
                </div>
                
                {/* Remove notification button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(item.id);
                  }}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 cursor-pointer"
                  aria-label="Remove alert log"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          ) : (
            <div className="py-8 px-4 text-center flex flex-col items-center justify-center select-none">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-350 mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold text-slate-700">Logs Empty</p>
              <p className="text-[10px] text-slate-450 mt-1 max-w-[200px]">
                No pending maintenance alerts or dispatch updates recorded.
              </p>
            </div>
          )}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}

export default NotificationDropdown;
