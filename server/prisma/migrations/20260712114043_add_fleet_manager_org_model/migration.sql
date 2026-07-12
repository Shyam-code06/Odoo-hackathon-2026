/*
  Warnings:

  - Added the required column `fleetManagerId` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleetManagerId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleetManagerId` to the `FuelLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleetManagerId` to the `MaintenanceLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleetManagerId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleetManagerId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fleetManagerId` to the `VehicleDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'DEACTIVATE', 'ACTIVATE', 'RESET_PASSWORD', 'LOGIN', 'LOGOUT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'MAINTENANCE_MANAGER';
ALTER TYPE "Role" ADD VALUE 'DRIVER_MANAGER';
ALTER TYPE "Role" ADD VALUE 'VIEWER';

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FuelLog" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceLog" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fleetManagerId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'VIEWER';

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VehicleDocument" ADD COLUMN     "fleetManagerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "fleetManagerId" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_fleetManagerId_idx" ON "AuditLog"("fleetManagerId");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_idx" ON "AuditLog"("resourceType");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "Driver_fleetManagerId_idx" ON "Driver"("fleetManagerId");

-- CreateIndex
CREATE INDEX "Expense_fleetManagerId_idx" ON "Expense"("fleetManagerId");

-- CreateIndex
CREATE INDEX "FuelLog_fleetManagerId_idx" ON "FuelLog"("fleetManagerId");

-- CreateIndex
CREATE INDEX "MaintenanceLog_fleetManagerId_idx" ON "MaintenanceLog"("fleetManagerId");

-- CreateIndex
CREATE INDEX "Trip_fleetManagerId_idx" ON "Trip"("fleetManagerId");

-- CreateIndex
CREATE INDEX "User_fleetManagerId_idx" ON "User"("fleetManagerId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "Vehicle_fleetManagerId_idx" ON "Vehicle"("fleetManagerId");

-- CreateIndex
CREATE INDEX "VehicleDocument_fleetManagerId_idx" ON "VehicleDocument"("fleetManagerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDocument" ADD CONSTRAINT "VehicleDocument_fleetManagerId_fkey" FOREIGN KEY ("fleetManagerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
