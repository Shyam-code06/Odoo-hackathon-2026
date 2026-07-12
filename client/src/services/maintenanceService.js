import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockMaintenance from '@/data/maintenance.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';
import { vehicleService } from './vehicleService';

// Helper to map DB maintenance format to frontend format
const mapMaintenanceDbToFrontend = (m) => {
  if (!m) return null;
  
  const parts = m.description ? m.description.split(' | ') : [];
  const maintenanceType = parts[0] || 'Scheduled Service';
  const description = parts.slice(1).join(' | ') || m.description || '';
  
  const status = m.isClosed ? 'completed' : 'pending';
  
  return {
    id: m.id,
    vehicleId: m.vehicleId,
    vehicleName: m.vehicle ? `${m.vehicle.make} ${m.vehicle.model} (${m.vehicle.registrationNumber})` : 'Unknown Vehicle',
    maintenanceType,
    description,
    cost: parseFloat(m.cost || 0),
    status,
    startDate: m.startDate ? m.startDate.slice(0, 10) : '',
    endDate: m.endDate ? m.endDate.slice(0, 10) : ''
  };
};

// Helper to resolve vehicle ID from name string
const resolveVehicleIdFromName = async (vehicleName) => {
  if (!vehicleName) return null;
  const vehicles = await vehicleService.getAll();
  const vehicle = vehicles.find(v => `${v.make} ${v.model} (${v.plateNumber})` === vehicleName);
  return vehicle ? vehicle.id : null;
};

/**
 * Maintenance Log Operations Service
 */
export const maintenanceService = {
  getAll: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockMaintenance;
    }
    const response = await axiosInstance.get('/maintenance', { params: filters });
    return response.data.map(mapMaintenanceDbToFrontend);
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockMaintenance.find((m) => m.id === id) || null;
    }
    const response = await axiosInstance.get(`/maintenance/${id}`);
    return mapMaintenanceDbToFrontend(response.data);
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newItem = { id: `maint-${Date.now()}`, ...data };
      mockMaintenance.push(newItem);
      return newItem;
    }
    
    const vehicleId = await resolveVehicleIdFromName(data.vehicleName);
    if (!vehicleId) throw new Error('Selected vehicle not found.');

    const payload = {
      description: `${data.maintenanceType} | ${data.description}`,
      cost: Number(data.cost),
      startDate: data.startDate,
      vehicleId
    };

    const response = await axiosInstance.post('/maintenance', payload);
    const createdLog = response.data;

    // If status is completed upon creation, call complete endpoint immediately
    if (data.status === 'completed') {
      const completeResponse = await axiosInstance.put(`/maintenance/${createdLog.id}/complete`, {
        cost: Number(data.cost),
        description: `${data.maintenanceType} | ${data.description}`,
        endDate: data.endDate
      });
      return mapMaintenanceDbToFrontend(completeResponse.data);
    }

    return mapMaintenanceDbToFrontend(createdLog);
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const index = mockMaintenance.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Maintenance entry not found');
      mockMaintenance[index] = { ...mockMaintenance[index], ...data };
      return mockMaintenance[index];
    }

    if (data.status === 'completed') {
      const response = await axiosInstance.put(`/maintenance/${id}/complete`, {
        cost: Number(data.cost),
        description: `${data.maintenanceType} | ${data.description}`,
        endDate: data.endDate
      });
      return mapMaintenanceDbToFrontend(response.data);
    }

    // Since backend does not support PUT /maintenance/:id without completion,
    // we delete and recreate to save changes on pending items.
    const vehicleId = await resolveVehicleIdFromName(data.vehicleName);
    if (!vehicleId) throw new Error('Selected vehicle not found.');

    await axiosInstance.delete(`/maintenance/${id}`);
    
    const createPayload = {
      description: `${data.maintenanceType} | ${data.description}`,
      cost: Number(data.cost),
      startDate: data.startDate,
      vehicleId
    };

    const response = await axiosInstance.post('/maintenance', createPayload);
    return mapMaintenanceDbToFrontend(response.data);
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockMaintenance.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Maintenance entry not found');
      mockMaintenance.splice(index, 1);
      return { success: true };
    }
    const response = await axiosInstance.delete(`/maintenance/${id}`);
    return response.data;
  },

  /**
   * Export maintenance records to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return exportLocalData(mockMaintenance, 'maintenance_report', format);
    }
    const response = await axiosInstance.get('/maintenance/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'maintenance_report', format);
  },

  statistics: async () => {
    return {};
  }
};

export default maintenanceService;
