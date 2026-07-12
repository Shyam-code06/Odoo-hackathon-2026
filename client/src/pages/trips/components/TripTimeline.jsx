import { CheckCircle2, Clock, MapPin, Truck, Users, Fuel, AlertTriangle, Play } from 'lucide-react';
import { cn } from '@/utils';

const iconMap = {
  created: Play,
  vehicle_assigned: Truck,
  driver_assigned: Users,
  started: Clock,
  checkpoint: MapPin,
  fuel_added: Fuel,
  maintenance_alert: AlertTriangle,
  completed: CheckCircle2,
};

const colorMap = {
  created: 'text-blue-500 bg-blue-50 border-blue-100',
  vehicle_assigned: 'text-purple-500 bg-purple-50 border-purple-100',
  driver_assigned: 'text-indigo-500 bg-indigo-50 border-indigo-100',
  started: 'text-amber-500 bg-amber-50 border-amber-100',
  checkpoint: 'text-sky-500 bg-sky-50 border-sky-100',
  fuel_added: 'text-emerald-500 bg-emerald-50 border-emerald-100',
  maintenance_alert: 'text-rose-500 bg-rose-50 border-rose-100 animate-pulse',
  completed: 'text-emerald-500 bg-emerald-50 border-emerald-100',
};

export function TripTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 font-semibold select-none">
        No tracking events registered for this route.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l border-slate-200 space-y-6 ml-3 pt-2 pb-2 text-left select-none">
      {timeline.map((event, idx) => {
        const Icon = iconMap[event.type] || MapPin;
        const colorClass = colorMap[event.type] || 'text-slate-500 bg-slate-50 border-slate-100';

        return (
          <div key={event.id || idx} className="relative group">
            {/* Dot Node */}
            <div className={cn(
              "absolute -left-[37px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-sm",
              colorClass
            )}>
              <Icon className="w-3.5 h-3.5" />
            </div>

            {/* Content Details */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <h5 className="text-xs font-bold text-slate-800 tracking-tight">
                  {event.title}
                </h5>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  {event.timestamp || event.time}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-450 leading-relaxed">
                {event.description}
              </p>
              {event.location && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-primary uppercase bg-blue-50/50 border border-blue-100 px-1.5 py-0.5 rounded-lg mt-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TripTimeline;
