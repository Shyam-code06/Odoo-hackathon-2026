import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockDashboard from '@/data/dashboard.json';

/**
 * Dashboard Operations Service
 */
export const dashboardService = {
  getOverviewData: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return mockDashboard;
    }
    const response = await axiosInstance.get('/dashboard/overview');
    return response.data;
  },
};

export default dashboardService;
