import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Premium Progress Indicators (Linear & Circular placeholders)
 */
export function Progress({
  value = 0, // 0 to 100
  max = 100,
  showValue = false,
  className,
  variant = 'primary',
  size = 'md',
  color, // Optional hex color override (e.g. '#F59E0B')
  ...props
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: 'bg-brand-primary',
    success: 'bg-brand-success',
    warning: 'bg-brand-secondary',
    danger: 'bg-brand-danger',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3.5',
  };

  return (
    <div className={cn("w-full text-left select-none", className)} {...props}>
      {showValue && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn(
        "w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50",
        sizes[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn("h-full rounded-full", !color && colors[variant])}
          style={color ? { backgroundColor: color } : undefined}
        />
      </div>
    </div>
  );
}

/**
 * Circular progress loader placeholder.
 */
export function CircularProgress({
  size = 40,
  strokeWidth = 4,
  className,
  ...props
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className={cn("inline-flex items-center justify-center shrink-0", className)} {...props}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-slate-100)"
          strokeWidth={strokeWidth}
          className="border border-slate-200/50"
        />
        {/* Progress indicator circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-brand-primary)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animate={{
            strokeDashoffset: [circumference, circumference * 0.25, circumference],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.8,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
          style={{ transformOrigin: '50% 50%' }}
        />
      </svg>
    </div>
  );
}

export default Progress;
