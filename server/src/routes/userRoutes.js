const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const { requireFleetManager } = require('../middlewares/permissions');
const userController = require('../controllers/userController');

// All user management routes require authentication + Fleet Manager role
router.use(authenticateJWT);
router.use(requireFleetManager);

// List all org users
router.get('/', userController.listUsers);

// Get single user
router.get('/:id', userController.getUser);

// Create a new user in the org
router.post('/', userController.createUser);

// Update user details (name, email, role)
router.put('/:id', userController.updateUser);

// Deactivate / Activate
router.patch('/:id/deactivate', userController.deactivateUser);
router.patch('/:id/activate', userController.activateUser);

// Reset password
router.patch('/:id/reset-password', userController.resetUserPassword);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
