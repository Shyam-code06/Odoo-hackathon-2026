import { useState, useEffect } from 'react';

/**
 * Media query hook — returns true/false based on a CSS media query string.
 * Useful for responsive logic in components without CSS class dependencies.
 *
 * @param {string} query - CSS media query string, e.g. '(max-width: 768px)'
 * @returns {boolean} Whether the query currently matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    // Modern API
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience presets matching Tailwind breakpoints
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

export default useMediaQuery;
