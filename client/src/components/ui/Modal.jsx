import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

/**
 * Premium Modal container with backdrop blur and enter/exit animations.
 */
export function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop = true,
  className,
  ...props
}) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll on background when modal is open
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
    sm: 'max-w-[400px]',
    md: 'max-w-[540px]',
    lg: 'max-w-[800px]',
    xl: 'max-w-[1140px]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Panel Box */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className={cn(
              "relative w-full bg-white rounded-2xl border border-slate-200/80 shadow-premium-xl z-10 flex flex-col text-left overflow-hidden",
              sizes[size],
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-subtle select-none">
              <h3 id="modal-title" className="text-base font-bold text-slate-850 tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close modal dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-655 font-medium leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Reusable Confirmation and Feedback Dialogs (Delete / Warning / Success)
 */
export function ConfirmationDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info', // 'info' | 'success' | 'warning' | 'danger'
  isLoading = false,
  ...props
}) {
  const iconConfig = {
    info: { icon: HelpCircle, color: 'text-brand-primary bg-blue-50 border-blue-100' },
    success: { icon: CheckCircle2, color: 'text-brand-success bg-green-50 border-green-100' },
    warning: { icon: AlertTriangle, color: 'text-brand-secondary bg-amber-50 border-amber-100' },
    danger: { icon: AlertCircle, color: 'text-brand-danger bg-rose-50 border-rose-100' },
  };

  const buttonVariants = {
    info: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
  };

  const config = iconConfig[variant] || iconConfig.info;
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closeOnBackdrop={!isLoading} {...props}>
      <div className="flex flex-col items-center text-center py-2 select-none">
        {/* Animated Dialog Icon */}
        <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 shrink-0", config.color)}>
          <Icon className="w-6 h-6" />
        </div>

        <h4 className="text-base font-bold text-slate-800 tracking-tight mb-2">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed px-2 mb-6">{message}</p>

        {/* Dialog Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            isDisabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default Modal;
