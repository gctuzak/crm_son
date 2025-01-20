const { query } = require('../config/database');

const statsController = {
    getDashboardStats: async (req, res) => {
        try {
            // Kişi sayısı
            const personResult = await query(
                'SELECT COUNT(*) as count FROM persons'
            );
            console.log('Kişi sayısı:', personResult.rows[0].count);

            // Şirket sayısı
            const companyResult = await query(
                'SELECT COUNT(*) as count FROM companies'
            );
            console.log('Şirket sayısı:', companyResult.rows[0].count);

            // Dosya sayısı
            const fileResult = await query(
                'SELECT COUNT(*) as count FROM files'
            );
            console.log('Dosya sayısı:', fileResult.rows[0].count);

            // Yanıtı hazırla
            const response = {
                success: true,
                stats: {
                    persons: parseInt(personResult.rows[0].count) || 0,
                    companies: parseInt(companyResult.rows[0].count) || 0,
                    files: parseInt(fileResult.rows[0].count) || 0
                }
            };

            console.log('Stats yanıtı:', response);
            res.json(response);
        } catch (error) {
            console.error('Stats hatası:', error);
            res.status(500).json({
                success: false,
                message: 'İstatistikler alınamadı: ' + error.message
            });
        }
    }
};

module.exports = statsController; 