import { Button } from './Button';
import { cn } from '@/utils';

/**
 * Reusable empty state view with illustration placeholder and actions
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-premium flex flex-col items-center justify-center select-none",
        className
      )}
      {...props}
    >
      {/* Icon Wrapper */}
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-bg-secondary flex items-center justify-center text-slate-400 mb-5 border border-slate-200/50">
          <Icon className="w-8 h-8" />
        </div>
      )}

      {/* Text Info */}
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed mb-6 font-medium">
          {description}
        </p>
      )}

      {/* Reusable Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        {primaryActionLabel && onPrimaryAction && (
          <Button onClick={onPrimaryAction}>
            {primaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
