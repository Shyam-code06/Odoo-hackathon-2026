import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockVehicles from '@/data/vehicles.json';

/**
 * Fleet Vehicles Operations Service
 */
export const vehicleService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockVehicles;
    }
    const response = await axiosInstance.get('/vehicles', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockVehicles.find((v) => v.id === id) || null;
    }
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newVehicle = { id: `veh-${Date.now()}`, ...data };
      mockVehicles.push(newVehicle);
      return newVehicle;
    }
    const response = await axiosInstance.post('/vehicles', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockVehicles.findIndex((v) => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      mockVehicles[index] = { ...mockVehicles[index], ...data };
      return mockVehicles[index];
    }
    const response = await axiosInstance.put(`/vehicles/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockVehicles.findIndex((v) => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      mockVehicles.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },
};

export default vehicleService;
