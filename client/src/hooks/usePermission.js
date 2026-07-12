import { useAuth } from '@/hooks/useAuth';

/**
 * usePermission — granular permission checking hook.
 *
 * Returns utilities to check if the current user has specific permissions
 * or is a Fleet Manager (org admin).
 *
 * Permissions are loaded from user.permissions[] which comes from the JWT.
 * The backend sets permissions based on role at login time.
 *
 * Usage:
 *   const { hasPermission, isFleetManager } = usePermission();
 *   if (hasPermission('create_vehicle')) { ... }
 *   if (isFleetManager()) { ... }
 */
export const usePermission = () => {
  const { user, hasPermission, isFleetManager } = useAuth();

  /**
   * Check if the current user has ALL of the specified permissions.
   * @param {string|string[]} perms - Single permission or array of permissions
   */
  const hasAllPermissions = (perms) => {
    if (!user) return false;
    const permsArray = Array.isArray(perms) ? perms : [perms];
    return permsArray.every(p => hasPermission(p));
  };

  /**
   * Check if the current user has ANY of the specified permissions.
   * @param {string[]} perms - Array of permissions (at least one must match)
   */
  const hasAnyPermission = (perms) => {
    if (!user) return false;
    return perms.some(p => hasPermission(p));
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isFleetManager,
    user,
  };
};

export default usePermission;
