const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Check role restriction: DRIVER role is not allowed to login (only 4 admin roles)
  const allowedRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Access denied. Role not authorized to login.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    env.JWT_SECRET || 'your_fallback_secret_key',
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found.');
  }

  return user;
};

const register = async (email, password, name, role) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered.');
  }

  const allowedRoles = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST', 'DRIVER'];
  const userRole = role && allowedRoles.includes(role.toUpperCase()) ? role.toUpperCase() : 'DRIVER';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: userRole,
    },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    env.JWT_SECRET || 'your_fallback_secret_key',
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

module.exports = {
  login,
  getMe,
  register,
};
