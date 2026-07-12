const vehicleService = require('../services/vehicleService');

const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getVehicles(req.query);
    return res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

const getAvailableVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();
    return res.status(200).json(vehicles);
  } catch (err) {
    next(err);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    return res.status(200).json(vehicle);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, model, type, maxLoadCapacity, acquisitionCost, region } = req.body;
    if (!registrationNumber || !model || !type || maxLoadCapacity === undefined || acquisitionCost === undefined || !region) {
      return res.status(400).json({ error: 'Missing required vehicle fields.' });
    }
    const vehicle = await vehicleService.createVehicle(req.body);
    return res.status(201).json(vehicle);
  } catch (err) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    return res.status(200).json(vehicle);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('already in use')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    return res.status(200).json({ message: 'Vehicle deleted successfully.' });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('active trip')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const statistics = await vehicleService.getStatistics();
    return res.status(200).json(statistics);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getVehicles,
  getAvailableVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getStatistics,
};
