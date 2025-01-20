const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Veritabanı bağlantısı
connectDB();

// Routes - /api prefix'ini kaldırıyoruz
app.use('/', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı'
    });
});

module.exports = app; 