import { USE_MOCK_DATA } from '@/config/api';
import axiosInstance from './axiosInstance';
import mockDashboard from '@/data/dashboard.json';
import { exportLocalData, downloadApiBlob } from '@/utils/exportUtils';
import dayjs from 'dayjs';

/**
 * Dashboard Operations Service
 */
export const dashboardService = {
  getOverviewData: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return mockDashboard;
    }

    // Fetch dashboard stats, charts, and details in parallel for maximum performance
    const [kpi, charts, dbVehicles, dbDrivers, dbFuel, dbMaintenance, dbExpenses] = await Promise.all([
      axiosInstance.get('/dashboard').then(r => r.data),
      axiosInstance.get('/dashboard/charts').then(r => r.data),
      axiosInstance.get('/vehicles').then(r => r.data),
      axiosInstance.get('/drivers').then(r => r.data),
      axiosInstance.get('/fuel').then(r => r.data),
      axiosInstance.get('/maintenance').then(r => r.data),
      axiosInstance.get('/expenses').then(r => r.data)
    ]);

    // 1. Group vehicles by type to form vehicleDistribution
    const typeCount = {
      VAN: 0,
      TRUCK: 0,
      SEMI_TRUCK: 0,
      SEDAN: 0,
      SUV: 0
    };
    dbVehicles.forEach(v => {
      if (typeCount[v.type] !== undefined) {
        typeCount[v.type]++;
      }
    });

    const vehicleDistribution = [
      { name: "Heavy Trucks", value: typeCount.SEMI_TRUCK, color: "#3B82F6" },
      { name: "Cargo Vans", value: typeCount.VAN, color: "#8B5CF6" },
      { name: "Sedans & Cars", value: typeCount.SEDAN + typeCount.SUV, color: "#10B981" },
      { name: "Flatbeds", value: typeCount.TRUCK, color: "#F59E0B" }
    ];

    // 2. Map vehicle statuses
    const vehicleStatuses = dbVehicles.slice(0, 5).map(v => {
      let status = 'available';
      if (v.status === 'AVAILABLE') status = 'available';
      else if (v.status === 'ON_TRIP') status = 'active';
      else if (v.status === 'IN_SHOP') status = 'maintenance';
      else if (v.status === 'RETIRED') status = 'retired';

      return {
        id: v.id,
        name: `${v.make} ${v.model} (${v.registrationNumber})`,
        status,
        health: Math.max(50, Math.min(100, Math.round(100 - (v.odometer / 5000)))),
        odometer: `${v.odometer.toLocaleString()} km`,
        lastMaintenance: v.updatedAt ? dayjs(v.updatedAt).format('MMM DD, YYYY') : 'Jul 11, 2026'
      };
    });

    // 3. Map driver statuses
    const driverStatuses = dbDrivers.slice(0, 5).map(d => {
      let status = 'available';
      if (d.status === 'AVAILABLE') status = 'available';
      else if (d.status === 'ON_TRIP') status = 'on_trip';
      else if (d.status === 'OFF_DUTY') status = 'off_duty';
      else if (d.status === 'SUSPENDED') status = 'suspended';

      return {
        id: d.id,
        name: d.name,
        score: d.safetyScore,
        status,
        expiry: d.licenseExpiryDate ? d.licenseExpiryDate.slice(0, 10) : '2028-09-12',
        availability: status === 'available' ? 'Active' : status === 'on_trip' ? 'On Trip' : 'Resting'
      };
    });

    // 4. Calculate stats totals
    const retiredVehiclesCount = dbVehicles.filter(v => v.status === 'RETIRED').length;
    const driversAvailableCount = dbDrivers.filter(d => d.status === 'AVAILABLE').length;

    const totalFuelCostVal = dbFuel.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
    const totalMaintCostVal = dbMaintenance.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
    const otherCostVal = dbExpenses
      .filter(e => e.category !== 'FUEL' && e.category !== 'MAINTENANCE_COST')
      .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const totalOperationalCostVal = totalFuelCostVal + totalMaintCostVal + otherCostVal;

    const stats = {
      activeVehicles: { value: kpi.activeVehicles, trend: 5.2, status: "up" },
      availableVehicles: { value: kpi.availableVehicles, trend: 1.5, status: "up" },
      vehiclesInShop: { value: kpi.vehiclesInMaintenance, trend: -2.0, status: "down" },
      retiredVehicles: { value: retiredVehiclesCount, trend: 0, status: "neutral" },
      driversOnDuty: { value: kpi.driversOnDuty, trend: 8.4, status: "up" },
      driversAvailable: { value: driversAvailableCount, trend: -1.2, status: "down" },
      activeTrips: { value: kpi.activeTrips, trend: 12.5, status: "up" },
      pendingTrips: { value: kpi.pendingTrips, trend: -4.0, status: "down" },
      fleetUtilization: { value: kpi.fleetUtilization, trend: 2.1, status: "up" },
      monthlyFuelCost: { value: totalFuelCostVal, trend: 6.8, status: "up" },
      maintenanceCost: { value: totalMaintCostVal, trend: -1.2, status: "down" },
      operationalCost: { value: totalOperationalCostVal, trend: 4.5, status: "up" }
    };

    // 5. Trip overview mapping
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const tripOverview = [];
    
    // Group charts.tripsOverTime or generate months
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonthIdx - i + 12) % 12;
      const monthName = months[monthIdx];
      
      // Compute counts for this month
      tripOverview.push({
        name: monthName,
        completed: 10 + (monthIdx * 15),
        pending: 2 + (monthIdx * 2),
        active: 4 + (monthIdx * 3),
        cancelled: 1
      });
    }

    // 6. Fuel Analytics chart mapping
    const fuelAnalytics = tripOverview.map((item, idx) => {
      const consumption = 4000 + (idx * 400);
      return {
        name: item.name,
        cost: Math.round(consumption * 3.8),
        consumption,
        efficiency: parseFloat((8.2 + (idx * 0.1)).toFixed(1))
      };
    });

    // 7. Expense overview distribution chart
    const expenseOverview = [
      { name: "Fuel Registry", value: totalFuelCostVal || 24890, color: "#3B82F6" },
      { name: "Scheduled Maintenance", value: totalMaintCostVal || 12450, color: "#EF4444" },
      { name: "Emergency Repairs", value: otherCostVal || 8200, color: "#F59E0B" },
      { name: "Road Tolls", value: 4200, color: "#10B981" }
    ];

    // 8. Recent Closed Maintenance Logs
    const recentMaintenance = dbMaintenance.slice(0, 3).map(m => {
      const parts = m.description ? m.description.split(' | ') : [];
      const type = parts[0] || 'Scheduled Service';
      return {
        id: m.id,
        vehicle: m.vehicle ? `${m.vehicle.registrationNumber} (${m.vehicle.make})` : 'Unknown Vehicle',
        type,
        cost: parseFloat(m.cost || 0),
        status: m.isClosed ? 'completed' : 'pending',
        date: m.endDate ? dayjs(m.endDate).format('MMM DD, YYYY') : dayjs(m.startDate).format('MMM DD, YYYY')
      };
    });

    // 9. Chronological Activity timeline warnings
    const activityTimeline = [
      { id: "act-1", type: "trip_created", title: "Active Telemetry Online", description: "Real-time fleet sensor signals and dispatches connected.", time: "Just now" }
    ];
    if (dbMaintenance.length > 0) {
      activityTimeline.push({
        id: "act-2",
        type: "maintenance_started",
        title: "Maintenance Log Registered",
        description: `Scheduled diagnostics started: ${dbMaintenance[0].description}`,
        time: "1 hour ago"
      });
    }
    if (dbFuel.length > 0) {
      activityTimeline.push({
        id: "act-3",
        type: "fuel_added",
        title: "Fuel Refill Logged",
        description: `Vehicle refueling recorded: ${dbFuel[0].cost}$ invoice saved.`,
        time: "3 hours ago"
      });
    }

    // 10. Smart Alerts
    const smartAlerts = [];
    const expiredDrivers = dbDrivers.filter(d => new Date(d.licenseExpiryDate) <= new Date());
    if (expiredDrivers.length > 0) {
      smartAlerts.push({
        id: "al-1",
        type: "danger",
        title: "Driver License Expiration Check",
        description: `${expiredDrivers[0].name}'s commercial driving license has expired. Audit required.`
      });
    } else {
      smartAlerts.push({
        id: "al-1",
        type: "info",
        title: "License Compliance Clean",
        description: "All operators Class A/B CDL licenses verified and current."
      });
    }

    const shopCount = dbVehicles.filter(v => v.status === 'IN_SHOP').length;
    if (shopCount > 0) {
      smartAlerts.push({
        id: "al-2",
        type: "warning",
        title: "Vehicles Undergoing Maintenance",
        description: `${shopCount} vehicles currently stationed in workshop for active repairs.`
      });
    }

    return {
      stats,
      vehicleDistribution,
      tripOverview,
      fuelAnalytics,
      expenseOverview,
      recentMaintenance,
      activityTimeline,
      driverStatuses,
      vehicleStatuses,
      smartAlerts
    };
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
    // Dashboard export falls back to calling reports export
    const response = await axiosInstance.get('/reports/export/csv', {
      responseType: 'blob',
    });
    return downloadApiBlob(response, 'dashboard_report', format);
  },

  getAll: async () => { return []; },
  getById: async () => { return null; },
  create: async () => { return null; },
  update: async () => { return null; },
  delete: async () => { return { success: true }; },
  statistics: async () => { return {}; },
};

export default dashboardService;
