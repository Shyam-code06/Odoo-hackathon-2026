import { useState, useEffect } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Theme Provider that manages the document theme state (light / dark)
 * and persists the selection in localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('transitops_theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return 'light'; // Default preference is Light Theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Smooth transition style class trigger
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('transitops_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
