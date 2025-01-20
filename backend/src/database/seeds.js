const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const createDefaultAdmin = async () => {
    try {
        // Önce admin kullanıcısının var olup olmadığını kontrol et
        const existingAdmin = await query(
            'SELECT * FROM users WHERE email = $1',
            ['admin@example.com']
        );

        if (existingAdmin.length === 0) {
            // Admin kullanıcısı yoksa oluştur
            const hashedPassword = await bcrypt.hash('Admin123!', 10);
            await query(
                `INSERT INTO users (
                    first_name,
                    last_name,
                    email,
                    password,
                    role,
                    is_active
                ) VALUES ($1, $2, $3, $4, $5, $6)`,
                ['Admin', 'User', 'admin@example.com', hashedPassword, 'admin', true]
            );
            console.log('Varsayılan admin kullanıcısı oluşturuldu');
        } else {
            console.log('Admin kullanıcısı zaten mevcut');
        }
    } catch (error) {
        console.error('Admin kullanıcısı oluşturulurken hata:', error);
        throw error;
    }
};

const runSeeds = async () => {
    try {
        await createDefaultAdmin();
        console.log('Seed işlemi başarıyla tamamlandı');
        process.exit(0);
    } catch (error) {
        console.error('Seed işlemi sırasında hata:', error);
        process.exit(1);
    }
};

runSeeds(); 