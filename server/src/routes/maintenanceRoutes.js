const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

router.get('/', requireRole(allAdminRoles), maintenanceController.getMaintenanceLogs);
router.get('/:id', requireRole(allAdminRoles), maintenanceController.getMaintenanceLogById);

router.post('/', requireRole(['FLEET_MANAGER']), maintenanceController.createMaintenanceLog);
router.put('/:id/complete', requireRole(['FLEET_MANAGER']), maintenanceController.completeMaintenanceLog);
router.delete('/:id', requireRole(['FLEET_MANAGER']), maintenanceController.deleteMaintenanceLog);

module.exports = router;
