const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const CustomerController = require('../controllers/CustomerController');

// Şirket route'ları
router.post('/companies', auth, CustomerController.createCompany);
router.put('/companies/:id', auth, CustomerController.updateCompany);
router.get('/companies/:id', auth, CustomerController.getCompany);
router.get('/companies', auth, CustomerController.getAllCompanies);

// Kişi route'ları
router.post('/persons', auth, CustomerController.createPerson);
router.put('/persons/:id', auth, CustomerController.updatePerson);
router.get('/persons/:id', auth, CustomerController.getPerson);
router.get('/persons', auth, CustomerController.getAllPersons);

// Şirket çalışanları route'ları
router.get('/companies/:companyId/employees', auth, CustomerController.getCompanyEmployees);
router.put('/company-employees/:id', auth, CustomerController.updateCompanyEmployee);

module.exports = router; 