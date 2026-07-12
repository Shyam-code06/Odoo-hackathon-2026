const expenseService = require('../services/expenseService');

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpenses(req.query);
    return res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    return res.status(200).json(expense);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const { amount, category, vehicleId } = req.body;
    if (amount === undefined || !category || !vehicleId) {
      return res.status(400).json({ error: 'Amount, category, and vehicleId are required.' });
    }
    const expense = await expenseService.createExpense(req.body);
    return res.status(201).json(expense);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.body);
    return res.status(200).json(expense);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    return res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
