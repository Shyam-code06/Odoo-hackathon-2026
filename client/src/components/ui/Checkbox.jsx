import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Premium custom Checkbox controller with spring click feedback
 */
export const Checkbox = forwardRef(({
  className,
  label,
  checked = false,
  onChange,
  isDisabled = false,
  error,
  id,
  ...props
}, ref) => {
  const checkboxId = id || `chk-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <label 
      htmlFor={checkboxId}
      className={cn(
        "inline-flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-slate-700 w-fit",
        isDisabled && "cursor-not-allowed text-slate-400",
        className
      )}
    >
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={isDisabled}
        className="sr-only"
        {...props}
      />
      
      {/* Visual box container */}
      <motion.div
        animate={{
          backgroundColor: checked ? 'var(--color-brand-primary)' : '#FFFFFF',
          borderColor: error 
            ? 'var(--color-brand-danger)' 
            : checked 
              ? 'var(--color-brand-primary)' 
              : 'var(--color-slate-200)',
        }}
        whileTap={{ scale: isDisabled ? 1 : 0.92 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 shadow-premium-sm transition-all focus-within:ring-1 focus-within:ring-brand-primary/30",
          !checked && !isDisabled && "hover:border-slate-350"
        )}
      >
        {checked && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Check className="w-3 h-3 text-white stroke-[3.5px]" />
          </motion.span>
        )}
      </motion.div>
      
      {label && <span>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
