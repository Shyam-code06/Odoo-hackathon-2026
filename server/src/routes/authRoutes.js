const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticateJWT, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
