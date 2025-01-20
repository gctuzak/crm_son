const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
    constructor() {
        super('users');
    }

    async findByEmail(email) {
        try {
            const users = await this.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return users[0];
        } catch (error) {
            throw new Error(`Email ile kullanıcı bulunamadı: ${error.message}`);
        }
    }

    async findActiveUsers() {
        try {
            return await this.query(
                'SELECT * FROM users WHERE is_active = true'
            );
        } catch (error) {
            throw new Error(`Aktif kullanıcılar getirilemedi: ${error.message}`);
        }
    }

    async getSafeUser(user) {
        if (!user) return null;
        const { password, ...safeUser } = user;
        return safeUser;
    }
}

module.exports = new UserModel(); 