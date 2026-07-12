import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockFuel from '@/data/fuel.json';

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
};

export default fuelService;
