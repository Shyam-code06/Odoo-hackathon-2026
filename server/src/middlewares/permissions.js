/**
 * Permission constants for granular action-level authorization.
 * These are stored in the JWT and checked on both frontend and backend.
 */
const PERMISSIONS = {
  // User management
  MANAGE_USERS: 'manage_users',

  // Vehicles
  VIEW_VEHICLE:   'view_vehicle',
  CREATE_VEHICLE: 'create_vehicle',
  EDIT_VEHICLE:   'edit_vehicle',
  DELETE_VEHICLE: 'delete_vehicle',

  // Drivers
  VIEW_DRIVER:   'view_driver',
  CREATE_DRIVER: 'create_driver',
  EDIT_DRIVER:   'edit_driver',
  DELETE_DRIVER: 'delete_driver',

  // Trips
  VIEW_TRIP:    'view_trip',
  CREATE_TRIP:  'create_trip',
  DISPATCH_TRIP:'dispatch_trip',
  DELETE_TRIP:  'delete_trip',

  // Maintenance
  VIEW_MAINTENANCE:   'view_maintenance',
  MANAGE_MAINTENANCE: 'manage_maintenance',

  // Finance
  VIEW_FINANCE:   'view_finance',
  MANAGE_FINANCE: 'manage_finance',

  // Analytics & Reports
  VIEW_ANALYTICS: 'view_analytics',

  // Export
  EXPORT_DATA: 'export_data',

  // Settings
  MANAGE_SETTINGS: 'manage_settings',
};

/**
 * Role → Permissions mapping.
 * Defines exactly what each role can do.
 */
const ROLE_PERMISSIONS = {
  FLEET_MANAGER: Object.values(PERMISSIONS),  // Full access

  DISPATCHER: [
    PERMISSIONS.VIEW_VEHICLE,
    PERMISSIONS.VIEW_DRIVER,
    PERMISSIONS.VIEW_TRIP,
    PERMISSIONS.CREATE_TRIP,
    PERMISSIONS.DISPATCH_TRIP,
    PERMISSIONS.DELETE_TRIP,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  SAFETY_OFFICER: [
    PERMISSIONS.VIEW_VEHICLE,
    PERMISSIONS.VIEW_DRIVER,
    PERMISSIONS.VIEW_TRIP,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
  ],

  FINANCIAL_ANALYST: [
    PERMISSIONS.VIEW_VEHICLE,
    PERMISSIONS.VIEW_TRIP,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.MANAGE_FINANCE,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
  ],

  MAINTENANCE_MANAGER: [
    PERMISSIONS.VIEW_VEHICLE,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.MANAGE_MAINTENANCE,
  ],

  DRIVER_MANAGER: [
    PERMISSIONS.VIEW_DRIVER,
    PERMISSIONS.CREATE_DRIVER,
    PERMISSIONS.EDIT_DRIVER,
    PERMISSIONS.DELETE_DRIVER,
    PERMISSIONS.VIEW_TRIP,
  ],

  VIEWER: [
    PERMISSIONS.VIEW_VEHICLE,
    PERMISSIONS.VIEW_DRIVER,
    PERMISSIONS.VIEW_TRIP,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  DRIVER: [],
};

/**
 * Get permissions array for a given role.
 * @param {string} role - The user's role (e.g., 'FLEET_MANAGER')
 * @returns {string[]} List of permission strings
 */
const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Middleware: requirePermission(perm)
 * Checks that req.user.permissions includes the specified permission string.
 * Must be used AFTER authenticateJWT.
 *
 * @param {string} permission - The permission constant to require
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const userPermissions = req.user.permissions || [];
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: `Forbidden. You do not have permission: '${permission}'.`,
      });
    }

    next();
  };
};

/**
 * Middleware: requireFleetManager
 * Shorthand guard — only FLEET_MANAGER role can proceed.
 * Must be used AFTER authenticateJWT.
 */
const requireFleetManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  if (req.user.role !== 'FLEET_MANAGER') {
    return res.status(403).json({
      error: 'Forbidden. Only Fleet Managers can perform this action.',
    });
  }

  next();
};

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsForRole,
  requirePermission,
  requireFleetManager,
};
