const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);
router.put('/change-password', auth, UserController.changePassword);
router.put('/deactivate', auth, UserController.deactivateUser);
router.get('/users', auth, UserController.listUsers);

module.exports = router; 