const maintenanceService = require('../services/maintenanceService');

const getMaintenanceLogs = async (req, res, next) => {
  try {
    const logs = await maintenanceService.getMaintenanceLogs(req.query);
    return res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

const getMaintenanceLogById = async (req, res, next) => {
  try {
    const log = await maintenanceService.getMaintenanceLogById(req.params.id);
    return res.status(200).json(log);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const createMaintenanceLog = async (req, res, next) => {
  try {
    const { description, cost, vehicleId } = req.body;
    if (!description || !vehicleId) {
      return res.status(400).json({ error: 'Description and vehicleId are required.' });
    }
    const log = await maintenanceService.createMaintenanceLog(req.body);
    return res.status(201).json(log);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('active trip') || err.message.includes('retired')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const completeMaintenanceLog = async (req, res, next) => {
  try {
    const log = await maintenanceService.completeMaintenanceLog(req.params.id, req.body);
    return res.status(200).json(log);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('already closed')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const deleteMaintenanceLog = async (req, res, next) => {
  try {
    await maintenanceService.deleteMaintenanceLog(req.params.id);
    return res.status(200).json({ message: 'Maintenance log deleted successfully.' });
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  getMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  completeMaintenanceLog,
  deleteMaintenanceLog,
};
