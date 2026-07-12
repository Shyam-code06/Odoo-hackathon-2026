const prisma = require('../config/db');

const getExpenses = async (query = {}) => {
  const { category, vehicleId, tripId } = query;
  
  const where = {};
  if (category) where.category = category;
  if (vehicleId) where.vehicleId = vehicleId;
  if (tripId) where.tripId = tripId;

  return prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      vehicle: true,
      trip: true,
    },
  });
};

const getExpenseById = async (id) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: { vehicle: true },
  });
  if (!expense) {
    throw new Error('Expense not found.');
  }
  return expense;
};

const createExpense = async (data) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
  if (!vehicle) {
    throw new Error('Vehicle not found.');
  }

  return prisma.expense.create({
    data: {
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date ? new Date(data.date) : new Date(),
      description: data.description || null,
      vehicleId: data.vehicleId,
      tripId: data.tripId || null,
    },
  });
};

const updateExpense = async (id, data) => {
  await getExpenseById(id);

  const updatedData = { ...data };
  if (data.amount !== undefined) updatedData.amount = parseFloat(data.amount);
  if (data.date) updatedData.date = new Date(data.date);

  return prisma.expense.update({
    where: { id },
    data: updatedData,
  });
};

const deleteExpense = async (id) => {
  await getExpenseById(id);
  return prisma.expense.delete({
    where: { id },
  });
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
