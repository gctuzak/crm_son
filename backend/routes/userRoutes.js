const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', asyncHandler(authController.login));

// Protected routes
router.use(authMiddleware);

// Kullanıcı listesi - Sadece admin ve yöneticiler
router.get('/', isAdmin, asyncHandler(userController.getAll));

// Kullanıcı detayı
router.get('/:id', asyncHandler(userController.getById));

// Yeni kullanıcı oluşturma - Sadece admin
router.post('/', isAdmin, asyncHandler(userController.create));

// Kullanıcı güncelleme
router.put('/:id', asyncHandler(userController.update));

// Kullanıcı silme - Sadece admin
router.delete('/:id', isAdmin, asyncHandler(userController.delete));

// Kullanıcı durumu değiştirme - Sadece admin
router.patch('/:id/toggle-status', isAdmin, asyncHandler(userController.toggleStatus));

module.exports = router; 