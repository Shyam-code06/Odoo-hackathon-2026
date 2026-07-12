import { ShieldAlert, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

// Icon severity map
const severityIcon = {
  danger: AlertCircle,
  warning: AlertTriangle,
  info: HelpCircle,
};

export function SmartAlerts({ data }) {
  return (
    <Card className="p-6 text-left border-slate-200/80 shadow-premium-sm flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-danger" />
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Active Fleet Hazards</h3>
        </div>
        <span className="text-[10px] text-brand-danger font-bold uppercase tracking-wider bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg">
          Action Required
        </span>
      </div>

      <div className="flex-1 space-y-3.5">
        {data && data.length > 0 ? (
          data.map((alert) => {
            const Icon = severityIcon[alert.type] || HelpCircle;
            
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-3 text-left relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5",
                  alert.type === 'danger' && 'bg-rose-50/50 border-rose-200/60 text-brand-danger',
                  alert.type === 'warning' && 'bg-amber-50/50 border-amber-200/60 text-brand-secondary',
                  alert.type === 'info' && 'bg-blue-50/50 border-blue-200/60 text-brand-primary'
                )}
              >
                <Icon className="w-4.5 h-4.5 shrink-0 text-current mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <h5 className="font-bold text-slate-800 text-[11px] tracking-tight">
                    {alert.title}
                  </h5>
                  <p className="text-[10px] font-semibold text-slate-450 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-350 mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">No active hazards</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              All vehicles are within safe operational limits, and CDL records are up-to-date.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default SmartAlerts;
