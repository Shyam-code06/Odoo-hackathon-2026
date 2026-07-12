import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Reusable Card component with custom styling options.
 */
export function Card({
  children,
  className,
  variant = 'basic', // 'basic' | 'glass' | 'interactive' | 'gradient'
  onClick,
  ...props
}) {
  const baseStyle = 'rounded-2xl border border-slate-200/80 bg-white shadow-premium overflow-hidden p-6 text-left';

  const variants = {
    basic: '',
    glass: 'bg-white/70 backdrop-blur-md border-white/60 shadow-premium-sm',
    interactive: 'cursor-pointer hover:shadow-premium-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0',
    gradient: 'relative bg-gradient-to-br from-white to-brand-bg-secondary/40',
  };

  const Component = variant === 'interactive' ? motion.div : 'div';
  const motionProps = variant === 'interactive' ? { whileTap: { scale: 0.99 } } : {};

  return (
    <Component
      className={cn(baseStyle, variants[variant], className)}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex justify-between items-center border-b border-subtle pb-4 mb-4 select-none", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("border-t border-subtle pt-4 mt-4 text-xs font-semibold text-slate-400 select-none", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Enterprise Stat KPI Card
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  trendValue, // numerical percentage e.g. 12.5
  trendDirection, // 'up' | 'down' | 'neutral'
  trendLabel = 'vs last period',
  isLoading = false,
  className,
  colorVariant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'purple'
  ...props
}) {
  const colors = {
    primary: 'text-brand-primary bg-blue-50/60 border-blue-100/50',
    success: 'text-brand-success bg-green-50/60 border-green-100/50',
    warning: 'text-brand-secondary bg-amber-50/60 border-amber-100/50',
    danger: 'text-brand-danger bg-rose-50/60 border-rose-100/50',
    purple: 'text-brand-purple bg-purple-50/60 border-purple-100/50',
  };

  // Rendering Loader skeleton state
  if (isLoading) {
    return (
      <div className={cn("bg-white border border-slate-200/80 rounded-2xl p-6 shadow-premium select-none animate-pulse space-y-4", className)}>
        <div className="flex justify-between items-center">
          <div className="h-3.5 bg-slate-200 rounded w-1/2" />
          <div className="w-9 h-9 bg-slate-200 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const renderTrend = () => {
    if (!trendDirection) return null;
    
    if (trendDirection === 'up') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brand-success bg-green-50 border border-green-100 px-2 py-0.5 rounded-full shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5" />
          {trendValue}%
        </span>
      );
    }

    if (trendDirection === 'down') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-brand-danger bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full shrink-0">
          <ArrowDownRight className="w-3.5 h-3.5" />
          {trendValue}%
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full shrink-0">
        <Minus className="w-3 h-3" />
        {trendValue || '0'}%
      </span>
    );
  };

  return (
    <Card className={className} {...props}>
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 overflow-hidden select-none">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-850 tracking-tight leading-none mt-1 truncate">{value}</h3>
        </div>
        
        {Icon && (
          <div className={cn("p-2.5 rounded-xl border shrink-0", colors[colorVariant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 select-none overflow-hidden">
        {renderTrend()}
        {trendLabel && (
          <span className="text-[11px] font-semibold text-slate-400 truncate">{trendLabel}</span>
        )}
      </div>
    </Card>
  );
}

export default Card;
