const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

router.get('/fuel-efficiency', requireRole(allAdminRoles), reportController.getFuelEfficiencyReport);
router.get('/operational-cost', requireRole(allAdminRoles), reportController.getOperationalCostReport);
router.get('/roi', requireRole(allAdminRoles), reportController.getROIReport);
router.get('/export/csv', requireRole(allAdminRoles), reportController.exportCSV);
router.get('/export/pdf', requireRole(allAdminRoles), reportController.exportPDF);

module.exports = router;
