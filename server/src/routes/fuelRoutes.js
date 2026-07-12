const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
const writeRoles = ['FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'];

router.get('/', requireRole(allAdminRoles), fuelController.getFuelLogs);
router.get('/export', requireRole(allAdminRoles), fuelController.exportCSV);
router.get('/:id', requireRole(allAdminRoles), fuelController.getFuelLogById);

router.post('/', requireRole(writeRoles), fuelController.createFuelLog);
router.put('/:id', requireRole(writeRoles), fuelController.updateFuelLog);
router.delete('/:id', requireRole(writeRoles), fuelController.deleteFuelLog);

module.exports = router;
