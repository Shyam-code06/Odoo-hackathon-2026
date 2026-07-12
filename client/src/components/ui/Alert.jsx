import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Reusable Alert Banner component (Info, Success, Warning, Danger)
 */
export function Alert({
  children,
  title,
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  isDismissible = false,
  className,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const config = {
    info: {
      icon: HelpCircle,
      wrapper: 'bg-blue-50 text-brand-primary border-blue-200/50',
      closeBtn: 'hover:bg-blue-100/50 text-blue-500',
    },
    success: {
      icon: CheckCircle2,
      wrapper: 'bg-green-50 text-brand-success border-green-200/50',
      closeBtn: 'hover:bg-green-100/50 text-green-500',
    },
    warning: {
      icon: AlertTriangle,
      wrapper: 'bg-amber-50/70 text-brand-secondary border-amber-200/50',
      closeBtn: 'hover:bg-amber-100/50 text-amber-500',
    },
    danger: {
      icon: AlertCircle,
      wrapper: 'bg-rose-50 text-brand-danger border-rose-200/50',
      closeBtn: 'hover:bg-rose-100/50 text-rose-500',
    },
  };

  const current = config[variant] || config.info;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={cn(
          "flex items-start gap-3.5 p-4 rounded-xl border text-xs font-semibold leading-relaxed text-left relative overflow-hidden select-none",
          current.wrapper,
          className
        )}
        {...props}
      >
        <Icon className="w-5 h-5 shrink-0 text-current mt-0.5" />
        
        <div className="flex-1 space-y-1">
          {title && <h5 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h5>}
          <div className="text-slate-655 font-medium">{children}</div>
        </div>

        {isDismissible && (
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className={cn(
              "p-1 rounded-lg transition-colors cursor-pointer shrink-0 ml-2 mt-0.5",
              current.closeBtn
            )}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default Alert;
