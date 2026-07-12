const { PrismaClient } = require('../generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clean database in correct dependency order
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // Create Users with the 4 administrative roles
  const hashedPassword = await bcrypt.hash('password123', 10);

  const manager = await prisma.user.create({
    data: {
      email: 'manager@transitops.com',
      password: hashedPassword,
      name: 'Fleet Manager John',
      role: 'FLEET_MANAGER',
    },
  });

  const dispatcher = await prisma.user.create({
    data: {
      email: 'dispatcher@transitops.com',
      password: hashedPassword,
      name: 'Dispatcher Jane',
      role: 'DISPATCHER',
    },
  });

  const safety = await prisma.user.create({
    data: {
      email: 'safety@transitops.com',
      password: hashedPassword,
      name: 'Safety Officer Sam',
      role: 'SAFETY_OFFICER',
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: 'analyst@transitops.com',
      password: hashedPassword,
      name: 'Financial Analyst Fiona',
      role: 'FINANCIAL_ANALYST',
    },
  });

  console.log('Users created with 4 administrative roles.');

  // Create Vehicles
  const van = await prisma.vehicle.create({
    data: {
      registrationNumber: 'VAN-05',
      model: 'Ford Transit Van',
      type: 'VAN',
      maxLoadCapacity: 500.0, // kg
      odometer: 12000.0, // km
      acquisitionCost: 35000.00,
      status: 'AVAILABLE',
      region: 'North',
    },
  });

  const truck = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TRUCK-12',
      model: 'Volvo FH16 Semi',
      type: 'SEMI_TRUCK',
      maxLoadCapacity: 25000.0, // kg
      odometer: 150000.0, // km
      acquisitionCost: 120000.00,
      status: 'AVAILABLE',
      region: 'East',
    },
  });

  const shopVehicle = await prisma.vehicle.create({
    data: {
      registrationNumber: 'SHOP-99',
      model: 'GMC Savana',
      type: 'VAN',
      maxLoadCapacity: 800.0,
      odometer: 95000.0,
      acquisitionCost: 28000.00,
      status: 'IN_SHOP',
      region: 'South',
    },
  });

  console.log('Vehicles created.');

  // Create Drivers
  const validExpiry = new Date();
  validExpiry.setFullYear(validExpiry.getFullYear() + 2); // Expiry in 2 years

  const expiredExpiry = new Date();
  expiredExpiry.setFullYear(expiredExpiry.getFullYear() - 1); // Expired 1 year ago

  const driver1 = await prisma.driver.create({
    data: {
      name: 'Alex Rider',
      licenseNumber: 'LIC-100234',
      licenseCategory: 'Class A',
      licenseExpiryDate: validExpiry,
      contactNumber: '+1234567890',
      safetyScore: 98.5,
      status: 'AVAILABLE',
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Bob Builder',
      licenseNumber: 'LIC-200543',
      licenseCategory: 'Class B',
      licenseExpiryDate: validExpiry,
      contactNumber: '+1987654321',
      safetyScore: 85.0,
      status: 'AVAILABLE',
    },
  });

  // Suspended driver
  await prisma.driver.create({
    data: {
      name: 'Charlie Suspended',
      licenseNumber: 'LIC-999999',
      licenseCategory: 'Class A',
      licenseExpiryDate: validExpiry,
      contactNumber: '+1555555555',
      safetyScore: 40.0,
      status: 'SUSPENDED',
    },
  });

  // Expired license driver
  await prisma.driver.create({
    data: {
      name: 'David Expired',
      licenseNumber: 'LIC-000000',
      licenseCategory: 'Class B',
      licenseExpiryDate: expiredExpiry,
      contactNumber: '+1666666666',
      safetyScore: 95.0,
      status: 'AVAILABLE',
    },
  });

  console.log('Drivers created.');
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
