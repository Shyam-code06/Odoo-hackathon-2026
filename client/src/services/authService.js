import axiosInstance from './axiosInstance';

// ---------------------------------------------------------------------------
// Role → Permissions mapping (mirrors backend permissions.js)
// This is used to enrich the user object on the frontend for UI gating.
// The real permissions come from the JWT — this is a safety fallback.
// ---------------------------------------------------------------------------
const ROLE_PERMISSIONS_MAP = {
  fleet_manager: [
    'manage_users', 'view_vehicle', 'create_vehicle', 'edit_vehicle', 'delete_vehicle',
    'view_driver', 'create_driver', 'edit_driver', 'delete_driver',
    'view_trip', 'create_trip', 'dispatch_trip', 'delete_trip',
    'view_maintenance', 'manage_maintenance',
    'view_finance', 'manage_finance',
    'view_analytics', 'export_data', 'manage_settings',
  ],
  dispatcher: [
    'view_vehicle', 'view_driver', 'view_trip', 'create_trip', 'dispatch_trip', 'delete_trip', 'view_analytics',
  ],
  safety_officer: [
    'view_vehicle', 'view_driver', 'view_trip', 'view_maintenance', 'manage_maintenance', 'view_analytics', 'export_data',
  ],
  financial_analyst: [
    'view_vehicle', 'view_trip', 'view_finance', 'manage_finance', 'view_analytics', 'export_data',
  ],
  maintenance_manager: [
    'view_vehicle', 'view_maintenance', 'manage_maintenance',
  ],
  driver_manager: [
    'view_driver', 'create_driver', 'edit_driver', 'delete_driver', 'view_trip',
  ],
  viewer: [
    'view_vehicle', 'view_driver', 'view_trip', 'view_maintenance', 'view_finance', 'view_analytics',
  ],
  driver: [],
};

/**
 * Normalize backend user to frontend format.
 * Backend roles are uppercase (FLEET_MANAGER), frontend uses lowercase (fleet_manager).
 * Permissions come from the JWT if present; else derived from role.
 */
const mapUser = (backendUser) => {
  if (!backendUser) return null;

  const role = backendUser.role ? backendUser.role.toLowerCase() : 'viewer';
  // Use real permissions from JWT/backend when available, else derive from role
  const permissions = (backendUser.permissions && backendUser.permissions.length > 0)
    ? backendUser.permissions
    : (ROLE_PERMISSIONS_MAP[role] || []);

  return {
    ...backendUser,
    role,
    permissions,
    fleetManagerId: backendUser.fleetManagerId || null,
    avatar: backendUser.avatar
      || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face`,
  };
};

/**
 * Authentication Service
 */
export const authService = {
  login: async ({ email, password }) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token, user } = response.data;
    return { token, user: mapUser(user) };
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return mapUser(response.data);
  },

  // Standard CRUD stubs (auth page doesn't list records)
  getAll: async () => [],
  getById: async () => null,
  create: async () => null,
  update: async () => null,
  delete: async () => ({ success: true }),
  export: async () => '',
  statistics: async () => ({}),
};

export default authService;
