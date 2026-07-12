import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Wrench, Calendar, Info, ShieldCheck, DollarSign, Activity } from 'lucide-react';
import dayjs from 'dayjs';
import { maintenanceService } from '@/services/maintenanceService';
import { vehicleService } from '@/services/vehicleService';
import { CrudPage } from '@/components/crud/CrudPage';
import { FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { StatusChip } from '@/components/ui/StatusChip';

// 1. Zod Validation Schema
const maintenanceSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle is required"),
  maintenanceType: z.string().min(3, "Maintenance type must be at least 3 characters"),
  description: z.string().min(5, "Detailed description is required"),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
  status: z.string().min(1, "Status is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
});

const defaultValues = {
  vehicleName: '',
  maintenanceType: '',
  description: '',
  cost: 0,
  status: 'pending',
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: '',
};

// 2. Table Column Configurations
const columns = [
  {
    key: 'vehicleName',
    header: 'Vehicle Asset',
    sortable: true,
    render: (row) => <span className="font-bold text-slate-800 tracking-tight">{row.vehicleName}</span>,
  },
  {
    key: 'maintenanceType',
    header: 'Service Type',
    sortable: true,
    render: (row) => <span className="font-bold text-slate-700">{row.maintenanceType}</span>,
  },
  {
    key: 'cost',
    header: 'Invoiced Cost',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-700">${row.cost?.toLocaleString()}</span>,
  },
  {
    key: 'startDate',
    header: 'Start Date',
    sortable: true,
  },
  {
    key: 'endDate',
    header: 'Release Date',
    sortable: true,
    render: (row) => <span className="text-slate-550 font-semibold">{row.endDate || '-'}</span>,
  },
  {
    key: 'status',
    header: 'Work Status',
    sortable: true,
    render: (row) => {
      const isPending = row.status === 'pending';
      return (
        <div className="flex items-center gap-2">
          <StatusChip status={row.status} />
          {isPending && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
        </div>
      );
    },
  },
];

// 3. Dynamic Filter Configuration
const filterConfig = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

// 4. Statistics Panel Calculator
const calculateStats = (items) => {
  const total = items.length;
  const completed = items.filter((i) => i.status === 'completed').length;
  const pending = items.filter((i) => i.status === 'pending').length;
  const totalCost = items.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return [
    { label: "Total Repairs Logged", value: total, icon: Wrench, variant: "blue" },
    { label: "Active Workshop Cases", value: pending, icon: Activity, variant: "amber", trend: 5.4, trendDirection: "up" },
    { label: "Completed Servicing", value: completed, icon: ShieldCheck, variant: "emerald", trend: 12.8, trendDirection: "up" },
    { label: "Accumulated Expenditure", value: `$${totalCost.toLocaleString()}`, icon: DollarSign, variant: "purple", trend: -1.2, trendDirection: "down" },
  ];
};

// 5. Add / Edit Form UI Fields Component
function MaintenanceFormFields({ register, errors, setValue, watch }) {
  const [vehicles, setVehicles] = useState([]);
  const currentVehicle = watch('vehicleName');
  const currentStatus = watch('status');

  useEffect(() => {
    vehicleService.getAll().then((data) => {
      setVehicles(data.map((v) => ({
        value: `${v.make} ${v.model} (${v.plateNumber})`,
        label: `${v.make} ${v.model} (${v.plateNumber})`
      })));
    }).catch(console.error);
  }, []);

  const statusOpts = [
    { value: 'pending', label: 'Pending / In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Assigned Fleet Vehicle" isRequired>
        <Select 
          options={vehicles} 
          value={currentVehicle} 
          onChange={(val) => setValue('vehicleName', val)} 
          isSearchable
        />
      </FormField>

      <FormField label="Service Type" error={errors.maintenanceType?.message} isRequired>
        <Input placeholder="e.g. Engine Tune-up" {...register('maintenanceType')} />
      </FormField>

      <FormField label="Start Date" error={errors.startDate?.message} isRequired>
        <Input type="date" {...register('startDate')} />
      </FormField>

      <FormField label="Release Date" error={errors.endDate?.message}>
        <Input type="date" {...register('endDate')} />
      </FormField>

      <FormField label="Repair Invoiced Cost ($)" error={errors.cost?.message} isRequired>
        <Input type="number" {...register('cost')} />
      </FormField>

      <FormField label="Workshop Status" isRequired>
        <Select options={statusOpts} value={currentStatus} onChange={(val) => setValue('status', val)} />
      </FormField>

      <div className="md:col-span-2">
        <FormField label="Diagnostic Description Details" error={errors.description?.message} isRequired>
          <Textarea 
            placeholder="Document repair actions taken, parts replaced, or diagnostic error codes logged..." 
            {...register('description')} 
          />
        </FormField>
      </div>
    </div>
  );
}

// 6. Sliding Right Drawer Detailed View Component
function MaintenanceDetailView({ item }) {
  return (
    <div className="space-y-6 text-left select-none">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-subtle pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-brand-secondary animate-pulse-slow">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{item.vehicleName}</h4>
          <p className="text-[10px] text-slate-400 font-semibold">{item.maintenanceType}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Booked In At:</span>
          <span className="text-slate-700 font-bold">{item.startDate}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Released At:</span>
          <span className="text-slate-700 font-bold">{item.endDate || 'Active in workshop'}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> repair Invoice Cost:</span>
          <span className="text-slate-700 font-bold">${item.cost?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-slate-450 font-semibold">Service Status:</span>
          <StatusChip status={item.status} />
        </div>
      </div>

      {/* Description Box */}
      <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 bg-white shadow-premium-sm">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Diagnostic Report Comments
        </h5>
        <p className="text-[11.5px] font-semibold text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">
          "{item.description}"
        </p>
      </div>
    </div>
  );
}

export function Maintenance() {
  return (
    <CrudPage
      service={maintenanceService}
      title="Maintenance Logs"
      subtitle="Track scheduled servicing, emergency repairs, and diesel filter renewals."
      columns={columns}
      filterConfig={filterConfig}
      statCalculator={calculateStats}
      FormComponent={MaintenanceFormFields}
      DetailComponent={MaintenanceDetailView}
      validationSchema={maintenanceSchema}
      defaultValues={defaultValues}
      searchKeys={['vehicleName', 'maintenanceType', 'description', 'status']}
    />
  );
}

export default Maintenance;
