const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

// All vehicle routes require authentication
router.use(authenticateJWT);

// Read-only access for all administrative roles
const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

router.get('/', requireRole(allAdminRoles), vehicleController.getVehicles);
router.get('/available', requireRole(allAdminRoles), vehicleController.getAvailableVehicles);
router.get('/statistics', requireRole(allAdminRoles), vehicleController.getStatistics);
router.get('/export', requireRole(allAdminRoles), vehicleController.exportCSV);
router.get('/:id', requireRole(allAdminRoles), vehicleController.getVehicleById);

// Write/Edit access restricted to Fleet Managers only
router.post('/', requireRole(['FLEET_MANAGER']), vehicleController.createVehicle);
router.put('/:id', requireRole(['FLEET_MANAGER']), vehicleController.updateVehicle);
router.delete('/:id', requireRole(['FLEET_MANAGER']), vehicleController.deleteVehicle);

module.exports = router;
