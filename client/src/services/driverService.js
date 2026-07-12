import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockDrivers from '@/data/drivers.json';

/**
 * Fleet Drivers Operations Service
 */
export const driverService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockDrivers;
    }
    const response = await axiosInstance.get('/drivers', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockDrivers.find((d) => d.id === id) || null;
    }
    const response = await axiosInstance.get(`/drivers/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newDriver = { id: `drv-${Date.now()}`, ...data };
      mockDrivers.push(newDriver);
      return newDriver;
    }
    const response = await axiosInstance.post('/drivers', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockDrivers.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      mockDrivers[index] = { ...mockDrivers[index], ...data };
      return mockDrivers[index];
    }
    const response = await axiosInstance.put(`/drivers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockDrivers.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      mockDrivers.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/drivers/${id}`);
    return response.data;
  },
};

export default driverService;
