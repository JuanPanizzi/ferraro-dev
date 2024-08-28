// src/service/api.js
import axios from 'axios';
import { API_BASE_URL } from './config'; // Importar la URL base desde config.js

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // Esto es necesario si usas cookies o Laravel Sanctum
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
