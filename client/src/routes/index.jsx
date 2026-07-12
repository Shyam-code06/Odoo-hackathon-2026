import { Routes, Route } from 'react-router-dom';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import PublicLayout from '@/layouts/PublicLayout';

// Pages
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/dashboard/Dashboard';
import Vehicles from '@/pages/vehicles/Vehicles';
import Drivers from '@/pages/drivers/Drivers';
import Trips from '@/pages/trips/Trips';
import Maintenance from '@/pages/maintenance/Maintenance';
import Fuel from '@/pages/fuel/Fuel';
import Expenses from '@/pages/expenses/Expenses';
import Analytics from '@/pages/analytics/Analytics';
import Settings from '@/pages/settings/Settings';
import NotFound from '@/pages/NotFound';

/**
 * Global Routing Manager
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (e.g. login) */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes (Dashboard / Operations console) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/fuel" element={<Fuel />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Wildcard 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
