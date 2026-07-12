import { z } from 'zod';
import { Truck, Calendar, Fuel, Compass, Shield } from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';
import { CrudPage } from '@/components/crud/CrudPage';
import { FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusChip } from '@/components/ui/StatusChip';

// 1. Zod Validation Schema
const vehicleSchema = z.object({
  plateNumber: z.string().min(3, "Plate number must be at least 3 characters"),
  make: z.string().min(2, "Make brand is required"),
  model: z.string().min(2, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  type: z.string().min(1, "Classification type is required"),
  capacity: z.coerce.number().min(0.1, "Capacity must be positive"),
  odometer: z.coerce.number().min(0, "Odometer cannot be negative"),
  acquisitionCost: z.coerce.number().min(0, "Acquisition cost cannot be negative"),
  region: z.string().min(1, "Region is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  status: z.string().min(1, "Status is required"),
});

const defaultValues = {
  plateNumber: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'Heavy Duty Truck',
  capacity: 15,
  odometer: 0,
  acquisitionCost: 0,
  region: 'North',
  fuelType: 'Diesel',
  status: 'available',
};

// 2. Table Column Configurations
const columns = [
  {
    key: 'plateNumber',
    header: 'Reg Number',
    sortable: true,
    render: (row) => <span className="font-bold text-slate-800 tracking-tight">{row.plateNumber}</span>,
  },
  {
    key: 'make',
    header: 'Vehicle Model',
    sortable: true,
    render: (row) => (
      <div className="flex flex-col text-left">
        <span className="font-bold text-slate-700">{row.make} {row.model}</span>
        <span className="text-[10px] text-slate-400 font-semibold">{row.year}</span>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Classification',
    sortable: true,
  },
  {
    key: 'capacity',
    header: 'Payload Capacity',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-700">{row.capacity} tons</span>,
  },
  {
    key: 'odometer',
    header: 'Odometer Mileage',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-700">{row.odometer?.toLocaleString()} mi</span>,
  },
  {
    key: 'acquisitionCost',
    header: 'Acquisition Cost',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-700">${row.acquisitionCost?.toLocaleString()}</span>,
  },
  {
    key: 'region',
    header: 'Operational Region',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => <StatusChip status={row.status} />,
  },
];

// 3. Dynamic Filter Configuration
const filterConfig = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'available', label: 'Available' },
      { value: 'on_trip', label: 'On Trip' },
      { value: 'maintenance', label: 'In Shop' },
      { value: 'retired', label: 'Retired' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    options: [
      { value: 'Heavy Duty Truck', label: 'Heavy Duty Truck' },
      { value: 'Light Cargo Van', label: 'Light Cargo Van' },
      { value: 'Flatbed Trailer', label: 'Flatbed Trailer' },
    ],
  },
];

// 4. Statistics Panel Calculator
const calculateStats = (items) => {
  const total = items.length;
  const available = items.filter((i) => i.status === 'available').length;
  const onTrip = items.filter((i) => i.status === 'on_trip').length;
  const inShop = items.filter((i) => i.status === 'maintenance').length;

  return [
    { label: "Total Fleet Assets", value: total, icon: Truck, variant: "blue" },
    { label: "Available Units", value: available, icon: Truck, variant: "emerald", trend: 1.2, trendDirection: "up" },
    { label: "Trips in Transit", value: onTrip, icon: Truck, variant: "blue", trend: 4.8, trendDirection: "up" },
    { label: "In Shop Repairs", value: inShop, icon: Truck, variant: "rose", trend: -2.1, trendDirection: "down" },
  ];
};

// 5. Add / Edit Form UI Fields Component
function VehicleFormFields({ register, errors, setValue, watch }) {
  const currentStatus = watch('status');
  const currentType = watch('type');
  const currentFuel = watch('fuelType');
  const currentRegion = watch('region');

  const statusOpts = [
    { value: 'available', label: 'Available' },
    { value: 'on_trip', label: 'On Trip' },
    { value: 'maintenance', label: 'In Shop' },
    { value: 'retired', label: 'Retired' },
  ];

  const typeOpts = [
    { value: 'Heavy Duty Truck', label: 'Heavy Duty Truck' },
    { value: 'Light Cargo Van', label: 'Light Cargo Van' },
    { value: 'Flatbed Trailer', label: 'Flatbed Trailer' },
  ];

  const fuelOpts = [
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Gasoline', label: 'Gasoline' },
    { value: 'Electric', label: 'Electric' },
  ];

  const regionOpts = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Plate Registration Number" error={errors.plateNumber?.message} isRequired>
        <Input placeholder="e.g. TX-3902" {...register('plateNumber')} />
      </FormField>

      <FormField label="Make Brand" error={errors.make?.message} isRequired>
        <Input placeholder="e.g. Volvo" {...register('make')} />
      </FormField>

      <FormField label="Model Name" error={errors.model?.message} isRequired>
        <Input placeholder="e.g. FH16" {...register('model')} />
      </FormField>

      <FormField label="Model Year" error={errors.year?.message} isRequired>
        <Input type="number" {...register('year')} />
      </FormField>

      <FormField label="Capacity Size (Tons)" error={errors.capacity?.message} isRequired>
        <Input type="number" step="0.1" {...register('capacity')} />
      </FormField>

      <FormField label="Current Odometer (Miles)" error={errors.odometer?.message} isRequired>
        <Input type="number" {...register('odometer')} />
      </FormField>

      <FormField label="Acquisition Cost ($)" error={errors.acquisitionCost?.message} isRequired>
        <Input type="number" {...register('acquisitionCost')} />
      </FormField>

      <FormField label="Operational Region" isRequired>
        <Select options={regionOpts} value={currentRegion} onChange={(val) => setValue('region', val)} />
      </FormField>

      <FormField label="Fuel System" isRequired>
        <Select options={fuelOpts} value={currentFuel} onChange={(val) => setValue('fuelType', val)} />
      </FormField>

      <FormField label="Asset Classification" isRequired>
        <Select options={typeOpts} value={currentType} onChange={(val) => setValue('type', val)} />
      </FormField>

      <FormField label="Status" isRequired>
        <Select options={statusOpts} value={currentStatus} onChange={(val) => setValue('status', val)} />
      </FormField>
    </div>
  );
}

