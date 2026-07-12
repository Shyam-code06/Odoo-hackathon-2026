const driverService = require('../services/driverService');

const getDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getDrivers(req.query);
    return res.status(200).json(drivers);
  } catch (err) {
    next(err);
  }
};

const getAvailableDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getAvailableDrivers();
    return res.status(200).json(drivers);
  } catch (err) {
    next(err);
  }
};

const getLicenseExpiringDrivers = async (req, res, next) => {
  try {
    const drivers = await driverService.getLicenseExpiringDrivers();
    return res.status(200).json(drivers);
  } catch (err) {
    next(err);
  }
};

const getDriverById = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    return res.status(200).json(driver);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const createDriver = async (req, res, next) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber } = req.body;
    if (!name || !licenseNumber || !licenseCategory || !licenseExpiryDate || !contactNumber) {
      return res.status(400).json({ error: 'Missing required driver fields.' });
    }
    const driver = await driverService.createDriver(req.body);
    return res.status(201).json(driver);
  } catch (err) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    return res.status(200).json(driver);
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

const deleteDriver = async (req, res, next) => {
  try {
    await driverService.deleteDriver(req.params.id);
    return res.status(200).json({ message: 'Driver deleted successfully.' });
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

const exportCSV = async (req, res, next) => {
  try {
    const drivers = await driverService.getDrivers(req.query);
    const headers = ['Name', 'License Number', 'License Category', 'License Expiry Date', 'Contact Number', 'Safety Score', 'Status'];
    const rows = drivers.map(d => [
      `"${d.name.replace(/"/g, '""')}"`,
      d.licenseNumber,
      d.licenseCategory,
      d.licenseExpiryDate ? d.licenseExpiryDate.toISOString().slice(0, 10) : '',
      d.contactNumber,
      d.safetyScore,
      d.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="drivers_export.csv"');
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDrivers,
  getAvailableDrivers,
  getLicenseExpiringDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  exportCSV,
};
