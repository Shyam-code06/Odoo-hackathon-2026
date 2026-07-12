import { cn } from '@/utils';

/**
 * Premium capsule Badges for labeling states or quantities
 */
export function Badge({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center gap-1 font-semibold rounded-full select-none shrink-0 w-fit';

  const variants = {
    primary: 'bg-blue-50 text-brand-primary border border-blue-100',
    success: 'bg-green-50 text-brand-success border border-green-100',
    warning: 'bg-amber-50/70 text-brand-secondary border border-amber-100/70',
    danger: 'bg-red-50 text-brand-danger border border-red-100',
    info: 'bg-purple-50 text-brand-purple border border-purple-100',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200/50',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1',
    lg: 'text-xs px-3 py-1.5 gap-1.5',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {Icon && <Icon className={cn("shrink-0", size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />}
      {children}
    </span>
  );
}

export default Badge;
