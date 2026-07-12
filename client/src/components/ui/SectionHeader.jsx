import { cn } from '@/utils';

/**
 * Reusable Section Header for layout groups or card columns
 */
export function SectionHeader({
  title,
  description,
  actions,
  className,
  ...props
}) {
  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-subtle pb-3 mb-4 select-none",
        className
      )}
      {...props}
    >
      <div className="space-y-0.5 text-left">
        <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{title}</h3>
        {description && (
          <p className="text-xs text-slate-400 leading-normal">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
