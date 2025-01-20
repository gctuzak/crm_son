const { Pool } = require('pg');
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'crm_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Beklenmeyen veritabanı hatası:', err);
});

const connect = async () => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Veritabanı bağlantısı başarılı:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        throw error;
    } finally {
        if (client) client.release();
    }
};

const disconnect = async () => {
    try {
        await pool.end();
        console.log('Veritabanı bağlantısı kapatıldı');
    } catch (error) {
        console.error('Veritabanı bağlantısı kapatılırken hata:', error);
        throw error;
    }
};

const query = async (text, params = []) => {
    const client = await pool.connect();
    try {
        console.log('SQL Query:', text);
        console.log('Query Params:', params);
        
        const result = await client.query(text, params);
        console.log('Query Result Rows:', result.rows);
        
        return result;
    } catch (error) {
        console.error('Sorgu hatası:', error);
        throw error;
    } finally {
        client.release();
    }
};

process.on('SIGINT', async () => {
    try {
        await disconnect();
    } catch (error) {
        console.error('Kapatma sırasında hata:', error);
    } finally {
        process.exit(0);
    }
});

module.exports = {
    connect,
    disconnect,
    query,
    pool
}; 