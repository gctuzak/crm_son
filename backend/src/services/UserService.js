const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BaseService = require('./BaseService');
const UserModel = require('../models/UserModel');

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    async generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }

    async login(email, password) {
        try {
            const user = await this.model.findByEmail(email);
            if (!user) {
                throw new Error('Kullanıcı bulunamadı');
            }

            const isValidPassword = await this.validatePassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Geçersiz şifre');
            }

            if (!user.is_active) {
                throw new Error('Hesap devre dışı');
            }

            const token = await this.generateToken(user);
            const safeUser = await this.model.getSafeUser(user);

            return { user: safeUser, token };
        } catch (error) {
            throw new Error(`Giriş başarısız: ${error.message}`);
        }
    }

    async register(userData) {
        try {
            const { email, password, first_name, last_name } = userData;

            if (!email || !password || !first_name || !last_name) {
                throw new Error('Email, şifre, ad ve soyad zorunludur');
            }

            const existingUser = await this.model.findByEmail(email);
            if (existingUser) {
                throw new Error('Bu email adresi zaten kullanımda');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await this.model.create({
                email,
                password: hashedPassword,
                first_name,
                last_name,
                is_active: true
            });

            const token = await this.generateToken(user);
            const safeUser = await this.model.getSafeUser(user);

            return { user: safeUser, token };
        } catch (error) {
            throw new Error(`Kayıt başarısız: ${error.message}`);
        }
    }

    async updateProfile(userId, userData) {
        try {
            if (userData.email) {
                const existingUser = await this.model.findByEmail(userData.email);
                if (existingUser && existingUser.id !== userId) {
                    throw new Error('Bu email adresi zaten kullanımda');
                }
            }

            const user = await this.model.update(userId, userData);
            return await this.model.getSafeUser(user);
        } catch (error) {
            throw new Error(`Profil güncellenemedi: ${error.message}`);
        }
    }

    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error('Kullanıcı bulunamadı');
            }

            const isValidPassword = await this.validatePassword(currentPassword, user.password);
            if (!isValidPassword) {
                throw new Error('Mevcut şifre yanlış');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await this.model.update(userId, { password: hashedPassword });
        } catch (error) {
            throw new Error(`Şifre değiştirilemedi: ${error.message}`);
        }
    }

    async deactivateUser(userId) {
        try {
            await this.model.update(userId, { is_active: false });
        } catch (error) {
            throw new Error(`Hesap devre dışı bırakılamadı: ${error.message}`);
        }
    }

    async listUsers() {
        try {
            const users = await this.model.findActiveUsers();
            return Promise.all(users.map(user => this.model.getSafeUser(user)));
        } catch (error) {
            throw new Error(`Kullanıcılar listelenemedi: ${error.message}`);
        }
    }
}

module.exports = new UserService(); 