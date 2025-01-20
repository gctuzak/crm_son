const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');

// Debug middleware
router.use((req, res, next) => {
    console.log('Company Route:', req.method, req.url);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

// CRUD işlemleri
router.post('/', CompanyController.create);
router.get('/', CompanyController.getAll);

// Arama endpoint'i - parametreli route'lardan ÖNCE tanımlanmalı
router.get('/search', CompanyController.search);

// Parametreli route'lar en sonda olmalı
router.get('/:id', CompanyController.getById);
router.put('/:id', CompanyController.update);
router.delete('/:id', CompanyController.delete);

module.exports = router; 