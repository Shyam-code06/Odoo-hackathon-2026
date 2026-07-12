import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import PublicLayout from '@/layouts/PublicLayout';
import RoleGuard from '@/routes/RoleGuard';

// Pages
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Vehicles from '@/pages/vehicles/Vehicles';
import Drivers from '@/pages/drivers/Drivers';
import Trips from '@/pages/trips/Trips';
import Maintenance from '@/pages/maintenance/Maintenance';
import Fuel from '@/pages/fuel/Fuel';
import Expenses from '@/pages/expenses/Expenses';
import Reports from '@/pages/analytics/Reports';
import Charts from '@/pages/analytics/Charts';
import KPIs from '@/pages/analytics/KPIs';
import Settings from '@/pages/settings/Settings';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';

// Mapped Roles matching constant assignments
const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  DRIVER: 'driver',
};

/**
 * Global Routing Manager
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes (Dashboard / Operations shell) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Fleet Sub-section */}
        <Route 
          path="/fleet/vehicles" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR, ROLES.DRIVER]}>
              <Vehicles />
            </RoleGuard>
          } 
        />
        <Route 
          path="/fleet/drivers" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <Drivers />
            </RoleGuard>
          } 
        />
        <Route 
          path="/fleet/trips" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR, ROLES.DRIVER]}>
              <Trips />
            </RoleGuard>
          } 
        />

        {/* Maintenance Log */}
        <Route 
          path="/maintenance" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <Maintenance />
            </RoleGuard>
          } 
        />

        {/* Fuel & Expenses Sub-section */}
        <Route 
          path="/fuel-expenses/fuel" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR, ROLES.DRIVER]}>
              <Fuel />
            </RoleGuard>
          } 
        />
        <Route 
          path="/fuel-expenses/expenses" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <Expenses />
            </RoleGuard>
          } 
        />

        {/* Analytics Sub-section */}
        <Route 
          path="/analytics/reports" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <Reports />
            </RoleGuard>
          } 
        />
        <Route 
          path="/analytics/charts" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <Charts />
            </RoleGuard>
          } 
        />
        <Route 
          path="/analytics/kpis" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <KPIs />
            </RoleGuard>
          } 
        />

        {/* General Settings */}
        <Route 
          path="/settings" 
          element={
            <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.OPERATOR]}>
              <Settings />
            </RoleGuard>
          } 
        />

        {/* Security redirection */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallbacks */}
        <Route path="/fleet" element={<Navigate to="/fleet/vehicles" replace />} />
        <Route path="/fuel-expenses" element={<Navigate to="/fuel-expenses/fuel" replace />} />
        <Route path="/analytics" element={<Navigate to="/analytics/reports" replace />} />
      </Route>

      {/* Wildcard 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
