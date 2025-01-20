const { query } = require('../config/database');

const createTables = async () => {
    try {
        // Users tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Persons tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS persons (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                identity_number VARCHAR(20),
                email VARCHAR(255),
                phone VARCHAR(20),
                address TEXT,
                type VARCHAR(50) DEFAULT 'individual',
                city VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Companies tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) DEFAULT 'limited',
                tax_number VARCHAR(20),
                tax_office VARCHAR(100),
                address TEXT,
                phone VARCHAR(20),
                sector VARCHAR(100),
                city VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Files tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                path VARCHAR(255) NOT NULL,
                size INTEGER NOT NULL,
                mime_type VARCHAR(100) NOT NULL,
                entity_type VARCHAR(50) NOT NULL,
                entity_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Tablolar başarıyla oluşturuldu');
    } catch (error) {
        console.error('Tablo oluşturma hatası:', error);
        throw error;
    }
};

const runMigrations = async () => {
    try {
        await createTables();
        console.log('Migrations başarıyla tamamlandı');
        process.exit(0);
    } catch (error) {
        console.error('Migration hatası:', error);
        process.exit(1);
    }
};

runMigrations(); 