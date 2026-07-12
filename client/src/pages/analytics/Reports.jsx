import { FileText, Plus } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function Reports() {
  return (
    <PageWrapper>
      <div className="space-y-6 select-none">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Executive Reports</h1>
            <p className="text-sm text-slate-500 mt-1">Audit fleet performance logs, incident details, and financial registries.</p>
          </div>
          <button 
            disabled 
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-brand-primary rounded-xl opacity-60 cursor-not-allowed self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Placeholder Table / List Empty state */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-premium">
          <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-200/50">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">No report files generated</h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            There are no compiled PDF or CSV reports. Click the compile action button to build a custom audit log.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Reports;
