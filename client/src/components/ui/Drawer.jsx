import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils';

/**
 * Premium slide-out Drawer panel (Left/Right placement)
 */
export function Drawer({
  isOpen = false,
  onClose,
  title,
  children,
  position = 'right', // 'right' | 'left'
  size = 'md', // 'sm' | 'md' | 'lg'
  closeOnBackdrop = true,
  className,
  ...props
}) {
  // Lock scroll on background when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
  };

  const slideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Drawer Body Panel */}
          <motion.div
            variants={slideVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={cn(
              "fixed inset-y-0 bg-white border-slate-200/80 shadow-premium-xl z-10 flex flex-col w-full text-left",
              position === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              sizes[size],
              className
            )}
            role="dialog"
            aria-modal="true"
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-subtle select-none shrink-0">
              <h3 className="text-base font-bold text-slate-850 tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-655 font-medium leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Drawer;
