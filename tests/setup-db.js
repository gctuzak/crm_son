const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function setupTestDatabase() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres'
    });

    try {
        await client.connect();

        // Test veritabanını oluştur
        await client.query('DROP DATABASE IF EXISTS crm_db');
        await client.query('CREATE DATABASE crm_db');

        // Bağlantıyı kapat
        await client.end();

        // Test veritabanına bağlan
        const testClient = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'postgres',
            database: 'crm_db'
        });

        await testClient.connect();

        // Schema dosyasını oku ve çalıştır
        const schemaPath = path.join(__dirname, '..', 'src', 'database', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf-8');
        await testClient.query(schema);

        console.log('Test veritabanı başarıyla oluşturuldu');
        await testClient.end();
    } catch (error) {
        console.error('Test veritabanı oluşturulurken hata:', error);
        process.exit(1);
    }
}

// Test veritabanını oluştur
setupTestDatabase(); 