const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crm_db',
    password: 'postgres',
    port: 5432,
});

// Bağlantıyı test et
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
    } else {
        console.log('Veritabanı bağlantısı başarılı:', res.rows[0]);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 