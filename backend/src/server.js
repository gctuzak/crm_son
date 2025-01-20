require('dotenv').config();
const app = require('./app');
const { connect } = require('./config/database');

const port = process.env.PORT || 3000;

// Veritabanı bağlantısını kur ve sunucuyu başlat
connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Sunucu ${port} portunda çalışıyor`);
        });
    })
    .catch(error => {
        console.error('Sunucu başlatılamadı:', error);
        process.exit(1);
    });
