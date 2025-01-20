const User = require('../models/User');
const { ApiError } = require('../utils/errors');

const userController = {
    // Tüm kullanıcıları getir
    getAll: async (req, res) => {
        try {
            const users = await User.find();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            throw new ApiError('Kullanıcılar getirilirken bir hata oluştu', 500);
        }
    },

    // Tek kullanıcı getir
    getById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new ApiError('Kullanıcı bulunamadı', 404);
            }
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error.name === 'CastError') {
                throw new ApiError('Geçersiz kullanıcı ID', 400);
            }
            throw error;
        }
    },

    // Yeni kullanıcı oluştur
    create: async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ApiError('Bu e-posta adresi zaten kullanımda', 400);
            }
            throw new ApiError('Kullanıcı oluşturulurken bir hata oluştu', 500);
        }
    },

    // Kullanıcı güncelle
    update: async (req, res) => {
        try {
            const updates = req.body;
            const user = await User.findById(req.params.id);
            
            if (!user) {
                throw new ApiError('Kullanıcı bulunamadı', 404);
            }

            // Şifre güncellenmiyorsa, şifre alanını kaldır
            if (!updates.password) {
                delete updates.password;
            }

            Object.keys(updates).forEach(key => {
                user[key] = updates[key];
            });

            await user.save();
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error.code === 11000) {
                throw new ApiError('Bu e-posta adresi zaten kullanımda', 400);
            }
            throw error;
        }
    },

    // Kullanıcı sil
    delete: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                throw new ApiError('Kullanıcı bulunamadı', 404);
            }
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            throw new ApiError('Kullanıcı silinirken bir hata oluştu', 500);
        }
    },

    // Kullanıcı durumunu değiştir
    toggleStatus: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new ApiError('Kullanıcı bulunamadı', 404);
            }

            user.is_active = !user.is_active;
            await user.save();

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            throw new ApiError('Kullanıcı durumu güncellenirken bir hata oluştu', 500);
        }
    }
};

module.exports = userController; 