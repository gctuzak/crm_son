'use client';

import api from './api';

class PersonService {
    async getAll() {
        try {
            const response = await api.get('/api/persons');
            console.log('Kişiler yanıtı:', response);
            return {
                rows: response.data.data.rows || [],
                success: true
            };
        } catch (error) {
            console.error('Kişiler getirilirken hata:', error);
            return {
                rows: [],
                success: false,
                error: error.message
            };
        }
    }

    async getById(id) {
        try {
            const response = await api.get(`/api/persons/${id}`);
            console.log('Kişi detayı yanıtı:', response);
            return response.data;
        } catch (error) {
            console.error('Kişi detayı getirilirken hata:', error);
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async create(data) {
        try {
            const response = await api.post('/api/persons', data);
            return response.data;
        } catch (error) {
            console.error('Kişi oluşturulurken hata:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const response = await api.put(`/api/persons/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Kişi güncellenirken hata:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Silme isteği gönderiliyor. ID:', id);
            
            // Silme işlemini doğrudan gerçekleştir
            const response = await api.delete(`/api/persons/${id}`);
            console.log('Silme yanıtı:', response);

            // Backend'den gelen yanıtı kontrol et
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

export const personService = new PersonService();
export default personService; 