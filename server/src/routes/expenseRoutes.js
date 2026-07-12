const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticateJWT, requireRole } = require('../middlewares/auth');

router.use(authenticateJWT);

const allAdminRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
const writeRoles = ['FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST'];

router.get('/', requireRole(allAdminRoles), expenseController.getExpenses);
router.get('/export', requireRole(allAdminRoles), expenseController.exportCSV);
router.get('/:id', requireRole(allAdminRoles), expenseController.getExpenseById);

router.post('/', requireRole(writeRoles), expenseController.createExpense);
router.put('/:id', requireRole(writeRoles), expenseController.updateExpense);
router.delete('/:id', requireRole(writeRoles), expenseController.deleteExpense);

module.exports = router;
