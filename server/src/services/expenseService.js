const prisma = require('../config/db');

const getExpenses = async (query = {}, fleetManagerId) => {
  const { category, vehicleId, tripId } = query;

  const where = { fleetManagerId };
  if (category) where.category = category;
  if (vehicleId) where.vehicleId = vehicleId;
  if (tripId) where.tripId = tripId;

  return prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { vehicle: true, trip: true },
  });
};

const getExpenseById = async (id, fleetManagerId) => {
  const expense = await prisma.expense.findFirst({
    where: { id, fleetManagerId },
    include: { vehicle: true },
  });
  if (!expense) throw new Error('Expense not found.');
  return expense;
};

const createExpense = async (data, fleetManagerId) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: data.vehicleId, fleetManagerId },
  });
  if (!vehicle) throw new Error('Vehicle not found.');

  return prisma.expense.create({
    data: {
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date ? new Date(data.date) : new Date(),
      description: data.description || null,
      vehicleId: data.vehicleId,
      tripId: data.tripId || null,
      fleetManagerId,
    },
  });
};

const updateExpense = async (id, data, fleetManagerId) => {
  await getExpenseById(id, fleetManagerId);

  const updatedData = { ...data };
  delete updatedData.fleetManagerId;
  if (data.amount !== undefined) updatedData.amount = parseFloat(data.amount);
  if (data.date) updatedData.date = new Date(data.date);

  return prisma.expense.update({ where: { id }, data: updatedData });
};

const deleteExpense = async (id, fleetManagerId) => {
  await getExpenseById(id, fleetManagerId);
  return prisma.expense.delete({ where: { id } });
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
