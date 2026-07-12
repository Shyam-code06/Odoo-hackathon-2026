/**
 * TransitOps Application Constants
 */

// User roles for RBAC
export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  DRIVER: 'driver',
  VIEWER: 'viewer',
};

// Vehicle operational status
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service',
};

export const VEHICLE_STATUS_LABELS = {
  [VEHICLE_STATUS.ACTIVE]: 'Active',
  [VEHICLE_STATUS.MAINTENANCE]: 'In Maintenance',
  [VEHICLE_STATUS.OUT_OF_SERVICE]: 'Out of Service',
};

// Driver status
export const DRIVER_STATUS = {
  AVAILABLE: 'available',
  ON_TRIP: 'on_trip',
  OFF_DUTY: 'off_duty',
  SUSPENDED: 'suspended',
};

export const DRIVER_STATUS_LABELS = {
  [DRIVER_STATUS.AVAILABLE]: 'Available',
  [DRIVER_STATUS.ON_TRIP]: 'On Trip',
  [DRIVER_STATUS.OFF_DUTY]: 'Off Duty',
  [DRIVER_STATUS.SUSPENDED]: 'Suspended',
};

// Trip progress status
export const TRIP_STATUS = {
  PENDING: 'pending',
  DISPATCHED: 'dispatched',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
};

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.PENDING]: 'Pending',
  [TRIP_STATUS.DISPATCHED]: 'Dispatched',
  [TRIP_STATUS.IN_TRANSIT]: 'In Transit',
  [TRIP_STATUS.COMPLETED]: 'Completed',
  [TRIP_STATUS.DELAYED]: 'Delayed',
  [TRIP_STATUS.CANCELLED]: 'Cancelled',
};

// Maintenance type status
export const MAINTENANCE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
};

// Expense Category
export const EXPENSE_CATEGORY = {
  FUEL: 'fuel',
  MAINTENANCE: 'maintenance',
  TOLLS: 'tolls',
  INSURANCE: 'insurance',
  SALARY: 'salary',
  MISCELLANEOUS: 'miscellaneous',
};

// Navigation layout settings
export const NAV_ITEMS = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: 'LayoutDashboard',
    allowedRoles: ['admin', 'operator', 'driver']
  },
  {
    label: 'Fleet Management',
    icon: 'Truck',
    allowedRoles: ['admin', 'operator', 'driver'],
    children: [
      { path: '/fleet/vehicles', label: 'Vehicles', icon: 'Truck', allowedRoles: ['admin', 'operator', 'driver'] },
      { path: '/fleet/drivers', label: 'Drivers', icon: 'Users', allowedRoles: ['admin', 'operator'] },
      { path: '/fleet/trips', label: 'Trips', icon: 'Route', allowedRoles: ['admin', 'operator', 'driver'] },
    ]
  },
  { 
    path: '/maintenance', 
    label: 'Maintenance', 
    icon: 'Wrench',
    allowedRoles: ['admin', 'operator']
  },
  {
    label: 'Fuel & Expenses',
    icon: 'Fuel',
    allowedRoles: ['admin', 'operator', 'driver'],
    children: [
      { path: '/fuel-expenses/fuel', label: 'Fuel Logs', icon: 'Fuel', allowedRoles: ['admin', 'operator', 'driver'] },
      { path: '/fuel-expenses/expenses', label: 'Expenses', icon: 'DollarSign', allowedRoles: ['admin', 'operator'] },
    ]
  },
  {
    label: 'Analytics',
    icon: 'BarChart3',
    allowedRoles: ['admin', 'operator'],
    children: [
      { path: '/analytics/reports', label: 'Reports', icon: 'FileText', allowedRoles: ['admin', 'operator'] },
      { path: '/analytics/charts', label: 'Charts', icon: 'AreaChart', allowedRoles: ['admin', 'operator'] },
      { path: '/analytics/kpis', label: 'KPI Targets', icon: 'Target', allowedRoles: ['admin', 'operator'] },
    ]
  },
  { 
    path: '/settings', 
    label: 'Settings', 
    icon: 'Settings',
    allowedRoles: ['admin', 'operator']
  },
];
