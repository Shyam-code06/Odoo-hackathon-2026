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
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/vehicles', label: 'Vehicles', icon: 'Truck' },
  { path: '/drivers', label: 'Drivers', icon: 'Users' },
  { path: '/trips', label: 'Trips', icon: 'Route' },
  { path: '/maintenance', label: 'Maintenance', icon: 'Wrench' },
  { path: '/fuel', label: 'Fuel Registry', icon: 'Fuel' },
  { path: '/expenses', label: 'Expenses', icon: 'DollarSign' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
];
