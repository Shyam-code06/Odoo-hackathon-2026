import { useEffect, useState, useCallback } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardLoader } from '@/components/ui/Loader';
import { dashboardService } from '@/services/dashboardService';
import toast from 'react-hot-toast';

// Dashboard Sub-components
import { DashboardHeader } from './components/DashboardHeader';
import { DashboardStats } from './components/DashboardStats';
import { FleetOverview } from './components/FleetOverview';
import { TripOverview } from './components/TripOverview';
import { FuelAnalytics } from './components/FuelAnalytics';
import { ExpenseOverview } from './components/ExpenseOverview';
import { QuickActions } from './components/QuickActions';
import { RecentTrips } from './components/RecentTrips';
import { RecentMaintenance } from './components/RecentMaintenance';
import { ActivityTimeline } from './components/ActivityTimeline';
import { SmartAlerts } from './components/SmartAlerts';
import { VehicleStatus } from './components/VehicleStatus';
import { DriverStatus } from './components/DriverStatus';

export function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = await dashboardService.export('csv');
      toast.success(`Dashboard overview data exported successfully: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export dashboard data.');
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch overview data from the telemetry service layer
  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    }
    try {
      const payload = await dashboardService.getOverviewData();
      setData(payload);
    } catch (err) {
      console.error('Failed to load dashboard overview data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // 1. Initial Skeleton Loading State
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="space-y-6 text-left">
          <div className="border-b border-subtle pb-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-3.5 bg-slate-100 rounded w-1/3 mt-2" />
          </div>
          <DashboardLoader />
        </div>
      </PageWrapper>
    );
  }

  // 2. Render Premium Dashboard
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Core Header with Actions and Filters */}
        <DashboardHeader 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing} 
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* Hazard Banner and Smart Alerts */}
        {data?.smartAlerts && (
          <div className="grid grid-cols-1 gap-6">
            <SmartAlerts data={data.smartAlerts} />
          </div>
        )}

        <SectionHeader 
          title="Operational Shortcuts" 
          description="Immediate command actions to register assets, dispatch drivers, and log costs."
        />
        {/* Reusable Primary Quick Actions Panel */}
        <QuickActions />

        {/* KPI Counter Cards section */}
        {data?.stats && <DashboardStats stats={data.stats} />}

        <SectionHeader 
          title="Logistics Analytics & Fuel Command" 
          description="Analytical performance graphs showing monthly dispatch ratios, vehicle categories, and fuel efficiency trends."
        />
        {/* Recharts Analytics Grid (2 Columns on large viewports) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TripOverview 
            data={data?.tripOverview} 
            isLoading={isRefreshing} 
            onRefresh={handleRefresh}
          />
          <FleetOverview 
            data={data?.vehicleDistribution} 
            isLoading={isRefreshing} 
            onRefresh={handleRefresh}
          />
          <FuelAnalytics 
            data={data?.fuelAnalytics} 
            isLoading={isRefreshing} 
            onRefresh={handleRefresh}
          />
          <ExpenseOverview 
            data={data?.expenseOverview} 
            isLoading={isRefreshing} 
            onRefresh={handleRefresh}
          />
        </div>

        <SectionHeader 
          title="Live Asset Health & Safety Roster" 
          description="Real-time health ratings, odometer registries, and safety ratings for active transport operators."
        />
        {/* Interactive Asset grids (Vehicles & Drivers status) */}
        <div className="grid grid-cols-1 gap-6">
          {data?.vehicleStatuses && <VehicleStatus data={data.vehicleStatuses} />}
          {data?.driverStatuses && <DriverStatus data={data.driverStatuses} />}
        </div>

        <SectionHeader 
          title="Operational Log Feeds & Audit Timelines" 
          description="Summary dispatch tables, active maintenance workshop assignments, and live event logging."
        />
        {/* Activity Streams and Maintenance lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trips Table (Occupies 2 columns) */}
          <div className="lg:col-span-2">
            <RecentTrips />
          </div>
          
          {/* Recent Maintenance Logs */}
          {data?.recentMaintenance && (
            <RecentMaintenance data={data.recentMaintenance} />
          )}

          {/* live activity stream timeline */}
          <div className="lg:col-span-3">
            {data?.activityTimeline && (
              <ActivityTimeline data={data.activityTimeline} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
