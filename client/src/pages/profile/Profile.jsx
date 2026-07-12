import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Shield,
  Calendar, Clock, TrendingUp, Truck, Route, Star,
  Edit3, Key, Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { USER_ROLE_LABELS, USER_ROLE_COLORS } from '@/constants';
import { formatDate } from '@/utils';

const ACTIVITY_STATS = [
  { label: 'Trips Managed', value: '142', icon: Route, color: 'text-brand-primary bg-blue-50 border-blue-100' },
  { label: 'Vehicles Tracked', value: '68', icon: Truck, color: 'text-brand-success bg-green-50 border-green-100' },
  { label: 'Reports Generated', value: '24', icon: TrendingUp, color: 'text-brand-purple bg-purple-50 border-purple-100' },
  { label: 'Performance Score', value: '94%', icon: Star, color: 'text-brand-secondary bg-amber-50 border-amber-100' },
];

const RECENT_ACTIVITIES = [
  { action: 'Logged in from New York, NY', time: 'Today at 7:30 AM', icon: Activity },
  { action: 'Generated Fleet Utilization Report', time: 'Yesterday at 4:12 PM', icon: TrendingUp },
  { action: 'Approved 3 maintenance requests', time: 'Jul 10 at 11:22 AM', icon: Truck },
  { action: 'Updated driver dispatch assignment', time: 'Jul 9 at 2:05 PM', icon: Route },
  { action: 'Password changed successfully', time: 'Jul 8 at 9:30 AM', icon: Key },
];

export function Profile() {
  const { user } = useAuth();

  const roleLabel = useMemo(() => {
    if (!user) return 'User';
    return USER_ROLE_LABELS[user.role] || user.role;
  }, [user]);

  const roleColor = useMemo(() => {
    if (!user) return 'neutral';
    return USER_ROLE_COLORS[user.role] || 'neutral';
  }, [user]);

  if (!user) return null;

  return (
    <PageWrapper title="My Profile">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal information and account preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="text-center">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="relative inline-block mb-4"
              >
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="2xl"
                  className="ring-4 ring-brand-primary/10 ring-offset-2"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-success rounded-full border-2 border-white pulse-dot" />
              </motion.div>

              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{user.name}</h2>
              <div className="mt-2">
                <Badge variant={roleColor} size="md" className="capitalize">
                  {roleLabel}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-3 font-semibold">{user.email}</p>

              {/* Info rows */}
              <div className="mt-5 space-y-3 text-left border-t border-subtle pt-5">
                {[
                  { icon: Briefcase, label: user.department || 'Operations' },
                  { icon: Phone, label: user.phone || '+1 (555) 000-0000' },
                  { icon: MapPin, label: user.location || 'HQ — New York, NY' },
                  { icon: Calendar, label: `Joined ${formatDate(user.joinedAt || '2023-01-15')}` },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Edit button placeholder */}
              <button className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </Card>

            {/* Security Card */}
            <Card className="space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-primary" />
                Security
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Two-Factor Auth', status: 'Enabled', color: 'success' },
                  { label: 'Session Timeout', status: '8 hours', color: 'neutral' },
                  { label: 'Last Password Change', status: '30 days ago', color: 'warning' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                    <Badge variant={item.color} size="sm">{item.status}</Badge>
                  </div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 mt-2 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                <Key className="w-3.5 h-3.5" />
                Change Password
              </button>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ACTIVITY_STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-premium text-center stat-card-hover"
                  >
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-800">{stat.value}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Permissions Card */}
            <Card>
              <h3 className="text-sm font-bold text-slate-800 mb-4">Access Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(user.permissions || ['view_fleet', 'view_reports']).map((perm) => {
                  const label = perm.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  const isManage = perm.startsWith('manage');
                  return (
                    <div
                      key={perm}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-semibold ${
                        isManage
                          ? 'bg-blue-50/60 border-blue-100/60 text-brand-primary'
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <Shield className={`w-3.5 h-3.5 shrink-0 ${isManage ? 'text-brand-primary' : 'text-slate-400'}`} />
                      {label}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <h3 className="text-sm font-bold text-slate-800 mb-5">Performance Overview</h3>
              <div className="space-y-4">
                {[
                  { label: 'Task Completion Rate', value: 94, color: 'bg-brand-primary' },
                  { label: 'Response Time Score', value: 87, color: 'bg-brand-success' },
                  { label: 'Fleet Efficiency Rating', value: 78, color: 'bg-brand-purple' },
                  { label: 'Safety Compliance', value: 98, color: 'bg-brand-secondary' },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">{metric.label}</span>
                      <span className="text-slate-800">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} showValue={false} size="sm" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="flex items-start gap-3 pb-3 border-b border-subtle last:border-0 last:pb-0"
                    >
                      <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 leading-snug">{activity.action}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Profile;
