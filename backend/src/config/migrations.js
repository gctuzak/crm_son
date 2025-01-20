const { query } = require('./database');

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
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Companies tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                tax_number VARCHAR(20) UNIQUE NOT NULL,
                tax_office VARCHAR(100),
                address TEXT,
                phone VARCHAR(20),
                sector VARCHAR(100),
                city VARCHAR(100),
                representative_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
                identity_number VARCHAR(20) UNIQUE NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(20),
                address TEXT,
                type VARCHAR(50),
                city VARCHAR(100),
                representative_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Company_Employees tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS company_employees (
                id SERIAL PRIMARY KEY,
                company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
                person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
                position VARCHAR(100),
                department VARCHAR(100),
                is_active BOOLEAN DEFAULT true,
                start_date DATE,
                end_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(company_id, person_id)
            )
        `);

        // Files tablosu
        await query(`
            CREATE TABLE IF NOT EXISTS files (
                id SERIAL PRIMARY KEY,
                entity_type VARCHAR(50) NOT NULL,
                entity_id INTEGER NOT NULL,
                file_name VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                mime_type VARCHAR(100) NOT NULL,
                size INTEGER NOT NULL,
                path TEXT NOT NULL,
                uploader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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

const dropTables = async () => {
    try {
        await query('DROP TABLE IF EXISTS files CASCADE');
        await query('DROP TABLE IF EXISTS company_employees CASCADE');
        await query('DROP TABLE IF EXISTS companies CASCADE');
        await query('DROP TABLE IF EXISTS persons CASCADE');
        await query('DROP TABLE IF EXISTS users CASCADE');
        console.log('Tablolar başarıyla silindi');
    } catch (error) {
        console.error('Tablo silme hatası:', error);
        throw error;
    }
};

module.exports = {
    createTables,
    dropTables
}; 