const prisma = require('../config/db');

const getMaintenanceLogs = async (query = {}, fleetManagerId) => {
  const { isClosed, vehicleId } = query;

  const where = { fleetManagerId };
  if (isClosed !== undefined) where.isClosed = isClosed === 'true';
  if (vehicleId) where.vehicleId = vehicleId;

  return prisma.maintenanceLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { vehicle: true },
  });
};

const getMaintenanceLogById = async (id, fleetManagerId) => {
  const log = await prisma.maintenanceLog.findFirst({
    where: { id, fleetManagerId },
    include: { vehicle: true },
  });
  if (!log) throw new Error('Maintenance log not found.');
  return log;
};

const createMaintenanceLog = async (data, fleetManagerId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: data.vehicleId, fleetManagerId },
  });
  if (!vehicle) throw new Error('Vehicle not found.');
  if (vehicle.status === 'ON_TRIP') {
    throw new Error('Cannot put vehicle into maintenance while it is on an active trip.');
  }
  if (vehicle.status === 'RETIRED') {
    throw new Error('Cannot perform maintenance on a retired vehicle.');
  }

  return prisma.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.create({
      data: {
        description: data.description,
        cost: parseFloat(data.cost || 0),
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        isClosed: false,
        vehicleId: data.vehicleId,
        fleetManagerId,
      },
    });

    await tx.vehicle.update({
      where: { id: data.vehicleId },
      data: { status: 'IN_SHOP' },
    });

    return log;
  });
};

const completeMaintenanceLog = async (id, data, fleetManagerId) => {
  const log = await getMaintenanceLogById(id, fleetManagerId);
  if (log.isClosed) throw new Error('Maintenance log is already closed.');

  const cost = data.cost !== undefined ? parseFloat(data.cost) : parseFloat(log.cost);
  const description = data.description || log.description;

  return prisma.$transaction(async (tx) => {
    const updatedLog = await tx.maintenanceLog.update({
      where: { id },
      data: {
        cost,
        description,
        isClosed: true,
        endDate: data.endDate ? new Date(data.endDate) : new Date(),
      },
    });

    const vehicle = await tx.vehicle.findUnique({ where: { id: log.vehicleId } });
    if (vehicle && vehicle.status !== 'RETIRED') {
      await tx.vehicle.update({ where: { id: log.vehicleId }, data: { status: 'AVAILABLE' } });
    }

    await tx.expense.create({
      data: {
        amount: cost,
        category: 'MAINTENANCE_COST',
        description: `Maintenance Closed: ${description}`,
        vehicleId: log.vehicleId,
        fleetManagerId,
      },
    });

    return updatedLog;
  });
};

const deleteMaintenanceLog = async (id, fleetManagerId) => {
  const log = await getMaintenanceLogById(id, fleetManagerId);

  return prisma.$transaction(async (tx) => {
    const deletedLog = await tx.maintenanceLog.delete({ where: { id } });

    if (!log.isClosed) {
      const vehicle = await tx.vehicle.findUnique({ where: { id: log.vehicleId } });
      if (vehicle && vehicle.status === 'IN_SHOP') {
        await tx.vehicle.update({ where: { id: log.vehicleId }, data: { status: 'AVAILABLE' } });
      }
    }

    return deletedLog;
  });
};

module.exports = {
  getMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  completeMaintenanceLog,
  deleteMaintenanceLog,
};
