import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Reusable hook to consume global theme context state and toggler.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return context;
}

export default useTheme;
