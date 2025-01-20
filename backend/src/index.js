const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connect } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Veritabanı bağlantısı
connect().catch(err => {
    console.error('Veritabanı bağlantı hatası:', err);
    process.exit(1);
});

// CORS ayarları
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// JSON parser
app.use(express.json());

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
    console.log('404 hatası:', req.method, req.originalUrl);
    res.status(404).json({
        success: false,
        message: 'Sayfa bulunamadı'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Sunucu hatası'
    });
});

app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app; 