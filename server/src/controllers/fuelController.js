const fuelService = require('../services/fuelService');

const getFuelLogs = async (req, res, next) => {
  try {
    const logs = await fuelService.getFuelLogs(req.query);
    return res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

const getFuelLogById = async (req, res, next) => {
  try {
    const log = await fuelService.getFuelLogById(req.params.id);
    return res.status(200).json(log);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const createFuelLog = async (req, res, next) => {
  try {
    const { liters, cost, vehicleId } = req.body;
    if (liters === undefined || cost === undefined || !vehicleId) {
      return res.status(400).json({ error: 'Liters, cost, and vehicleId are required.' });
    }
    const log = await fuelService.createFuelLog(req.body);
    return res.status(201).json(log);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const updateFuelLog = async (req, res, next) => {
  try {
    const log = await fuelService.updateFuelLog(req.params.id, req.body);
    return res.status(200).json(log);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const deleteFuelLog = async (req, res, next) => {
  try {
    await fuelService.deleteFuelLog(req.params.id);
    return res.status(200).json({ message: 'Fuel log deleted successfully.' });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const logs = await fuelService.getFuelLogs(req.query);
    const headers = ['Vehicle Registration', 'Volume (Liters)', 'Cost ($)', 'Date', 'Odometer'];
    const rows = logs.map(f => [
      f.vehicle ? f.vehicle.registrationNumber : '',
      f.liters,
      f.cost,
      f.date ? f.date.toISOString().slice(0, 10) : '',
      f.odometer
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="fuel_export.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
  exportCSV,
};
