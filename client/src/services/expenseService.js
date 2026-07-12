import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockExpenses from '@/data/expenses.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';

/**
 * Operating Expenses Operations Service
 */
export const expenseService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockExpenses;
    }
    const response = await axiosInstance.get('/expenses', { params: filters });
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newItem = { id: `exp-${Date.now()}`, ...data };
      mockExpenses.push(newItem);
      return newItem;
    }
    const response = await axiosInstance.post('/expenses', data);
    return response.data;
  },

  /**
   * Export expense records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockExpenses, 'expenses', format);
    }
    const response = await axiosInstance.get('/expenses/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'expenses', format);
  },
};

export default expenseService;
