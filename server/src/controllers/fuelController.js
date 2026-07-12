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

module.exports = {
  getFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
};
