import { z } from 'zod';
import { Users, Phone, Mail, FileCheck, Award } from 'lucide-react';
import dayjs from 'dayjs';
import { driverService } from '@/services/driverService';
import { CrudPage } from '@/components/crud/CrudPage';
import { FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusChip } from '@/components/ui/StatusChip';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';

// 1. Zod Validation Schema
const driverSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(7, "Invalid phone number"),
  licenseNumber: z.string().min(5, "License number is required"),
  licenseExpiry: z.string().min(1, "License expiration date is required"),
  category: z.string().min(1, "License category is required"),
  safetyScore: z.coerce.number().min(0).max(100, "Safety score must be between 0 and 100"),
  status: z.string().min(1, "Status is required"),
  avatar: z.string().optional(),
});

const defaultValues = {
  name: '',
  email: '',
  phone: '',
  licenseNumber: '',
  licenseExpiry: dayjs().add(2, 'year').format('YYYY-MM-DD'),
  category: 'Class A CDL',
  safetyScore: 95,
  status: 'available',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
};

// 2. Table Column Configurations
const columns = [
  {
    key: 'name',
    header: 'Operator',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3 text-left">
        <Avatar src={row.avatar} name={row.name} size="sm" />
        <div className="flex flex-col">
          <span className="font-bold text-slate-700">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-semibold">{row.email}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'licenseNumber',
    header: 'CDL License',
    sortable: true,
    render: (row) => (
      <div className="flex flex-col text-left">
        <span className="font-bold text-slate-700">{row.licenseNumber}</span>
        <span className="text-[10px] text-slate-450 font-semibold">{row.category}</span>
      </div>
    ),
  },
  {
    key: 'licenseExpiry',
    header: 'License Expiration',
    sortable: true,
    render: (row) => {
      const isExpired = dayjs(row.licenseExpiry).isBefore(dayjs());
      const isExpiringSoon = dayjs(row.licenseExpiry).isBefore(dayjs().add(30, 'day')) && !isExpired;
      
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-655">{row.licenseExpiry}</span>
          {isExpired && (
            <Badge variant="danger" size="sm" className="font-bold text-[9px] py-0.5 px-1.5 animate-pulse">
              EXPIRED
            </Badge>
          )}
          {isExpiringSoon && (
            <Badge variant="warning" size="sm" className="font-bold text-[9px] py-0.5 px-1.5">
              EXPIRING SOON
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: 'safetyScore',
    header: 'Safety Rating',
    sortable: true,
    align: 'center',
    render: (row) => (
      <div className="flex items-center gap-2.5 w-24">
        <Progress 
          value={row.safetyScore} 
          variant={row.safetyScore >= 95 ? 'success' : row.safetyScore >= 90 ? 'info' : 'danger'}
          className="h-1.5 flex-1"
        />
        <span className="text-[10px] font-bold text-slate-800 shrink-0">{row.safetyScore}%</span>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Phone Number',
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
      { value: 'suspended', label: 'Suspended' },
    ],
  },
];

// 4. Statistics Panel Calculator
const calculateStats = (items) => {
  const total = items.length;
  const available = items.filter((i) => i.status === 'available').length;
  const onTrip = items.filter((i) => i.status === 'on_trip').length;
  const expired = items.filter((i) => dayjs(i.licenseExpiry).isBefore(dayjs())).length;

  return [
    { label: "Total Drivers", value: total, icon: Users, variant: "blue" },
    { label: "Available Drivers", value: available, icon: Users, variant: "emerald", trend: 2.5, trendDirection: "up" },
    { label: "On Trip Dispatches", value: onTrip, icon: Users, variant: "blue", trend: 8.4, trendDirection: "up" },
    { label: "Expired Licenses", value: expired, icon: Users, variant: expired > 0 ? "rose" : "blue", trend: 0, trendDirection: "neutral" },
  ];
};

// 5. Add / Edit Form UI Fields Component
function DriverFormFields({ register, errors, setValue, watch }) {
  const currentStatus = watch('status');
  const currentCategory = watch('category');

  const statusOpts = [
    { value: 'available', label: 'Available' },
    { value: 'on_trip', label: 'On Trip' },
    { value: 'maintenance', label: 'In Shop' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const categoryOpts = [
    { value: 'Class A CDL', label: 'Class A CDL' },
    { value: 'Class B CDL', label: 'Class B CDL' },
    { value: 'Standard Permit', label: 'Standard Permit' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Full Name" error={errors.name?.message} isRequired>
        <Input placeholder="e.g. Carlos Santana" {...register('name')} />
      </FormField>

      <FormField label="Email address" error={errors.email?.message} isRequired>
        <Input type="email" placeholder="e.g. carlos@transitops.com" {...register('email')} />
      </FormField>

      <FormField label="Phone Number" error={errors.phone?.message} isRequired>
        <Input placeholder="e.g. +1 (555) 349-2091" {...register('phone')} />
      </FormField>

      <FormField label="CDL License Code" error={errors.licenseNumber?.message} isRequired>
        <Input placeholder="e.g. CDL-99823-TX" {...register('licenseNumber')} />
      </FormField>

      <FormField label="CDL Expiry Date" error={errors.licenseExpiry?.message} isRequired>
        <Input type="date" {...register('licenseExpiry')} />
      </FormField>

      <FormField label="Safety Performance Score (0-100)" error={errors.safetyScore?.message} isRequired>
        <Input type="number" {...register('safetyScore')} />
      </FormField>

      <FormField label="CDL Class" isRequired>
        <Select options={categoryOpts} value={currentCategory} onChange={(val) => setValue('category', val)} />
      </FormField>

      <FormField label="Duty Status" isRequired>
        <Select options={statusOpts} value={currentStatus} onChange={(val) => setValue('status', val)} />
      </FormField>

      <FormField label="Avatar Image URL" error={errors.avatar?.message}>
        <Input placeholder="https://..." {...register('avatar')} />
      </FormField>
    </div>
  );
}

// 6. Sliding Right Drawer Detailed View Component
function DriverDetailView({ item }) {
  const isExpired = dayjs(item.licenseExpiry).isBefore(dayjs());
  return (
    <div className="space-y-6 text-left select-none">
      {/* Profile Header */}
      <div className="flex items-center gap-3 border-b border-subtle pb-4">
        <Avatar src={item.avatar} name={item.name} size="md" className="border border-slate-200" />
        <div>
          <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
          <p className="text-[10px] text-slate-400 font-semibold">{item.category}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4.5 space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email:</span>
          <span className="text-slate-700 font-bold">{item.email}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone:</span>
          <span className="text-slate-700 font-bold">{item.phone}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold flex items-center gap-1"><FileCheck className="w-3.5 h-3.5" /> CDL License Code:</span>
          <span className="text-slate-700 font-bold">{item.licenseNumber}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-450 font-semibold">License Expiration:</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 font-bold">{item.licenseExpiry}</span>
            {isExpired && (
              <Badge variant="danger" size="sm" className="font-bold text-[9px]">
                EXPIRED
              </Badge>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-slate-450 font-semibold">Safety Score Rating:</span>
          <Badge
            variant={item.safetyScore >= 95 ? 'success' : item.safetyScore >= 90 ? 'info' : 'danger'}
            size="sm"
            className="font-bold text-[9px]"
          >
            {item.safetyScore} / 100
          </Badge>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-slate-450 font-semibold">Duty Status:</span>
          <StatusChip status={item.status} />
        </div>
      </div>

      {/* Safety Score Progress */}
      <div className="border border-slate-200/80 rounded-xl p-4 space-y-3 bg-white shadow-premium-sm">
        <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-slate-400" />
          Operator Safety Analytics
        </h5>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-slate-450 font-bold">
            <span>SLA COMPLIANCE SCORE</span>
            <span>{item.safetyScore}%</span>
          </div>
          <Progress 
            value={item.safetyScore}
            variant={item.safetyScore >= 95 ? 'success' : item.safetyScore >= 90 ? 'info' : 'danger'}
            className="h-2"
          />
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            The safety compliance index averages acceleration spikes, sudden stops, speed telemetry compliance, and daily check-ins.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Drivers() {
  return (
    <CrudPage
      service={driverService}
      title="Drivers Registry"
      subtitle="Track safety logs, CDL verification, and operational duties of transport operators."
      columns={columns}
      filterConfig={filterConfig}
      statCalculator={calculateStats}
      FormComponent={DriverFormFields}
      DetailComponent={DriverDetailView}
      validationSchema={driverSchema}
      defaultValues={defaultValues}
      searchKeys={['name', 'licenseNumber', 'phone', 'email']}
    />
  );
}

export default Drivers;
