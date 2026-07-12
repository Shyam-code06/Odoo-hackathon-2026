const expenseService = require('../services/expenseService');

const getFMId = (req) => req.user.fleetManagerId || req.user.id;

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpenses(req.query, getFMId(req));
    return res.status(200).json(expenses);
  } catch (err) { next(err); }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, getFMId(req));
    return res.status(200).json(expense);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { amount, category, vehicleId } = req.body;
    if (amount === undefined || !category || !vehicleId) {
      return res.status(400).json({ error: 'Amount, category, and vehicleId are required.' });
    }
    const expense = await expenseService.createExpense(req.body, getFMId(req));
    return res.status(201).json(expense);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body, getFMId(req));
    return res.status(200).json(expense);
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.id, getFMId(req));
    return res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpenses(req.query, getFMId(req));
    const headers = ['Vehicle Registration', 'Amount ($)', 'Category', 'Date', 'Description'];
    const rows = expenses.map(e => [
      e.vehicle ? e.vehicle.registrationNumber : '',
      e.amount, e.category,
      e.date ? e.date.toISOString().slice(0, 10) : '',
      `"${(e.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses_export.csv"');
    return res.status(200).send(csvContent);
  } catch (err) { next(err); }
};

module.exports = { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, exportCSV };
