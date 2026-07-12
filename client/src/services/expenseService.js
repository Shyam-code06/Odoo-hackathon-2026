import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockExpenses from '@/data/expenses.json';

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
};

export default expenseService;
