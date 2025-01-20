const BaseService = require('./BaseService');
const CompanyModel = require('../models/CompanyModel');

class CompanyService extends BaseService {
    constructor() {
        super(CompanyModel);
    }

    async validateCompanyData(data) {
        const errors = [];

        // Şirket adı kontrolü
        if (!data.name) {
            errors.push(this.validateError('Şirket adı gereklidir', 'name'));
        }

        // Şirket türü kontrolü
        if (!data.type) {
            errors.push(this.validateError('Şirket türü gereklidir', 'type'));
        } else if (!['anonim', 'limited', 'sahis', 'diger'].includes(data.type)) {
            errors.push(this.validateError('Geçersiz şirket türü', 'type'));
        }

        // Vergi numarası kontrolü
        if (data.tax_number && data.tax_number.length !== 10) {
            errors.push(this.validateError('Vergi numarası 10 haneli olmalıdır', 'tax_number'));
        }

        // E-posta kontrolü
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push(this.validateError('Geçerli bir e-posta adresi giriniz', 'email'));
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    async createCompany(data, userId) {
        try {
            // Validasyon
            await this.validateCompanyData(data);

            // Vergi numarası benzersiz mi?
            if (data.tax_number) {
                const existing = await this.model.findByTaxNumber(data.tax_number);
                if (existing) {
                    throw this.businessError('Bu vergi numarası başka bir şirket tarafından kullanılıyor');
                }
            }

            // Oluşturan kullanıcı bilgisini ekle
            data.created_by = userId;

            // Şirketi oluştur
            return await this.create(data);
        } catch (error) {
            throw Array.isArray(error) ? error : new Error(`Şirket oluşturulamadı: ${error.message}`);
        }
    }

    async updateCompany(id, data) {
        try {
            // Validasyon
            await this.validateCompanyData(data);

            // Vergi numarası değişiyorsa kontrol et
            if (data.tax_number) {
                const existing = await this.model.findByTaxNumber(data.tax_number);
                if (existing && existing.id !== id) {
                    throw this.businessError('Bu vergi numarası başka bir şirket tarafından kullanılıyor');
                }
            }

            // Şirketi güncelle
            return await this.update(id, data);
        } catch (error) {
            throw Array.isArray(error) ? error : new Error(`Şirket güncellenemedi: ${error.message}`);
        }
    }

    async searchCompanies(query = {}) {
        try {
            const { name, type, sector, city, representative } = query;
            let companies = [];

            if (name) {
                companies = await this.model.findByName(name);
            } else if (type) {
                companies = await this.model.findAll({ where: { type } });
            } else if (sector) {
                companies = await this.model.findBySector(sector);
            } else if (city) {
                companies = await this.model.findByCity(city);
            } else if (representative) {
                companies = await this.model.findByRepresentative(representative);
            } else {
                companies = await this.getAll();
            }

            return companies;
        } catch (error) {
            throw new Error(`Şirket araması başarısız: ${error.message}`);
        }
    }

    async getCompanyDetails(id) {
        try {
            const company = await this.model.getCompanyDetails(id);
            if (!company) {
                throw this.businessError('Şirket bulunamadı');
            }

            // Çalışanları getir
            const employees = await this.model.getEmployees(id);
            
            // Dosyaları getir
            const files = await this.model.getFiles(id);

            return {
                ...company,
                employees,
                files
            };
        } catch (error) {
            throw new Error(`Şirket detayları alınamadı: ${error.message}`);
        }
    }

    async addEmployee(companyId, personId, data) {
        try {
            // Şirket ve kişi var mı kontrol et
            const company = await this.getById(companyId);
            if (!company) {
                throw this.businessError('Şirket bulunamadı');
            }

            // Kişi zaten bu şirkette çalışıyor mu?
            const employees = await this.model.getEmployees(companyId);
            const existingEmployee = employees.find(e => e.id === personId);
            if (existingEmployee) {
                throw this.businessError('Bu kişi zaten şirkette çalışıyor');
            }

            // Çalışan bilgilerini ekle
            return await this.db.one(`
                INSERT INTO CompanyEmployees (company_id, person_id, position, department, is_active)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [companyId, personId, data.position, data.department, true]);
        } catch (error) {
            throw new Error(`Çalışan eklenemedi: ${error.message}`);
        }
    }

    async updateEmployee(companyId, personId, data) {
        try {
            return await this.db.oneOrNone(`
                UPDATE CompanyEmployees
                SET position = $3, department = $4, is_active = $5
                WHERE company_id = $1 AND person_id = $2
                RETURNING *
            `, [companyId, personId, data.position, data.department, data.is_active]);
        } catch (error) {
            throw new Error(`Çalışan bilgileri güncellenemedi: ${error.message}`);
        }
    }

    async removeEmployee(companyId, personId) {
        try {
            return await this.db.oneOrNone(`
                DELETE FROM CompanyEmployees
                WHERE company_id = $1 AND person_id = $2
                RETURNING *
            `, [companyId, personId]);
        } catch (error) {
            throw new Error(`Çalışan çıkarılamadı: ${error.message}`);
        }
    }

    async search(query) {
        try {
            if (!query) {
                return await this.getAll();
            }

            const searchQuery = `%${query}%`;
            const result = await this.model.query(
                `SELECT * FROM companies 
                WHERE name ILIKE $1 
                OR tax_number ILIKE $1 
                OR email ILIKE $1
                OR phone ILIKE $1
                OR address ILIKE $1`,
                [searchQuery]
            );

            return result.rows;
        } catch (error) {
            throw new Error(`Şirket araması başarısız: ${error.message}`);
        }
    }

    async count() {
        try {
            const result = await this.model.query('SELECT COUNT(*) as count FROM companies');
            console.log('Şirket sayısı sorgu sonucu:', result);
            if (!result || result.length === 0) {
                return 0;
            }
            return parseInt(result[0].count);
        } catch (error) {
            console.error('Şirket sayısı hatası:', error);
            throw new Error(`Şirket sayısı alınırken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = new CompanyService(); 