const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    // If invalid password or email, return 401 Unauthorized
    if (err.message.includes('Invalid') || err.message.includes('denied')) {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getMe(userId);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // Statelss JWT logout. Client side deletes token.
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }
    const result = await authService.register(email, password, name, role);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message.includes('already registered')) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
};

module.exports = {
  login,
  getMe,
  logout,
  register,
};
