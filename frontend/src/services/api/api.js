'use client';

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

console.log('API URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
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
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Hatası:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            error: error.response?.data?.error || error.message
        });
        return Promise.reject(error);
    }
);

export default api; 