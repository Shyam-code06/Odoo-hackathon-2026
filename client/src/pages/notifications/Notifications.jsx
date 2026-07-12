import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Wrench, Route, Fuel, Users, Truck,
  CheckCheck, Trash2, Filter, Info
} from 'lucide-react';
import { useLayout } from '@/hooks/useLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils';

const CATEGORY_CONFIG = {
  maintenance: { icon: Wrench, color: 'text-brand-secondary bg-amber-50 border-amber-100', label: 'Maintenance', badgeVariant: 'warning' },
  dispatch: { icon: Route, color: 'text-brand-primary bg-blue-50 border-blue-100', label: 'Trips', badgeVariant: 'info' },
  finance: { icon: Fuel, color: 'text-brand-success bg-green-50 border-green-100', label: 'Fuel & Finance', badgeVariant: 'success' },
  drivers: { icon: Users, color: 'text-brand-purple bg-purple-50 border-purple-100', label: 'Drivers', badgeVariant: 'primary' },
  vehicles: { icon: Truck, color: 'text-brand-danger bg-rose-50 border-rose-100', label: 'Vehicles', badgeVariant: 'danger' },
};

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'dispatch', label: 'Trips' },
  { id: 'finance', label: 'Finance' },
];

export function Notifications() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotification } = useLayout();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => n.isUnread).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchCategory = activeFilter === 'all' || n.category === activeFilter;
      const matchUnread = !showUnreadOnly || n.isUnread;
      return matchCategory && matchUnread;
    });
  }, [notifications, activeFilter, showUnreadOnly]);

  return (
    <PageWrapper title="Notification Center">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-brand-danger text-white text-xs font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Operational alerts, maintenance warnings, and system updates.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              leftIcon={Filter}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={showUnreadOnly ? 'border-brand-primary text-brand-primary bg-blue-50' : ''}
            >
              {showUnreadOnly ? 'Unread Only' : 'All Alerts'}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={CheckCheck}
                onClick={markAllNotificationsAsRead}
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeFilter === tab.id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(CATEGORY_CONFIG).slice(0, 4).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const count = notifications.filter((n) => n.category === key).length;
            const unread = notifications.filter((n) => n.category === key && n.isUnread).length;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key === activeFilter ? 'all' : key)}
                className={cn(
                  'flex items-center gap-3 p-3 bg-white border rounded-xl text-left transition-all cursor-pointer shadow-premium hover:shadow-premium-md',
                  activeFilter === key ? 'border-brand-primary bg-blue-50/30' : 'border-slate-200/80'
                )}
              >
                <div className={cn('p-2 rounded-lg border shrink-0', cfg.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">{cfg.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {count} alerts {unread > 0 && <span className="text-brand-primary">· {unread} new</span>}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Notification List */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-subtle bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {filteredNotifications.length} Notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
            {filteredNotifications.length > 0 && (
              <span className="text-[10px] text-slate-400 font-semibold">
                Click to mark as read · Hover to dismiss
              </span>
            )}
          </div>

          <div className="divide-y divide-subtle">
            <AnimatePresence initial={false}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif, idx) => {
                  const cfg = CATEGORY_CONFIG[notif.category] || CATEGORY_CONFIG.dispatch;
                  const Icon = cfg.icon;

                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12, height: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={cn(
                        'flex items-start gap-4 px-6 py-5 transition-colors hover:bg-slate-50/60 cursor-pointer group relative',
                        notif.isUnread && 'bg-blue-50/20'
                      )}
                    >
                      {/* Unread indicator stripe */}
                      {notif.isUnread && (
                        <div className="absolute left-0 inset-y-0 w-1 bg-brand-primary rounded-r" />
                      )}

                      {/* Category icon */}
                      <div className={cn('p-2.5 rounded-xl border shrink-0 mt-0.5', cfg.color)}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={cn('text-sm leading-snug', notif.isUnread ? 'font-bold text-slate-800' : 'font-semibold text-slate-700')}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {notif.description}
                            </p>
                          </div>
                          <Badge variant={cfg.badgeVariant} size="sm" className="shrink-0">
                            {cfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-semibold text-slate-400">{notif.time}</span>
                          {notif.isUnread && (
                            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">New</span>
                          )}
                        </div>
                      </div>

                      {/* Dismiss button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                        aria-label="Dismiss notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-16">
                  <EmptyState
                    icon={Bell}
                    title="All caught up!"
                    description="No notifications matching the current filter. You're up to date with all operational alerts."
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Notifications are synced from the operations service layer. Real-time push notifications will be enabled after backend integration.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Notifications;
