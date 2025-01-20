const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

// Public routes (auth gerektirmeyen)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes (auth gerektiren)
router.use(auth);
router.get('/me', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/change-password', UserController.changePassword);
router.get('/users', UserController.listUsers);
router.put('/deactivate', UserController.deactivateUser);

module.exports = router; 