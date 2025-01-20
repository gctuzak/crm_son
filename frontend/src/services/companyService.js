'use client';

import api from './api';

class CompanyService {
    async getAll() {
        try {
            const response = await api.get('/companies');
            console.log('API Yanıtı:', response);
            
            if (response.data && response.data.data && Array.isArray(response.data.data.rows)) {
                return {
                    success: true,
                    data: response.data.data.rows
                };
            }
            
            console.error('Geçersiz API yanıtı:', response);
            return {
                success: false,
                error: 'Geçersiz veri formatı'
            };
        } catch (error) {
            console.error('Şirketler getirilirken hata:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getById(id) {
        try {
            console.log('Şirket detayı isteği gönderiliyor. ID:', id);
            const response = await api.get(`/companies/${id}`);
            console.log('Şirket detayı yanıtı:', response);
            
            if (response.data && response.data.data) {
                return {
                    data: response.data.data,
                    success: true
                };
            }
            
            return {
                data: null,
                success: false,
                message: 'Şirket bulunamadı'
            };
        } catch (error) {
            console.error('Şirket detayı getirilirken hata:', error);
            return {
                data: null,
                success: false,
                message: error.response?.data?.message || 'Şirket detayı alınamadı'
            };
        }
    }

    async create(data) {
        try {
            const response = await api.post('/companies', data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Şirket oluşturulurken hata:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async update(id, data) {
        try {
            const response = await api.put(`/companies/${id}`, data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Şirket güncellenirken hata:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async delete(id) {
        try {
            console.log('Silme isteği gönderiliyor. ID:', id);
            const response = await api.delete(`/companies/${id}`);
            console.log('Silme yanıtı:', response);
            
            if (response.data && response.data.success) {
                return {
                    success: true,
                    message: 'Şirket başarıyla silindi'
                };
            }
            
            return {
                success: false,
                error: response.data?.message || 'Silme işlemi başarısız oldu'
            };
        } catch (error) {
            console.error('Silme hatası:', error);
            return {
                success: false,
                error: error.message || 'Silme işlemi başarısız oldu'
            };
        }
    }
}

export const companyService = new CompanyService();
export default companyService; 