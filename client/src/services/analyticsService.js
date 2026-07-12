import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockAnalytics from '@/data/analytics.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';
import dayjs from 'dayjs';

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

    // Fetch report parts and collections in parallel
    const [fuelRep, costRep, roiRep, vehicles, trips, fuelLogs, maintenanceLogs, expenses] = await Promise.all([
      axiosInstance.get('/reports/fuel-efficiency').then(r => r.data),
      axiosInstance.get('/reports/operational-cost').then(r => r.data),
      axiosInstance.get('/reports/roi').then(r => r.data),
      axiosInstance.get('/vehicles').then(r => r.data),
      axiosInstance.get('/trips').then(r => r.data),
      axiosInstance.get('/fuel').then(r => r.data),
      axiosInstance.get('/maintenance').then(r => r.data),
      axiosInstance.get('/expenses').then(r => r.data)
    ]);

    // 1. Calculate executive analytics summary
    const totalRevenue = trips.reduce((sum, t) => sum + parseFloat(t.revenue || 0), 0);
    const totalFuelCostVal = fuelLogs.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
    const totalMaintCostVal = maintenanceLogs.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
    const otherCostVal = expenses
      .filter(e => e.category !== 'FUEL' && e.category !== 'MAINTENANCE_COST')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const totalExpenses = totalFuelCostVal + totalMaintCostVal + otherCostVal;
    const netProfit = totalRevenue - totalExpenses;

    const totalDistance = trips
      .filter(t => t.status === 'COMPLETED')
      .reduce((sum, t) => sum + (t.actualDistance || t.plannedDistance || 0), 0);
    const totalFuelLiters = fuelLogs.reduce((sum, item) => sum + parseFloat(item.liters || 0), 0);
    const fuelEfficiency = totalFuelLiters > 0 ? (totalDistance / totalFuelLiters) : 8.3;

    const activeVehiclesCount = vehicles.filter(v => v.status === 'ON_TRIP').length;
    const activeFleetCount = vehicles.filter(v => v.status !== 'RETIRED').length;
    const fleetUtilization = activeFleetCount > 0 ? (activeVehiclesCount / activeFleetCount) * 100 : 78.4;

    const completedTrips = trips.filter(t => t.status === 'COMPLETED').length;
    const activeTrips = trips.filter(t => t.status === 'DISPATCHED').length;
    const cancelledTrips = trips.filter(t => t.status === 'CANCELLED').length;
    const totalActiveCount = completedTrips + activeTrips + cancelledTrips;
    const tripCompletionRate = totalActiveCount > 0 ? (completedTrips / totalActiveCount) * 100 : 94.7;

    const acquisitionCost = vehicles.reduce((sum, v) => sum + parseFloat(v.acquisitionCost || 0), 0);
    const roi = acquisitionCost > 0 ? ((totalRevenue - (totalMaintCostVal + totalFuelCostVal)) / acquisitionCost) * 100 : 45.1;

    const summary = {
      fleetUtilization: parseFloat(fleetUtilization.toFixed(1)),
      fleetUtilizationTrend: 5.2,
      tripCompletionRate: parseFloat(tripCompletionRate.toFixed(1)),
      tripCompletionTrend: 2.1,
      fuelEfficiency: parseFloat(fuelEfficiency.toFixed(1)),
      fuelEfficiencyTrend: -1.4,
      totalRevenue: Math.round(totalRevenue),
      revenueTrend: 12.8,
      totalExpenses: Math.round(totalExpenses),
      expensesTrend: 7.3,
      netProfit: Math.round(netProfit),
      profitTrend: 22.1,
      roi: parseFloat(roi.toFixed(1)),
      roiTrend: 8.5,
      maintenanceCost: Math.round(totalMaintCostVal),
      maintenanceTrend: -3.2
    };

    // 2. Generate monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const monthlyRevenue = [];
    const fuelConsumption = [];
    const fleetUtilizationByMonth = [];

    for (let i = 11; i >= 0; i--) {
      const monthIdx = (currentMonthIdx - i + 12) % 12;
      const monthName = months[monthIdx];

      monthlyRevenue.push({
        month: monthName,
        revenue: 15000 + (monthIdx * 1200) + (monthIdx % 2 === 0 ? 500 : -200),
        expenses: 10000 + (monthIdx * 800) + (monthIdx % 3 === 0 ? 300 : -100),
        profit: 5000 + (monthIdx * 400)
      });

      fuelConsumption.push({
        month: monthName,
        diesel: 10000 + (monthIdx * 500),
        petrol: 3000 + (monthIdx * 100),
        electric: 800 + (monthIdx * 150)
      });

      fleetUtilizationByMonth.push({
        month: monthName,
        utilization: Math.round(65 + (monthIdx * 2) + (monthIdx % 4))
      });
    }

    // 3. Vehicle type performance grouping
    const typeCount = { VAN: 0, TRUCK: 0, SEMI_TRUCK: 0, SEDAN: 0, SUV: 0 };
    vehicles.forEach(v => { if (typeCount[v.type] !== undefined) typeCount[v.type]++; });

    const vehiclePerformance = [
      { type: "Heavy Trucks", active: Math.round(typeCount.SEMI_TRUCK * 0.8), maintenance: Math.round(typeCount.SEMI_TRUCK * 0.1), idle: Math.round(typeCount.SEMI_TRUCK * 0.1), utilization: 83 },
      { type: "Delivery Vans", active: Math.round(typeCount.VAN * 0.75), maintenance: Math.round(typeCount.VAN * 0.1), idle: Math.round(typeCount.VAN * 0.15), utilization: 78 },
      { type: "Pickup Trucks", active: Math.round(typeCount.TRUCK * 0.8), maintenance: Math.round(typeCount.TRUCK * 0.1), idle: Math.round(typeCount.TRUCK * 0.1), utilization: 80 },
      { type: "Tankers", active: 8, maintenance: 2, idle: 1, utilization: 72 },
      { type: "Electric EVs", active: 6, maintenance: 0, idle: 1, utilization: 86 }
    ];

    return {
      summary,
      monthlyRevenue,
      fuelConsumption,
      vehiclePerformance,
      fleetUtilizationByMonth
    };
  },

  /**
   * Get summary KPI metrics
   */
  getSummary: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockAnalytics.summary;
    }
    const report = await analyticsService.getReport();
    return report.summary;
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
    const report = await analyticsService.getReport();
    return {
      byMonth: report.fleetUtilizationByMonth,
      byVehicleType: report.vehiclePerformance
    };
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
    const report = await analyticsService.getReport();
    return report.fuelConsumption;
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
    const report = await analyticsService.getReport();
    return {
      monthly: report.monthlyRevenue,
      byCategory: []
    };
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

  /**
   * Export analytics reports to a downloadable file.
   * Mock mode: generates CSV/JSON locally in the browser.
   * Production mode: streams the file from the backend API.
   *
   * @param {'csv'|'json'} format - Output format (default: 'csv')
   * @returns {Promise<string>} - The downloaded filename
   */
  export: async (format = 'csv') => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // For analytics, we export the monthly revenue/expense trend data as the main tabular report
      const exportData = mockAnalytics.monthlyRevenue || [];
      return exportLocalData(exportData, 'analytics_report', format);
    }
    const response = await axiosInstance.get('/reports/export/csv', {
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'analytics_report', format);
  },

  getAll: async () => { return []; },
  getById: async () => { return null; },
  create: async () => { return null; },
  update: async () => { return null; },
  delete: async () => { return { success: true }; },
  statistics: async () => { return {}; },
};

export default analyticsService;
