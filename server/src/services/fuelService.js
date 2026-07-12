const prisma = require('../config/db');

const getFuelLogs = async (query = {}) => {
  const { vehicleId, tripId } = query;
  const where = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (tripId) where.tripId = tripId;

  return prisma.fuelLog.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      vehicle: true,
      trip: true,
    },
  });
};

const getFuelLogById = async (id) => {
  const log = await prisma.fuelLog.findUnique({
    where: { id },
    include: { vehicle: true },
  });
  if (!log) {
    throw new Error('Fuel log not found.');
  }
  return log;
};

const createFuelLog = async (data) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) {
    throw new Error('Vehicle not found.');
  }

  // Record fuel log and log it as an Expense under FUEL category automatically
  return prisma.$transaction(async (tx) => {
    const fuelLog = await tx.fuelLog.create({
      data: {
        liters: parseFloat(data.liters),
        cost: parseFloat(data.cost),
        date: data.date ? new Date(data.date) : new Date(),
        odometer: parseFloat(data.odometer || vehicle.odometer),
        vehicleId: data.vehicleId,
        tripId: data.tripId || null,
      },
    });

    await tx.expense.create({
      data: {
        amount: parseFloat(data.cost),
        category: 'FUEL',
        date: data.date ? new Date(data.date) : new Date(),
        description: `Fuel Refill: ${data.liters}L`,
        vehicleId: data.vehicleId,
        tripId: data.tripId || null,
      },
    });

    return fuelLog;
  });
};

const updateFuelLog = async (id, data) => {
  const log = await getFuelLogById(id);

  const updatedData = { ...data };
  if (data.liters !== undefined) updatedData.liters = parseFloat(data.liters);
  if (data.cost !== undefined) updatedData.cost = parseFloat(data.cost);
  if (data.odometer !== undefined) updatedData.odometer = parseFloat(data.odometer);
  if (data.date) updatedData.date = new Date(data.date);

  return prisma.fuelLog.update({
    where: { id },
    data: updatedData,
  });
};

const deleteFuelLog = async (id) => {
  await getFuelLogById(id);
  return prisma.fuelLog.delete({
    where: { id },
  });
};

module.exports = {
  getFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
};
