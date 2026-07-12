import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockFuel from '@/data/fuel.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';
import { vehicleService } from './vehicleService';
import { tripService } from './tripService';

// Helper to map DB fuel log to frontend format
const mapFuelDbToFrontend = (f) => {
  if (!f) return null;
  const gallons = parseFloat((f.liters / 3.78541).toFixed(2));
  return {
    id: f.id,
    vehicleName: f.vehicle ? `${f.vehicle.make} ${f.vehicle.model} (${f.vehicle.registrationNumber})` : 'Unknown Vehicle',
    vehicleId: f.vehicleId,
    trip: f.trip ? f.trip.tripNumber : 'TRP-9902',
    tripId: f.tripId,
    gallons,
    cost: parseFloat(f.cost || 0),
    fuelType: f.vehicle?.type === 'VAN' ? 'Gasoline' : 'Diesel',
    date: f.date ? f.date.slice(0, 10) : '2026-07-01'
  };
};

// Helper to resolve vehicle and trip IDs
const resolveVehicleAndTrip = async (vehicleName, tripCode) => {
  const vehicles = await vehicleService.getAll();
  const vehicle = vehicles.find(v => `${v.make} ${v.model} (${v.plateNumber})` === vehicleName);
  if (!vehicle) throw new Error('Selected vehicle not found.');

  let tripId = null;
  try {
    const trips = await tripService.getAll();
    const trip = trips.find(t => t.tripNumber.toLowerCase() === tripCode.toLowerCase() || t.id === tripCode);
    if (trip) tripId = trip.id;
  } catch (e) {
    console.error('Failed to resolve trip ID', e);
  }

  return { vehicleId: vehicle.id, tripId, odometer: vehicle.odometer };
};

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
    return response.data.map(mapFuelDbToFrontend);
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockFuel.find((f) => f.id === id) || null;
    }
    const response = await axiosInstance.get(`/fuel/${id}`);
    return mapFuelDbToFrontend(response.data);
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newItem = { id: `fuel-${Date.now()}`, ...data };
      mockFuel.push(newItem);
      return newItem;
    }
    const { vehicleId, tripId, odometer } = await resolveVehicleAndTrip(data.vehicleName, data.trip);
    const payload = {
      vehicleId,
      tripId,
      liters: Number(data.gallons) * 3.78541,
      cost: Number(data.cost),
      date: data.date,
      odometer
    };
    const response = await axiosInstance.post('/fuel', payload);
    return mapFuelDbToFrontend(response.data);
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockFuel.findIndex((f) => f.id === id);
      if (index === -1) throw new Error('Fuel log not found');
      mockFuel[index] = { ...mockFuel[index], ...data };
      return mockFuel[index];
    }
    const { vehicleId, tripId, odometer } = await resolveVehicleAndTrip(data.vehicleName, data.trip);
    const payload = {
      vehicleId,
      tripId,
      liters: Number(data.gallons) * 3.78541,
      cost: Number(data.cost),
      date: data.date,
      odometer
    };
    const response = await axiosInstance.put(`/fuel/${id}`, payload);
    return mapFuelDbToFrontend(response.data);
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockFuel.findIndex((f) => f.id === id);
      if (index === -1) throw new Error('Fuel log not found');
      mockFuel.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/fuel/${id}`);
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

  statistics: async () => {
    return {};
  }
};

export default fuelService;
