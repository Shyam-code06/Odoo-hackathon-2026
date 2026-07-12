import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockAnalytics from '@/data/analytics.json';

/**
 * Analytics and Performance Reporting Service
 * Switch USE_MOCK_DATA to false in config/api.js to route to real backend.
 */
export const analyticsService = {
  /**
   * Get full analytics report (fleet utilization, revenue, expenses, etc.)
   */
  getReport: async (timeframe = 'monthly') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockAnalytics;
    }
    const response = await axiosInstance.get('/analytics/report', { params: { timeframe } });
    return response.data;
  },

  /**
   * Get summary KPI metrics
   */
  getSummary: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnalytics.summary;
    }
    const response = await axiosInstance.get('/analytics/summary');
    return response.data;
  },

  /**
   * Get fleet utilization over time
   */
  getFleetUtilization: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        byMonth: mockAnalytics.fleetUtilizationByMonth,
        byVehicleType: mockAnalytics.vehiclePerformance,
      };
    }
    const response = await axiosInstance.get('/analytics/fleet-utilization', { params });
    return response.data;
  },

  /**
   * Get driver performance metrics
   */
  getDriverPerformance: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockAnalytics.driverPerformance;
    }
    const response = await axiosInstance.get('/analytics/driver-performance', { params });
    return response.data;
  },

  /**
   * Get fuel consumption breakdown
   */
  getFuelConsumption: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      return mockAnalytics.fuelConsumption;
    }
    const response = await axiosInstance.get('/analytics/fuel-consumption', { params });
    return response.data;
  },

  /**
   * Get financial summary (revenue, expenses, profit)
   */
  getFinancialSummary: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return {
        monthly: mockAnalytics.monthlyRevenue,
        byCategory: mockAnalytics.expensesByCategory,
      };
    }
    const response = await axiosInstance.get('/analytics/financial-summary', { params });
    return response.data;
  },

  /**
   * Get maintenance cost breakdown
   */
  getMaintenanceCosts: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnalytics.maintenanceCosts;
    }
    const response = await axiosInstance.get('/analytics/maintenance-costs', { params });
    return response.data;
  },

  /**
   * Get trip completion statistics
   */
  getTripStats: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnalytics.tripStatus;
    }
    const response = await axiosInstance.get('/analytics/trip-stats', { params });
    return response.data;
  },

  /**
   * Get KPI targets vs actuals
   */
  getKpiTargets: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnalytics.kpiTargets;
    }
    const response = await axiosInstance.get('/analytics/kpi-targets');
    return response.data;
  },
};

export default analyticsService;
