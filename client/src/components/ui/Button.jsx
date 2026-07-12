import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Premium reusable Button component with Framer Motion animations.
 */
export const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-blue-700 shadow-premium-sm hover:shadow-premium',
    secondary: 'bg-brand-bg-secondary text-slate-700 hover:bg-slate-200/80',
    outline: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-premium-sm',
    ghost: 'text-slate-655 hover:bg-slate-100 hover:text-slate-800',
    success: 'bg-brand-success text-white hover:bg-green-700 shadow-premium-sm',
    danger: 'bg-brand-danger text-white hover:bg-red-700 shadow-premium-sm',
    warning: 'bg-brand-secondary text-white hover:bg-amber-600 shadow-premium-sm',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-xs px-4.5 py-2.5 gap-2',
    lg: 'text-sm px-6 py-3.5 gap-2.5',
    icon: 'p-2.5 rounded-xl',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      whileTap={{ scale: isDisabled || isLoading ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      )}
      {!isLoading && LeftIcon && (
        <LeftIcon className={cn("shrink-0", size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      )}
      
      {children}
      
      {!isLoading && RightIcon && (
        <RightIcon className={cn("shrink-0", size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
