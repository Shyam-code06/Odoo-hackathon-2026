const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const { getPermissionsForRole } = require('../middlewares/permissions');

/**
 * Helper: Build a JWT for a user.
 * The token embeds fleetManagerId so the backend never trusts the client for org scoping.
 * - If the user IS a Fleet Manager: fleetManagerId = user.id
 * - If the user belongs to an org: fleetManagerId = user.fleetManagerId
 */
const signToken = (user) => {
  const fleetManagerId = user.role === 'FLEET_MANAGER' ? user.id : user.fleetManagerId;
  const permissions = getPermissionsForRole(user.role);

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      fleetManagerId,
      permissions,
    },
    env.JWT_SECRET || 'your_fallback_secret_key',
    { expiresIn: '8h' }
  );
};

/**
 * Build a safe user object to return to the client (no password).
 */
const buildUserResponse = (user) => {
  const fleetManagerId = user.role === 'FLEET_MANAGER' ? user.id : user.fleetManagerId;
  const permissions = getPermissionsForRole(user.role);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    isDefault: user.isDefault,
    fleetManagerId,
    permissions,
  };
};

// ---------------------------------------------------------------------------
// AUTH OPERATIONS
// ---------------------------------------------------------------------------

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('Invalid email or password.');

  if (!user.isActive) {
    throw new Error('Account is deactivated. Please contact your Fleet Manager.');
  }

  // Only non-DRIVER roles can log in to the dashboard
  const allowedRoles = [
    'FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST',
    'MAINTENANCE_MANAGER', 'DRIVER_MANAGER', 'VIEWER',
  ];
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Access denied. Role not authorized to login.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password.');

  const token = signToken(user);

  return { token, user: buildUserResponse(user) };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, name: true, role: true,
      isActive: true, isDefault: true, fleetManagerId: true, createdAt: true,
    },
  });

  if (!user) throw new Error('User not found.');
  return buildUserResponse(user);
};

const logout = async () => {
  // Stateless JWT logout. Client side deletes token.
  return { message: 'Logged out successfully.' };
};

// ---------------------------------------------------------------------------
// USER MANAGEMENT — Fleet Manager only operations
// ---------------------------------------------------------------------------

/**
 * Create a new user in the Fleet Manager's organization.
 * Only the Fleet Manager can do this.
 */
const createOrgUser = async (data, callerFleetManagerId) => {
  const { email, password, name, role } = data;

  if (!email || !password || !name || !role) {
    throw new Error('Email, password, name, and role are required.');
  }

  // Prevent creating another FLEET_MANAGER
  if (role === 'FLEET_MANAGER') {
    throw new Error('Cannot create another Fleet Manager. Each organization has exactly one.');
  }

  const allowedRoles = [
    'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST',
    'MAINTENANCE_MANAGER', 'DRIVER_MANAGER', 'VIEWER', 'DRIVER',
  ];
  if (!allowedRoles.includes(role)) {
    throw new Error(`Invalid role '${role}'.`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered.');

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      fleetManagerId: callerFleetManagerId,
    },
  });

  return buildUserResponse(user);
};

/**
 * List all users in the Fleet Manager's organization.
 */
const listOrgUsers = async (callerFleetManagerId) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { id: callerFleetManagerId },            // The Fleet Manager themselves
        { fleetManagerId: callerFleetManagerId }, // Their sub-users
      ],
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true, email: true, name: true, role: true,
      isActive: true, isDefault: true, fleetManagerId: true,
      createdAt: true, updatedAt: true,
    },
  });

  return users.map(buildUserResponse);
};

/**
 * Get a single org user (Fleet Manager can only access their own org).
 */
const getOrgUser = async (userId, callerFleetManagerId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      OR: [
        { id: callerFleetManagerId },
        { fleetManagerId: callerFleetManagerId },
      ],
    },
  });

  if (!user) throw new Error('User not found in your organization.');
  return buildUserResponse(user);
};

/**
 * Update a user's name and/or role.
 */
const updateOrgUser = async (userId, data, callerFleetManagerId) => {
  const user = await getOrgUser(userId, callerFleetManagerId);

  if (user.isDefault && data.role && data.role !== 'FLEET_MANAGER') {
    throw new Error('Cannot change the role of the default Fleet Manager account.');
  }

  if (data.role === 'FLEET_MANAGER') {
    throw new Error('Cannot elevate a user to Fleet Manager role.');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
    },
  });

  return buildUserResponse(updated);
};

/**
 * Deactivate a user (soft delete — they can't log in).
 */
const deactivateOrgUser = async (userId, callerFleetManagerId) => {
  const user = await getOrgUser(userId, callerFleetManagerId);

  if (user.isDefault) {
    throw new Error('Cannot deactivate the default Fleet Manager account.');
  }
  if (userId === callerFleetManagerId) {
    throw new Error('Cannot deactivate yourself.');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  return buildUserResponse(updated);
};

/**
 * Reactivate a deactivated user.
 */
const activateOrgUser = async (userId, callerFleetManagerId) => {
  await getOrgUser(userId, callerFleetManagerId);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: true },
  });

  return buildUserResponse(updated);
};

/**
 * Reset a user's password (Fleet Manager sets a new password for a sub-user).
 */
const resetOrgUserPassword = async (userId, newPassword, callerFleetManagerId) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  await getOrgUser(userId, callerFleetManagerId);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password reset successfully.' };
};

/**
 * Delete a user. Cannot delete the default account or the caller.
 */
const deleteOrgUser = async (userId, callerFleetManagerId) => {
  const user = await getOrgUser(userId, callerFleetManagerId);

  if (user.isDefault) {
    throw new Error('Cannot delete the default Fleet Manager account.');
  }
  if (userId === callerFleetManagerId) {
    throw new Error('Cannot delete yourself.');
  }

  await prisma.user.delete({ where: { id: userId } });
  return { message: 'User deleted successfully.' };
};

module.exports = {
  login,
  getMe,
  logout,
  createOrgUser,
  listOrgUsers,
  getOrgUser,
  updateOrgUser,
  deactivateOrgUser,
  activateOrgUser,
  resetOrgUserPassword,
  deleteOrgUser,
};
