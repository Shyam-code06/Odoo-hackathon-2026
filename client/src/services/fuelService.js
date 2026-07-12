import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockFuel from '@/data/fuel.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';

/**
 * Fuel Registry Operations Service
 */
export const fuelService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockFuel;
    }
    const response = await axiosInstance.get('/fuel', { params: filters });
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newItem = { id: `fuel-${Date.now()}`, ...data };
      mockFuel.push(newItem);
      return newItem;
    }
    const response = await axiosInstance.post('/fuel', data);
    return response.data;
  },

  /**
   * Export fuel log records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockFuel, 'fuel_logs', format);
    }
    const response = await axiosInstance.get('/fuel/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'fuel_logs', format);
  },
};

export default fuelService;