// 6. Sliding Right Drawer Detailed View Component
function VehicleDetailView({ item }) {
  return (
    <div className="space-y-6 text-left select-none">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-subtle pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{item.make} {item.model}</h4>
          <p className="text-[10px] text-slate-400 font-semibold">{item.plateNumber}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Model Year:</span>
          <span className="text-slate-700 font-bold">{item.year}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Classification:</span>
          <span className="text-slate-700 font-bold">{item.type}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Compass className="w-3.5 h-3.5" /> Operating Region:</span>
          <span className="text-slate-700 font-bold">{item.region}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Fuel className="w-3.5 h-3.5" /> Fuel Type:</span>
          <span className="text-slate-700 font-bold">{item.fuelType}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Current Odometer:</span>
          <span className="text-slate-700 font-bold">{item.odometer?.toLocaleString()} mi</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Tonnage Capacity:</span>
          <span className="text-slate-700 font-bold">{item.capacity} tons</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Acquisition Price:</span>
          <span className="text-slate-700 font-bold">${item.acquisitionCost?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Last Serviced:</span>
          <span className="text-slate-700 font-bold">{item.lastMaintenance || 'None recorded'}</span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-slate-450 font-semibold">Status:</span>
          <StatusChip status={item.status} />
        </div>
      </div>

      {/* Decorative Diagnostic Graph Placeholder */}
      <div className="border border-slate-200/80 rounded-xl p-4 space-y-3 bg-white shadow-premium-sm">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">System Diagnostic Score</h5>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-slate-100 animate-spin-slow flex items-center justify-center text-xs font-bold text-slate-800">
            94%
          </div>
          <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Engine pressure, brake pads, and tire gauges are within optimal regulatory limits.
          </div>
        </div>
      </div>
    </div>
  );
}

export function Vehicles() {
  return (
    <CrudPage
      service={vehicleService}
      title="Vehicles Inventory"
      subtitle="Register, track mileage, and audit logistics vehicle assets."
      columns={columns}
      filterConfig={filterConfig}
      statCalculator={calculateStats}
      FormComponent={VehicleFormFields}
      DetailComponent={VehicleDetailView}
      validationSchema={vehicleSchema}
      defaultValues={defaultValues}
      searchKeys={['plateNumber', 'make', 'model', 'type', 'region']}
    />
  );
}

export default Vehicles;
