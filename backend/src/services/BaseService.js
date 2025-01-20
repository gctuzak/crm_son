class BaseService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw new Error(`Bu kayıt oluşturulamadı: ${error.message}`);
        }
    }

    async getAll() {
        try {
            return await this.model.findAll();
        } catch (error) {
            throw new Error(`Kayıtlar getirilemedi: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            console.log('BaseService.getById çağrıldı. ID:', id);
            
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error('Geçersiz ID formatı');
            }

            const record = await this.model.findById(numericId);
            console.log('FindById sonucu:', record);

            if (!record) {
                throw new Error(`ID ${numericId} olan kayıt bulunamadı`);
            }

            return record;
        } catch (error) {
            console.error('BaseService.getById Error:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            // ID kontrolü
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error('Geçersiz ID formatı');
            }

            const record = await this.model.findById(numericId);
            if (!record) {
                throw new Error(`ID ${numericId} olan kayıt bulunamadı`);
            }

            const updatedRecord = await this.model.update(numericId, data);
            if (!updatedRecord) {
                throw new Error(`ID ${numericId} olan kayıt güncellenemedi`);
            }

            return updatedRecord;
        } catch (error) {
            if (error.message.includes('Geçersiz ID') || error.message.includes('bulunamadı')) {
                throw error;
            }
            throw new Error(`Kayıt güncellenemedi: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            console.log('BaseService.delete başladı. ID:', id);
            
            const numericId = parseInt(id);
            if (isNaN(numericId)) {
                throw new Error('Geçersiz ID formatı');
            }

            const result = await this.model.delete(numericId);
            console.log('Delete sonucu:', result);

            if (!result || !result.success) {
                throw new Error(result?.message || 'Kayıt silinemedi');
            }

            return { success: true, message: 'Kayıt başarıyla silindi' };
        } catch (error) {
            console.error('BaseService.delete hatası:', error);
            throw new Error(`Kayıt silinemedi: ${error.message}`);
        }
    }
}

module.exports = BaseService; 