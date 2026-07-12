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

  // ─── CLEAN (order matters for FK constraints) ──────────────────────────────
  try { await prisma.auditLog.deleteMany(); } catch(e) { /* table may not exist yet */ }
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicle.deleteMany();
  // Delete sub-users before fleet manager (FK constraint)
  await prisma.user.deleteMany({ where: { fleetManagerId: { not: null } } });
  await prisma.user.deleteMany();

  console.log('Database cleaned.');

  // ─── DEFAULT FLEET MANAGER ─────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@transitops.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedAdminPw = await bcrypt.hash(adminPassword, 10);

  const fleetManager = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedAdminPw,
      name: 'Fleet Manager Admin',
      role: 'FLEET_MANAGER',
      isDefault: true,
      isActive: true,
      fleetManagerId: null,
    },
  });

  console.log(`Default Fleet Manager created: ${adminEmail} / ${adminPassword}`);

  const fmId = fleetManager.id;

  // ─── SUB-USERS (all linked to Fleet Manager) ───────────────────────────────
  const hashedPw = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'dispatcher@transitops.com',
        password: hashedPw,
        name: 'Jane Dispatcher',
        role: 'DISPATCHER',
        isActive: true,
        fleetManagerId: fmId,
      },
      {
        email: 'safety@transitops.com',
        password: hashedPw,
        name: 'Sam Safety',
        role: 'SAFETY_OFFICER',
        isActive: true,
        fleetManagerId: fmId,
      },
      {
        email: 'finance@transitops.com',
        password: hashedPw,
        name: 'Fiona Finance',
        role: 'FINANCIAL_ANALYST',
        isActive: true,
        fleetManagerId: fmId,
      },
      {
        email: 'maintenance@transitops.com',
        password: hashedPw,
        name: 'Mike Maintenance',
        role: 'MAINTENANCE_MANAGER',
        isActive: true,
        fleetManagerId: fmId,
      },
      {
        email: 'viewer@transitops.com',
        password: hashedPw,
        name: 'Victor Viewer',
        role: 'VIEWER',
        isActive: true,
        fleetManagerId: fmId,
      },
    ],
  });

  console.log('Sub-users created (all linked to Fleet Manager).');

  // ─── VEHICLES ───────────────────────────────────────────────────────────────
  const van = await prisma.vehicle.create({
    data: {
      registrationNumber: 'VAN-05',
      model: 'Ford Transit Van',
      type: 'VAN',
      maxLoadCapacity: 500.0,
      odometer: 12000.0,
      acquisitionCost: 35000.00,
      status: 'AVAILABLE',
      region: 'North',
      fleetManagerId: fmId,
    },
  });

  const truck = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TRUCK-12',
      model: 'Volvo FH16 Semi',
      type: 'SEMI_TRUCK',
      maxLoadCapacity: 25000.0,
      odometer: 150000.0,
      acquisitionCost: 120000.00,
      status: 'AVAILABLE',
      region: 'East',
      fleetManagerId: fmId,
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
      fleetManagerId: fmId,
    },
  });

  console.log('Vehicles created.');

  // ─── DRIVERS ────────────────────────────────────────────────────────────────
  const validExpiry = new Date();
  validExpiry.setFullYear(validExpiry.getFullYear() + 2);

  const expiredExpiry = new Date();
  expiredExpiry.setFullYear(expiredExpiry.getFullYear() - 1);

  const driver1 = await prisma.driver.create({
    data: {
      name: 'Alex Rider',
      licenseNumber: 'LIC-100234',
      licenseCategory: 'Class A',
      licenseExpiryDate: validExpiry,
      contactNumber: '+1234567890',
      safetyScore: 98.5,
      status: 'AVAILABLE',
      fleetManagerId: fmId,
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
      fleetManagerId: fmId,
    },
  });

  await prisma.driver.create({
    data: {
      name: 'Charlie Suspended',
      licenseNumber: 'LIC-999999',
      licenseCategory: 'Class A',
      licenseExpiryDate: validExpiry,
      contactNumber: '+1555555555',
      safetyScore: 40.0,
      status: 'SUSPENDED',
      fleetManagerId: fmId,
    },
  });

  await prisma.driver.create({
    data: {
      name: 'David Expired',
      licenseNumber: 'LIC-000000',
      licenseCategory: 'Class B',
      licenseExpiryDate: expiredExpiry,
      contactNumber: '+1666666666',
      safetyScore: 95.0,
      status: 'AVAILABLE',
      fleetManagerId: fmId,
    },
  });

  console.log('Drivers created.');

  // ─── COMPLETED TRIP (for reports/analytics data) ──────────────────────────
  const completedTrip = await prisma.trip.create({
    data: {
      tripNumber: 'TRIP-SEED01',
      source: 'New York',
      destination: 'Boston',
      cargoWeight: 200,
      plannedDistance: 350,
      actualDistance: 355,
      status: 'COMPLETED',
      revenue: 1500.00,
      dispatchTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completionTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      vehicleId: van.id,
      driverId: driver1.id,
      fleetManagerId: fmId,
    },
  });

  // ─── FUEL LOG ────────────────────────────────────────────────────────────────
  await prisma.fuelLog.create({
    data: {
      liters: 45.5,
      cost: 68.25,
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      odometer: 12350,
      vehicleId: van.id,
      tripId: completedTrip.id,
      fleetManagerId: fmId,
    },
  });

  // ─── EXPENSES ────────────────────────────────────────────────────────────────
  await prisma.expense.create({
    data: {
      amount: 68.25,
      category: 'FUEL',
      description: 'Fuel Refill: 45.5L',
      vehicleId: van.id,
      tripId: completedTrip.id,
      fleetManagerId: fmId,
    },
  });

  await prisma.expense.create({
    data: {
      amount: 35.00,
      category: 'TOLL',
      description: 'Turnpike toll',
      vehicleId: van.id,
      tripId: completedTrip.id,
      fleetManagerId: fmId,
    },
  });

  // ─── MAINTENANCE LOG ─────────────────────────────────────────────────────────
  await prisma.maintenanceLog.create({
    data: {
      description: 'Oil change + brake inspection',
      cost: 250.00,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isClosed: false,
      vehicleId: shopVehicle.id,
      fleetManagerId: fmId,
    },
  });

  console.log('Trips, fuel logs, expenses, and maintenance logs created.');
  console.log('\n✅ Database seeding complete!');
  console.log(`\n🔑 Login credentials:`);
  console.log(`   Fleet Manager: ${adminEmail} / ${adminPassword}`);
  console.log(`   Dispatcher:    dispatcher@transitops.com / password123`);
  console.log(`   Safety:        safety@transitops.com / password123`);
  console.log(`   Finance:       finance@transitops.com / password123`);
  console.log(`   Maintenance:   maintenance@transitops.com / password123`);
  console.log(`   Viewer:        viewer@transitops.com / password123`);
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
