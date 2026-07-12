const prisma = require('../config/db');

const getTrips = async (query = {}) => {
  const { status, vehicleId, driverId, sortBy, order } = query;
  
  const where = {};
  if (status) where.status = status;
  if (vehicleId) where.vehicleId = vehicleId;
  if (driverId) where.driverId = driverId;

  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  return prisma.trip.findMany({
    where,
    orderBy,
    include: {
      vehicle: true,
      driver: true,
    },
  });
};

const getTripById = async (id) => {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      vehicle: true,
      driver: true,
      fuelLogs: true,
      expenses: true,
    },
  });
  if (!trip) {
    throw new Error('Trip not found.');
  }
  return trip;
};

const createTrip = async (data) => {
  // Validate cargo weight <= vehicle maxLoadCapacity (if vehicle specified)
  if (data.vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) throw new Error('Vehicle not found.');
    if (parseFloat(data.cargoWeight) > vehicle.maxLoadCapacity) {
      throw new Error(`Cargo weight (${data.cargoWeight} kg) exceeds vehicle's maximum capacity (${vehicle.maxLoadCapacity} kg).`);
    }
  }

  // Generate unique trip number (e.g., TRIP-12345)
  const tripNumber = `TRIP-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

  return prisma.trip.create({
    data: {
      tripNumber,
      source: data.source,
      destination: data.destination,
      cargoWeight: parseFloat(data.cargoWeight),
      plannedDistance: parseFloat(data.plannedDistance),
      status: 'DRAFT',
      revenue: data.revenue || 0.00,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
    },
  });
};

const updateTrip = async (id, data) => {
  const trip = await getTripById(id);
  
  if (trip.status !== 'DRAFT') {
    throw new Error('Only DRAFT trips can be updated.');
  }

  const updatedData = { ...data };
  
  if (data.vehicleId || data.cargoWeight !== undefined) {
    const vId = data.vehicleId || trip.vehicleId;
    const cW = data.cargoWeight !== undefined ? parseFloat(data.cargoWeight) : trip.cargoWeight;
    
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vId } });
    if (!vehicle) throw new Error('Vehicle not found.');
    if (cW > vehicle.maxLoadCapacity) {
      throw new Error(`Cargo weight (${cW} kg) exceeds vehicle's maximum capacity (${vehicle.maxLoadCapacity} kg).`);
    }
  }

  if (data.cargoWeight !== undefined) updatedData.cargoWeight = parseFloat(data.cargoWeight);
  if (data.plannedDistance !== undefined) updatedData.plannedDistance = parseFloat(data.plannedDistance);
  if (data.actualDistance !== undefined) updatedData.actualDistance = parseFloat(data.actualDistance);

  return prisma.trip.update({
    where: { id },
    data: updatedData,
  });
};

const dispatchTrip = async (id) => {
  const trip = await getTripById(id);
  if (trip.status !== 'DRAFT') {
    throw new Error('Only DRAFT trips can be dispatched.');
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: trip.vehicleId } });
  const driver = await prisma.driver.findUnique({ where: { id: trip.driverId } });

  // 1. Vehicle availability validation
  if (!vehicle) throw new Error('Assigned vehicle not found.');
  if (vehicle.status === 'RETIRED' || vehicle.status === 'IN_SHOP') {
    throw new Error(`Vehicle ${vehicle.registrationNumber} cannot be dispatched as it is ${vehicle.status}.`);
  }
  if (vehicle.status === 'ON_TRIP') {
    throw new Error(`Vehicle ${vehicle.registrationNumber} is already on another trip.`);
  }

  // 2. Driver compliance validation
  if (!driver) throw new Error('Assigned driver not found.');
  if (driver.status === 'SUSPENDED') {
    throw new Error(`Driver ${driver.name} cannot be assigned because they are SUSPENDED.`);
  }
  if (driver.status === 'ON_TRIP') {
    throw new Error(`Driver ${driver.name} is already on another active trip.`);
  }
  if (new Date(driver.licenseExpiryDate) <= new Date()) {
    throw new Error(`Driver ${driver.name} cannot be assigned because their driving license is expired.`);
  }

  // 3. Cargo weight validation
  if (trip.cargoWeight > vehicle.maxLoadCapacity) {
    throw new Error(`Cargo weight (${trip.cargoWeight} kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity} kg).`);
  }

  // Transaction for status updates
  return prisma.$transaction(async (tx) => {
    // Update Vehicle to ON_TRIP
    await tx.vehicle.update({
      where: { id: vehicle.id },
      data: { status: 'ON_TRIP' },
    });

    // Update Driver to ON_TRIP
    await tx.driver.update({
      where: { id: driver.id },
      data: { status: 'ON_TRIP' },
    });

    // Update Trip to DISPATCHED
    return tx.trip.update({
      where: { id: trip.id },
      data: {
        status: 'DISPATCHED',
        dispatchTime: new Date(),
      },
    });
  });
};

const completeTrip = async (id, actualDistance) => {
  const trip = await getTripById(id);
  if (trip.status !== 'DISPATCHED') {
    throw new Error('Only DISPATCHED trips can be completed.');
  }

  const distance = parseFloat(actualDistance || trip.plannedDistance);

  return prisma.$transaction(async (tx) => {
    // Update vehicle odometer and return status to AVAILABLE
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: {
        status: 'AVAILABLE',
        odometer: {
          increment: distance,
        },
      },
    });

    // Update driver status to AVAILABLE
    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: 'AVAILABLE' },
    });

    // Complete the trip
    return tx.trip.update({
      where: { id: trip.id },
      data: {
        status: 'COMPLETED',
        actualDistance: distance,
        completionTime: new Date(),
      },
    });
  });
};

const cancelTrip = async (id) => {
  const trip = await getTripById(id);
  
  if (trip.status !== 'DISPATCHED' && trip.status !== 'DRAFT') {
    throw new Error('Only DRAFT or DISPATCHED trips can be cancelled.');
  }

  // If DRAFT, just update status
  if (trip.status === 'DRAFT') {
    return prisma.trip.update({
      where: { id: trip.id },
      data: { status: 'CANCELLED' },
    });
  }

  // If DISPATCHED, release vehicle & driver and change status
  return prisma.$transaction(async (tx) => {
    await tx.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: 'AVAILABLE' },
    });

    await tx.driver.update({
      where: { id: trip.driverId },
      data: { status: 'AVAILABLE' },
    });

    return tx.trip.update({
      where: { id: trip.id },
      data: { status: 'CANCELLED' },
    });
  });
};

const deleteTrip = async (id) => {
  const trip = await getTripById(id);
  if (trip.status !== 'DRAFT' && trip.status !== 'CANCELLED') {
    throw new Error('Cannot delete active or completed trips.');
  }
  return prisma.trip.delete({
    where: { id },
  });
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  deleteTrip,
};
