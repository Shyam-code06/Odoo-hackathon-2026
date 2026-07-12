import { Calendar, Truck, DollarSign, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/StatusChip';
import { Avatar } from '@/components/ui/Avatar';
import { TripTimeline } from './TripTimeline';

export function TripDrawer({ item, onComplete, onCancel }) {
  const isActive = item.status === 'in_transit' || item.status === 'dispatched';

  // Sample expenses for this trip
  const sampleExpenses = [
    { id: 'ex-1', date: '2026-07-11', type: 'Fuel Refill', amount: 340, category: 'Fuel' },
    { id: 'ex-2', date: '2026-07-11', type: 'Highway Toll', amount: 45, category: 'Tolls' }
  ];

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* 1. Trip Header Badge */}
      <div className="flex items-center justify-between border-b border-subtle pb-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trip Reference ID</span>
          <h4 className="text-sm font-bold text-slate-800">{item.tripCode || item.id}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={item.priority === 'High' ? 'danger' : 'neutral'} size="sm" className="font-bold text-[9px]">
            {item.priority || 'Normal'} Priority
          </Badge>
          <StatusChip status={item.status} />
        </div>
      </div>

      {/* 2. Stepper Status Banner */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3.5">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-450 font-semibold block mb-0.5">Origin Source</span>
            <span className="text-slate-700 font-bold block">{item.source || item.origin}</span>
          </div>
          <div>
            <span className="text-slate-450 font-semibold block mb-0.5">Destination Terminal</span>
            <span className="text-slate-700 font-bold block">{item.destination}</span>
          </div>
        </div>
        <div className="border-t border-slate-200/50 pt-3 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-450 font-semibold block mb-0.5">Expected Delivery</span>
            <span className="text-slate-750 font-bold block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {item.expectedDeliveryDate || item.eta}
            </span>
          </div>
          <div>
            <span className="text-slate-450 font-semibold block mb-0.5">Total Route Distance</span>
            <span className="text-slate-750 font-bold block">{item.distance || item.estimatedDistance} mi</span>
          </div>
        </div>
      </div>

      {/* 3. Cargo Details */}
      <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 bg-white shadow-premium-sm">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          Cargo Consignment Info
        </h5>
        <div className="grid grid-cols-2 gap-4 text-xs pt-1.5">
          <div>
            <span className="text-slate-400 font-medium block">Cargo Classification</span>
            <span className="text-slate-700 font-bold block">{item.cargoType}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Total Weight Limit</span>
            <span className="text-slate-700 font-bold block">{item.cargoWeight} tons</span>
          </div>
        </div>
      </div>

      {/* 4. Assigned Driver & Vehicle preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Driver */}
        <div className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/20 text-left space-y-3">
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Assigned Operator</span>
          <div className="flex items-center gap-2.5">
            <Avatar name={item.driverName} size="sm" />
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-800 truncate">{item.driverName}</h5>
              <span className="text-[9px] text-slate-400 font-semibold truncate block">Class A CDL Verified</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-200/50">
            <span className="text-slate-450 font-semibold">Safety score:</span>
            <Badge variant="success" size="sm" className="font-bold text-[9px]">
              {item.driverSafetyScore || 98}%
            </Badge>
          </div>
        </div>

        {/* Vehicle */}
        <div className="p-4 border border-slate-200/60 rounded-xl bg-slate-50/20 text-left space-y-3">
          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Assigned Truck</span>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-800 truncate">{item.vehicleName}</h5>
              <span className="text-[9px] text-slate-450 font-semibold truncate block">{item.plateNumber}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-200/50">
            <span className="text-slate-450 font-semibold">Asset Health:</span>
            <span className="text-brand-success font-bold">{item.vehicleHealth || '94%'}</span>
          </div>
        </div>
      </div>

      {/* 5. Fuel & Expense summary */}
      <div className="grid grid-cols-1 gap-4">
        {/* Expenses List */}
        <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-premium-sm space-y-3">
          <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Trip Cost Invoices
          </h5>
          <div className="space-y-2">
            {sampleExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between text-xs py-1.5 border-b border-subtle last:border-b-0">
                <span className="text-slate-655 font-semibold">{exp.type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px]">{exp.date}</span>
                  <span className="font-bold text-slate-800">${exp.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Route Event Timeline */}
      <div className="border border-slate-200/80 rounded-xl p-5 bg-white shadow-premium-sm space-y-4">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">Route Tracking Timeline</h5>
        <TripTimeline timeline={item.timeline} />
      </div>

      {/* 7. Action Button Deck */}
      {isActive && (
        <div className="flex items-center gap-3 pt-4 border-t border-subtle">
          <Button
            variant="outline"
            leftIcon={XCircle}
            onClick={() => onCancel(item)}
            className="flex-1"
          >
            Cancel Trip
          </Button>
          <Button
            variant="primary"
            leftIcon={CheckCircle2}
            onClick={() => onComplete(item)}
            className="flex-1"
          >
            Complete Delivery
          </Button>
        </div>
      )}
    </div>
  );
}

export default TripDrawer;
