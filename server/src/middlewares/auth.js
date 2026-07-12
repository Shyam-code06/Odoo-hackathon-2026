const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * authenticateJWT
 * Verifies the Bearer token from the Authorization header.
 * On success, sets req.user with:
 *   { id, email, role, name, fleetManagerId, permissions }
 * where fleetManagerId is the Fleet Manager's user ID that scopes all org data.
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Malformed token.' });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || 'your_fallback_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * requireRole(allowedRoles)
 * Checks req.user.role against the allowed roles array.
 * Must be used AFTER authenticateJWT.
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Role '${req.user.role}' does not have access.` });
    }

    next();
  };
};

module.exports = {
  authenticateJWT,
  requireRole,
};
