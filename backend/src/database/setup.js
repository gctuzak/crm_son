const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const setupDatabase = async () => {
    try {
        // SQL dosyasını oku
        const sqlFile = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // SQL komutlarını çalıştır
        await db.none(sql);
        
        console.log('Veritabanı başarıyla kuruldu');
        process.exit(0);
    } catch (error) {
        console.error('Veritabanı kurulum hatası:', error);
        process.exit(1);
    }
};

setupDatabase(); 