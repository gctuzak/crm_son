const BaseService = require('./BaseService');
const FileModel = require('../models/FileModel');
const fs = require('fs');
const path = require('path');

class FileService extends BaseService {
    constructor() {
        super(FileModel);
    }

    async create(fileData) {
        try {
            // Dosya bilgilerini veritabanına kaydet
            const file = await super.create(fileData);
            return file;
        } catch (error) {
            // Hata durumunda yüklenen dosyayı sil
            if (fileData.path && fs.existsSync(fileData.path)) {
                fs.unlinkSync(fileData.path);
            }
            throw error;
        }
    }

    async delete(id) {
        try {
            // Önce dosya bilgilerini al
            const file = await this.getById(id);
            if (!file) {
                throw new Error('Dosya bulunamadı');
            }

            // Dosyayı diskten sil
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            // Veritabanından kaydı sil
            await super.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async getById(id) {
        try {
            const file = await super.getById(id);
            if (!file) {
                throw new Error('Dosya bulunamadı');
            }
            return file;
        } catch (error) {
            throw error;
        }
    }

    async getAll() {
        try {
            const files = await super.getAll();
            return files;
        } catch (error) {
            throw error;
        }
    }

    async count() {
        try {
            const result = await this.model.query('SELECT COUNT(*) as count FROM files');
            console.log('Dosya sayısı sorgu sonucu:', result);
            if (!result || result.length === 0) {
                return 0;
            }
            return parseInt(result[0].count);
        } catch (error) {
            console.error('Dosya sayısı hatası:', error);
            throw new Error(`Dosya sayısı alınırken hata oluştu: ${error.message}`);
        }
    }
}

module.exports = new FileService(); 