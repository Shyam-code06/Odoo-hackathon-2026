import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Premium custom Switch Toggle with slide animations
 */
export const Switch = forwardRef(({
  className,
  label,
  checked = false,
  onChange,
  isDisabled = false,
  id,
  ...props
}, ref) => {
  const switchId = id || `sw-${Math.random().toString(36).substring(2, 9)}`;

  const handleToggle = () => {
    if (isDisabled) return;
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={switchId}
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none text-xs font-semibold text-slate-700 w-fit",
        isDisabled && "cursor-not-allowed text-slate-400",
        className
      )}
    >
      <input
        ref={ref}
        id={switchId}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={handleToggle}
        disabled={isDisabled}
        className="sr-only"
        {...props}
      />

      {/* Switch track */}
      <motion.div
        animate={{
          backgroundColor: checked ? 'var(--color-brand-primary)' : 'var(--color-slate-200)',
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          "w-9 h-5 rounded-full p-0.5 relative transition-colors shrink-0",
          isDisabled && "opacity-50"
        )}
      >
        {/* Switch handle */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-4 h-4 rounded-full bg-white shadow-premium-sm"
          style={{
            position: 'absolute',
            left: checked ? 'calc(100% - 18px)' : '2px',
            top: '2px',
          }}
        />
      </motion.div>

      {label && <span>{label}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';

export default Switch;
