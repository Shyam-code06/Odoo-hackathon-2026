import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockAuth from '@/data/auth.json';

// Helper to normalize backend user role and permissions for frontend UI consumption
const mapRoleAndPermissions = (backendUser) => {
  if (!backendUser) return null;
  const role = backendUser.role ? backendUser.role.toLowerCase() : 'driver';
  let permissions = [];
  if (role === 'fleet_manager') {
    permissions = ["view_fleet", "manage_fleet", "view_reports", "manage_settings", "view_finance"];
  } else if (role === 'dispatcher') {
    permissions = ["view_fleet", "manage_trips", "view_reports"];
  } else if (role === 'safety_officer') {
    permissions = ["view_fleet", "view_maintenance", "view_reports"];
  } else if (role === 'financial_analyst') {
    permissions = ["view_finance", "view_reports", "view_expenses"];
  } else {
    permissions = ["view_fleet"];
  }
  return {
    ...backendUser,
    role,
    permissions,
    avatar: backendUser.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face`
  };
};

/**
 * Authentication Service
 */
export const authService = {
  login: async ({ email, password }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const matchedUser = mockAuth.mockUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (!matchedUser) {
        throw new Error('Invalid email or password.');
      }

      return {
        user: matchedUser,
        token: mockAuth.mockToken,
      };
    }

    const response = await axiosInstance.post('/auth/login', { email, password });
    const { token, user } = response.data;
    return {
      token,
      user: mapRoleAndPermissions(user)
    };
  },

  register: async ({ email, password, name, role }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newUser = { id: `usr-${Date.now()}`, email, name, role: role || 'FLEET_MANAGER' };
      return { user: newUser, token: 'mock-token' };
    }
    const response = await axiosInstance.post('/auth/register', { email, password, name, role });
    const { token, user } = response.data;
    return {
      token,
      user: mapRoleAndPermissions(user)
    };
  },

  logout: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true };
    }
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    if (USE_MOCK_DATA) {
      const stored = localStorage.getItem('transitops_user') || sessionStorage.getItem('transitops_user');
      return stored ? JSON.parse(stored) : null;
    }
    const response = await axiosInstance.get('/auth/me');
    return mapRoleAndPermissions(response.data);
  },

  // Standard CRUD service method stubs
  getAll: async () => { return []; },
  getById: async () => { return null; },
  create: async () => { return null; },
  update: async () => { return null; },
  delete: async () => { return { success: true }; },
  export: async () => { return ''; },
  statistics: async () => { return {}; },
};

export default authService;
