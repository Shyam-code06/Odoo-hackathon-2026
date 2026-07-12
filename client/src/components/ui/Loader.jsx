import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Generic rotating loader spinner
 */
export function Spinner({ className, size = 'md', ...props }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  return (
    <Loader2 
      className={cn("animate-spin text-brand-primary shrink-0", sizes[size], className)} 
      {...props} 
    />
  );
}

/**
 * Full-screen backdrop loader block
 */
export function PageLoader({ message = 'Loading operations...', ...props }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg/85 backdrop-blur-xs select-none"
      {...props}
    >
      <Spinner size="lg" className="mb-4" />
      <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{message}</p>
    </div>
  );
}

/**
 * Card loader block placeholder
 */
export function CardSkeleton({ className, ...props }) {
  return (
    <div 
      className={cn("bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium animate-pulse space-y-4", className)}
      {...props}
    >
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="w-8 h-8 bg-slate-200 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-slate-200 rounded w-1/2" />
        <div className="h-2.5 bg-slate-200 rounded w-3/4" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton block
 */
export function TableSkeleton({ rows = 5, cols = 4, className, ...props }) {
  return (
    <div className={cn("w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium overflow-hidden animate-pulse", className)} {...props}>
      {/* Table Head Mockup */}
      <div className="flex items-center justify-between pb-4 border-b border-subtle mb-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <div key={idx} className="h-3 bg-slate-200 rounded w-1/6" />
        ))}
      </div>
      {/* Table Rows Mockup */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between py-2 border-b border-subtle last:border-0 last:pb-0">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div 
                key={cIdx} 
                className={cn(
                  "h-2.5 bg-slate-200 rounded",
                  cIdx === 0 ? "w-1/4" : cIdx === cols - 1 ? "w-1/12" : "w-1/6"
                )} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Labeled Form fields skeleton block
 */
export function FormSkeleton({ fields = 4, className, ...props }) {
  return (
    <div className={cn("space-y-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium animate-pulse", className)} {...props}>
      {Array.from({ length: fields }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-1/5" />
          <div className="h-11 bg-slate-100 rounded-xl w-full" />
        </div>
      ))}
      <div className="h-11 bg-slate-200 rounded-xl w-1/3 pt-2" />
    </div>
  );
}

/**
 * Chart columns skeleton block
 */
export function ChartSkeleton({ className, ...props }) {
  return (
    <div className={cn("bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium animate-pulse space-y-6 min-h-[300px] flex flex-col justify-between", className)} {...props}>
      <div className="h-3 bg-slate-200 rounded w-1/4" />
      <div className="flex items-end justify-between h-44 gap-4 px-2">
        <div className="w-full bg-slate-100 rounded-t-lg h-[30%]" />
        <div className="w-full bg-slate-100 rounded-t-lg h-[60%]" />
        <div className="w-full bg-slate-100 rounded-t-lg h-[40%]" />
        <div className="w-full bg-slate-100 rounded-t-lg h-[80%]" />
        <div className="w-full bg-slate-100 rounded-t-lg h-[50%]" />
      </div>
      <div className="h-1.5 bg-slate-200 rounded w-full" />
    </div>
  );
}

/**
 * Stacked profiles list skeleton block
 */
export function ListSkeleton({ items = 4, className, ...props }) {
  return (
    <div className={cn("space-y-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium animate-pulse", className)} {...props}>
      {Array.from({ length: items }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3 py-1 border-b border-subtle last:border-0 last:pb-0">
          <div className="w-9 h-9 bg-slate-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-2 bg-slate-100 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard control view skeleton block
 */
export function DashboardLoader({ className, ...props }) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* Charts + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartSkeleton className="lg:col-span-2" />
        <ListSkeleton />
      </div>
    </div>
  );
}
