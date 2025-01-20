const BaseModel = require('./BaseModel');
const { query: dbQuery } = require('../config/database');

class PersonModel extends BaseModel {
    constructor() {
        super('persons');
    }

    async findByName(name) {
        try {
            const result = await this.query(
                `SELECT * FROM persons 
                WHERE LOWER(first_name) LIKE LOWER($1) 
                OR LOWER(last_name) LIKE LOWER($1)`,
                [`%${name}%`]
            );
            return result.rows || [];
        } catch (error) {
            throw new Error(`İsme göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByIdentityNumber(identityNumber) {
        try {
            console.log('FindByIdentityNumber çağrıldı:', identityNumber);
            
            if (!identityNumber) {
                console.log('TC Kimlik no boş, null dönüyor');
                return null;
            }

            const result = await this.query(
                'SELECT * FROM persons WHERE identity_number = $1',
                [identityNumber]
            );

            console.log('FindByIdentityNumber DB sonucu:', result);
            return result.rows?.[0] || null;
        } catch (error) {
            console.error('FindByIdentityNumber hatası:', error);
            throw new Error(`Kimlik numarasına göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            console.log('FindByEmail çağrıldı:', email);
            
            if (!email) {
                console.log('Email boş, null dönüyor');
                return null;
            }

            const result = await this.query(
                'SELECT * FROM persons WHERE LOWER(email) = LOWER($1)',
                [email]
            );

            console.log('FindByEmail DB sonucu:', result);
            return result.rows?.[0] || null;
        } catch (error) {
            console.error('FindByEmail hatası:', error);
            throw new Error(`Email'e göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByType(type) {
        try {
            const result = await this.query(
                'SELECT * FROM persons WHERE type = $1',
                [type]
            );
            return result.rows || [];
        } catch (error) {
            throw new Error(`Türe göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByCity(city) {
        try {
            const result = await this.query(
                'SELECT * FROM persons WHERE city = $1',
                [city]
            );
            return result.rows || [];
        } catch (error) {
            throw new Error(`Şehre göre arama yapılamadı: ${error.message}`);
        }
    }

    async findByRepresentative(representativeId) {
        try {
            const result = await this.query(
                'SELECT * FROM persons WHERE representative_id = $1',
                [representativeId]
            );
            return result.rows || [];
        } catch (error) {
            throw new Error(`Temsilciye göre arama yapılamadı: ${error.message}`);
        }
    }

    async getFiles(personId) {
        try {
            const result = await this.query(
                `SELECT f.*, u.first_name as uploader_first_name, u.last_name as uploader_last_name
                FROM files f
                LEFT JOIN users u ON f.uploader_id = u.id
                WHERE f.entity_type = 'person' AND f.entity_id = $1
                ORDER BY f.created_at DESC`,
                [personId]
            );
            return result.rows || [];
        } catch (error) {
            throw new Error(`Dosyalar getirilemedi: ${error.message}`);
        }
    }

    async getAll() {
        try {
            console.log('GetAll çağrıldı');
            const result = await this.query(
                `SELECT 
                    p.*,
                    c.name as company_name
                FROM persons p
                LEFT JOIN companies c ON p.company_id = c.id
                ORDER BY p.first_name, p.last_name`,
                []
            );
            console.log('GetAll sonucu:', result.rows);
            return result.rows || [];
        } catch (error) {
            console.error('GetAll Error:', error);
            throw new Error(`Kişiler getirilemedi: ${error.message}`);
        }
    }

    async updatePerson(id, data) {
        try {
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error('Geçersiz ID formatı');
            }

            // Önce kişinin var olduğunu kontrol et
            const existingPerson = await this.findById(numericId);
            if (!existingPerson) {
                throw new Error(`ID ${numericId} olan kişi bulunamadı`);
            }

            const updateFields = [];
            const values = [];
            let paramCount = 1;

            // Sadece tanımlı alanları güncelle
            for (const [key, value] of Object.entries(data)) {
                // undefined değerleri atla, null değerleri kabul et
                if (value !== undefined) {
                    updateFields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            }

            // Güncelleme tarihi ekle
            updateFields.push('updated_at = CURRENT_TIMESTAMP');

            // ID'yi en son parametre olarak ekle
            values.push(numericId);

            const query = `
                UPDATE persons 
                SET ${updateFields.join(', ')}
                WHERE id = $${values.length}
                RETURNING *;
            `;

            console.log('Update Query:', query);
            console.log('Update Values:', values);

            const result = await this.query(query, values);
            
            console.log('Query Result:', result);
            
            // Sonuç direkt olarak dizi şeklinde geliyor
            if (!result || result.length === 0) {
                console.log('Güncelleme başarısız: Sonuç boş');
                throw new Error('Güncelleme başarısız: Kayıt bulunamadı');
            }

            console.log('Güncelleme başarılı:', result[0]);
            return result[0];
        } catch (error) {
            console.error('UpdatePerson Error:', error);
            if (error.code === '23505') {
                if (error.constraint?.includes('identity_number')) {
                    throw new Error('Bu TC Kimlik numarası başka bir kişi tarafından kullanılıyor');
                } else if (error.constraint?.includes('email')) {
                    throw new Error('Bu e-posta adresi başka bir kişi tarafından kullanılıyor');
                }
            }
            throw error;
        }
    }

    async searchCompanies(searchTerm) {
        try {
            const result = await this.query(
                `SELECT id, name 
                FROM companies 
                WHERE LOWER(name) LIKE LOWER($1)
                ORDER BY name`,
                [`%${searchTerm}%`]
            );
            return result.rows || [];
        } catch (error) {
            console.error('SearchCompanies Error:', error);
            throw new Error(`Şirket araması yapılamadı: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            console.log('FindById çağrıldı. ID:', id);
            
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                console.log('Geçersiz ID formatı:', id);
                throw new Error('Geçersiz ID formatı');
            }

            const result = await dbQuery(
                `SELECT p.*, c.name as company_name 
                 FROM persons p 
                 LEFT JOIN companies c ON p.company_id = c.id 
                 WHERE p.id = $1`,
                [numericId]
            );

            console.log('FindById DB sonucu:', result);

            if (!result || result.length === 0) {
                console.log(`ID ${numericId} olan kayıt bulunamadı`);
                throw new Error(`ID ${numericId} olan kayıt bulunamadı`);
            }

            const person = result[0];
            console.log('Bulunan kişi:', person);
            return person;
        } catch (error) {
            console.error('FindById Error:', error);
            throw error;
        }
    }

    async getStats() {
        try {
            const result = await this.query(`
                SELECT 
                    (SELECT COUNT(*) FROM persons) as persons_count,
                    (SELECT COUNT(*) FROM companies) as companies_count,
                    (SELECT COUNT(*) FROM files) as files_count
            `);
            
            return {
                persons: parseInt(result[0].persons_count),
                companies: parseInt(result[0].companies_count),
                files: parseInt(result[0].files_count)
            };
        } catch (error) {
            console.error('GetStats Error:', error);
            throw error;
        }
    }
}

module.exports = new PersonModel(); 