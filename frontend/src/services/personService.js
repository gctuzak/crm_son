'use client';

import api from './api';

class PersonService {
    async getAll() {
        try {
            const response = await api.get('/persons');
            console.log('Kişiler yanıtı:', response);
            if (response.data?.success) {
                return {
                    success: true,
                    data: response.data.data?.rows || []
                };
            }
            return {
                success: false,
                error: 'Kişiler alınamadı',
                data: []
            };
        } catch (error) {
            console.error('Kişiler getirilirken hata:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    async getById(id) {
        try {
            console.log('Kişi detayı isteği gönderiliyor. ID:', id);
            console.log('İstek URL:', `/persons/${id}`);
            const response = await api.get(`/persons/${id}`);
            console.log('Kişi detayı ham yanıt:', response);
            console.log('Yanıt durumu:', response.status);
            console.log('Yanıt başlıkları:', response.headers);
            console.log('Yanıt verisi:', response.data);
            
            if (response.data?.success && response.data?.data) {
                return {
                    data: response.data.data,
                    success: true
                };
            }
            
            return {
                data: null,
                success: false,
                message: response.data?.message || 'Kişi bulunamadı'
            };
        } catch (error) {
            console.error('Kişi detayı getirilirken hata detayı:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            return {
                data: null,
                success: false,
                message: error.response?.data?.message || 'Kişi detayı alınamadı'
            };
        }
    }

    async create(data) {
        try {
            const response = await api.post('/persons', data);
            return response.data;
        } catch (error) {
            console.error('Kişi oluşturulurken hata:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            console.log('Güncelleme isteği gönderiliyor:', { id, data });
            const response = await api.put(`/persons/${id}`, data);
            console.log('Güncelleme yanıtı:', response);
            return response.data;
        } catch (error) {
            console.error('Kişi güncellenirken hata:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Silme isteği gönderiliyor:', id);
            const response = await api.delete(`/persons/${id}`);
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

    async getStats() {
        try {
            const response = await api.get('/persons/stats');
            console.log('Stats API Response:', response);
            return response.data;
        } catch (error) {
            console.error('Stats API Error:', error);
            throw error;
        }
    }
}

export const personService = new PersonService();
export default personService; 