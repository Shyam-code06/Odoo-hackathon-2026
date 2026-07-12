import { 
  Activity, 
  Route, 
  Wrench, 
  Fuel, 
  UserCheck, 
  Clock 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

// Icon mapping configuration
const iconMap = {
  trip_created: Route,
  maintenance_started: Wrench,
  fuel_added: Fuel,
  driver_registered: UserCheck,
};

export function ActivityTimeline({ data }) {
  return (
    <Card className="p-6 text-left border-slate-200/80 shadow-premium-sm flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-4 mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-primary" />
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Dispatch Activity Log</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-lg">
          Live stream
        </span>
      </div>

      <div className="flex-1 relative pl-6 border-l border-slate-200/80 space-y-5.5 ml-3.5 pt-1.5 pb-2">
        {data && data.length > 0 ? (
          data.map((item) => {
            const Icon = iconMap[item.type] || Activity;
            
            return (
              <div key={item.id} className="relative group text-left">
                {/* Timeline node icon */}
                <div className={cn(
                  "absolute -left-[38px] top-0.5 w-6 h-6 rounded-full border bg-white flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-sm",
                  item.type === 'trip_created' && 'text-blue-500 border-blue-100 bg-blue-50/20',
                  item.type === 'maintenance_started' && 'text-rose-500 border-rose-100 bg-rose-50/20',
                  item.type === 'fuel_added' && 'text-amber-500 border-amber-100 bg-amber-50/20',
                  item.type === 'driver_registered' && 'text-emerald-500 border-emerald-100 bg-emerald-50/20'
                )}>
                  <Icon className="w-3 h-3" />
                </div>

                {/* Event info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] font-bold text-slate-800 tracking-tight">
                      {item.title}
                    </p>
                    <span className="flex items-center gap-0.5 text-[9px] text-slate-400 font-semibold shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-450 leading-relaxed pr-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 -ml-6 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-350 mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">No activity recorded</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              No recent dispatches, fuel logs, or maintenance updates recorded today.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ActivityTimeline;
