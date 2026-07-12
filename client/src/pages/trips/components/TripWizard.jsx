import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X,
  Truck, 
  User, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  Fuel, 
  Clock, 
  ShieldAlert,
  Award,
  AlertTriangle
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { vehicleService } from '@/services/vehicleService';
import { driverService } from '@/services/driverService';
import { FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

import { cn } from '@/utils';

// Step 1: Form Validation Schema
const tripInfoSchema = z.object({
  tripName: z.string().min(3, "Trip name must be at least 3 characters"),
  source: z.string().min(2, "Source terminal is required"),
  destination: z.string().min(2, "Destination terminal is required"),
  cargoType: z.string().min(1, "Cargo classification type is required"),
  cargoWeight: z.coerce.number().min(0.1, "Cargo weight must be positive"),
  estimatedDistance: z.coerce.number().min(1, "Estimated route distance is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  priority: z.string().min(1, "Priority is required"),
  notes: z.string().optional(),
});

const defaultValues = {
  tripName: '',
  source: '',
  destination: '',
  cargoType: 'Industrial Equipment',
  cargoWeight: 10,
  estimatedDistance: 250,
  expectedDeliveryDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
  priority: 'Normal',
  notes: '',
};

export function TripWizard({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState(1);
  
  // Available list feeds
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Selected assignments
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // React Hook Form for Step 1
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(tripInfoSchema),
    defaultValues
  });

  const tripValues = watch();

  // Load available assets
  useEffect(() => {
    if (isOpen) {
      setIsLoadingAssets(true);
      Promise.all([
        vehicleService.getAll(),
        driverService.getAll()
      ]).then(([vData, dData]) => {
        setVehicles(vData);
        setDrivers(dData);
      }).catch((err) => {
        console.error('Failed to load fleet assets for dispatch:', err);
        toast.error('Failed to load available fleet roster.');
      }).finally(() => {
        setIsLoadingAssets(false);
      });
    } else {
      // Reset wizard
      setStep(1);
      setSelectedVehicle(null);
      setSelectedDriver(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Navigation handlers
  const handleNextStep1 = () => {
    // Triggers schema validations
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!selectedVehicle) {
      toast.error('Please assign a vehicle before proceeding.');
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = () => {
    if (!selectedDriver) {
      toast.error('Please assign a driver before proceeding.');
      return;
    }
    setStep(4);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleDispatchConfirm = async () => {
    if (!selectedVehicle || !selectedDriver) return;

    const newTripData = {
      tripCode: `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
      tripName: tripValues.tripName,
      source: tripValues.source,
      destination: tripValues.destination,
      cargoType: tripValues.cargoType,
      cargoWeight: Number(tripValues.cargoWeight),
      distance: Number(tripValues.estimatedDistance),
      expectedDeliveryDate: tripValues.expectedDeliveryDate,
      priority: tripValues.priority,
      notes: tripValues.notes,
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.make} ${selectedVehicle.model}`,
      plateNumber: selectedVehicle.plateNumber,
      driverId: selectedDriver.id,
      driverName: selectedDriver.name,
      status: 'dispatched', // dispatch center
      eta: tripValues.expectedDeliveryDate,
      timeline: [
        {
          id: 'evt-1',
          type: 'created',
          title: 'Trip Initialized',
          description: 'Shipment cargo specs registered and validated.',
          timestamp: dayjs().format('hh:mm A')
        },
        {
          id: 'evt-2',
          type: 'vehicle_assigned',
          title: 'Truck Assigned',
          description: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plateNumber}) secured.`,
          timestamp: dayjs().format('hh:mm A')
        },
        {
          id: 'evt-3',
          type: 'driver_assigned',
          title: 'Driver Dispatched',
          description: `${selectedDriver.name} Class A CDL verification accepted.`,
          timestamp: dayjs().format('hh:mm A')
        },
        {
          id: 'evt-4',
          type: 'started',
          title: 'Trip Dispatched',
          description: `Dispatched from ${tripValues.source} towards ${tripValues.destination}.`,
          timestamp: dayjs().format('hh:mm A')
        }
      ]
    };

    try {
      await onSave(newTripData);
      toast.success('Trip successfully dispatched!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create dispatch schedule.');
    }
  };

  // Cost calculations
  const estFuel = selectedVehicle ? Math.round(tripValues.estimatedDistance / 6.5) : 0;
  const estCost = Math.round(tripValues.estimatedDistance * 2.85 + estFuel * 3.8);
  const estHours = Math.round(tripValues.estimatedDistance / 52);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl shadow-premium-lg flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-subtle flex items-center justify-between text-left">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Create Trip Dispatch Wizard</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Step-by-step route scheduling and operator dispatching.</p>
          </div>
          <button onClick={onClose} className="p-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper progress bar */}
        <div className="bg-slate-50 border-b border-subtle px-6 py-4.5 flex items-center justify-between gap-2 overflow-x-auto text-[10px] font-bold tracking-wider uppercase text-slate-400">
          <div className="flex items-center gap-4.5 flex-1 min-w-max">
            {/* Step 1 */}
            <div className={cn("flex items-center gap-2", step >= 1 && "text-brand-primary")}>
              <span className={cn("w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center bg-white text-[9px] shrink-0 font-extrabold", step > 1 && "bg-brand-primary text-white border-brand-primary")}>
                {step > 1 ? <Check className="w-3 h-3" /> : '1'}
              </span>
              <span>1. Trip Details</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-200 flex-1 min-w-[20px]" />

            {/* Step 2 */}
            <div className={cn("flex items-center gap-2", step >= 2 && "text-brand-primary")}>
              <span className={cn("w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center bg-white text-[9px] shrink-0 font-extrabold", step > 2 && "bg-brand-primary text-white border-brand-primary")}>
                {step > 2 ? <Check className="w-3 h-3" /> : '2'}
              </span>
              <span>2. Vehicle Select</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-200 flex-1 min-w-[20px]" />

            {/* Step 3 */}
            <div className={cn("flex items-center gap-2", step >= 3 && "text-brand-primary")}>
              <span className={cn("w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center bg-white text-[9px] shrink-0 font-extrabold", step > 3 && "bg-brand-primary text-white border-brand-primary")}>
                {step > 3 ? <Check className="w-3 h-3" /> : '3'}
              </span>
              <span>3. Driver Roster</span>
            </div>
            <div className="h-0.5 w-8 bg-slate-200 flex-1 min-w-[20px]" />

            {/* Step 4 */}
            <div className={cn("flex items-center gap-2", step >= 4 && "text-brand-primary")}>
              <span className={cn("w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center bg-white text-[9px] shrink-0 font-extrabold", step === 4 && "border-brand-primary text-brand-primary")}>
                4
              </span>
              <span>4. Review & Launch</span>
            </div>
          </div>
        </div>

        {/* Content body container */}
        <div className="flex-1 overflow-y-auto p-6 text-left">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSubmit(handleNextStep1)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="md:col-span-2 border-b border-subtle pb-2 mb-2 flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <FileText className="w-4 h-4 text-brand-primary" />
                  <span>Consignment Cargo & Dispatch Specifications</span>
                </div>

                <FormField label="Trip Schedule Name" error={errors.tripName?.message} isRequired>
                  <Input placeholder="e.g. Dallas Steel Pipe Delivery" {...register('tripName')} />
                </FormField>

                <FormField label="Cargo Classification" error={errors.cargoType?.message} isRequired>
                  <Input placeholder="e.g. Industrial Machinery" {...register('cargoType')} />
                </FormField>

                <FormField label="Cargo Weight Limit (Tons)" error={errors.cargoWeight?.message} isRequired>
                  <Input type="number" step="0.1" {...register('cargoWeight')} />
                </FormField>

                <FormField label="Origin Station" error={errors.source?.message} isRequired>
                  <Input placeholder="e.g. Dallas Logistics Hub" {...register('source')} />
                </FormField>

                <FormField label="Destination Terminal" error={errors.destination?.message} isRequired>
                  <Input placeholder="e.g. Houston North Port" {...register('destination')} />
                </FormField>

                <FormField label="Estimated Distance (Miles)" error={errors.estimatedDistance?.message} isRequired>
                  <Input type="number" {...register('estimatedDistance')} />
                </FormField>

                <FormField label="Target Delivery Date" error={errors.expectedDeliveryDate?.message} isRequired>
                  <Input type="date" {...register('expectedDeliveryDate')} />
                </FormField>

                <FormField label="Dispatch Priority" isRequired>
                  <Select 
                    options={[
                      { value: 'Normal', label: 'Normal Priority' },
                      { value: 'High', label: 'High Priority (Urgent)' }
                    ]} 
                    value={tripValues.priority} 
                    onChange={(val) => setValue('priority', val)} 
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Route Dispatch Notes">
                    <Textarea placeholder="Instructions for safety gates, dispatch security checks, or parking locations..." {...register('notes')} />
                  </FormField>
                </div>

                {/* Navigation Button inside Form to trigger submit validation */}
                <div className="md:col-span-2 flex justify-end pt-4 border-t border-subtle mt-4">
                  <Button type="submit" variant="primary" rightIcon={ArrowRight}>
                    Next: Assign Truck
                  </Button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-subtle pb-2 flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <Truck className="w-4 h-4 text-brand-primary" />
                  <span>Assign Vehicle Asset (Required Payload capacity: {tripValues.cargoWeight} tons)</span>
                </div>

                {isLoadingAssets ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-bold animate-pulse">
                    Scanning fleet inventory statuses...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((v) => {
                      const isOverloaded = tripValues.cargoWeight > v.capacity;
                      const isUnavailable = v.status !== 'available';
                      const isDisabled = isOverloaded || isUnavailable;
                      const isSelected = selectedVehicle?.id === v.id;

                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            if (isDisabled) return;
                            setSelectedVehicle(v);
                          }}
                          className={cn(
                            "p-4 border rounded-xl bg-slate-50/10 text-left space-y-3 transition-all duration-200 relative overflow-hidden",
                            isDisabled ? "opacity-60 bg-slate-100/50 cursor-not-allowed border-slate-200" : "cursor-pointer hover:border-slate-350 hover:bg-slate-50/30",
                            isSelected && "border-brand-primary bg-blue-50/10 shadow-[0_0_12px_rgba(59,130,246,0.15)] ring-1 ring-brand-primary"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{v.make} {v.model}</h4>
                              <p className="text-[10px] text-slate-450 font-semibold">{v.plateNumber}</p>
                            </div>
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-lg border", 
                              v.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                            )}>
                              {v.status === 'available' ? 'Available' : 'Unavailable'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-200/50 text-slate-500">
                            <div>
                              <span className="font-semibold block">Max Payload:</span>
                              <span className="font-bold text-slate-700">{v.capacity} tons</span>
                            </div>
                            <div>
                              <span className="font-semibold block">Odometer:</span>
                              <span className="font-bold text-slate-700">{v.odometer?.toLocaleString()} mi</span>
                            </div>
                          </div>

                          {/* Overloaded or Unavailable tags */}
                          {isOverloaded && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center p-3">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-danger bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Capacity Exceeded
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Stepper Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-subtle mt-6">
                  <Button type="button" variant="outline" leftIcon={ArrowLeft} onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" rightIcon={ArrowRight} onClick={handleNextStep2}>
                    Next: Assign Driver
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="border-b border-subtle pb-2 flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span>Assign Duty Operator</span>
                </div>

                {isLoadingAssets ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-bold animate-pulse">
                    Scanning operator roster...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drivers.map((d) => {
                      const isExpired = dayjs(d.licenseExpiry).isBefore(dayjs());
                      const isUnavailable = d.status !== 'available';
                      const isDisabled = isExpired || isUnavailable;
                      const isSelected = selectedDriver?.id === d.id;

                      return (
                        <div
                          key={d.id}
                          onClick={() => {
                            if (isDisabled) return;
                            setSelectedDriver(d);
                          }}
                          className={cn(
                            "p-4 border rounded-xl bg-slate-50/10 text-left space-y-3 transition-all duration-200 relative overflow-hidden",
                            isDisabled ? "opacity-60 bg-slate-100/50 cursor-not-allowed border-slate-200" : "cursor-pointer hover:border-slate-350 hover:bg-slate-50/30",
                            isSelected && "border-brand-primary bg-blue-50/10 shadow-[0_0_12px_rgba(59,130,246,0.15)] ring-1 ring-brand-primary"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar src={d.avatar} name={d.name} size="sm" />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-800 truncate">{d.name}</h4>
                              <p className="text-[9px] text-slate-400 font-semibold truncate">Expires: {d.licenseExpiry}</p>
                            </div>
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-lg border", 
                              d.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                            )}>
                              {d.status === 'available' ? 'Available' : 'Busy'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-200/50">
                            <span className="text-slate-450 font-semibold flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-slate-400" /> Safety rating:
                            </span>
                            <span className="font-bold text-slate-700">{d.safetyScore}%</span>
                          </div>

                          {isExpired && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center p-3">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-danger bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                CDL Expired
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Stepper Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-subtle mt-6">
                  <Button type="button" variant="outline" leftIcon={ArrowLeft} onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" rightIcon={ArrowRight} onClick={handleNextStep3}>
                    Next: Review & Launch
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="border-b border-subtle pb-2 flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <Check className="w-4 h-4 text-brand-success" />
                  <span>Review Consignment Manifest & Cost Estimations</span>
                </div>

                {/* Manifest Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Trip Details Card */}
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 text-left space-y-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ROUTE SPECIFICATIONS</span>
                    <h5 className="text-xs font-bold text-slate-800">{tripValues.tripName}</h5>
                    <div className="space-y-1 text-[10px] text-slate-500 font-semibold">
                      <p>Cargo: {tripValues.cargoType} ({tripValues.cargoWeight} tons)</p>
                      <p>From: {tripValues.source}</p>
                      <p>To: {tripValues.destination}</p>
                      <p>Distance: {tripValues.estimatedDistance} miles</p>
                    </div>
                  </div>

                  {/* Truck Assignment */}
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 text-left space-y-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ASSIGNED VEHICLE</span>
                    <h5 className="text-xs font-bold text-slate-800">{selectedVehicle?.make} {selectedVehicle?.model}</h5>
                    <div className="space-y-1 text-[10px] text-slate-500 font-semibold">
                      <p>Registration: {selectedVehicle?.plateNumber}</p>
                      <p>Tonnage Capacity: {selectedVehicle?.capacity} tons</p>
                      <p>Odometer: {selectedVehicle?.odometer?.toLocaleString()} mi</p>
                      <p>Health index: {selectedVehicle?.health}%</p>
                    </div>
                  </div>

                  {/* Driver Assignment */}
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 text-left space-y-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ASSIGNED OPERATOR</span>
                    <h5 className="text-xs font-bold text-slate-800">{selectedDriver?.name}</h5>
                    <div className="space-y-1 text-[10px] text-slate-500 font-semibold">
                      <p>Safety Score: {selectedDriver?.safetyScore}%</p>
                      <p>License: {selectedDriver?.category}</p>
                      <p>Expiry: {selectedDriver?.licenseExpiry}</p>
                      <p>Duty Phone: {selectedDriver?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Estimate indicators */}
                <div className="grid grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/15">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">EST. BUDGET</span>
                      <span className="text-xs font-bold text-slate-800">${estCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                      <Fuel className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">EST. DIESEL</span>
                      <span className="text-xs font-bold text-slate-800">{estFuel} gal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">EST. DURATION</span>
                      <span className="text-xs font-bold text-slate-800">{estHours} hours</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-subtle mt-6">
                  <Button type="button" variant="outline" leftIcon={ArrowLeft} onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" onClick={handleDispatchConfirm}>
                    Authorize & Dispatch Vehicle
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default TripWizard;
