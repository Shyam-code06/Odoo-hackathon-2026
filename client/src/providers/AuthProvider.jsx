import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import authService from '@/services/authService';

/**
 * Global authentication state provider.
 * Supports JWT storage, remember-me persistence, session recovery,
 * global auth-failure event subscriptions, RBAC utilities, and permission checks.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session from storage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('transitops_user') || sessionStorage.getItem('transitops_user');
        const token = localStorage.getItem('transitops_auth_token') || sessionStorage.getItem('transitops_auth_token');

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore authentication session:', error);
        localStorage.removeItem('transitops_auth_token');
        localStorage.removeItem('transitops_user');
        sessionStorage.removeItem('transitops_auth_token');
        sessionStorage.removeItem('transitops_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to global 401/403 Unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('transitops_auth_token');
      localStorage.removeItem('transitops_user');
      sessionStorage.removeItem('transitops_auth_token');
      sessionStorage.removeItem('transitops_user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  /** Login with email + password. */
  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user: loggedInUser, token } = response;

      setUser(loggedInUser);
      setIsAuthenticated(true);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('transitops_auth_token', token);
      storage.setItem('transitops_user', JSON.stringify(loggedInUser));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed. Please check credentials.' };
    } finally {
      setLoading(false);
    }
  }, []);

  /** Log out and clear all session data. */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Backend logout request failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('transitops_auth_token');
      localStorage.removeItem('transitops_user');
      sessionStorage.removeItem('transitops_auth_token');
      sessionStorage.removeItem('transitops_user');
      setLoading(false);
    }
  }, []);

  /**
   * Check if the current user has a specific role.
   * @param {string|string[]} requiredRoles - Role(s) to check
   */
  const hasRole = useCallback((requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.includes(user.role);
  }, [user]);

  /**
   * Check if the current user has a specific granular permission.
   * Permissions come from the JWT payload (set by the backend based on role).
   * @param {string} permission - The permission string to check (e.g., 'create_vehicle')
   */
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    if (!permission) return true;
    return Array.isArray(user.permissions) && user.permissions.includes(permission);
  }, [user]);

  /**
   * Check if the current user is the Fleet Manager (org admin).
   */
  const isFleetManager = useCallback(() => {
    return user?.role === 'fleet_manager';
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    hasPermission,
    isFleetManager,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
