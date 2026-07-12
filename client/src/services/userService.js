import axiosInstance from './axiosInstance';

/**
 * User Management Service
 * All endpoints are restricted to Fleet Manager on the backend.
 * This service is used exclusively from the UserManagement page.
 */
export const userService = {
  /**
   * Get all users in the current Fleet Manager's organization.
   */
  getAll: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  /**
   * Get a single user by ID.
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user in the organization.
   * @param {object} data - { email, password, name, role }
   */
  create: async (data) => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  },

  /**
   * Update a user's details.
   * @param {string} id
   * @param {object} data - { name?, email?, role? }
   */
  update: async (id, data) => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Deactivate a user (soft deactivation — they can't log in).
   */
  deactivate: async (id) => {
    const response = await axiosInstance.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Re-activate a deactivated user.
   */
  activate: async (id) => {
    const response = await axiosInstance.patch(`/users/${id}/activate`);
    return response.data;
  },

  /**
   * Reset a user's password. Fleet Manager sets the new password.
   * @param {string} id
   * @param {string} newPassword
   */
  resetPassword: async (id, newPassword) => {
    const response = await axiosInstance.patch(`/users/${id}/reset-password`, { newPassword });
    return response.data;
  },

  /**
   * Permanently delete a user from the organization.
   * Cannot delete the default Fleet Manager account or yourself.
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
