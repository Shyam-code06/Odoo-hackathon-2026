import { useNavigate } from 'react-router-dom';
import { Truck, Heart, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/utils';

export function VehicleStatus({ data }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 lg:p-8 text-left border-slate-200/80 shadow-premium flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-5 mb-5">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Active Vehicle Health</h3>
        </div>
        <button
          onClick={() => navigate('/fleet/vehicles')}
          className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
        >
          View Inventory
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-slate-200/60 rounded-xl hover:border-slate-350 hover:bg-slate-50/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20"
            >
              {/* Asset header */}
              <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Odometer: {item.odometer.toLocaleString()} mi</p>
                </div>
              </div>

              {/* Health Score Progress */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-450">
                  <div className="flex items-center gap-1">
                    <Heart className={cn("w-3.5 h-3.5", item.health >= 85 ? "text-emerald-500" : "text-rose-500")} />
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

              {/* Status and last serviced info */}
              <div className="flex items-center md:items-end justify-between md:flex-col gap-2 shrink-0 md:w-1/4">
                <StatusChip status={item.status} className="shrink-0" />
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                  <span>Served: {item.lastMaintenance}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-700">No active assets</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default VehicleStatus;
