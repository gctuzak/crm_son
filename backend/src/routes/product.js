const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Kategori ve birim route'ları
router.get('/categories', ProductController.getCategories);
router.get('/units', ProductController.getUnits);

// Ürün route'ları
router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router; 