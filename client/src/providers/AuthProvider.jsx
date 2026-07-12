import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '@/context/AuthContext';
import authService from '@/services/authService';

/**
 * Global authentication state provider.
 * Supports JWT storage logic, remember-me persistence, session recovery, 
 * global auth-failure event subscriptions, and RBAC utility functions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Checks and restores authentication session on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('transitops_user') || sessionStorage.getItem('transitops_user');
        const token = localStorage.getItem('transitops_auth_token') || sessionStorage.getItem('transitops_auth_token');

        if (token && storedUser) {
          // Future validation: send token to server to confirm validity
          // For now, restore user from local storage
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore authentication session:', error);
        // Clean up corrupt storage
        localStorage.removeItem('transitops_auth_token');
        localStorage.removeItem('transitops_user');
        sessionStorage.removeItem('transitops_auth_token');
        sessionStorage.removeItem('transitops_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to global 401 Unauthorized events emitted by Axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('transitops_auth_token');
      localStorage.removeItem('transitops_user');
      sessionStorage.removeItem('transitops_auth_token');
      sessionStorage.removeItem('transitops_user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  /**
   * Log in user using email and password credentials.
   */
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

  /**
   * Discard authentication tokens and log user out.
   */
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
   * Role-Based Access Control utility.
   * Checks if current user possesses any of the required credentials.
   */
  const hasRole = useCallback((requiredRoles) => {
    if (!user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return rolesArray.includes(user.role);
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
