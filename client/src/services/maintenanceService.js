import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockMaintenance from '@/data/maintenance.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';

/**
 * Maintenance Log Operations Service
 */
export const maintenanceService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockMaintenance;
    }
    const response = await axiosInstance.get('/maintenance', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockMaintenance.find((m) => m.id === id) || null;
    }
    const response = await axiosInstance.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newItem = { id: `maint-${Date.now()}`, ...data };
      mockMaintenance.push(newItem);
      return newItem;
    }
    const response = await axiosInstance.post('/maintenance', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockMaintenance.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Maintenance entry not found');
      mockMaintenance[index] = { ...mockMaintenance[index], ...data };
      return mockMaintenance[index];
    }
    const response = await axiosInstance.put(`/maintenance/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockMaintenance.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Maintenance entry not found');
      mockMaintenance.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/maintenance/${id}`);
    return response.data;
  },

  /**
   * Export maintenance records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockMaintenance, 'maintenance_report', format);
    }
    const response = await axiosInstance.get('/maintenance/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'maintenance_report', format);
  },
};

export default maintenanceService;
