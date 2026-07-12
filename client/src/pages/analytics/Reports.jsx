import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Download, RefreshCw,
  Calendar, Filter, ArrowUpRight, ArrowDownRight, Minus,
  BarChart3, PieChartIcon, DollarSign, Truck, Route, Fuel,
  Wrench, Users, Target
} from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { CardSkeleton } from '@/components/ui/Loader';
import { formatCurrency } from '@/utils';
import { CHART_COLOR_ARRAY, CHART_COLORS } from '@/constants';
import toast from 'react-hot-toast';

const DATE_RANGE_OPTIONS = [
  { value: 'last_7', label: 'Last 7 Days' },
  { value: 'last_30', label: 'Last 30 Days' },
  { value: 'last_90', label: 'Last 90 Days' },
  { value: 'this_year', label: 'This Year' },
  { value: 'all_time', label: 'All Time' },
];

const FUEL_TYPE_OPTIONS = [
  { value: 'all', label: 'All Fuel Types' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'electric', label: 'Electric' },
];

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-premium-md text-xs font-semibold">
      {label && <p className="text-slate-400 mb-2 font-bold uppercase tracking-wider text-[10px]">{label}</p>}
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="text-slate-800 font-bold">
            {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
};

// Trend indicator micro-component
const TrendPill = ({ value, inverted = false }) => {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
        <Minus className="w-3 h-3" />0%
      </span>
    );
  }
  const isPositive = inverted ? value < 0 : value > 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
      isPositive
        ? 'text-brand-success bg-green-50 border border-green-100'
        : 'text-brand-danger bg-rose-50 border border-rose-100'
    }`}>
      <Icon className="w-3.5 h-3.5" />
      {Math.abs(value)}%
    </span>
  );
};

export function Reports() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('this_year');
  const [fuelType, setFuelType] = useState('all');

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const result = await analyticsService.getReport();
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Failed to refresh analytics data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = await analyticsService.export('csv');
      toast.success(`Analytics report exported successfully: ${filename}`, { icon: '📊' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export analytics report.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true);
    toast.success('Data refreshed');
  };

  const fuelData = useMemo(() => {
    if (!data?.fuelConsumption) return [];
    if (fuelType === 'all') return data.fuelConsumption;
    return data.fuelConsumption.map((d) => ({ month: d.month, [fuelType]: d[fuelType] }));
  }, [data, fuelType]);

  if (isLoading) {
    return (
      <PageWrapper title="Reports">
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-64 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </PageWrapper>
    );
  }

  const summary = data?.summary || {};

  return (
    <PageWrapper title="Analytics Reports">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics & Reports</h1>
            <p className="text-sm text-slate-500 mt-1">
              Business intelligence across fleet performance, financials, and driver metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <Select
              options={DATE_RANGE_OPTIONS}
              value={dateRange}
              onChange={setDateRange}
              className="w-44"
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              isLoading={isRefreshing}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Download}
              isLoading={isExporting}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Fuel Type Quick Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Fuel Type:
          </span>
          {FUEL_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFuelType(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                fuelType === opt.value
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── KPI Summary Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Revenue',
              value: formatCurrency(summary.totalRevenue),
              trend: summary.revenueTrend,
              icon: DollarSign,
              color: 'text-brand-primary bg-blue-50 border-blue-100',
              desc: 'This year',
            },
            {
              title: 'Net Profit',
              value: formatCurrency(summary.netProfit),
              trend: summary.profitTrend,
              icon: TrendingUp,
              color: 'text-brand-success bg-green-50 border-green-100',
              desc: 'After expenses',
            },
            {
              title: 'Fleet Utilization',
              value: `${summary.fleetUtilization}%`,
              trend: summary.fleetUtilizationTrend,
              icon: Truck,
              color: 'text-brand-purple bg-purple-50 border-purple-100',
              desc: 'Active vs total',
            },
            {
              title: 'Trip Completion',
              value: `${summary.tripCompletionRate}%`,
              trend: summary.tripCompletionTrend,
              icon: Route,
              color: 'text-brand-secondary bg-amber-50 border-amber-100',
              desc: 'vs last period',
            },
            {
              title: 'Total Expenses',
              value: formatCurrency(summary.totalExpenses),
              trend: summary.expensesTrend,
              icon: Filter,
              color: 'text-brand-danger bg-rose-50 border-rose-100',
              desc: 'vs last period',
              inverted: true,
            },
            {
              title: 'Maintenance Cost',
              value: formatCurrency(summary.maintenanceCost),
              trend: summary.maintenanceTrend,
              icon: Wrench,
              color: 'text-orange-600 bg-orange-50 border-orange-100',
              desc: 'Saved 3.2%',
            },
            {
              title: 'Fuel Efficiency',
              value: `${summary.fuelEfficiency} km/L`,
              trend: summary.fuelEfficiencyTrend,
              icon: Fuel,
              color: 'text-teal-600 bg-teal-50 border-teal-100',
              desc: 'Fleet average',
              inverted: true,
            },
            {
              title: 'ROI',
              value: `${summary.roi}%`,
              trend: summary.roiTrend,
              icon: Target,
              color: 'text-brand-primary bg-blue-50 border-blue-100',
              desc: 'Return on investment',
            },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-premium stat-card-hover"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">{kpi.title}</p>
                  <div className={`p-2 rounded-xl border shrink-0 ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{kpi.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendPill value={kpi.trend} inverted={kpi.inverted} />
                  <span className="text-[10px] text-slate-400 font-semibold truncate">{kpi.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Revenue & Expense Area Chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Revenue vs Expenses"
            subtitle="Monthly financial performance breakdown"
            onRefresh={handleRefresh}
            onExport={handleExport}
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data?.monthlyRevenue || []} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS.primary} strokeWidth={2.5} fill="url(#gradRevenue)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={CHART_COLORS.danger} strokeWidth={2} fill="url(#gradExpenses)" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke={CHART_COLORS.success} strokeWidth={2} fill="none" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Fleet Utilization Line Chart */}
          <ChartContainer
            title="Fleet Utilization Rate"
            subtitle="Monthly utilization percentage across active vehicles"
            onRefresh={handleRefresh}
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data?.fleetUtilizationByMonth || []} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  name="Utilization"
                  stroke={CHART_COLORS.purple}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.purple, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                {/* 85% target reference line indicator */}
                <Line type="monotone" dataKey={() => 85} name="Target (85%)" stroke={CHART_COLORS.success} strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* ── Fuel Consumption Bar Chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Fuel Consumption by Type"
            subtitle="Monthly breakdown across diesel, petrol, and electric"
            onRefresh={handleRefresh}
            onExport={handleExport}
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fuelData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k L`} />
                <Tooltip content={<CustomTooltip suffix=" L" />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                {(fuelType === 'all' || fuelType === 'diesel') && <Bar dataKey="diesel" name="Diesel" fill={CHART_COLORS.warning} radius={[3, 3, 0, 0]} maxBarSize={28} />}
                {(fuelType === 'all' || fuelType === 'petrol') && <Bar dataKey="petrol" name="Petrol" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} maxBarSize={28} />}
                {(fuelType === 'all' || fuelType === 'electric') && <Bar dataKey="electric" name="Electric" fill={CHART_COLORS.success} radius={[3, 3, 0, 0]} maxBarSize={28} />}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Trip Status Donut */}
          <ChartContainer
            title="Trip Status Distribution"
            subtitle="Completed, in-transit, delayed, and cancelled trips"
            isLoading={isRefreshing}
          >
            <div className="flex items-center gap-6">
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data?.tripStatus || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(data?.tripStatus || []).map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 shrink-0">
                {(data?.tripStatus || []).map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-semibold">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-slate-600 min-w-[70px]">{item.name}</span>
                    <span className="text-slate-800 font-bold">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartContainer>
        </div>

        {/* ── Expenses & Maintenance ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense by Category Pie */}
          <ChartContainer
            title="Expense Breakdown by Category"
            subtitle="Year-to-date expense distribution"
            onExport={handleExport}
            isLoading={isRefreshing}
          >
            <div className="space-y-3 mt-2">
              {(data?.expensesByCategory || []).map((cat, idx) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: cat.color }} />
                      <span className="text-slate-600">{cat.name}</span>
                    </div>
                    <span className="text-slate-800">{formatCurrency(cat.value)}</span>
                  </div>
                  <Progress
                    value={(cat.value / (summary.totalExpenses || 1)) * 100}
                    size="sm"
                    showValue={false}
                    color={cat.color}
                  />
                </div>
              ))}
            </div>
          </ChartContainer>

          {/* Maintenance Cost Bar */}
          <ChartContainer
            title="Maintenance Cost Analysis"
            subtitle="Scheduled vs emergency vs preventive costs"
            onRefresh={handleRefresh}
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data?.maintenanceCosts || []} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-slate-500)', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Bar dataKey="scheduled" name="Scheduled" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} maxBarSize={20} stackId="a" />
                <Bar dataKey="emergency" name="Emergency" fill={CHART_COLORS.danger} radius={[0, 0, 0, 0]} maxBarSize={20} stackId="a" />
                <Bar dataKey="preventive" name="Preventive" fill={CHART_COLORS.success} radius={[3, 3, 0, 0]} maxBarSize={20} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* ── Driver Performance Table ── */}
        <Card>
          <div className="flex items-center justify-between border-b border-subtle pb-4 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-primary" />
                Driver Performance Rankings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by trip count, on-time rate, fuel, and safety scores</p>
            </div>
            <Badge variant="info" size="sm">{data?.driverPerformance?.length || 0} drivers</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-subtle">
                  {['#', 'Driver', 'Trips', 'On-Time', 'Fuel Score', 'Safety Score', 'Rating'].map((h) => (
                    <th key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left py-2 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {(data?.driverPerformance || []).map((driver, idx) => (
                  <tr key={driver.name} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 pr-4 text-xs font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 pr-4 text-xs font-bold text-slate-800">{driver.name}</td>
                    <td className="py-3 pr-4 text-xs font-semibold text-slate-600">{driver.trips}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${driver.onTime >= 95 ? 'text-brand-success' : driver.onTime >= 88 ? 'text-brand-secondary' : 'text-brand-danger'}`}>
                          {driver.onTime}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="w-20">
                        <Progress value={driver.fuelScore} size="sm" showValue={false} />
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant={driver.safetyScore >= 97 ? 'success' : driver.safetyScore >= 92 ? 'info' : 'warning'}
                        size="sm"
                      >
                        {driver.safetyScore}%
                      </Badge>
                    </td>
                    <td className="py-3 text-xs font-bold text-slate-800">
                      ⭐ {driver.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Revenue Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { title: 'Revenue Forecast (Q3)', value: 'Coming Soon', icon: DollarSign, desc: 'ML-powered revenue forecasting module' },
            { title: 'Profit Analysis', value: 'Coming Soon', icon: TrendingUp, desc: 'Margin analysis and profit center breakdown' },
            { title: 'ROI by Vehicle Class', value: 'Coming Soon', icon: BarChart3, desc: 'Per-class investment return calculations' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/80 border-dashed rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-premium-sm">
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-600">{card.title}</p>
                <Badge variant="neutral" size="sm" className="mt-2">Enterprise Feature</Badge>
                <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Reports;
