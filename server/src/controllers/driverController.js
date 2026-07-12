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

module.exports = {
  getDrivers,
  getAvailableDrivers,
  getLicenseExpiringDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
