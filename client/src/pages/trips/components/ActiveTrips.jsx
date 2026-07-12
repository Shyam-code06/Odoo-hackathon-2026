import { motion } from 'framer-motion';
import { Truck, Route, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/Button';

export function ActiveTrips({ trips = [], onView, onComplete, onCancel }) {
  if (trips.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-premium-sm select-none">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-350 mx-auto mb-4">
          <Route className="w-7 h-7" />
        </div>
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">No active dispatches</h4>
        <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
          There are no transport trucks in transit. Use the wizard on top to initiate a dispatch load.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 select-none">
      {trips.map((trip) => {
        // Mocking progress for active cards (e.g. 45% based on code)
        const progressVal = trip.status === 'dispatched' ? 10 : trip.status === 'delayed' ? 60 : 45;
        const covered = Math.round((trip.distance || 250) * (progressVal / 100));
        const remaining = (trip.distance || 250) - covered;

        return (
          <motion.div
            key={trip.id || trip.tripCode}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="group"
          >
            <Card className="p-5 border-slate-200/80 shadow-premium-sm hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.08)] transition-all duration-200 flex flex-col h-full space-y-4 text-left">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-subtle pb-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{trip.tripName}</h4>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">{trip.tripCode}</p>
                </div>
                <StatusChip status={trip.status} />
              </div>

              {/* Terminals Row */}
              <div className="flex items-center gap-2.5 text-xs">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">ORIGIN</span>
                  <span className="text-slate-700 font-bold truncate block">{trip.source}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-3" />
                <div className="min-w-0 flex-1 text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">DESTINATION</span>
                  <span className="text-slate-700 font-bold truncate block">{trip.destination}</span>
                </div>
              </div>

              {/* Progress and Distance */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[9px] font-bold text-slate-450 uppercase">
                  <span>DISPATCH PROGRESS</span>
                  <span>{progressVal}%</span>
                </div>
                <Progress value={progressVal} variant={trip.status === 'delayed' ? 'warning' : 'primary'} className="h-1.5" />
                <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-1">
                  <span>{covered} mi covered</span>
                  <span>{remaining} mi left</span>
                </div>
              </div>

              {/* Vehicle & Driver Info */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/50 text-[10px] text-slate-500 font-semibold">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate text-slate-700 font-bold">{trip.vehicleName || 'Truck'}</span>
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={trip.driverName} size="xs" className="shrink-0" />
                  <span className="truncate text-slate-700 font-bold">{trip.driverName || 'Driver'}</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200/50 justify-end flex-1 align-bottom">
                <Button
                  variant="outline"
                  size="xs"
                  className="px-2.5 h-7 py-1 text-[9px] font-bold"
                  onClick={() => onView(trip)}
                >
                  Inspect details
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="px-2.5 h-7 py-1 text-[9px] font-bold text-brand-danger border-rose-200/60 hover:bg-rose-50"
                  leftIcon={XCircle}
                  onClick={() => onCancel(trip)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  className="px-2.5 h-7 py-1 text-[9px] font-bold"
                  leftIcon={CheckCircle2}
                  onClick={() => onComplete(trip)}
                >
                  Deliver
                </Button>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ActiveTrips;
