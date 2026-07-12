const prisma = require('../config/db');

const getDashboardKPIs = async (filters = {}, fleetManagerId) => {
  const { type, region } = filters;

  const vehicleWhere = { fleetManagerId };
  if (type) vehicleWhere.type = type;
  if (region) vehicleWhere.region = region;

  const vehicles = await prisma.vehicle.findMany({ where: vehicleWhere });

  const totalVehiclesCount = vehicles.length;
  const activeVehiclesCount = vehicles.filter(v => v.status === 'ON_TRIP').length;
  const availableVehiclesCount = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const maintenanceVehiclesCount = vehicles.filter(v => v.status === 'IN_SHOP').length;
  const retiredVehiclesCount = vehicles.filter(v => v.status === 'RETIRED').length;

  const tripWhere = { fleetManagerId };
  if (totalVehiclesCount > 0 && (type || region)) {
    tripWhere.vehicleId = { in: vehicles.map(v => v.id) };
  }

  const trips = await prisma.trip.findMany({ where: tripWhere });

  const activeTripsCount = trips.filter(t => t.status === 'DISPATCHED').length;
  const pendingTripsCount = trips.filter(t => t.status === 'DRAFT').length;

  const driversCount = await prisma.driver.count({
    where: { fleetManagerId, status: 'ON_TRIP' },
  });

  const activeFleetCount = totalVehiclesCount - retiredVehiclesCount;
  const fleetUtilization = activeFleetCount > 0 ? (activeVehiclesCount / activeFleetCount) * 100 : 0;

  return {
    activeVehicles: activeVehiclesCount,
    availableVehicles: availableVehiclesCount,
    vehiclesInMaintenance: maintenanceVehiclesCount,
    activeTrips: activeTripsCount,
    pendingTrips: pendingTripsCount,
    driversOnDuty: driversCount,
    fleetUtilization: parseFloat(fleetUtilization.toFixed(2)),
    totalNonRetiredVehicles: activeFleetCount,
  };
};

const getDashboardCharts = async (fleetManagerId) => {
  // 1. Expenses by Category
  const expensesGrouped = await prisma.expense.groupBy({
    by: ['category'],
    where: { fleetManagerId },
    _sum: { amount: true },
  });

  const expensesByCategory = expensesGrouped.map(item => ({
    category: item.category,
    amount: item._sum.amount ? parseFloat(item._sum.amount) : 0,
  }));

  // 2. Trips over time (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const trips = await prisma.trip.findMany({
    where: {
      fleetManagerId,
      createdAt: { gte: sixMonthsAgo },
    },
    select: { createdAt: true, status: true },
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const tripsOverTime = {};

  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    tripsOverTime[label] = { label, count: 0 };
  }

  trips.forEach(t => {
    const date = new Date(t.createdAt);
    const label = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
    if (tripsOverTime[label]) tripsOverTime[label].count += 1;
  });

  // 3. Vehicles status breakdown
  const statusBreakdown = await prisma.vehicle.groupBy({
    by: ['status'],
    where: { fleetManagerId },
    _count: { id: true },
  });

  const vehiclesStatus = statusBreakdown.map(item => ({
    status: item.status,
    count: item._count.id,
  }));

  return {
    expensesByCategory,
    tripsOverTime: Object.values(tripsOverTime).reverse(),
    vehiclesStatus,
  };
};

module.exports = {
  getDashboardKPIs,
  getDashboardCharts,
};
