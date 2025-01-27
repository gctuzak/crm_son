const express = require('express');
const router = express.Router();
const personController = require('./controllers/PersonController');
const companyController = require('./controllers/CompanyController');
const fileController = require('./controllers/FileController');
const StatsController = require('./controllers/StatsController');
const customerRoutes = require('./routes/customer');

// Ana endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'CRM Item API',
        version: '1.1.4',
        timestamp: new Date()
    });
});

// Kişi route'ları
router.use('/persons', require('./routes/person'));

// Şirket route'ları
router.use('/companies', require('./routes/company'));

// Dosya route'ları
router.use('/files', require('./routes/file'));

// Ürün route'ları
router.use('/products', require('./routes/product'));

// Müşteri route'ları
router.use('/customers', customerRoutes);

router.get('/persons/stats', personController.getStats);

// Stats route'ları
router.get('/stats', (req, res) => {
    console.log('Stats endpoint çağrıldı');
    res.json({
        success: true,
        message: 'Stats API çalışıyor'
    });
});

router.get('/stats/dashboard', async (req, res) => {
    console.log('Dashboard endpoint çağrıldı');
    try {
        await StatsController.getDashboardStats(req, res);
    } catch (error) {
        console.error('Dashboard hatası:', error);
        res.status(500).json({
            success: false,
            message: 'İstatistikler alınamadı: ' + error.message
        });
    }
});

module.exports = router; 