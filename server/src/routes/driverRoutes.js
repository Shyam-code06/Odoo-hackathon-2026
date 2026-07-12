const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

router.get('/', requireRole(allAdminRoles), driverController.getDrivers);
router.get('/available', requireRole(allAdminRoles), driverController.getAvailableDrivers);
router.get('/license-expiring', requireRole(allAdminRoles), driverController.getLicenseExpiringDrivers);
router.get('/export', requireRole(allAdminRoles), driverController.exportCSV);
router.get('/:id', requireRole(allAdminRoles), driverController.getDriverById);

// Create, Update, Delete restricted to Fleet Manager and Safety Officer
router.post('/', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), driverController.createDriver);
router.put('/:id', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), driverController.updateDriver);
router.delete('/:id', requireRole(['FLEET_MANAGER', 'SAFETY_OFFICER']), driverController.deleteDriver);

module.exports = router;
