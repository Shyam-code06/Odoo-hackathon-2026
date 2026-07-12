import { useNavigate } from 'react-router-dom';
import { Truck, Heart, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/utils';

export function VehicleStatus({ data }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 text-left border-slate-200/80 shadow-premium-sm flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-brand-primary" />
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Active Vehicle Health</h3>
        </div>
        <button
          onClick={() => navigate('/fleet/vehicles')}
          className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
        >
          View Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/20 hover:border-slate-350 hover:bg-slate-50/50 transition-all duration-200 hover:-translate-y-0.5 space-y-3"
            >
              {/* Asset header */}
              <div className="flex items-start justify-between gap-3">
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-slate-850 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-450 font-semibold mt-1">Odometer: {item.odometer}</p>
                </div>
                <StatusChip status={item.status} className="shrink-0" />
              </div>

              {/* Health Score Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase text-slate-450">
                  <div className="flex items-center gap-1">
                    <Heart className={cn("w-3 h-3", item.health >= 85 ? "text-emerald-500" : "text-rose-500")} />
                    <span>SYSTEM DIAGNOSTICS</span>
                  </div>
                  <span className={cn(item.health >= 85 ? "text-brand-success" : "text-brand-danger")}>
                    {item.health}%
                  </span>
                </div>
                
                <Progress 
                  value={item.health} 
                  variant={item.health >= 85 ? 'success' : item.health >= 75 ? 'info' : 'danger'}
                  className="h-1.5"
                />
              </div>

              {/* Footer log */}
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-200/50">
                <Calendar className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                <span>Last serviced: {item.lastMaintenance}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 md:col-span-3 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-700">No active assets</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default VehicleStatus;
