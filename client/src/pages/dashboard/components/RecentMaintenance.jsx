import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function RecentMaintenance({ data }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 text-left border-slate-200/80 shadow-premium-sm flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-brand-primary" />
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Active Maintenance</h3>
        </div>
        <button
          onClick={() => navigate('/maintenance')}
          className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
        >
          View Log Registry
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-slate-200/60 hover:border-slate-300 rounded-xl transition-all duration-200 hover:-translate-y-0.5 flex items-start justify-between gap-3 bg-slate-50/40"
            >
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{item.vehicle}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-450 font-semibold">
                  <span className="truncate">{item.type}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-0.5 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
                <span className="text-xs font-extrabold text-slate-800">
                  ${item.cost.toLocaleString()}
                </span>
                <Badge
                  variant={item.status === 'completed' ? 'success' : 'warning'}
                  size="sm"
                  className="py-0.5 px-1.5 text-[9px] font-bold"
                >
                  <span className="flex items-center gap-1">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : (
                      <Clock className="w-2.5 h-2.5" />
                    )}
                    {item.status.toUpperCase()}
                  </span>
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-350 mb-3">
              <Wrench className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">All vehicles healthy</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              No vehicles currently booked in the terminal shop garages.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default RecentMaintenance;
