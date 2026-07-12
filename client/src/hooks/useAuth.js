import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Reusable hook to consume global authentication state and utilities
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
