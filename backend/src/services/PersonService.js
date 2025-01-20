const BaseService = require('./BaseService');
const PersonModel = require('../models/PersonModel');

class PersonService extends BaseService {
    constructor() {
        super(PersonModel);
    }

    async validatePersonData(data) {
        const errors = [];

        // Ad ve soyad kontrolü
        if (!data.first_name) {
            errors.push(this.validateError('Ad gereklidir', 'first_name'));
        }
        if (!data.last_name) {
            errors.push(this.validateError('Soyad gereklidir', 'last_name'));
        }

        // Kişi türü kontrolü
        if (!data.type) {
            errors.push(this.validateError('Kişi türü gereklidir', 'type'));
        } else if (!['individual', 'employee', 'freelancer'].includes(data.type)) {
            errors.push(this.validateError('Geçersiz kişi türü', 'type'));
        }

        // TC Kimlik kontrolü - opsiyonel
        if (data.identity_number && data.identity_number.length !== 11) {
            errors.push(this.validateError('TC Kimlik numarası 11 haneli olmalıdır', 'identity_number'));
        }

        // E-posta kontrolü - opsiyonel
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push(this.validateError('Geçerli bir e-posta adresi giriniz', 'email'));
            }
        }

        // company_id kontrolü - opsiyonel
        if (data.company_id) {
            if (isNaN(parseInt(data.company_id))) {
                errors.push(this.validateError('Geçersiz şirket ID', 'company_id'));
            }
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    async createPerson(data) {
        try {
            // Validasyon
            await this.validatePersonData(data);

            // TC Kimlik benzersiz mi?
            if (data.identity_number) {
                const existing = await this.model.findByIdentityNumber(data.identity_number);
                if (existing) {
                    throw this.businessError('Bu TC Kimlik numarası başka bir kişi tarafından kullanılıyor');
                }
            }

            // E-posta benzersiz mi?
            if (data.email) {
                const existing = await this.model.findByEmail(data.email);
                if (existing) {
                    throw this.businessError('Bu e-posta adresi başka bir kişi tarafından kullanılıyor');
                }
            }

            // Kişiyi oluştur
            return await this.create(data);
        } catch (error) {
            throw Array.isArray(error) ? error : new Error(`Kişi oluşturulamadı: ${error.message}`);
        }
    }

    async updatePerson(id, data) {
        try {
            console.log('UpdatePerson başladı. ID:', id, 'Data:', data);
            
            // ID kontrolü
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw this.businessError('Geçersiz ID formatı');
            }

            // Veri dönüşümleri
            const personData = {
                first_name: data.first_name?.trim(),
                last_name: data.last_name?.trim(),
                email: data.email?.trim() || null,
                phone: data.phone?.trim() || null,
                city: data.city?.trim() || null,
                address: data.address?.trim() || null,
                type: data.type,
                identity_number: data.identity_number?.trim() || null,
                company_id: data.company_id ? parseInt(data.company_id) : null
            };

            // Validasyon
            await this.validatePersonData(personData);

            // Mevcut kişiyi kontrol et
            const currentPerson = await this.model.findById(numericId);
            if (!currentPerson) {
                throw this.businessError(`ID ${numericId} olan kişi bulunamadı`);
            }

            // TC Kimlik değişiyorsa kontrol et
            if (personData.identity_number && personData.identity_number !== currentPerson.identity_number) {
                const existing = await this.model.findByIdentityNumber(personData.identity_number);
                console.log('TC Kimlik kontrolü sonucu:', existing);
                
                if (existing && existing.id !== numericId) {
                    throw this.businessError(`Bu TC Kimlik numarası (${personData.identity_number}) başka bir kişi tarafından kullanılıyor`);
                }
            }

            // E-posta değişiyorsa kontrol et
            if (personData.email && personData.email.toLowerCase() !== (currentPerson.email || '').toLowerCase()) {
                const existing = await this.model.findByEmail(personData.email);
                console.log('Email kontrolü sonucu:', existing);
                
                if (existing && existing.id !== numericId) {
                    throw this.businessError(`Bu e-posta adresi (${personData.email}) başka bir kişi tarafından kullanılıyor`);
                }
            }

            console.log('Güncellenecek veri:', personData);

            const updatedPerson = await this.model.updatePerson(numericId, personData);
            if (!updatedPerson) {
                throw this.businessError(`Kişi güncellenemedi: Kayıt bulunamadı`);
            }

            console.log('Güncelleme sonucu:', updatedPerson);
            return updatedPerson;
        } catch (error) {
            console.error('UpdatePerson hatası:', error);
            if (error.message.includes('duplicate key value violates unique constraint')) {
                if (error.message.includes('identity_number')) {
                    throw this.businessError('Bu TC Kimlik numarası başka bir kişi tarafından kullanılıyor');
                } else if (error.message.includes('email')) {
                    throw this.businessError('Bu e-posta adresi başka bir kişi tarafından kullanılıyor');
                }
            }
            throw Array.isArray(error) ? error : this.businessError(error.message);
        }
    }

    async searchPersons(query = {}) {
        try {
            const { name, type, city, representative } = query;
            let persons = [];

            if (name) {
                persons = await this.model.findByName(name);
            } else if (type) {
                persons = await this.model.findByType(type);
            } else if (city) {
                persons = await this.model.findByCity(city);
            } else if (representative) {
                persons = await this.model.findByRepresentative(representative);
            } else {
                persons = await this.getAll();
            }

            return persons;
        } catch (error) {
            throw new Error(`Kişi araması başarısız: ${error.message}`);
        }
    }

    async getPersonDetails(id) {
        try {
            const person = await this.model.getPersonDetails(id);
            if (!person) {
                throw this.businessError('Kişi bulunamadı');
            }

            // Çalıştığı şirketleri getir
            const companies = await this.model.getCompanies(id);
            
            // Dosyaları getir
            const files = await this.model.getFiles(id);

            return {
                ...person,
                companies,
                files
            };
        } catch (error) {
            throw new Error(`Kişi detayları alınamadı: ${error.message}`);
        }
    }

    async getActiveCompanies(id) {
        try {
            return await this.model.getActiveCompanies(id);
        } catch (error) {
            throw new Error(`Aktif şirketler alınamadı: ${error.message}`);
        }
    }

    async getEmployeeCount(companyId) {
        try {
            return await this.model.getCompanyEmployeeCount(companyId);
        } catch (error) {
            throw new Error(`Çalışan sayısı alınamadı: ${error.message}`);
        }
    }

    async addEmployment(data) {
        try {
            // Veri kontrolü
            if (!data || typeof data !== 'object') {
                throw new Error('Geçersiz istihdam verisi');
            }

            // person_id kontrolü
            const parsedPersonId = parseInt(data.person_id);
            if (isNaN(parsedPersonId)) {
                throw new Error('Geçersiz kişi ID');
            }

            // company_id kontrolü
            const parsedCompanyId = parseInt(data.company_id);
            if (isNaN(parsedCompanyId)) {
                throw new Error('Geçersiz şirket ID');
            }

            // Zorunlu alan kontrolü
            if (!data.position || typeof data.position !== 'string') {
                throw new Error('Pozisyon alanı zorunludur');
            }
            if (!data.department || typeof data.department !== 'string') {
                throw new Error('Departman alanı zorunludur');
            }

            // Kişi kontrolü
            const person = await this.model.findById(parsedPersonId);
            if (!person) {
                throw new Error('Kişi bulunamadı');
            }

            // Mevcut istihdam kontrolü
            const currentEmployment = await this.model.getCurrentEmployment(parsedPersonId);
            if (currentEmployment && currentEmployment.company_id === parsedCompanyId) {
                throw new Error('Bu kişi zaten bu şirkette çalışıyor');
            }

            const employmentData = {
                person_id: parsedPersonId,
                company_id: parsedCompanyId,
                position: data.position.trim(),
                department: data.department.trim(),
                is_active: true
            };

            const result = await this.model.addEmployment(employmentData);
            return { success: true, data: result };
        } catch (error) {
            console.error('AddEmployment hatası:', error);
            if (error.message.includes('foreign key constraint')) {
                throw new Error('Geçersiz şirket veya kişi ID');
            }
            throw new Error(`İstihdam bilgisi eklenemedi: ${error.message}`);
        }
    }

    validateError(message, field) {
        return {
            message,
            field
        };
    }

    businessError(message) {
        return new Error(message);
    }

    async findByEmail(email) {
        try {
            const result = await this.model.query(
                'SELECT * FROM persons WHERE LOWER(email) = LOWER($1)',
                [email]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(`E-posta ile kişi arama hatası: ${error.message}`);
        }
    }

    async searchCompanies(searchTerm) {
        try {
            if (!searchTerm || searchTerm.length < 2) {
                return [];
            }
            return await this.model.searchCompanies(searchTerm);
        } catch (error) {
            console.error('SearchCompanies Error:', error);
            throw this.businessError(`Şirket araması yapılamadı: ${error.message}`);
        }
    }

    async getStats() {
        try {
            const [
                totalPersons,
                totalCompanies,
                totalFiles
            ] = await Promise.all([
                this.model.query('SELECT COUNT(*) as count FROM persons'),
                this.model.query('SELECT COUNT(*) as count FROM companies'),
                this.model.query('SELECT COUNT(*) as count FROM files')
            ]);

            return {
                persons: parseInt(totalPersons.rows[0].count),
                companies: parseInt(totalCompanies.rows[0].count),
                files: parseInt(totalFiles.rows[0].count)
            };
        } catch (error) {
            console.error('GetStats Error:', error);
            throw new Error('İstatistikler alınamadı: ' + error.message);
        }
    }

    async count() {
        try {
            const result = await this.model.query('SELECT COUNT(*) as count FROM persons');
            console.log('Kişi sayısı sorgu sonucu:', result);
            if (!result || result.length === 0) {
                return 0;
            }
            return parseInt(result[0].count);
        } catch (error) {
            console.error('Kişi sayısı hatası:', error);
            throw new Error(`Kişi sayısı alınırken hata oluştu: ${error.message}`);
        }
    }

    async getAll() {
        try {
            const result = await this.model.query(`
                SELECT 
                    p.*,
                    c.name as company_name
                FROM persons p
                LEFT JOIN companies c ON p.company_id = c.id
                ORDER BY p.created_at DESC
            `);
            return result;
        } catch (error) {
            console.error('GetAll Error:', error);
            throw new Error(`Kişiler alınırken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = new PersonService(); 