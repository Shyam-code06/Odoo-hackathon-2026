import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockDashboard from '@/data/dashboard.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';

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

  /**
   * Export dashboard statistics summary to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Convert dashboard stats into a flat array of key/value rows
      const statsArray = Object.entries(mockDashboard.stats).map(([key, stat]) => ({
        metric: key.replace(/([A-Z])/g, ' $1').trim(),
        value: stat.value,
        trend: stat.trend,
        status: stat.status
      }));
      return exportLocalData(statsArray, 'dashboard_report', format);
    }
    const response = await axiosInstance.get('/dashboard/export', {
      params: { format },
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'dashboard_report', format);
  },
};

export default dashboardService;
