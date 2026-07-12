const prisma = require('../config/db');

const getMaintenanceLogs = async (query = {}) => {
  const { isClosed, vehicleId } = query;
  
  const where = {};
  if (isClosed !== undefined) where.isClosed = isClosed === 'true';
  if (vehicleId) where.vehicleId = vehicleId;

  return prisma.maintenanceLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      vehicle: true,
    },
  });
};

const getMaintenanceLogById = async (id) => {
  const log = await prisma.maintenanceLog.findUnique({
    where: { id },
    include: { vehicle: true },
  });
  if (!log) {
    throw new Error('Maintenance log not found.');
  }
  return log;
};

const createMaintenanceLog = async (data) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) {
    throw new Error('Vehicle not found.');
  }
  if (vehicle.status === 'ON_TRIP') {
    throw new Error('Cannot put vehicle into maintenance while it is on an active trip.');
  }
  if (vehicle.status === 'RETIRED') {
    throw new Error('Cannot perform maintenance on a retired vehicle.');
  }

  return prisma.$transaction(async (tx) => {
    // 1. Create Maintenance Log
    const log = await tx.maintenanceLog.create({
      data: {
        description: data.description,
        cost: parseFloat(data.cost || 0),
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        isClosed: false,
        vehicleId: data.vehicleId,
      },
    });

    // 2. Change vehicle status to IN_SHOP
    await tx.vehicle.update({
      where: { id: data.vehicleId },
      data: { status: 'IN_SHOP' },
    });

    return log;
  });
};

const completeMaintenanceLog = async (id, data) => {
  const log = await getMaintenanceLogById(id);
  if (log.isClosed) {
    throw new Error('Maintenance log is already closed.');
  }

  const cost = data.cost !== undefined ? parseFloat(data.cost) : parseFloat(log.cost);
  const description = data.description || log.description;

  return prisma.$transaction(async (tx) => {
    // 1. Close the maintenance log
    const updatedLog = await tx.maintenanceLog.update({
      where: { id },
      data: {
        cost,
        description,
        isClosed: true,
        endDate: data.endDate ? new Date(data.endDate) : new Date(),
      },
    });

    // 2. Check if vehicle is retired before changing its status back to AVAILABLE
    const vehicle = await tx.vehicle.findUnique({ where: { id: log.vehicleId } });
    if (vehicle && vehicle.status !== 'RETIRED') {
      await tx.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    // 3. Log this maintenance cost as an Expense automatically
    await tx.expense.create({
      data: {
        amount: cost,
        category: 'MAINTENANCE_COST',
        description: `Maintenance Closed: ${description}`,
        vehicleId: log.vehicleId,
      },
    });

    return updatedLog;
  });
};

const deleteMaintenanceLog = async (id) => {
  const log = await getMaintenanceLogById(id);
  
  return prisma.$transaction(async (tx) => {
    // Delete log
    const deletedLog = await tx.maintenanceLog.delete({
      where: { id },
    });

    // If it was open, restore vehicle back to AVAILABLE
    if (!log.isClosed) {
      const vehicle = await tx.vehicle.findUnique({ where: { id: log.vehicleId } });
      if (vehicle && vehicle.status === 'IN_SHOP') {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: 'AVAILABLE' },
        });
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
