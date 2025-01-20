const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');
const upload = require('../middleware/upload');

// Temel CRUD işlemleri
router.post('/:entityType/:entityId', upload.single('file'), FileController.create);
router.get('/', FileController.getAll);
router.get('/:id', FileController.getById);
router.delete('/:id', FileController.delete);

module.exports = router; 