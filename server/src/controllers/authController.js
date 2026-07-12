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
    if (err.message.includes('Invalid') || err.message.includes('denied') || err.message.includes('deactivated')) {
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
    const result = await authService.logout();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getMe,
  logout,
};
