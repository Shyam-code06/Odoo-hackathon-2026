import { cn } from '@/utils';

/**
 * Reusable dynamic page header layout
 */
export function PageHeader({
  title,
  description,
  breadcrumbs = [], // [{ label: '...', to: '...' }]
  actions,
  className,
  ...props
}) {
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-subtle pb-6 mb-6 select-none",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5 text-left">
        {/* Optional Title level breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center">
                <span>{crumb.label}</span>
                {idx < breadcrumbs.length - 1 && <span className="mx-2 text-slate-350">/</span>}
              </div>
            ))}
          </nav>
        )}

        <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">{title}</h1>
        {description && (
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
