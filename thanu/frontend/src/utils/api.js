import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
};

// Documents API
export const documentsAPI = {
    upload: (formData) => api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    list: () => api.get('/documents/list'),
    get: (documentId) => api.get(`/documents/${documentId}`),
    delete: (documentId) => api.delete(`/documents/${documentId}`),
};

// Q&A API
export const qaAPI = {
    ask: (questionData) => api.post('/qa/ask', questionData),
    summarize: (documentId) => api.post(`/qa/summarize/${documentId}`),
    getHistory: (documentId = null) => {
        const params = documentId ? { document_id: documentId } : {};
        return api.get('/qa/history', { params });
    },
    deleteHistory: (qaId) => api.delete(`/qa/history/${qaId}`),
};

// Health check
export const healthAPI = {
    check: () => api.get('/health'),
};

export default api;