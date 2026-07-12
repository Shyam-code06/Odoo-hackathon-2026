const prisma = require('../config/db');

const getVehicles = async (query = {}, fleetManagerId) => {
  const { search, type, status, region, sortBy, order } = query;

  const where = { fleetManagerId };

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

  return prisma.vehicle.findMany({ where, orderBy });
};

const getAvailableVehicles = async (fleetManagerId) => {
  return prisma.vehicle.findMany({
    where: { fleetManagerId, status: 'AVAILABLE' },
    orderBy: { registrationNumber: 'asc' },
  });
};

const getVehicleById = async (id, fleetManagerId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, fleetManagerId },
    include: {
      documents: true,
      maintenanceLogs: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });
  if (!vehicle) throw new Error('Vehicle not found.');
  return vehicle;
};

const createVehicle = async (data, fleetManagerId) => {
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
      fleetManagerId,
    },
  });
};

const updateVehicle = async (id, data, fleetManagerId) => {
  await getVehicleById(id, fleetManagerId);

  if (data.registrationNumber) {
    const existing = await prisma.vehicle.findFirst({
      where: { registrationNumber: data.registrationNumber, id: { not: id } },
    });
    if (existing) {
      throw new Error(`Vehicle registration number '${data.registrationNumber}' is already in use.`);
    }
  }

  const updateData = { ...data };
  delete updateData.fleetManagerId; // never allow client to change ownership
  if (data.maxLoadCapacity !== undefined) updateData.maxLoadCapacity = parseFloat(data.maxLoadCapacity);
  if (data.odometer !== undefined) updateData.odometer = parseFloat(data.odometer);

  return prisma.vehicle.update({ where: { id }, data: updateData });
};

const deleteVehicle = async (id, fleetManagerId) => {
  await getVehicleById(id, fleetManagerId);

  const activeTrips = await prisma.trip.findFirst({
    where: { vehicleId: id, status: { in: ['DISPATCHED'] } },
  });
  if (activeTrips) {
    throw new Error('Cannot delete vehicle while it is assigned to an active trip.');
  }

  return prisma.vehicle.delete({ where: { id } });
};

const getStatistics = async (fleetManagerId) => {
  const totals = await prisma.vehicle.groupBy({
    by: ['status'],
    where: { fleetManagerId },
    _count: { _all: true },
  });

  const types = await prisma.vehicle.groupBy({
    by: ['type'],
    where: { fleetManagerId },
    _count: { _all: true },
  });

  return {
    totals: totals.reduce((acc, curr) => { acc[curr.status] = curr._count._all; return acc; }, {}),
    types: types.reduce((acc, curr) => { acc[curr.type] = curr._count._all; return acc; }, {}),
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
