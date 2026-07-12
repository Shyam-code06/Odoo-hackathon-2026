const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/auth');

// Public routes (no auth required)
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected: current user info
router.get('/me', authenticateJWT, authController.getMe);

module.exports = router;
