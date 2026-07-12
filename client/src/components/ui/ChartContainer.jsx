import { useState } from 'react';
import { BarChart3, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Reusable Container Wrapper for operations charts
 */
export function ChartContainer({
  title,
  subtitle,
  actions,
  children,
  isLoading = false,
  onRefresh,
  onExport,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium flex flex-col justify-between select-none min-h-[360px]",
        className
      )}
      {...props}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-subtle pb-4 mb-5">
        <div className="text-left space-y-0.5">
          <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 leading-normal">{subtitle}</p>
          )}
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {actions}
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Refresh chart data"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
            </button>
          )}

          {onExport && (() => {
            const [isExporting, setIsExporting] = useState(false);
            const handleExportClick = async (e) => {
              if (isExporting) return;
              setIsExporting(true);
              try {
                await onExport(e);
              } finally {
                setIsExporting(false);
              }
            };
            return (
              <button
                onClick={handleExportClick}
                disabled={isLoading || isExporting}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>{isExporting ? 'Exporting...' : 'CSV'}</span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* Chart Panel Content */}
      <div className="flex-1 flex flex-col justify-center relative min-h-[220px]">
        {isLoading ? (
          // Custom Chart loader skeleton grid
          <div className="absolute inset-0 flex flex-col justify-between py-2 animate-pulse">
            <div className="flex items-end justify-between h-40 gap-6 px-4">
              <div className="w-full bg-slate-100 rounded-md h-[40%]" />
              <div className="w-full bg-slate-100 rounded-md h-[70%]" />
              <div className="w-full bg-slate-100 rounded-md h-[50%]" />
              <div className="w-full bg-slate-100 rounded-md h-[90%]" />
              <div className="w-full bg-slate-100 rounded-md h-[60%]" />
              <div className="w-full bg-slate-100 rounded-md h-[80%]" />
            </div>
            <div className="h-0.5 bg-slate-200 w-full" />
            <div className="flex justify-between px-2 text-[9px] text-slate-350">
              <div className="h-2.5 bg-slate-150 rounded w-10" />
              <div className="h-2.5 bg-slate-150 rounded w-10" />
              <div className="h-2.5 bg-slate-150 rounded w-10" />
              <div className="h-2.5 bg-slate-150 rounded w-10" />
            </div>
          </div>
        ) : children ? (
          <div className="w-full h-full min-h-[220px]">{children}</div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-200/50">
              <BarChart3 className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-[200px] text-center leading-relaxed">
              No chart data loaded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartContainer;
