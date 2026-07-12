import { useNavigate } from 'react-router-dom';
import { Users, Award, ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/StatusChip';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export function DriverStatus({ data }) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 lg:p-8 text-left border-slate-200/80 shadow-premium flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-subtle pb-5 mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Active Operator Roster</h3>
        </div>
        <button
          onClick={() => navigate('/fleet/drivers')}
          className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
        >
          View Drivers
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-slate-200/60 rounded-xl hover:border-slate-350 hover:bg-slate-50/40 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20"
            >
              {/* Profile header */}
              <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                <Avatar
                  src={item.avatar}
                  name={item.name}
                  size="md"
                  className="border border-slate-200 rounded-xl shrink-0"
                />
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Expires: {item.expiry}
                  </p>
                </div>
              </div>

              {/* Safety Score Rating */}
              <div className="flex-1 min-w-0 flex items-center justify-between md:justify-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-slate-500 font-semibold">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Safety score:</span>
                </div>
                
                <Badge
                  variant={item.score >= 95 ? 'success' : item.score >= 90 ? 'info' : 'warning'}
                  size="sm"
                  className="font-bold text-xs py-1 px-2.5"
                >
                  <span className="flex items-center gap-1">
                    {item.score >= 95 ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5" />
                    )}
                    {item.score} / 100
                  </span>
                </Badge>
              </div>

              {/* Status and telemetry link */}
              <div className="flex items-center md:items-end justify-between md:flex-col gap-2 shrink-0 md:w-1/4">
                <StatusChip status={item.status} className="shrink-0" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {item.availability}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-slate-700">No driver records found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default DriverStatus;
