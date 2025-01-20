'use client';

import api from './api/api';

class FileService {
    async getAll() {
        try {
            const response = await api.get('/files');
            console.log('Dosyalar yanıtı:', response);
            return {
                rows: response.data.data.rows || [],
                success: true
            };
        } catch (error) {
            console.error('Dosyalar getirilirken hata:', error);
            return {
                rows: [],
                success: false,
                error: error.message
            };
        }
    }

    async getById(id) {
        try {
            console.log('Dosya detayı isteği gönderiliyor. ID:', id);
            const response = await api.get(`/files/${id}`);
            console.log('Dosya detayı yanıtı:', response);
            
            if (response.data && response.data.data) {
                return {
                    data: response.data.data,
                    success: true
                };
            }
            
            return {
                data: null,
                success: false,
                message: 'Dosya bulunamadı'
            };
        } catch (error) {
            console.error('Dosya detayı getirilirken hata:', error);
            return {
                data: null,
                success: false,
                message: error.response?.data?.message || 'Dosya detayı alınamadı'
            };
        }
    }

    async create(data) {
        try {
            const response = await api.post('/files', data);
            return response.data;
        } catch (error) {
            console.error('Dosya oluşturulurken hata:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const response = await api.put(`/files/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Dosya güncellenirken hata:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Silme isteği gönderiliyor. ID:', id);
            
            const response = await api.delete(`/files/${id}`);
            console.log('Silme yanıtı:', response);

            if (response.data?.success === false) {
                throw new Error(response.data?.error || response.data?.message || 'Silme işlemi başarısız oldu');
            }

            return { success: true };
        } catch (error) {
            console.error('Silme hatası:', error.response || error);
            
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               error.message || 
                               'Silme işlemi sırasında bir hata oluştu';
            
            throw new Error(errorMessage);
        }
    }
}

export const fileService = new FileService();
export default fileService; 