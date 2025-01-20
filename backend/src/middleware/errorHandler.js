module.exports = (err, req, res, next) => {
    // Hata detaylarını logla
    console.error(err);

    // Multer dosya türü hatası kontrolü
    if (err.message === 'Desteklenmeyen dosya türü') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Hata türüne göre yanıt döndür
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            success: false,
            message: 'Validasyon hatası',
            errors: err.errors
        });
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Yetkilendirme hatası'
        });
    }

    if (err.name === 'BusinessError') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.code === '23505') { // Unique constraint violation
        return res.status(400).json({
            success: false,
            message: 'Bu kayıt zaten mevcut'
        });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({
            success: false,
            message: 'İlişkili kayıt bulunamadı'
        });
    }

    // Geliştirme ortamında detaylı hata bilgisi gönder
    if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
            success: false,
            message: err.message,
            stack: err.stack
        });
    }

    // Prodüksiyon ortamında genel hata mesajı gönder
    return res.status(500).json({
        success: false,
        message: 'Sunucu hatası'
    });
}; 