import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockExpenses from '@/data/expenses.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';
import { vehicleService } from './vehicleService';
import { tripService } from './tripService';

// Helper to map DB expense to frontend format
const mapExpenseDbToFrontend = (e) => {
  if (!e) return null;
  let category = 'Fuel';
  if (e.category === 'FUEL') category = 'Fuel';
  else if (e.category === 'MAINTENANCE_COST') category = 'Maintenance';
  else if (e.category === 'TOLL') category = 'Tolls';
  else category = 'Tolls'; // fallback

  return {
    id: e.id,
    expenseType: e.description || 'Log cost',
    vehicleName: e.vehicle ? `${e.vehicle.make} ${e.vehicle.model} (${e.vehicle.registrationNumber})` : 'Unknown Vehicle',
    vehicleId: e.vehicleId,
    trip: e.trip ? e.trip.tripNumber : 'TRP-9903',
    tripId: e.tripId,
    amount: parseFloat(e.amount || 0),
    category,
    date: e.date ? e.date.slice(0, 10) : '2026-07-01'
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

  return { vehicleId: vehicle.id, tripId };
};

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
    return response.data.map(mapExpenseDbToFrontend);
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockExpenses.find((e) => e.id === id) || null;
    }
    const response = await axiosInstance.get(`/expenses/${id}`);
    return mapExpenseDbToFrontend(response.data);
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newItem = { id: `exp-${Date.now()}`, ...data };
      mockExpenses.push(newItem);
      return newItem;
    }
    const { vehicleId, tripId } = await resolveVehicleAndTrip(data.vehicleName, data.trip);
    let category = 'OTHER';
    if (data.category === 'Fuel') category = 'FUEL';
    else if (data.category === 'Maintenance') category = 'MAINTENANCE_COST';
    else if (data.category === 'Repairs') category = 'MAINTENANCE_COST';
    else if (data.category === 'Tolls') category = 'TOLL';

    const payload = {
      vehicleId,
      tripId,
      amount: Number(data.amount),
      category,
      date: data.date,
      description: data.expenseType
    };
    const response = await axiosInstance.post('/expenses', payload);
    return mapExpenseDbToFrontend(response.data);
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockExpenses.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Expense entry not found');
      mockExpenses[index] = { ...mockExpenses[index], ...data };
      return mockExpenses[index];
    }
    const { vehicleId, tripId } = await resolveVehicleAndTrip(data.vehicleName, data.trip);
    let category = 'OTHER';
    if (data.category === 'Fuel') category = 'FUEL';
    else if (data.category === 'Maintenance') category = 'MAINTENANCE_COST';
    else if (data.category === 'Repairs') category = 'MAINTENANCE_COST';
    else if (data.category === 'Tolls') category = 'TOLL';

    const payload = {
      vehicleId,
      tripId,
      amount: Number(data.amount),
      category,
      date: data.date,
      description: data.expenseType
    };
    const response = await axiosInstance.put(`/expenses/${id}`, payload);
    return mapExpenseDbToFrontend(response.data);
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockExpenses.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Expense entry not found');
      mockExpenses.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/expenses/${id}`);
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

  statistics: async () => {
    return {};
  }
};

export default expenseService;
