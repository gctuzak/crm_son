'use client';

import api from './api';

class StatsService {
    async getDashboardStats() {
        try {
            console.log('Dashboard istatistikleri isteği gönderiliyor...');
            const response = await api.get('/stats/dashboard');
            console.log('Dashboard ham yanıt:', response);
            
            // Başarılı yanıt kontrolü
            if (response?.data?.success) {
                return {
                    success: true,
                    data: response.data
                };
            }
            
            // Başarısız yanıt durumu
            return {
                success: false,
                error: 'İstatistikler alınamadı'
            };
        } catch (error) {
            console.error('Dashboard istatistikleri alınırken hata:', error);
            return {
                success: false,
                error: error.message || 'Sunucu hatası'
            };
        }
    }
}

export const statsService = new StatsService();
export default statsService;