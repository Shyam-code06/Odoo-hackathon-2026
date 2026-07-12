const authService = require('../services/authService');

/**
 * Helper to extract the caller's fleet manager ID from the JWT.
 * Works for both Fleet Managers (id === fleetManagerId) and sub-users.
 */
const getFleetManagerId = (req) => req.user.fleetManagerId || req.user.id;

const createUser = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const user = await authService.createOrgUser(req.body, fleetManagerId);
    return res.status(201).json(user);
  } catch (err) {
    if (err.message.includes('already registered') || err.message.includes('already')) {
      return res.status(409).json({ error: err.message });
    }
    if (err.message.includes('required') || err.message.includes('Invalid role') || err.message.includes('Cannot create')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const users = await authService.listOrgUsers(fleetManagerId);
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const user = await authService.getOrgUser(req.params.id, fleetManagerId);
    return res.status(200).json(user);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const user = await authService.updateOrgUser(req.params.id, req.body, fleetManagerId);
    return res.status(200).json(user);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('Cannot') || err.message.includes('Invalid')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const user = await authService.deactivateOrgUser(req.params.id, fleetManagerId);
    return res.status(200).json(user);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('Cannot')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const user = await authService.activateOrgUser(req.params.id, fleetManagerId);
    return res.status(200).json(user);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};

const resetUserPassword = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'newPassword is required.' });
    }
    const result = await authService.resetOrgUserPassword(req.params.id, newPassword, fleetManagerId);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('least 6')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const fleetManagerId = getFleetManagerId(req);
    const result = await authService.deleteOrgUser(req.params.id, fleetManagerId);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes('Cannot')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deactivateUser,
  activateUser,
  resetUserPassword,
  deleteUser,
};
