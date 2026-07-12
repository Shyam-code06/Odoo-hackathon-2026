const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

router.get('/', requireRole(allAdminRoles), dashboardController.getDashboardKPIs);
router.get('/charts', requireRole(allAdminRoles), dashboardController.getDashboardCharts);

module.exports = router;
