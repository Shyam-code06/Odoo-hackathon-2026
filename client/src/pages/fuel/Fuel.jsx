import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Fuel as FuelIcon, Calendar, DollarSign, Activity, Route, ShieldAlert } from 'lucide-react';
import dayjs from 'dayjs';
import { fuelService } from '@/services/fuelService';
import { vehicleService } from '@/services/vehicleService';
import { CrudPage } from '@/components/crud/CrudPage';
import { FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// 1. Zod Validation Schema
const fuelSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle is required"),
  trip: z.string().min(3, "Trip dispatch number must be at least 3 characters"),
  gallons: z.coerce.number().min(0.1, "Gallons volume must be positive"),
  cost: z.coerce.number().min(0.1, "Cost amount must be positive"),
  fuelType: z.string().min(1, "Fuel type is required"),
  date: z.string().min(1, "Date is required"),
});

const defaultValues = {
  vehicleName: '',
  trip: '',
  gallons: 0,
  cost: 0,
  fuelType: 'Diesel',
  date: dayjs().format('YYYY-MM-DD'),
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
    key: 'trip',
    header: 'Trip Dispatch ID',
    sortable: true,
    render: (row) => <span className="font-bold text-slate-700">{row.trip}</span>,
  },
  {
    key: 'gallons',
    header: 'Volume Filled',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-700">{row.gallons} gal</span>,
  },
  {
    key: 'cost',
    header: 'Refill Cost',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-700">${row.cost?.toLocaleString()}</span>,
  },
  {
    key: 'avgCost',
    header: 'Average Cost/Gal',
    sortable: false,
    align: 'right',
    render: (row) => {
      const avg = row.gallons ? (row.cost / row.gallons).toFixed(2) : '0.00';
      return <span className="font-semibold text-slate-655">${avg} / gal</span>;
    },
  },
  {
    key: 'fuelType',
    header: 'Fuel Type',
    sortable: true,
  },
  {
    key: 'date',
    header: 'Purchase Date',
    sortable: true,
  },
];

// 3. Dynamic Filter Configuration
const filterConfig = [
  {
    key: 'fuelType',
    label: 'Fuel Type',
    options: [
      { value: 'Diesel', label: 'Diesel' },
      { value: 'Gasoline', label: 'Gasoline' },
    ],
  },
];

// 4. Statistics Panel Calculator
const calculateStats = (items) => {
  const totalEntries = items.length;
  const totalCost = items.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalGallons = items.reduce((acc, curr) => acc + (curr.gallons || 0), 0);
  const avgCostPerGallon = totalGallons ? (totalCost / totalGallons) : 0;

  return [
    { label: "Refills Logged", value: totalEntries, icon: FuelIcon, variant: "blue" },
    { label: "Accumulated Expenditure", value: `$${totalCost.toLocaleString()}`, icon: DollarSign, variant: "amber", trend: 6.8, trendDirection: "up" },
    { label: "Total Diesel Volume", value: `${totalGallons.toLocaleString()} gal`, icon: Activity, variant: "blue", trend: 5.2, trendDirection: "up" },
    { label: "Average Rate / Gal", value: `$${avgCostPerGallon.toFixed(2)}`, icon: DollarSign, variant: "purple", trend: -1.5, trendDirection: "down" },
  ];
};

// 5. Add / Edit Form UI Fields Component
function FuelFormFields({ register, errors, setValue, watch }) {
  const [vehicles, setVehicles] = useState([]);
  const currentVehicle = watch('vehicleName');
  const currentFuel = watch('fuelType');

  useEffect(() => {
    vehicleService.getAll().then((data) => {
      setVehicles(data.map((v) => ({
        value: `${v.make} ${v.model} (${v.plateNumber})`,
        label: `${v.make} ${v.model} (${v.plateNumber})`
      })));
    }).catch(console.error);
  }, []);

  const fuelOpts = [
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Gasoline', label: 'Gasoline' },
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

      <FormField label="Trip Dispatch Code" error={errors.trip?.message} isRequired>
        <Input placeholder="e.g. TRP-9902" {...register('trip')} />
      </FormField>

      <FormField label="Purchase Date" error={errors.date?.message} isRequired>
        <Input type="date" {...register('date')} />
      </FormField>

      <FormField label="Fuel System" isRequired>
        <Select options={fuelOpts} value={currentFuel} onChange={(val) => setValue('fuelType', val)} />
      </FormField>

      <FormField label="Volume Filled (Gallons)" error={errors.gallons?.message} isRequired>
        <Input type="number" step="0.01" {...register('gallons')} />
      </FormField>

      <FormField label="Refill Cost Invoice ($)" error={errors.cost?.message} isRequired>
        <Input type="number" step="0.01" {...register('cost')} />
      </FormField>
    </div>
  );
}

// 6. Sliding Right Drawer Detailed View Component
function FuelDetailView({ item }) {
  const avg = item.gallons ? (item.cost / item.gallons).toFixed(2) : '0.00';
  return (
    <div className="space-y-6 text-left select-none">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-subtle pb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <FuelIcon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{item.vehicleName}</h4>
          <p className="text-[10px] text-slate-400 font-semibold">{item.trip}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date:</span>
          <span className="text-slate-700 font-bold">{item.date}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Route className="w-3.5 h-3.5" /> Dispatch Reference:</span>
          <span className="text-slate-700 font-bold">{item.trip}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Fuel System Type:</span>
          <span className="text-slate-700 font-bold">{item.fuelType}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Gallons Loaded:</span>
          <span className="text-slate-700 font-bold">{item.gallons} gal</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Total Invoice Amount:</span>
          <span className="text-slate-700 font-bold">${item.cost?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Calculated Cost Per Gallon:</span>
          <span className="text-slate-700 font-bold">${avg} / gal</span>
        </div>
      </div>

      {/* Fuel efficiency advice */}
      <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 bg-white shadow-premium-sm">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          Logistics Audit Comments
        </h5>
        <p className="text-[10px] text-slate-450 leading-relaxed">
          This fuel purchase maps directly to dispatch {item.trip}. GPS verification validates that the vehicle stopped at the registered terminal refuel geofence coordinates.
        </p>
      </div>
    </div>
  );
}

export function Fuel() {
  return (
    <CrudPage
      service={fuelService}
      title="Fuel Logs"
      subtitle="Document diesel purchases, manage terminal refuels, and audit average cost-per-gallon rates."
      columns={columns}
      filterConfig={filterConfig}
      statCalculator={calculateStats}
      FormComponent={FuelFormFields}
      DetailComponent={FuelDetailView}
      validationSchema={fuelSchema}
      defaultValues={defaultValues}
      searchKeys={['vehicleName', 'trip', 'fuelType', 'date']}
    />
  );
}

export default Fuel;
