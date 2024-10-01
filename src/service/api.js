// src/service/api.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
});

// Interceptor to add Authorization header
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Initialize CSRF protection
export function initializeCsrfProtection() {
    return apiClient.get('/sanctum/csrf-cookie');
}

export default apiClient;
