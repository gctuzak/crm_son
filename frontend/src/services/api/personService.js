import api from './api';

const personService = {
    getAll: async () => {
        const response = await api.get('/persons');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/persons/${id}`);
        return response.data;
    },

    createPerson: async (data) => {
        const response = await api.post('/persons', data);
        return response.data;
    },

    updatePerson: async (id, data) => {
        const response = await api.put(`/persons/${id}`, data);
        return response.data;
    },

    deletePerson: async (id) => {
        const response = await api.delete(`/persons/${id}`);
        return response.data;
    },

    getStats: async () => {
        try {
            const response = await api.get('/persons/stats');
            console.log('Stats API Response:', response);
            return response.data;
        } catch (error) {
            console.error('Stats API Error:', error);
            throw error;
        }
    }
};

export default personService; 