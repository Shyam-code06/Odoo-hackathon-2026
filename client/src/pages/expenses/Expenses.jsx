import { DollarSign, Plus, Search, Filter } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function Expenses() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Operating Expenses</h1>
            <p className="text-sm text-slate-500 mt-1">Audit transport operations expenses including fuel purchases, driver salaries, tolls, and insurance.</p>
          </div>
          <button 
            disabled 
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-brand-primary rounded-xl opacity-60 cursor-not-allowed self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Record Expense
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-premium-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search expenses by invoice number, category..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-brand-bg-secondary rounded-lg border border-slate-200/80 focus:border-brand-primary focus:bg-white focus:outline-none transition-all"
              disabled
            />
          </div>
          <button disabled className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg opacity-60 cursor-not-allowed">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        {/* Empty list container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-premium">
          <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mx-auto mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">No expense logs</h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            There are no operational costs registered for the current accounting period. Future versions will render billing audits and cost charts here.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Expenses;
