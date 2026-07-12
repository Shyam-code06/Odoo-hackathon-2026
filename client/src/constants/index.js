/**
 * TransitOps Application Constants
 */

// User roles for RBAC — maps to auth.json role values
export const USER_ROLES = {
  FLEET_MANAGER: 'fleet_manager',
  DISPATCHER: 'dispatcher',
  SAFETY_OFFICER: 'safety_officer',
  FINANCIAL_ANALYST: 'financial_analyst',
  // Legacy aliases for backwards compatibility
  ADMIN: 'fleet_manager',
  OPERATOR: 'dispatcher',
  DRIVER: 'driver',
  VIEWER: 'viewer',
};

export const USER_ROLE_LABELS = {
  fleet_manager: 'Fleet Manager',
  dispatcher: 'Dispatcher',
  safety_officer: 'Safety Officer',
  financial_analyst: 'Financial Analyst',
  maintenance_manager: 'Maintenance Manager',
  driver_manager: 'Driver Manager',
  viewer: 'Viewer',
  admin: 'Administrator',
  operator: 'Operator',
  driver: 'Driver',
};

export const USER_ROLE_COLORS = {
  fleet_manager: 'primary',
  dispatcher: 'info',
  safety_officer: 'success',
  financial_analyst: 'purple',
  maintenance_manager: 'warning',
  driver_manager: 'teal',
  viewer: 'neutral',
  admin: 'primary',
  operator: 'info',
  driver: 'neutral',
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

// All roles allowed in protected sections
const ALL_ROLES = ['fleet_manager', 'dispatcher', 'safety_officer', 'financial_analyst', 'maintenance_manager', 'driver_manager', 'viewer', 'admin', 'operator', 'driver'];
const MANAGEMENT_ROLES = ['fleet_manager', 'dispatcher', 'driver_manager', 'admin', 'operator'];
const ANALYTICS_ROLES = ['fleet_manager', 'financial_analyst', 'dispatcher', 'admin', 'operator'];
const FINANCE_ROLES = ['fleet_manager', 'financial_analyst', 'admin', 'operator'];
const MAINTENANCE_ROLES = ['fleet_manager', 'dispatcher', 'safety_officer', 'maintenance_manager', 'admin', 'operator'];
const FM_ONLY = ['fleet_manager'];

// Navigation layout settings
export const NAV_ITEMS = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: 'LayoutDashboard',
    allowedRoles: ALL_ROLES,
  },
  {
    label: 'Fleet Management',
    icon: 'Truck',
    allowedRoles: ALL_ROLES,
    children: [
      { path: '/fleet/vehicles', label: 'Vehicles', icon: 'Truck', allowedRoles: ALL_ROLES },
      { path: '/fleet/drivers', label: 'Drivers', icon: 'Users', allowedRoles: MANAGEMENT_ROLES },
      { path: '/fleet/trips', label: 'Trips', icon: 'Route', allowedRoles: ALL_ROLES },
    ]
  },
  { 
    path: '/maintenance', 
    label: 'Maintenance', 
    icon: 'Wrench',
    allowedRoles: MAINTENANCE_ROLES,
  },
  {
    label: 'Fuel & Expenses',
    icon: 'Fuel',
    allowedRoles: FINANCE_ROLES,
    children: [
      { path: '/fuel-expenses/fuel', label: 'Fuel Logs', icon: 'Fuel', allowedRoles: FINANCE_ROLES },
      { path: '/fuel-expenses/expenses', label: 'Expenses', icon: 'DollarSign', allowedRoles: FINANCE_ROLES },
    ]
  },
  {
    label: 'Analytics',
    icon: 'BarChart3',
    allowedRoles: ANALYTICS_ROLES,
    children: [
      { path: '/analytics/reports', label: 'Reports', icon: 'FileText', allowedRoles: ANALYTICS_ROLES },
      { path: '/analytics/charts', label: 'Charts', icon: 'AreaChart', allowedRoles: ANALYTICS_ROLES },
      { path: '/analytics/kpis', label: 'KPI Targets', icon: 'Target', allowedRoles: ANALYTICS_ROLES },
    ]
  },
  {
    path: '/users',
    label: 'User Management',
    icon: 'UserCog',
    allowedRoles: FM_ONLY,
  },
  { 
    path: '/settings', 
    label: 'Settings', 
    icon: 'Settings',
    allowedRoles: FM_ONLY,
  },
];

// Chart brand color palette for Recharts
export const CHART_COLORS = {
  primary: '#2563EB',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  purple: '#7C3AED',
  teal: '#0D9488',
  pink: '#DB2777',
  orange: '#EA580C',
  neutral: '#94A3B8',
};

export const CHART_COLOR_ARRAY = [
  '#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#7C3AED',
  '#0D9488', '#DB2777', '#EA580C', '#0EA5E9', '#84CC16',
];

// App metadata
export const APP_META = {
  name: 'TransitOps',
  tagline: 'Enterprise Fleet Operations Platform',
  version: '2.0.0',
  year: 2026,
};
