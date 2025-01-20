require('dotenv').config({ path: '.env.test' });
const { connect, disconnect, pool } = require('../src/config/database');
const { createTables, dropTables } = require('../src/config/migrations');

// Test ortamı için timeout süresini artır
jest.setTimeout(30000);

// Her test suite öncesi
beforeAll(async () => {
    try {
        // Test veritabanına bağlan
        await connect();
        // Önce tabloları temizle
        await dropTables();
        // Sonra tabloları oluştur
        await createTables();
        console.log('Test ortamı hazırlandı');
    } catch (error) {
        console.error('Test ortamı hazırlanırken hata:', error);
        throw error;
    }
});

// Her test sonrası
afterEach(async () => {
    try {
        // Tabloları temizle
        await dropTables();
        // Tabloları yeniden oluştur
        await createTables();
        console.log('Test verileri temizlendi');
    } catch (error) {
        console.error('Test verileri temizlenirken hata:', error);
        throw error;
    }
});

// Her test suite sonrası
afterAll(async () => {
    try {
        // Tabloları temizle
        await dropTables();
        // Veritabanı bağlantısını kapat
        await disconnect();
        console.log('Test ortamı temizlendi');
    } catch (error) {
        console.error('Test ortamı temizlenirken hata:', error);
        throw error;
    }
}); 