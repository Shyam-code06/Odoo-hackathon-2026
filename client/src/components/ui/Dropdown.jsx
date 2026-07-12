import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
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
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 });
  const containerRef = useRef(null);

  const toggleMenu = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const closeMenu = () => setIsOpen(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // Also check if click was on the portaled menu
        const menuEl = document.getElementById('portal-dropdown-menu');
        if (menuEl && menuEl.contains(event.target)) {
          return;
        }
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on scroll to prevent alignment shift
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

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
          return React.cloneElement(child, { isOpen, onClose: closeMenu, coords });
        }
        return child;
      })}
    </div>
  );
}

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
 * Dropdown Menu panel using React Portals
 */
export function DropdownMenu({
  children,
  isOpen = false,
  onClose,
  align = 'right', // 'right' | 'left'
  className,
  coords,
  ...props
}) {
  const menuWidth = 160; // matches min-width

  const style = {
    position: 'absolute',
    top: `${coords?.top || 0}px`,
    left: align === 'right'
      ? `${(coords?.right || 0) - menuWidth}px`
      : `${coords?.left || 0}px`,
    zIndex: 9999,
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="portal-dropdown-menu"
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={style}
          className={cn(
            "bg-white border border-slate-200 rounded-xl shadow-premium-lg overflow-hidden py-1 text-left select-none",
            className
          )}
          style={{ ...style, minWidth: `${menuWidth}px` }}
          {...props}
        >
          <div onClick={onClose}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
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
