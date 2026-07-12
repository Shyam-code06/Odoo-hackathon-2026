import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Loader';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

const QUARTERLY_TARGETS = [
  { quarter: 'Q1 2026', status: 'completed', metric: 'Fleet Utilization', achieved: 74, target: 72, unit: '%' },
  { quarter: 'Q2 2026', status: 'completed', metric: 'Trip Completion', achieved: 93.2, target: 92, unit: '%' },
  { quarter: 'Q3 2026', status: 'active', metric: 'On-Time Delivery', achieved: 87.3, target: 95, unit: '%' },
  { quarter: 'Q4 2026', status: 'upcoming', metric: 'Revenue Target', achieved: 0, target: 100, unit: '%' },
];

export function KPIs() {
  const [kpis, setKpis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const result = await analyticsService.getKpiTargets();
      setKpis(result || []);
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getKpiStatus = (current, target) => {
    const pct = (current / target) * 100;
    if (pct >= 95) return { label: 'On Target', variant: 'success', icon: CheckCircle2 };
    if (pct >= 80) return { label: 'Near Target', variant: 'warning', icon: TrendingUp };
    return { label: 'Off Target', variant: 'danger', icon: AlertCircle };
  };

  if (isLoading) {
    return (
      <PageWrapper title="KPI Targets">
        <div className="space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-64 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </PageWrapper>
    );
  }

  const onTargetCount = kpis.filter((k) => (k.current / k.target) * 100 >= 95).length;

  return (
    <PageWrapper title="KPI Targets">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">KPI Target Tracking</h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor operational metrics against defined targets and business objectives.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={RefreshCw}
            isLoading={isRefreshing}
            onClick={() => { fetchData(true); toast.success('KPIs refreshed'); }}
          >
            Refresh KPIs
          </Button>
        </div>

        {/* Summary Banner */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'On Target', value: onTargetCount, total: kpis.length, color: 'text-brand-success bg-green-50 border-green-100' },
            { label: 'Near Target', value: kpis.filter((k) => { const p = (k.current / k.target) * 100; return p >= 80 && p < 95; }).length, total: kpis.length, color: 'text-brand-secondary bg-amber-50 border-amber-100' },
            { label: 'Off Target', value: kpis.filter((k) => (k.current / k.target) * 100 < 80).length, total: kpis.length, color: 'text-brand-danger bg-rose-50 border-rose-100' },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl border p-4 text-center ${item.color}`}>
              <p className="text-3xl font-extrabold">{item.value}<span className="text-base font-semibold opacity-60">/{item.total}</span></p>
              <p className="text-xs font-bold uppercase tracking-wider mt-1 opacity-80">{item.label}</p>
            </div>
          ))}
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kpis.map((kpi, idx) => {
            const pct = Math.min((kpi.current / kpi.target) * 100, 100);
            const status = getKpiStatus(kpi.current, kpi.target);
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={kpi.metric}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-premium stat-card-hover"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{kpi.metric}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      Target: {kpi.target}{kpi.unit}
                    </p>
                  </div>
                  <Badge variant={status.variant} size="sm" className="shrink-0 flex items-center gap-1">
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>

                {/* Current vs Target */}
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-3xl font-extrabold text-slate-800">{kpi.current}</span>
                    <span className="text-sm font-semibold text-slate-400 ml-1">{kpi.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500">Target</span>
                    <p className="text-base font-extrabold text-slate-600">{kpi.target}{kpi.unit}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <Progress value={pct} size="md" showValue={false} />
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>0</span>
                    <span className={cn(
                      'font-extrabold',
                      pct >= 95 ? 'text-brand-success' : pct >= 80 ? 'text-brand-secondary' : 'text-brand-danger'
                    )}>
                      {pct.toFixed(1)}% achieved
                    </span>
                    <span>{kpi.target}{kpi.unit}</span>
                  </div>
                </div>

                {/* Gap */}
                {pct < 100 && (
                  <div className="mt-3 pt-3 border-t border-subtle flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-500">
                      Gap: <span className="font-bold text-slate-700">
                        {(kpi.target - kpi.current).toFixed(1)}{kpi.unit} to reach target
                      </span>
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quarterly Progress */}
        <Card>
          <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-primary" />
            Quarterly Business Objectives
          </h3>
          <div className="space-y-4">
            {QUARTERLY_TARGETS.map((qt, idx) => (
              <div key={qt.quarter} className={cn(
                'flex items-center gap-4 p-4 rounded-xl border transition-all',
                qt.status === 'completed' ? 'bg-green-50/40 border-green-100/60' :
                qt.status === 'active' ? 'bg-blue-50/40 border-blue-100/60' :
                'bg-slate-50 border-slate-100'
              )}>
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm',
                  qt.status === 'completed' ? 'bg-green-100 text-brand-success' :
                  qt.status === 'active' ? 'bg-blue-100 text-brand-primary' :
                  'bg-slate-200 text-slate-400'
                )}>
                  {qt.status === 'completed' ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-700">{qt.quarter} — {qt.metric}</span>
                    <Badge
                      variant={qt.status === 'completed' ? 'success' : qt.status === 'active' ? 'primary' : 'neutral'}
                      size="sm"
                    >
                      {qt.status === 'completed' ? 'Completed' : qt.status === 'active' ? 'In Progress' : 'Upcoming'}
                    </Badge>
                  </div>
                  {qt.status !== 'upcoming' && (
                    <Progress
                      value={qt.status === 'completed' ? 100 : (qt.achieved / qt.target) * 100}
                      size="sm"
                      showValue={false}
                    />
                  )}
                  {qt.status !== 'upcoming' && (
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">
                      Achieved: {qt.achieved}{qt.unit} / Target: {qt.target}{qt.unit}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default KPIs;
