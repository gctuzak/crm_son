const { query } = require('../config/database');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async query(text, params = []) {
        try {
            console.log('SQL Query:', {
                text: text,
                params: params
            });
            const result = await query(text, params);
            console.log('Query Result:', {
                rowCount: result.rowCount,
                rows: result.rows,
                command: result.command
            });
            return result;
        } catch (error) {
            console.error('Query Error:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            return await this.query(`SELECT * FROM ${this.tableName}`);
        } catch (error) {
            throw new Error(`Kayıtlar getirilemedi: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            console.log('FindById başladı:', {
                id: id,
                tableName: this.tableName
            });

            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                console.log('Geçersiz ID formatı:', id);
                return null;
            }

            const result = await this.query(
                `SELECT * FROM ${this.tableName} WHERE id = $1`,
                [numericId]
            );

            const record = result.rows?.[0] || null;
            console.log('FindById sonucu:', {
                id: numericId,
                found: !!record,
                record: record
            });

            return record;
        } catch (error) {
            console.error('FindById hatası:', error);
            return null;
        }
    }

    async create(data) {
        try {
            const columns = Object.keys(data);
            const values = Object.values(data);
            const placeholders = values.map((_, index) => `$${index + 1}`);

            const result = await this.query(
                `INSERT INTO ${this.tableName} (${columns.join(', ')})
                VALUES (${placeholders.join(', ')})
                RETURNING *`,
                values
            );

            return result.rows?.[0] || null;
        } catch (error) {
            throw new Error(`Kayıt oluşturulamadı: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const columns = Object.keys(data);
            const values = Object.values(data);
            const setClause = columns
                .map((col, index) => `${col} = $${index + 1}`)
                .join(', ');

            const result = await this.query(
                `UPDATE ${this.tableName}
                SET ${setClause}
                WHERE id = $${values.length + 1}
                RETURNING *`,
                [...values, id]
            );

            return result.rows?.[0] || null;
        } catch (error) {
            throw new Error(`Kayıt güncellenemedi: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            console.log('Delete işlemi başladı:', {
                id: id,
                tableName: this.tableName
            });
            
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error('Geçersiz ID formatı');
            }

            // Doğrudan silme işlemini gerçekleştir
            const result = await this.query(
                `WITH deleted AS (
                    DELETE FROM ${this.tableName}
                    WHERE id = $1
                    RETURNING *
                )
                SELECT COUNT(*) as count FROM deleted`,
                [numericId]
            );

            // Silinen kayıt sayısını kontrol et
            const count = parseInt(result.rows[0]?.count || '0');
            if (count === 0) {
                throw new Error('Kayıt bulunamadı');
            }

            return { success: true, message: 'Kayıt başarıyla silindi' };
        } catch (error) {
            console.error('Delete hatası:', error);
            throw error;
        }
    }
}

module.exports = BaseModel; 