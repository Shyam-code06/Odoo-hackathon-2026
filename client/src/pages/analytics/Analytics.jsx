import { BarChart3, Calendar } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function Analytics() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fleet Analytics & Reports</h1>
            <p className="text-sm text-slate-500 mt-1">Review operational performance charts, fuel efficiency curves, and driver utilization metrics.</p>
          </div>
          <button 
            disabled 
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 opacity-60 cursor-not-allowed self-start sm:self-auto"
          >
            <Calendar className="w-4 h-4" />
            This Month
          </button>
        </div>

        {/* Dynamic Charts Grid Mockups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 min-h-[300px] flex flex-col justify-between shadow-premium">
            <div className="flex justify-between items-center border-b border-subtle pb-4">
              <h3 className="font-semibold text-slate-800 text-sm">Monthly Trip Delivery Rate</h3>
              <span className="text-xs text-slate-400">Line chart placeholder</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 rounded-xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-450 max-w-[240px] text-center leading-relaxed">
                Future prompts will integrate Recharts for visualizing delivery efficiencies.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 min-h-[300px] flex flex-col justify-between shadow-premium">
            <div className="flex justify-between items-center border-b border-subtle pb-4">
              <h3 className="font-semibold text-slate-800 text-sm">Operational Cost Distribution</h3>
              <span className="text-xs text-slate-400">Pie chart placeholder</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 rounded-xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-450 max-w-[240px] text-center leading-relaxed">
                A cost breakdowns pie chart will render here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Analytics;
