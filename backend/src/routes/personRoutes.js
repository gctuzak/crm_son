const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/PersonController');
const auth = require('../middleware/auth');

// Public routes
router.get('/stats', PersonController.getStats);
router.get('/search/companies', PersonController.searchCompanies);

// Protected routes
router.use(auth);
router.get('/', PersonController.getAll);
router.get('/:id', PersonController.getById);
router.post('/', PersonController.create);
router.put('/:id', PersonController.update);
router.delete('/:id', PersonController.delete);

module.exports = router; 