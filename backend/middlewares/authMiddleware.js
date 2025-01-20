const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/errors');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new ApiError('Lütfen giriş yapın', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.is_active) {
            throw new ApiError('Kullanıcı bulunamadı veya hesap pasif', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new ApiError('Geçersiz token', 401));
        } else {
            next(error);
        }
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        throw new ApiError('Bu işlem için yetkiniz yok', 403);
    }
    next();
};

const hasRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError('Bu işlem için yetkiniz yok', 403);
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    isAdmin,
    hasRole
}; 