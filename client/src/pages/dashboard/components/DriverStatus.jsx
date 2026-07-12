import { useNavigate } from 'react-router-dom';
import { Users, Award, ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export function DriverStatus({ data }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 text-left border-slate-200/80 shadow-premium-sm flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-primary" />
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">Active Operator Roster</h3>
        </div>
        <button
          onClick={() => navigate('/fleet/drivers')}
          className="text-[10px] font-bold text-brand-primary hover:underline cursor-pointer"
        >
          View Drivers
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/20 hover:border-slate-350 hover:bg-slate-50/50 transition-all duration-200 hover:-translate-y-0.5 space-y-3"
            >
              {/* Profile header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    size="sm"
                    className="border border-slate-200"
                  />
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold truncate flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      Expires: {item.expiry}
                    </p>
                  </div>
                </div>

                <StatusChip status={item.status} className="shrink-0" />
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200/50 text-[10px]">
                <div className="flex items-center gap-1 text-slate-500 font-semibold">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Safety score:</span>
                </div>
                
                <Badge
                  variant={item.score >= 95 ? 'success' : item.score >= 90 ? 'info' : 'warning'}
                  size="sm"
                  className="font-bold text-[9px] py-0.5 px-1.5"
                >
                  <span className="flex items-center gap-1">
                    {item.score >= 95 ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : (
                      <ShieldAlert className="w-3 h-3" />
                    )}
                    {item.score} / 100
                  </span>
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 md:col-span-3 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-700">No driver records found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default DriverStatus;
