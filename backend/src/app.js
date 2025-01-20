const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./utils/errors');

const app = express();

// Middleware'ler
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API route'ları
app.use('/api', routes);

// Hata yakalama
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı'
    });
});

module.exports = app; 