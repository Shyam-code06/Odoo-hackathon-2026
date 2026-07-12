import { useEffect, useState } from 'react';
import { z } from 'zod';
import { DollarSign, Calendar, Route, ShieldAlert } from 'lucide-react';
import dayjs from 'dayjs';
import { expenseService } from '@/services/expenseService';
import { vehicleService } from '@/services/vehicleService';
import { CrudPage } from '@/components/crud/CrudPage';
import { FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

// 1. Zod Validation Schema
const expenseSchema = z.object({
  expenseType: z.string().min(3, "Expense type must be at least 3 characters"),
  vehicleName: z.string().min(1, "Vehicle is required"),
  trip: z.string().min(3, "Trip dispatch number must be at least 3 characters"),
  amount: z.coerce.number().min(0.1, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required"),
});

const defaultValues = {
  expenseType: '',
  vehicleName: '',
  trip: '',
  amount: 0,
  date: dayjs().format('YYYY-MM-DD'),
  category: 'Fuel',
};

// 2. Table Column Configurations
const columns = [
  {
    key: 'expenseType',
    header: 'Invoice Type',
    sortable: true,
    render: (row) => <span className="font-bold text-slate-800 tracking-tight">{row.expenseType}</span>,
  },
  {
    key: 'vehicleName',
    header: 'Vehicle Asset',
    sortable: true,
    render: (row) => <span className="font-bold text-slate-700">{row.vehicleName}</span>,
  },
  {
    key: 'trip',
    header: 'Trip Dispatch ID',
    sortable: true,
  },
  {
    key: 'amount',
    header: 'Total Amount',
    sortable: true,
    align: 'right',
    render: (row) => <span className="font-bold text-slate-750">${row.amount?.toLocaleString()}</span>,
  },
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    render: (row) => {
      const colors = {
        Fuel: 'primary',
        Maintenance: 'rose',
        Repairs: 'warning',
        Tolls: 'emerald',
      };
      return (
        <Badge variant={colors[row.category] || 'neutral'} size="sm" className="font-bold text-[9px] py-0.5 px-1.5 uppercase">
          {row.category}
        </Badge>
      );
    },
  },
  {
    key: 'date',
    header: 'Invoice Date',
    sortable: true,
  },
];

// 3. Dynamic Filter Configuration
const filterConfig = [
  {
    key: 'category',
    label: 'Category',
    options: [
      { value: 'Fuel', label: 'Fuel' },
      { value: 'Maintenance', label: 'Maintenance' },
      { value: 'Repairs', label: 'Repairs' },
      { value: 'Tolls', label: 'Tolls' },
    ],
  },
];

// 4. Statistics Panel Calculator
const calculateStats = (items) => {
  const total = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const fuel = items.filter((i) => i.category === 'Fuel').reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const maintenance = items.filter((i) => i.category === 'Maintenance').reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const tolls = items.filter((i) => i.category === 'Tolls').reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return [
    { label: "Total Logged Expenses", value: `$${total.toLocaleString()}`, icon: DollarSign, variant: "blue" },
    { label: "Fuel Registry Costs", value: `$${fuel.toLocaleString()}`, icon: DollarSign, variant: "amber", trend: 6.8, trendDirection: "up" },
    { label: "Scheduled Repairs", value: `$${maintenance.toLocaleString()}`, icon: DollarSign, variant: "rose", trend: -1.2, trendDirection: "down" },
    { label: "Road Toll Invoices", value: `$${tolls.toLocaleString()}`, icon: DollarSign, variant: "emerald", trend: 2.1, trendDirection: "up" },
  ];
};

// 5. Add / Edit Form UI Fields Component
function ExpenseFormFields({ register, errors, setValue, watch }) {
  const [vehicles, setVehicles] = useState([]);
  const currentVehicle = watch('vehicleName');
  const currentCategory = watch('category');

  useEffect(() => {
    vehicleService.getAll().then((data) => {
      setVehicles(data.map((v) => ({
        value: `${v.make} ${v.model} (${v.plateNumber})`,
        label: `${v.make} ${v.model} (${v.plateNumber})`
      })));
    }).catch(console.error);
  }, []);

  const categoryOpts = [
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Repairs', label: 'Repairs' },
    { value: 'Tolls', label: 'Tolls' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Invoice Description" error={errors.expenseType?.message} isRequired>
        <Input placeholder="e.g. Road Toll TxTag" {...register('expenseType')} />
      </FormField>

      <FormField label="Assigned Fleet Vehicle" isRequired>
        <Select 
          options={vehicles} 
          value={currentVehicle} 
          onChange={(val) => setValue('vehicleName', val)} 
          isSearchable
        />
      </FormField>

      <FormField label="Trip Dispatch Code" error={errors.trip?.message} isRequired>
        <Input placeholder="e.g. TRP-9903" {...register('trip')} />
      </FormField>

      <FormField label="Invoice Date" error={errors.date?.message} isRequired>
        <Input type="date" {...register('date')} />
      </FormField>

      <FormField label="Total Cost Amount ($)" error={errors.amount?.message} isRequired>
        <Input type="number" step="0.01" {...register('amount')} />
      </FormField>

      <FormField label="Expense Classification" isRequired>
        <Select options={categoryOpts} value={currentCategory} onChange={(val) => setValue('category', val)} />
      </FormField>
    </div>
  );
}

// 6. Sliding Right Drawer Detailed View Component
function ExpenseDetailView({ item }) {
  return (
    <div className="space-y-6 text-left select-none">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-subtle pb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-success">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{item.expenseType}</h4>
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
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Route className="w-3.5 h-3.5" /> Dispatch ID:</span>
          <span className="text-slate-700 font-bold">{item.trip}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Vehicle Asset:</span>
          <span className="text-slate-700 font-bold">{item.vehicleName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">Total Invoice Amount:</span>
          <span className="text-slate-700 font-bold">${item.amount?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-slate-450 font-semibold">Category Classification:</span>
          <Badge variant={item.category === 'Fuel' ? 'primary' : item.category === 'Maintenance' ? 'rose' : item.category === 'Tolls' ? 'emerald' : 'warning'} size="sm" className="font-bold text-[9px] py-0.5 px-1.5 uppercase">
            {item.category}
          </Badge>
        </div>
      </div>

      {/* Expense explanation advice */}
      <div className="border border-slate-200/80 rounded-xl p-4 space-y-2.5 bg-white shadow-premium-sm">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          Finance Compliance Log
        </h5>
        <p className="text-[10px] text-slate-450 leading-relaxed">
          This expense transaction has been signed and queued for weekly reconciliation audit logs. Receipt attachment triggers are configured for API compliance checks.
        </p>
      </div>
    </div>
  );
}

export function Expenses() {
  return (
    <CrudPage
      service={expenseService}
      title="Expenses Management"
      subtitle="Audit, authorize, and record operations costs across fuel, tolls, and maintenance services."
      columns={columns}
      filterConfig={filterConfig}
      statCalculator={calculateStats}
      FormComponent={ExpenseFormFields}
      DetailComponent={ExpenseDetailView}
      validationSchema={expenseSchema}
      defaultValues={defaultValues}
      searchKeys={['expenseType', 'vehicleName', 'trip', 'category', 'date']}
    />
  );
}

export default Expenses;
