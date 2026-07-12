import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Premium animated Theme Toggle component for switching between light and dark themes.
 * Supports rotation, scale animations, proper ARIA attributes, and tooltips.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary outline-offset-2 cursor-pointer select-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="w-4.5 h-4.5 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'light' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute flex items-center justify-center text-slate-500"
            >
              <Sun className="w-4.5 h-4.5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute flex items-center justify-center text-amber-400"
            >
              <Moon className="w-4.5 h-4.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}

export default ThemeToggle;
