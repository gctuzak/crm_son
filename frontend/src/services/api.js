import axios from 'axios';

// API temel URL'sini ortam değişkeninden al veya varsayılan değeri kullan
const API_URL = 'http://localhost:3000';

console.log('Environment:', process.env.NODE_ENV);
console.log('API_URL:', API_URL);
console.log('PORT:', process.env.PORT);

// Axios instance oluştur
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Debug için
console.log('API Yapılandırması:', {
    baseURL: API_URL,
    nodeEnv: process.env.NODE_ENV,
    apiUrl: process.env.REACT_APP_API_URL
});

// İstek interceptor'ı
api.interceptors.request.use(
    (config) => {
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

// Yanıt interceptor'ı
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
        throw error;
    }
);

// Servisler
export const authService = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password })
};

export const personService = {
    getAll: () => api.get('/api/persons'),
    getById: (id) => api.get(`/api/persons/${id}`),
    create: (data) => api.post('/api/persons', data),
    update: (id, data) => api.put(`/api/persons/${id}`, data),
    delete: (id) => api.delete(`/api/persons/${id}`)
};

export const companyService = {
    getAll: () => api.get('/api/companies'),
    getById: (id) => api.get(`/api/companies/${id}`),
    create: (data) => api.post('/api/companies', data),
    update: (id, data) => api.put(`/api/companies/${id}`, data),
    delete: (id) => api.delete(`/api/companies/${id}`)
};

export const fileService = {
    getAll: () => api.get('/api/files'),
    getById: (id) => api.get(`/api/files/${id}`),
    create: (data) => api.post('/api/files', data),
    update: (id, data) => api.put(`/api/files/${id}`, data),
    delete: (id) => api.delete(`/api/files/${id}`)
};

export const statsService = {
    getDashboardStats: () => api.get('/api/stats/dashboard')
};

export default api; 