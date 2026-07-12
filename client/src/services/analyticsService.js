import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockAnalytics from '@/data/analytics.json';

/**
 * Analytics and Performance Reporting Service
 */
export const analyticsService = {
  getReport: async (timeframe = 'monthly') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockAnalytics;
    }
    const response = await axiosInstance.get('/analytics/report', { params: { timeframe } });
    return response.data;
  },
};

export default analyticsService;
