import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';

/**
 * Premium custom Dropdown Menu wrapper
 */
export function Dropdown({
  children,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
      {...props}
    >
      {/* Search for trigger and menu elements dynamically */}
      {React.Children.map(children, (child) => {
        if (!child) return null;
        if (child.type === DropdownTrigger) {
          return React.cloneElement(child, { onClick: toggleMenu, isOpen });
        }
        if (child.type === DropdownMenu) {
          return React.cloneElement(child, { isOpen, onClose: closeMenu });
        }
        return child;
      })}
    </div>
  );
}

// React import helper inside the component file to support React.Children
import React from 'react';

/**
 * Dropdown trigger button wrapper
 */
export function DropdownTrigger({ children, onClick, isOpen, ...props }) {
  return (
    <div onClick={onClick} className="cursor-pointer" {...props}>
      {/* If child is a function, pass open state */}
      {typeof children === 'function' ? children({ isOpen }) : children}
    </div>
  );
}

/**
 * Dropdown Menu panel
 */
export function DropdownMenu({
  children,
  isOpen = false,
  onClose,
  align = 'right', // 'right' | 'left'
  className,
  ...props
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            "absolute mt-2 bg-white border border-slate-200 rounded-xl shadow-premium-lg z-50 overflow-hidden min-w-[160px] py-1 text-left select-none",
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          {...props}
        >
          <div onClick={onClose}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Dropdown Option Row
 */
export function DropdownItem({
  children,
  icon: Icon,
  className,
  onClick,
  variant = 'default', // 'default' | 'danger'
  ...props
}) {
  const variants = {
    default: 'text-slate-655 hover:bg-slate-50 hover:text-slate-805',
    danger: 'text-brand-danger hover:bg-red-50/50 hover:text-red-700',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer",
        variants[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 text-current" />}
      <span>{children}</span>
    </button>
  );
}

export default Dropdown;
