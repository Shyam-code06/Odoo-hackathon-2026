import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockDrivers from '@/data/drivers.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';

// Helper to map DB driver format to frontend format
const mapDriverDbToFrontend = (d) => {
  if (!d) return null;
  
  let status = 'available';
  if (d.status === 'AVAILABLE') status = 'available';
  else if (d.status === 'ON_TRIP') status = 'on_trip';
  else if (d.status === 'OFF_DUTY') status = 'off_duty';
  else if (d.status === 'SUSPENDED') status = 'suspended';

  const email = `${d.name.toLowerCase().replace(/\s+/g, '.')}@transitops.com`;
  const avatarIndex = d.name.charCodeAt(0) % 5;
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  ];

  return {
    id: d.id,
    name: d.name,
    email,
    phone: d.contactNumber || '+1234567890',
    licenseNumber: d.licenseNumber,
    licenseExpiry: d.licenseExpiryDate ? d.licenseExpiryDate.slice(0, 10) : '2028-01-01',
    category: d.licenseCategory || 'Class A CDL',
    safetyScore: d.safetyScore,
    status,
    avatar: avatars[avatarIndex]
  };
};

// Helper to map frontend driver format to DB format
const mapDriverFrontendToDb = (data) => {
  let status = 'AVAILABLE';
  if (data.status === 'available') status = 'AVAILABLE';
  else if (data.status === 'on_trip') status = 'ON_TRIP';
  else if (data.status === 'off_duty') status = 'OFF_DUTY';
  else if (data.status === 'suspended') status = 'SUSPENDED';

  return {
    name: data.name,
    licenseNumber: data.licenseNumber,
    licenseCategory: data.category,
    licenseExpiryDate: data.licenseExpiry,
    contactNumber: data.phone,
    safetyScore: Number(data.safetyScore),
    status
  };
};

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
    return response.data.map(mapDriverDbToFrontend);
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockDrivers.find((d) => d.id === id) || null;
    }
    const response = await axiosInstance.get(`/drivers/${id}`);
    return mapDriverDbToFrontend(response.data);
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newDriver = { id: `drv-${Date.now()}`, ...data };
      mockDrivers.push(newDriver);
      return newDriver;
    }
    const payload = mapDriverFrontendToDb(data);
    const response = await axiosInstance.post('/drivers', payload);
    return mapDriverDbToFrontend(response.data);
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockDrivers.findIndex((d) => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      mockDrivers[index] = { ...mockDrivers[index], ...data };
      return mockDrivers[index];
    }
    const payload = mapDriverFrontendToDb(data);
    const response = await axiosInstance.put(`/drivers/${id}`, payload);
    return mapDriverDbToFrontend(response.data);
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

  /**
   * Export driver records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockDrivers, 'drivers', format);
    }
    const response = await axiosInstance.get('/drivers/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'drivers', format);
  },

  statistics: async () => {
    return {};
  }
};

export default driverService;
