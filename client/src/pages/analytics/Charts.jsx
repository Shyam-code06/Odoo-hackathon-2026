import { BarChart3 } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function Charts() {
  return (
    <PageWrapper>
      <div className="space-y-6 select-none">
        {/* Page Header */}
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Interactive Visualizations</h1>
          <p className="text-sm text-slate-500 mt-1">Cross-reference diesel registries, cargo weights, and delivery times on custom layouts.</p>
        </div>

        {/* Charts Mockup */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-premium min-h-[340px] flex flex-col justify-center items-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mb-4 border border-slate-200/50">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Interactive Charts Panel</h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
            Recharts layouts representing diesel registry curves and trip completion ratios will render here.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Charts;
