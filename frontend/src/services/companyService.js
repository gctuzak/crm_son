'use client';

import api from './api';

class CompanyService {
    async getAll() {
        try {
            const response = await api.get('/companies');
            console.log('Şirketler yanıtı:', response);
            if (response.data?.success) {
                return {
                    data: response.data.data || [],
                    success: true
                };
            }
            return {
                data: [],
                success: false,
                error: 'Şirketler alınamadı'
            };
        } catch (error) {
            console.error('Şirketler getirilirken hata:', error);
            return {
                data: [],
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
            return response.data;
        } catch (error) {
            console.error('Şirket oluşturulurken hata:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            console.log('Güncelleme isteği gönderiliyor:', { id, data });
            const response = await api.put(`/companies/${id}`, data);
            console.log('Güncelleme yanıtı:', response);
            return response.data;
        } catch (error) {
            console.error('Şirket güncellenirken hata:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Silme isteği gönderiliyor:', id);
            const response = await api.delete(`/companies/${id}`);
            console.log('Silme yanıtı:', response);
            
            if (response.status === 200 && response.data.success) {
                return { success: true };
            }
            throw new Error(response.data.message || 'Silme işlemi başarısız oldu');
        } catch (error) {
            console.error('Silme hatası detayı:', error.response || error);
            if (error.response) {
                const message = error.response.data?.message || 'Sunucu hatası';
                throw new Error(`Silme işlemi başarısız: ${message}`);
            }
            throw new Error('Silme işlemi sırasında bir hata oluştu');
        }
    }
}

export const companyService = new CompanyService();
export default companyService; 