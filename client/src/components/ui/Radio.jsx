import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Premium custom Radio selection control
 */
export const Radio = forwardRef(({
  className,
  label,
  checked = false,
  onChange,
  isDisabled = false,
  error,
  id,
  name,
  value,
  ...props
}, ref) => {
  const radioId = id || `rad-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <label
      htmlFor={radioId}
      className={cn(
        "inline-flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-slate-700 w-fit",
        isDisabled && "cursor-not-allowed text-slate-400",
        className
      )}
    >
      <input
        ref={ref}
        id={radioId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={isDisabled}
        className="sr-only"
        {...props}
      />

      {/* Visual circle container */}
      <motion.div
        animate={{
          borderColor: error 
            ? 'var(--color-brand-danger)' 
            : checked 
              ? 'var(--color-brand-primary)' 
              : 'var(--color-slate-200)',
          backgroundColor: '#FFFFFF',
        }}
        whileTap={{ scale: isDisabled ? 1 : 0.92 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 shadow-premium-sm transition-all focus-within:ring-1 focus-within:ring-brand-primary/30",
          !checked && !isDisabled && "hover:border-slate-350"
        )}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="w-2 h-2 rounded-full bg-brand-primary"
          />
        )}
      </motion.div>

      {label && <span>{label}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';

export default Radio;
