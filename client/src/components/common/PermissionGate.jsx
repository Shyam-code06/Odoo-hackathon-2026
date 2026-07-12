import { usePermission } from '@/hooks/usePermission';

/**
 * PermissionGate — conditionally renders children based on user permissions.
 *
 * This is a UI-only guard. The backend ALWAYS enforces the real authorization.
 * This component simply hides/shows elements so users don't see irrelevant actions.
 *
 * Usage:
 *   <PermissionGate permission="create_vehicle">
 *     <Button>Add Vehicle</Button>
 *   </PermissionGate>
 *
 *   <PermissionGate permission={['create_vehicle', 'edit_vehicle']} any>
 *     <ActionButtons />
 *   </PermissionGate>
 *
 *   <PermissionGate role="fleet_manager">
 *     <AdminPanel />
 *   </PermissionGate>
 *
 * Props:
 *   permission     {string|string[]}  - Single permission or array. Defaults to AND logic.
 *   any            {boolean}          - If true, ANY permission in array is sufficient (OR logic).
 *   role           {string}           - Shorthand role check (alternative to permission).
 *   fallback       {ReactNode}        - Optional element to render when denied (default: null).
 */
const PermissionGate = ({
  children,
  permission = null,
  any = false,
  role = null,
  fallback = null,
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, isFleetManager, user } = usePermission();

  let allowed = true;

  if (role) {
    if (role === 'fleet_manager') {
      allowed = isFleetManager();
    } else {
      allowed = user?.role === role;
    }
  } else if (permission) {
    const permsArray = Array.isArray(permission) ? permission : [permission];
    allowed = any
      ? hasAnyPermission(permsArray)
      : hasAllPermissions(permsArray);
  }

  return allowed ? children : fallback;
};

export default PermissionGate;
