const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
const dispatchRoles = ['FLEET_MANAGER', 'DISPATCHER'];

router.get('/', requireRole(allAdminRoles), tripController.getTrips);
router.get('/export', requireRole(allAdminRoles), tripController.exportCSV);
router.get('/:id', requireRole(allAdminRoles), tripController.getTripById);

// Manage trip lifecycle
router.post('/', requireRole(dispatchRoles), tripController.createTrip);
router.put('/:id', requireRole(dispatchRoles), tripController.updateTrip);
router.delete('/:id', requireRole(dispatchRoles), tripController.deleteTrip);

// Transitions
router.put('/:id/dispatch', requireRole(dispatchRoles), tripController.dispatchTrip);
router.put('/:id/complete', requireRole(dispatchRoles), tripController.completeTrip);
router.put('/:id/cancel', requireRole(dispatchRoles), tripController.cancelTrip);

module.exports = router;
