const prisma = require('../config/db');

const getDrivers = async (query = {}, fleetManagerId) => {
  const { search, status, licenseCategory, sortBy, order } = query;

  const where = { fleetManagerId };

  if (status) where.status = status;
  if (licenseCategory) where.licenseCategory = licenseCategory;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { licenseNumber: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  return prisma.driver.findMany({ where, orderBy });
};

const getAvailableDrivers = async (fleetManagerId) => {
  const today = new Date();
  return prisma.driver.findMany({
    where: {
      fleetManagerId,
      status: 'AVAILABLE',
      licenseExpiryDate: { gt: today },
    },
    orderBy: { name: 'asc' },
  });
};

const getLicenseExpiringDrivers = async (fleetManagerId) => {
  const today = new Date();
  const warningDate = new Date();
  warningDate.setDate(today.getDate() + 30);

  return prisma.driver.findMany({
    where: {
      fleetManagerId,
      licenseExpiryDate: { lte: warningDate },
    },
    orderBy: { licenseExpiryDate: 'asc' },
  });
};

const getDriverById = async (id, fleetManagerId) => {
  const driver = await prisma.driver.findFirst({
    where: { id, fleetManagerId },
  });
  if (!driver) throw new Error('Driver not found.');
  return driver;
};

const createDriver = async (data, fleetManagerId) => {
  const existing = await prisma.driver.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });
  if (existing) {
    throw new Error(`Driver license number '${data.licenseNumber}' already exists.`);
  }

  return prisma.driver.create({
    data: {
      name: data.name,
      licenseNumber: data.licenseNumber,
      licenseCategory: data.licenseCategory,
      licenseExpiryDate: new Date(data.licenseExpiryDate),
      contactNumber: data.contactNumber,
      safetyScore: parseFloat(data.safetyScore || 100.0),
      status: data.status || 'AVAILABLE',
      fleetManagerId,
    },
  });
};

const updateDriver = async (id, data, fleetManagerId) => {
  await getDriverById(id, fleetManagerId);

  if (data.licenseNumber) {
    const existing = await prisma.driver.findFirst({
      where: { licenseNumber: data.licenseNumber, id: { not: id } },
    });
    if (existing) {
      throw new Error(`Driver license number '${data.licenseNumber}' is already in use.`);
    }
  }

  const updateData = { ...data };
  delete updateData.fleetManagerId;
  if (data.licenseExpiryDate) updateData.licenseExpiryDate = new Date(data.licenseExpiryDate);
  if (data.safetyScore !== undefined) updateData.safetyScore = parseFloat(data.safetyScore);

  return prisma.driver.update({ where: { id }, data: updateData });
};

const deleteDriver = async (id, fleetManagerId) => {
  await getDriverById(id, fleetManagerId);

  const activeTrips = await prisma.trip.findFirst({
    where: { driverId: id, status: { in: ['DISPATCHED'] } },
  });
  if (activeTrips) {
    throw new Error('Cannot delete driver while they are assigned to an active trip.');
  }

  return prisma.driver.delete({ where: { id } });
};

module.exports = {
  getDrivers,
  getAvailableDrivers,
  getLicenseExpiringDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
