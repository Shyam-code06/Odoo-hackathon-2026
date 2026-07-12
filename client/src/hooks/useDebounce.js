import { useState, useEffect } from 'react';

/**
 * Debounce hook — delays updating the output value until after the delay.
 * Useful for search inputs to prevent excessive API calls.
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Milliseconds to wait (default: 350ms)
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
