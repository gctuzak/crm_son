const express = require('express');
const router = express.Router();
const FileController = require('../controllers/FileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Debug middleware
router.use((req, res, next) => {
    console.log('File Route:', req.method, req.url);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

// CRUD işlemleri
router.post('/:entityType/:entityId', upload.single('file'), FileController.create);
router.get('/', FileController.getAll);
router.get('/:id', FileController.getById);
router.delete('/:id', FileController.delete);

module.exports = router; 