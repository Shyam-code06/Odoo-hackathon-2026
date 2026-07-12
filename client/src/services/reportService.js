import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import { downloadApiBlob } from '@/utils/exportUtils';

/**
 * Enterprise Fleet Reports Service
 */
export const reportService = {
  getFuelEfficiency: async () => {
    if (USE_MOCK_DATA) {
      return [];
    }
    const response = await axiosInstance.get('/reports/fuel-efficiency');
    return response.data;
  },

  getOperationalCost: async () => {
    if (USE_MOCK_DATA) {
      return [];
    }
    const response = await axiosInstance.get('/reports/operational-cost');
    return response.data;
  },

  getROI: async () => {
    if (USE_MOCK_DATA) {
      return [];
    }
    const response = await axiosInstance.get('/reports/roi');
    return response.data;
  },

  // Standard CRUD service interface
  getAll: async () => {
    const [fuel, cost, roi] = await Promise.all([
      reportService.getFuelEfficiency(),
      reportService.getOperationalCost(),
      reportService.getROI(),
    ]);
    return { fuel, cost, roi };
  },

  getById: async () => { return null; },
  create: async () => { return null; },
  update: async () => { return null; },
  delete: async () => { return { success: true }; },
  statistics: async () => { return {}; },

  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      return '';
    }
    const endpoint = format === 'pdf' ? '/reports/export/pdf' : '/reports/export/csv';
    const response = await axiosInstance.get(endpoint, {
      responseType: 'blob'
    });
    return downloadApiBlob(response, 'fleet_report', format);
  }
};

export default reportService;
