const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');

// Ana endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'CRM API çalışıyor',
        version: '1.0.0'
    });
});

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