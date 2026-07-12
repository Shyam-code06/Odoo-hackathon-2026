import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockAuth from '@/data/auth.json';

/**
 * Authentication Service
 */
export const authService = {
  login: async ({ email, password }) => {
    if (USE_MOCK_DATA) {
      // Simulate real api response time
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
    return response.data;
  },

  register: async ({ email, password, name, role }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const newUser = { id: `usr-${Date.now()}`, email, name, role: role || 'FLEET_MANAGER' };
      return { user: newUser, token: 'mock-token' };
    }
    const response = await axiosInstance.post('/auth/register', { email, password, name, role });
    return response.data;
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
    return response.data;
  },
};

export default authService;
