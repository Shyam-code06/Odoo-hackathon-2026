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

const exportCSV = async (req, res, next) => {
  try {
    const logs = await maintenanceService.getMaintenanceLogs(req.query);
    const headers = ['Vehicle Registration', 'Description', 'Cost ($)', 'Start Date', 'End Date', 'Closed'];
    const rows = logs.map(m => [
      m.vehicle ? m.vehicle.registrationNumber : '',
      `"${(m.description || '').replace(/"/g, '""')}"`,
      m.cost || 0,
      m.startDate ? m.startDate.toISOString().slice(0, 10) : '',
      m.endDate ? m.endDate.toISOString().slice(0, 10) : '',
      m.isClosed ? 'Yes' : 'No'
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="maintenance_export.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  completeMaintenanceLog,
  deleteMaintenanceLog,
  exportCSV,
};
