import axios from 'axios';
import { API_URL } from '../config';

// Axios instance oluştur
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Token varsa ekle
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug log
        console.log('API İsteği:', {
            method: config.method,
            url: config.url,
            fullUrl: `${config.baseURL}${config.url}`
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Hata mesajlarını standartlaştır
        if (error.response) {
            // Server hatası
            const message = error.response.data.message || 'Bir hata oluştu';
            error.message = message;
        } else if (error.request) {
            // İstek yapılamadı
            error.message = 'Sunucuya ulaşılamıyor';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 