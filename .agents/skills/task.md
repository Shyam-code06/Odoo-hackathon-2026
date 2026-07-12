# Enterprise Multi-Tenant Implementation Tasks

## Phase 1: Database Schema
- [x] Update Prisma schema — new roles, fleetManagerId on all tables, AuditLog, User self-ref
- [x] Update seed.js — default Fleet Manager, sub-users, all data linked to fleetManagerId

## Phase 2: Backend Core
- [x] Create permissions.js middleware — PERMISSIONS constants + ROLE_PERMISSIONS map + requirePermission()
- [x] Update auth.js middleware — inject fleetManagerId + permissions into req.user
- [x] Update authService.js — login emits fleetManagerId+permissions in JWT, add user CRUD
- [x] Update authController.js — add user CRUD handlers, remove public register
- [x] NEW userRoutes.js — user management routes (Fleet Manager only)
- [x] Update authRoutes.js — remove /register, point to userRoutes
- [x] Update routes/index.js — mount /users route

## Phase 3: Backend Data Scoping
- [x] Update vehicleService.js — all queries scoped by fleetManagerId
- [x] Update vehicleController.js — extract fleetManagerId from req.user
- [x] Update driverService.js — all queries scoped by fleetManagerId
- [x] Update driverController.js — extract fleetManagerId from req.user
- [x] Update tripService.js — all queries scoped by fleetManagerId
- [x] Update tripController.js — extract fleetManagerId from req.user
- [x] Update maintenanceService.js — all queries scoped by fleetManagerId
- [x] Update maintenanceController.js — extract fleetManagerId from req.user
- [x] Update fuelService.js — all queries scoped by fleetManagerId
- [x] Update fuelController.js — extract fleetManagerId from req.user
- [x] Update expenseService.js — all queries scoped by fleetManagerId
- [x] Update expenseController.js — extract fleetManagerId from req.user
- [x] Update dashboardService.js — all queries scoped by fleetManagerId
- [x] Update dashboardController.js — extract fleetManagerId from req.user
- [x] Update reportService.js — all queries scoped by fleetManagerId
- [x] Update reportController.js — extract fleetManagerId from req.user
- [x] Update all route files — add granular requirePermission() guards

## Phase 4: Migration & Seed
- [x] Run prisma migrate dev
- [x] Run npm run seed

## Phase 5: Frontend Core
- [x] Update client authService.js — map new roles + permissions from JWT
- [x] Update AuthProvider.jsx — add hasPermission() to context
- [x] NEW usePermission.js hook
- [x] NEW PermissionGate.jsx component
- [x] Update RoleGuard.jsx — support requiredPermission prop
- [x] NEW userService.js — /users API calls

## Phase 6: Frontend Pages & Routes
- [x] Update constants/index.js — new roles, Users nav item
- [x] Update routes/index.jsx — add /users route (FM only), keep /signup
- [x] Update Register.jsx — convert to informational page
- [x] NEW UserManagement.jsx page
- [x] Update ProtectedLayout.jsx — add UserCog icon to icon map

## Phase 7: Frontend Permission Gates
- [x] Vehicles page — wrap create/edit/delete/export in PermissionGate
- [x] Drivers page — wrap create/edit/delete/export in PermissionGate
- [x] Trips page — wrap create/dispatch/delete in PermissionGate
- [x] Maintenance page — wrap create/edit/delete in PermissionGate
- [x] Fuel page — wrap create/edit/delete in PermissionGate
- [x] Expenses page — wrap create/edit/delete in PermissionGate

## Phase 8: Build Verification
- [x] npm run build (client) — 0 errors
