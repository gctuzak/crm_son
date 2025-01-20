const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/PersonController');
const PersonService = require('../services/PersonService');

// Debug middleware
router.use((req, res, next) => {
    console.log('Person Route:', req.method, req.url);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

// CRUD işlemleri
router.post('/', PersonController.create);
router.get('/', PersonController.getAll);
router.get('/:id', PersonController.getById);
router.put('/:id', PersonController.update);
router.delete('/:id', PersonController.delete);

router.post('/:id/employment', async (req, res) => {
    try {
        const { id } = req.params;
        const employmentData = req.body;
        const result = await PersonService.addEmployment(id, employmentData);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 