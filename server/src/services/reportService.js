const prisma = require('../config/db');

const getVehiclesReportData = async (fleetManagerId) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { fleetManagerId },
    include: {
      trips: {
        where: { status: 'COMPLETED' },
      },
      fuelLogs: true,
      maintenanceLogs: {
        where: { isClosed: true },
      },
      expenses: true,
    },
  });

  return vehicles.map(vehicle => {
    // 1. Total Distance on Completed Trips
    const totalDistance = vehicle.trips.reduce((sum, trip) => sum + (trip.actualDistance || 0), 0);

    // 2. Total Fuel Liters
    const totalFuelLiters = vehicle.fuelLogs.reduce((sum, log) => sum + log.liters, 0);

    // 3. Fuel Efficiency (km / Liter)
    const fuelEfficiency = totalFuelLiters > 0 ? totalDistance / totalFuelLiters : 0;

    // 4. Financial Calculations
    const totalRevenue = vehicle.trips.reduce((sum, trip) => sum + parseFloat(trip.revenue || 0), 0);

    // Maintenance Costs from MaintenanceLogs
    const maintenanceCost = vehicle.maintenanceLogs.reduce((sum, log) => sum + parseFloat(log.cost || 0), 0);

    // Fuel Costs from FuelLogs
    const fuelCost = vehicle.fuelLogs.reduce((sum, log) => sum + parseFloat(log.cost || 0), 0);

    // Other Expenses (excluding FUEL and MAINTENANCE_COST to prevent double counting if they are logged both ways)
    const otherCost = vehicle.expenses
      .filter(exp => exp.category !== 'FUEL' && exp.category !== 'MAINTENANCE_COST')
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    const totalOperationalCost = maintenanceCost + fuelCost + otherCost;

    // 5. Vehicle ROI: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
    const acquisitionCost = parseFloat(vehicle.acquisitionCost || 0);
    const roi = acquisitionCost > 0 ? (totalRevenue - (maintenanceCost + fuelCost)) / acquisitionCost : 0;

    return {
      id: vehicle.id,
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      type: vehicle.type,
      status: vehicle.status,
      acquisitionCost,
      totalDistance,
      totalFuelLiters,
      fuelEfficiency: parseFloat(fuelEfficiency.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      maintenanceCost: parseFloat(maintenanceCost.toFixed(2)),
      fuelCost: parseFloat(fuelCost.toFixed(2)),
      otherCost: parseFloat(otherCost.toFixed(2)),
      totalOperationalCost: parseFloat(totalOperationalCost.toFixed(2)),
      roi: parseFloat((roi * 100).toFixed(2)), // ROI in percentage
    };
  });
};

const getFuelEfficiencyReport = async (fleetManagerId) => {
  const data = await getVehiclesReportData(fleetManagerId);
  return data.map(v => ({
    id: v.id,
    registrationNumber: v.registrationNumber,
    model: v.model,
    type: v.type,
    totalDistance: v.totalDistance,
    totalFuelLiters: v.totalFuelLiters,
    fuelEfficiency: v.fuelEfficiency,
  }));
};

const getOperationalCostReport = async (fleetManagerId) => {
  const data = await getVehiclesReportData(fleetManagerId);
  return data.map(v => ({
    id: v.id,
    registrationNumber: v.registrationNumber,
    model: v.model,
    maintenanceCost: v.maintenanceCost,
    fuelCost: v.fuelCost,
    otherCost: v.otherCost,
    totalOperationalCost: v.totalOperationalCost,
  }));
};

const getROIReport = async (fleetManagerId) => {
  const data = await getVehiclesReportData(fleetManagerId);
  return data.map(v => ({
    id: v.id,
    registrationNumber: v.registrationNumber,
    model: v.model,
    acquisitionCost: v.acquisitionCost,
    totalRevenue: v.totalRevenue,
    maintenanceCost: v.maintenanceCost,
    fuelCost: v.fuelCost,
    roiPercent: v.roi,
  }));
};

const exportCSV = async (fleetManagerId) => {
  const data = await getVehiclesReportData(fleetManagerId);
  
  // Format CSV
  const headers = [
    'Registration Number',
    'Model',
    'Type',
    'Status',
    'Acquisition Cost ($)',
    'Total Distance (km)',
    'Fuel Consumed (L)',
    'Fuel Efficiency (km/L)',
    'Total Revenue ($)',
    'Maintenance Cost ($)',
    'Fuel Cost ($)',
    'Total Operational Cost ($)',
    'ROI (%)'
  ];

  const rows = data.map(v => [
    v.registrationNumber,
    `"${v.model.replace(/"/g, '""')}"`,
    v.type,
    v.status,
    v.acquisitionCost,
    v.totalDistance,
    v.totalFuelLiters,
    v.fuelEfficiency,
    v.totalRevenue,
    v.maintenanceCost,
    v.fuelCost,
    v.totalOperationalCost,
    v.roi
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

module.exports = {
  getVehiclesReportData,
  getFuelEfficiencyReport,
  getOperationalCostReport,
  getROIReport,
  exportCSV,
};
