const multer = require('multer');
const path = require('path');

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_DIR || 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya türü kontrolü
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error = new Error('Desteklenmeyen dosya türü');
        error.status = 400;
        cb(error, false);
    }
};

// Dosya boyutu limiti (10MB)
const limits = {
    fileSize: 10 * 1024 * 1024
};

// Multer middleware'i
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

module.exports = upload; 