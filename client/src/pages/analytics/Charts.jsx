import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { RefreshCw, Download } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ChartContainer } from '@/components/ui/ChartContainer';
import { CardSkeleton } from '@/components/ui/Loader';
import { Button } from '@/components/ui/Button';
import { CHART_COLORS } from '@/constants';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-premium-md text-xs font-semibold">
      {label && <p className="text-slate-400 mb-2 font-bold">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="text-slate-800 font-bold">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function Charts() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filename = await analyticsService.export('csv');
      toast.success(`Charts data exported successfully: ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export charts data.');
    } finally {
      setIsExporting(false);
    }
  };

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const result = await analyticsService.getReport();
      setData(result);
    } catch (err) {
      console.error('Failed to load charts data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const radarData = [
    { metric: 'Utilization', value: data?.summary?.fleetUtilization || 0 },
    { metric: 'Trip Rate', value: data?.summary?.tripCompletionRate || 0 },
    { metric: 'Fuel Eff.', value: (data?.summary?.fuelEfficiency || 0) * 10 },
    { metric: 'Safety', value: 94 },
    { metric: 'On-Time', value: 87 },
    { metric: 'ROI', value: data?.summary?.roi || 0 },
  ];

  if (isLoading) {
    return (
      <PageWrapper title="Charts">
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-64 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Interactive Charts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Interactive Visualizations</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cross-reference diesel registries, cargo weights, and delivery times on custom layouts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              isLoading={isRefreshing}
              onClick={() => fetchData(true)}
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
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart — Monthly Revenue */}
          <ChartContainer
            title="Revenue Trend — Area Chart"
            subtitle="Monthly revenue progression with gradient fill"
            onRefresh={() => fetchData(true)}
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data?.monthlyRevenue || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS.primary} strokeWidth={2.5} fill="url(#chartGradBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Bar Chart — Fuel */}
          <ChartContainer
            title="Fuel Consumption — Bar Chart"
            subtitle="Monthly diesel, petrol and EV consumption volumes"
            onRefresh={() => fetchData(true)}
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={(data?.fuelConsumption || []).slice(0, 6)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Bar dataKey="diesel" name="Diesel" fill={CHART_COLORS.warning} radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="petrol" name="Petrol" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="electric" name="Electric" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Pie Chart — Trip Status */}
          <ChartContainer
            title="Trip Status — Pie Chart"
            subtitle="Overall trip completion and status breakdown"
            isLoading={isRefreshing}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data?.tripStatus || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {(data?.tripStatus || []).map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartContainer>

          {/* Radar Chart — Fleet Performance KPIs */}
          <ChartContainer
            title="Fleet Performance — Radar Chart"
            subtitle="Multi-dimensional KPI analysis across 6 dimensions"
            isLoading={isRefreshing}
          >
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                <Radar
                  name="Current Period"
                  dataKey="value"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Composed Line Chart — Expenses + Revenue */}
          <div className="lg:col-span-2">
            <ChartContainer
              title="Financial Overview — Composed Chart"
              subtitle="Revenue bars with expense and profit trend lines overlaid"
              onRefresh={() => fetchData(true)}
              onExport={handleExport}
              isLoading={isRefreshing}
            >
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={data?.monthlyRevenue || []} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                  <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={30} opacity={0.7} />
                  <Bar dataKey="expenses" name="Expenses" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={30} opacity={0.6} />
                  <Area type="monotone" dataKey="profit" name="Profit" stroke={CHART_COLORS.success} strokeWidth={2.5} fill={CHART_COLORS.success} fillOpacity={0.05} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Charts;
