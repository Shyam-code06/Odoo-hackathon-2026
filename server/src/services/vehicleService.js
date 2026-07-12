const prisma = require('../config/db');

const getVehicles = async (query = {}) => {
  const { search, type, status, region, sortBy, order } = query;
  
  const where = {};
  
  if (type) where.type = type;
  if (status) where.status = status;
  if (region) where.region = region;
  
  if (search) {
    where.OR = [
      { registrationNumber: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  return prisma.vehicle.findMany({
    where,
    orderBy,
  });
};

const getAvailableVehicles = async () => {
  return prisma.vehicle.findMany({
    where: {
      status: 'AVAILABLE',
    },
    orderBy: {
      registrationNumber: 'asc',
    },
  });
};

const getVehicleById = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      documents: true,
      maintenanceLogs: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
  if (!vehicle) {
    throw new Error('Vehicle not found.');
  }
  return vehicle;
};

const createVehicle = async (data) => {
  // Check unique registration number
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber: data.registrationNumber },
  });
  if (existing) {
    throw new Error(`Vehicle registration number '${data.registrationNumber}' already exists.`);
  }

  return prisma.vehicle.create({
    data: {
      registrationNumber: data.registrationNumber,
      model: data.model,
      type: data.type,
      maxLoadCapacity: parseFloat(data.maxLoadCapacity),
      odometer: parseFloat(data.odometer || 0),
      acquisitionCost: data.acquisitionCost,
      status: data.status || 'AVAILABLE',
      region: data.region,
    },
  });
};

const updateVehicle = async (id, data) => {
  // Check vehicle existence
  await getVehicleById(id);

  if (data.registrationNumber) {
    const existing = await prisma.vehicle.findFirst({
      where: {
        registrationNumber: data.registrationNumber,
        id: { not: id },
      },
    });
    if (existing) {
      throw new Error(`Vehicle registration number '${data.registrationNumber}' is already in use.`);
    }
  }

  const updateData = { ...data };
  if (data.maxLoadCapacity !== undefined) updateData.maxLoadCapacity = parseFloat(data.maxLoadCapacity);
  if (data.odometer !== undefined) updateData.odometer = parseFloat(data.odometer);

  return prisma.vehicle.update({
    where: { id },
    data: updateData,
  });
};

const deleteVehicle = async (id) => {
  await getVehicleById(id);

  // Check if it has active trips
  const activeTrips = await prisma.trip.findFirst({
    where: {
      vehicleId: id,
      status: { in: ['DISPATCHED'] },
    },
  });
  if (activeTrips) {
    throw new Error('Cannot delete vehicle while it is assigned to an active trip.');
  }

  return prisma.vehicle.delete({
    where: { id },
  });
};

const getStatistics = async () => {
  const totals = await prisma.vehicle.groupBy({
    by: ['status'],
    _count: {
      _all: true,
    },
  });

  const types = await prisma.vehicle.groupBy({
    by: ['type'],
    _count: {
      _all: true,
    },
  });

  return {
    totals: totals.reduce((acc, curr) => {
      acc[curr.status] = curr._count._all;
      return acc;
    }, {}),
    types: types.reduce((acc, curr) => {
      acc[curr.type] = curr._count._all;
      return acc;
    }, {}),
  };
};

module.exports = {
  getVehicles,
  getAvailableVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getStatistics,
};
