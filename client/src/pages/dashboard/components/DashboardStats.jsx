import { 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  Activity,
  UserCheck,
  AlertTriangle,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/utils';

// Lucide mapping catalogue
const iconMap = {
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  Activity,
  UserCheck,
  AlertTriangle,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Percent,
};

/**
 * Premium SVG Mini Sparkline component to display metric trends
 */
function Sparkline({ variant = 'blue' }) {
  const colorMap = {
    blue: '#3B82F6',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#EF4444',
    purple: '#8B5CF6',
  };

  const color = colorMap[variant] || colorMap.blue;

  // Render static decorative wavy paths representing active telemetry trends
  const paths = {
    blue: "M0 12 Q 10 2, 20 18 T 40 8 T 60 22 T 80 4",
    emerald: "M0 20 Q 15 5, 30 18 T 60 5 T 80 2",
    amber: "M0 10 Q 10 22, 25 15 T 50 18 T 80 12",
    rose: "M0 4 Q 10 20, 20 8 T 40 22 T 60 12 T 80 20",
    purple: "M0 18 Q 12 4, 24 16 T 48 8 T 80 2",
  };

  return (
    <svg className="w-16 h-8 shrink-0 select-none opacity-80" viewBox="0 0 80 24">
      <path
        d={paths[variant] || paths.blue}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Reusable KPI Card element
 */
function KPICard({ 
  title, 
  value, 
  trend, 
  status, 
  icon: IconName, 
  variant = 'blue' 
}) {
  const Icon = iconMap[IconName] || Activity;

  const glows = {
    blue: 'hover:border-blue-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.12)]',
    emerald: 'hover:border-emerald-300 hover:shadow-[0_0_12px_rgba(16,185,129,0.12)]',
    rose: 'hover:border-rose-300 hover:shadow-[0_0_12px_rgba(239,68,68,0.12)]',
    purple: 'hover:border-purple-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.12)]',
    amber: 'hover:border-amber-300 hover:shadow-[0_0_12px_rgba(245,158,11,0.12)]',
  };

  return (
    <Card className={cn(
      "p-5 flex flex-col justify-between min-h-[142px] transition-all duration-300 hover:-translate-y-0.5 select-none border-slate-200/80 shadow-premium-sm",
      glows[variant]
    )}>
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center border",
          variant === 'blue' && 'bg-blue-50/60 border-blue-100 text-blue-600',
          variant === 'emerald' && 'bg-emerald-50/60 border-emerald-100 text-emerald-600',
          variant === 'rose' && 'bg-rose-50/60 border-rose-100 text-rose-600',
          variant === 'purple' && 'bg-purple-50/60 border-purple-100 text-purple-600',
          variant === 'amber' && 'bg-amber-50/60 border-amber-100 text-amber-600'
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Middle Value & Trend */}
      <div className="flex items-end justify-between mt-3 gap-2">
        <div className="space-y-1 text-left">
          <span className="text-xl font-extrabold text-slate-850 tracking-tight leading-none">
            {value}
          </span>
          <div className="flex items-center gap-1.5 mt-1 select-none">
            <Badge 
              variant={status === 'up' ? 'success' : status === 'down' ? 'danger' : 'neutral'} 
              size="sm"
              className="text-[9px] font-bold py-0.5 px-1.5"
            >
              {status === 'up' ? '+' : status === 'down' ? '-' : ''}{trend}%
            </Badge>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
              VS LAST MONTH
            </span>
          </div>
        </div>

        {/* Dynamic Sparkline */}
        <Sparkline variant={variant} />
      </div>
    </Card>
  );
}

export function DashboardStats({ stats }) {
  if (!stats) return null;

  // Format currency values nicely
  const formatCurrency = (val) => `$${Number(val).toLocaleString()}`;

  const vehicleKPIs = [
    {
      title: "Active Vehicles",
      value: stats.activeVehicles?.value || 0,
      trend: stats.activeVehicles?.trend || 0,
      status: stats.activeVehicles?.status || 'neutral',
      icon: "Truck",
      variant: "blue",
    },
    {
      title: "Available Vehicles",
      value: stats.availableVehicles?.value || 0,
      trend: stats.availableVehicles?.trend || 0,
      status: stats.availableVehicles?.status || 'neutral',
      icon: "UserCheck",
      variant: "emerald",
    },
    {
      title: "Vehicles In Shop",
      value: stats.vehiclesInShop?.value || 0,
      trend: stats.vehiclesInShop?.trend || 0,
      status: stats.vehiclesInShop?.status || 'neutral',
      icon: "Wrench",
      variant: "rose",
    },
    {
      title: "Retired Vehicles",
      value: stats.retiredVehicles?.value || 0,
      trend: stats.retiredVehicles?.trend || 0,
      status: stats.retiredVehicles?.status || 'neutral',
      icon: "AlertTriangle",
      variant: "amber",
    },
  ];

  const operatorKPIs = [
    {
      title: "Drivers On Duty",
      value: stats.driversOnDuty?.value || 0,
      trend: stats.driversOnDuty?.trend || 0,
      status: stats.driversOnDuty?.status || 'neutral',
      icon: "Users",
      variant: "blue",
    },
    {
      title: "Drivers Available",
      value: stats.driversAvailable?.value || 0,
      trend: stats.driversAvailable?.trend || 0,
      status: stats.driversAvailable?.status || 'neutral',
      icon: "UserCheck",
      variant: "emerald",
    },
    {
      title: "Active Trips",
      value: stats.activeTrips?.value || 0,
      trend: stats.activeTrips?.trend || 0,
      status: stats.activeTrips?.status || 'neutral',
      icon: "Route",
      variant: "blue",
    },
    {
      title: "Pending Trips",
      value: stats.pendingTrips?.value || 0,
      trend: stats.pendingTrips?.trend || 0,
      status: stats.pendingTrips?.status || 'neutral',
      icon: "ClipboardList",
      variant: "amber",
    },
  ];

  const financialKPIs = [
    {
      title: "Fleet Utilization",
      value: `${stats.fleetUtilization?.value || 0}%`,
      trend: stats.fleetUtilization?.trend || 0,
      status: stats.fleetUtilization?.status || 'neutral',
      icon: "Percent",
      variant: "purple",
    },
    {
      title: "Monthly Fuel Cost",
      value: formatCurrency(stats.monthlyFuelCost?.value || 0),
      trend: stats.monthlyFuelCost?.trend || 0,
      status: stats.monthlyFuelCost?.status || 'neutral',
      icon: "Fuel",
      variant: "amber",
    },
    {
      title: "Maintenance Cost",
      value: formatCurrency(stats.maintenanceCost?.value || 0),
      trend: stats.maintenanceCost?.trend || 0,
      status: stats.maintenanceCost?.status || 'neutral',
      icon: "Wrench",
      variant: "rose",
    },
    {
      title: "Operational Cost",
      value: formatCurrency(stats.operationalCost?.value || 0),
      trend: stats.operationalCost?.trend || 0,
      status: stats.operationalCost?.status || 'neutral',
      icon: "DollarSign",
      variant: "purple",
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* 1. Fleet Vehicle Telemetry Group */}
      <div className="space-y-4">
        <SectionHeader 
          title="Vehicle Asset Telemetry" 
          description="Status of physical assets, trailers, and vans registered in the active fleet registry."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicleKPIs.map((kpi, idx) => (
            <KPICard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              status={kpi.status}
              icon={kpi.icon}
              variant={kpi.variant}
            />
          ))}
        </div>
      </div>

      {/* 2. Operator & Dispatch Logs Group */}
      <div className="space-y-4">
        <SectionHeader 
          title="Operator & Dispatch Logs" 
          description="Real-time CDL driver availability and active load trip dispatches in transit."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {operatorKPIs.map((kpi, idx) => (
            <KPICard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              status={kpi.status}
              icon={kpi.icon}
              variant={kpi.variant}
            />
          ))}
        </div>
      </div>

      {/* 3. Fleet Expenditures & Utilization Group */}
      <div className="space-y-4">
        <SectionHeader 
          title="Fleet Expenditures & Performance" 
          description="Monthly diesel expenditures, repair invoice costs, and overall fleet usage efficiency."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {financialKPIs.map((kpi, idx) => (
            <KPICard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              status={kpi.status}
              icon={kpi.icon}
              variant={kpi.variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
