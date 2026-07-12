import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import PublicLayout from '@/layouts/PublicLayout';
import RoleGuard from '@/routes/RoleGuard';
import { PageLoader } from '@/components/ui/Loader';

// ── Eagerly loaded (critical path) ─────────────────────────────────────────
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Dashboard from '@/pages/dashboard/Dashboard';

// ── Lazy loaded (route-based code splitting) ────────────────────────────────
const Vehicles    = lazy(() => import('@/pages/vehicles/Vehicles'));
const Drivers     = lazy(() => import('@/pages/drivers/Drivers'));
const Trips       = lazy(() => import('@/pages/trips/Trips'));
const Maintenance = lazy(() => import('@/pages/maintenance/Maintenance'));
const Fuel        = lazy(() => import('@/pages/fuel/Fuel'));
const Expenses    = lazy(() => import('@/pages/expenses/Expenses'));
const Reports     = lazy(() => import('@/pages/analytics/Reports'));
const Charts      = lazy(() => import('@/pages/analytics/Charts'));
const KPIs        = lazy(() => import('@/pages/analytics/KPIs'));
const Settings    = lazy(() => import('@/pages/settings/Settings'));
const Profile     = lazy(() => import('@/pages/profile/Profile'));
const Notifications = lazy(() => import('@/pages/notifications/Notifications'));
const UserManagement = lazy(() => import('@/pages/users/UserManagement'));
const ServerError = lazy(() => import('@/pages/ServerError'));
const NetworkError = lazy(() => import('@/pages/NetworkError'));
const Unauthorized = lazy(() => import('@/pages/Unauthorized'));
const NotFound    = lazy(() => import('@/pages/NotFound'));

// All roles that can access protected sections
const ALL_ROLES = ['fleet_manager', 'dispatcher', 'safety_officer', 'financial_analyst', 'maintenance_manager', 'driver_manager', 'viewer', 'admin', 'operator', 'driver'];
const MANAGEMENT_ROLES = ['fleet_manager', 'dispatcher', 'driver_manager', 'admin', 'operator'];
const ANALYTICS_ROLES  = ['fleet_manager', 'financial_analyst', 'dispatcher', 'admin', 'operator'];
const FINANCE_ROLES    = ['fleet_manager', 'financial_analyst', 'admin', 'operator'];
const MAINTENANCE_ROLES = ['fleet_manager', 'dispatcher', 'safety_officer', 'maintenance_manager', 'admin', 'operator'];
const FM_ONLY = ['fleet_manager'];

/** Route-level Suspense fallback */
const SuspenseRoute = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/**
 * Global Application Routing Manager
 * Architecture: Public → PublicLayout, Protected → ProtectedLayout + RoleGuard
 * Code splitting: All non-critical pages are lazy-loaded for performance.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/500"   element={<SuspenseRoute><ServerError /></SuspenseRoute>} />
        <Route path="/network-error" element={<SuspenseRoute><NetworkError /></SuspenseRoute>} />
      </Route>

      {/* ── Protected Routes ─────────────────────────────────── */}
      <Route element={<ProtectedLayout />}>
        {/* Dashboard (all roles) */}
        <Route path="/" element={<Dashboard />} />

        {/* Profile & Notifications (all authenticated) */}
        <Route path="/profile" element={<SuspenseRoute><Profile /></SuspenseRoute>} />
        <Route path="/notifications" element={<SuspenseRoute><Notifications /></SuspenseRoute>} />

        {/* Fleet Management */}
        <Route
          path="/fleet/vehicles"
          element={
            <RoleGuard allowedRoles={ALL_ROLES}>
              <SuspenseRoute><Vehicles /></SuspenseRoute>
            </RoleGuard>
          }
        />
        <Route
          path="/fleet/drivers"
          element={
            <RoleGuard allowedRoles={MANAGEMENT_ROLES}>
              <SuspenseRoute><Drivers /></SuspenseRoute>
            </RoleGuard>
          }
        />
        <Route
          path="/fleet/trips"
          element={
            <RoleGuard allowedRoles={ALL_ROLES}>
              <SuspenseRoute><Trips /></SuspenseRoute>
            </RoleGuard>
          }
        />

        {/* Maintenance */}
        <Route
          path="/maintenance"
          element={
            <RoleGuard allowedRoles={MAINTENANCE_ROLES}>
              <SuspenseRoute><Maintenance /></SuspenseRoute>
            </RoleGuard>
          }
        />

        {/* Fuel & Expenses */}
        <Route
          path="/fuel-expenses/fuel"
          element={
            <RoleGuard allowedRoles={FINANCE_ROLES}>
              <SuspenseRoute><Fuel /></SuspenseRoute>
            </RoleGuard>
          }
        />
        <Route
          path="/fuel-expenses/expenses"
          element={
            <RoleGuard allowedRoles={FINANCE_ROLES}>
              <SuspenseRoute><Expenses /></SuspenseRoute>
            </RoleGuard>
          }
        />

        {/* Analytics */}
        <Route
          path="/analytics/reports"
          element={
            <RoleGuard allowedRoles={ANALYTICS_ROLES}>
              <SuspenseRoute><Reports /></SuspenseRoute>
            </RoleGuard>
          }
        />
        <Route
          path="/analytics/charts"
          element={
            <RoleGuard allowedRoles={ANALYTICS_ROLES}>
              <SuspenseRoute><Charts /></SuspenseRoute>
            </RoleGuard>
          }
        />
        <Route
          path="/analytics/kpis"
          element={
            <RoleGuard allowedRoles={ANALYTICS_ROLES}>
              <SuspenseRoute><KPIs /></SuspenseRoute>
            </RoleGuard>
          }
        />

        {/* Settings — Fleet Manager only */}
        <Route
          path="/settings"
          element={
            <RoleGuard allowedRoles={FM_ONLY}>
              <SuspenseRoute><Settings /></SuspenseRoute>
            </RoleGuard>
          }
        />

        {/* User Management — Fleet Manager only */}
        <Route
          path="/users"
          element={
            <RoleGuard allowedRoles={FM_ONLY}>
              <SuspenseRoute><UserManagement /></SuspenseRoute>
            </RoleGuard>
          }
        />

        {/* Error & Security */}
        <Route path="/unauthorized" element={<SuspenseRoute><Unauthorized /></SuspenseRoute>} />

        {/* Section fallback redirects */}
        <Route path="/fleet"         element={<Navigate to="/fleet/vehicles" replace />} />
        <Route path="/fuel-expenses" element={<Navigate to="/fuel-expenses/fuel" replace />} />
        <Route path="/analytics"     element={<Navigate to="/analytics/reports" replace />} />
      </Route>

      {/* ── 404 Wildcard ─────────────────────────────────────── */}
      <Route path="*" element={<SuspenseRoute><NotFound /></SuspenseRoute>} />
    </Routes>
  );
}

export default AppRoutes;
