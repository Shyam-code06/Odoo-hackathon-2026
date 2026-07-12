import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockVehicles from '@/data/vehicles.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';

// Helper to map DB vehicle format to frontend format
const mapVehicleDbToFrontend = (v) => {
  if (!v) return null;
  const parts = v.model ? v.model.split(' ') : [];
  const make = parts[0] || '';
  const model = parts.slice(1).join(' ') || v.model || '';

  let type = 'Medium Duty Truck';
  if (v.type === 'VAN') type = 'Light Cargo Van';
  else if (v.type === 'SEMI_TRUCK') type = 'Heavy Duty Truck';
  else if (v.type === 'TRUCK') type = 'Medium Duty Truck';
  else if (v.type === 'SEDAN') type = 'Sedan';
  else if (v.type === 'SUV') type = 'SUV';

  let status = 'available';
  if (v.status === 'AVAILABLE') status = 'available';
  else if (v.status === 'ON_TRIP') status = 'on_trip';
  else if (v.status === 'IN_SHOP') status = 'maintenance';
  else if (v.status === 'RETIRED') status = 'retired';

  return {
    id: v.id,
    plateNumber: v.registrationNumber,
    make,
    model,
    year: 2023,
    type,
    capacity: v.maxLoadCapacity,
    odometer: v.odometer,
    acquisitionCost: parseFloat(v.acquisitionCost || 0),
    region: v.region,
    fuelType: v.type === 'VAN' ? 'Gasoline' : 'Diesel',
    status,
    healthScore: Math.max(50, Math.min(100, Math.round(100 - (v.odometer / 5000)))),
    lastMaintenance: v.updatedAt ? v.updatedAt.slice(0, 10) : '2026-07-01'
  };
};

// Helper to map frontend format to DB vehicle format
const mapVehicleFrontendToDb = (data) => {
  let type = 'TRUCK';
  if (data.type === 'Light Cargo Van' || data.type === 'VAN') type = 'VAN';
  else if (data.type === 'Heavy Duty Truck' || data.type === 'SEMI_TRUCK') type = 'SEMI_TRUCK';
  else if (data.type === 'Medium Duty Truck' || data.type === 'TRUCK') type = 'TRUCK';
  else if (data.type === 'Sedan' || data.type === 'SEDAN') type = 'SEDAN';
  else if (data.type === 'SUV' || data.type === 'SUV') type = 'SUV';

  let status = 'AVAILABLE';
  if (data.status === 'available') status = 'AVAILABLE';
  else if (data.status === 'on_trip') status = 'ON_TRIP';
  else if (data.status === 'maintenance') status = 'IN_SHOP';
  else if (data.status === 'retired') status = 'RETIRED';

  return {
    registrationNumber: data.plateNumber,
    model: `${data.make} ${data.model}`,
    type,
    maxLoadCapacity: Number(data.capacity),
    odometer: Number(data.odometer),
    acquisitionCost: Number(data.acquisitionCost),
    region: data.region,
    status
  };
};

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
    return response.data.map(mapVehicleDbToFrontend);
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockVehicles.find((v) => v.id === id) || null;
    }
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return mapVehicleDbToFrontend(response.data);
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newVehicle = { id: `veh-${Date.now()}`, ...data };
      mockVehicles.push(newVehicle);
      return newVehicle;
    }
    const payload = mapVehicleFrontendToDb(data);
    const response = await axiosInstance.post('/vehicles', payload);
    return mapVehicleDbToFrontend(response.data);
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockVehicles.findIndex((v) => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      mockVehicles[index] = { ...mockVehicles[index], ...data };
      return mockVehicles[index];
    }
    const payload = mapVehicleFrontendToDb(data);
    const response = await axiosInstance.put(`/vehicles/${id}`, payload);
    return mapVehicleDbToFrontend(response.data);
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

  /**
   * Export vehicle records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockVehicles, 'vehicles', format);
    }
    const response = await axiosInstance.get('/vehicles/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'vehicles', format);
  },

  statistics: async () => {
    if (USE_MOCK_DATA) {
      return {};
    }
    const response = await axiosInstance.get('/vehicles/statistics');
    return response.data;
  }
};

export default vehicleService;
