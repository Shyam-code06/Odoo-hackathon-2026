import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockTrips from '@/data/trips.json';

/**
 * Trip Dispatch Operations Service
 */
export const tripService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockTrips;
    }
    const response = await axiosInstance.get('/trips', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockTrips.find((t) => t.id === id) || null;
    }
    const response = await axiosInstance.get(`/trips/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newTrip = { id: `trp-${Date.now()}`, ...data };
      mockTrips.push(newTrip);
      return newTrip;
    }
    const response = await axiosInstance.post('/trips', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockTrips.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      mockTrips[index] = { ...mockTrips[index], ...data };
      return mockTrips[index];
    }
    const response = await axiosInstance.put(`/trips/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockTrips.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      mockTrips.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/trips/${id}`);
    return response.data;
  },
};

export default tripService;
