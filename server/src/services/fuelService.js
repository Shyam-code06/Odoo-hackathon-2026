const prisma = require('../config/db');

const getFuelLogs = async (query = {}, fleetManagerId) => {
  const { vehicleId, tripId } = query;
  const where = { fleetManagerId };
  if (vehicleId) where.vehicleId = vehicleId;
  if (tripId) where.tripId = tripId;

  return prisma.fuelLog.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { vehicle: true, trip: true },
  });
};

const getFuelLogById = async (id, fleetManagerId) => {
  const log = await prisma.fuelLog.findFirst({
    where: { id, fleetManagerId },
    include: { vehicle: true },
  });
  if (!log) throw new Error('Fuel log not found.');
  return log;
};

const createFuelLog = async (data, fleetManagerId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: data.vehicleId, fleetManagerId },
  });
  if (!vehicle) throw new Error('Vehicle not found.');

  return prisma.$transaction(async (tx) => {
    const fuelLog = await tx.fuelLog.create({
      data: {
        liters: parseFloat(data.liters),
        cost: parseFloat(data.cost),
        date: data.date ? new Date(data.date) : new Date(),
        odometer: parseFloat(data.odometer || vehicle.odometer),
        vehicleId: data.vehicleId,
        tripId: data.tripId || null,
        fleetManagerId,
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
        fleetManagerId,
      },
    });

    return fuelLog;
  });
};

const updateFuelLog = async (id, data, fleetManagerId) => {
  await getFuelLogById(id, fleetManagerId);

  const updatedData = { ...data };
  delete updatedData.fleetManagerId;
  if (data.liters !== undefined) updatedData.liters = parseFloat(data.liters);
  if (data.cost !== undefined) updatedData.cost = parseFloat(data.cost);
  if (data.odometer !== undefined) updatedData.odometer = parseFloat(data.odometer);
  if (data.date) updatedData.date = new Date(data.date);

  return prisma.fuelLog.update({ where: { id }, data: updatedData });
};

const deleteFuelLog = async (id, fleetManagerId) => {
  await getFuelLogById(id, fleetManagerId);
  return prisma.fuelLog.delete({ where: { id } });
};

module.exports = {
  getFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
};
