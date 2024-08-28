import axios from 'axios';
import { API_BASE_URL } from './config'; // Importa la URL base desde config.js

const apiClient = axios.create({
    baseURL: API_BASE_URL, // Usa la URL base configurada en config.js
    withCredentials: true // Esto es necesario para Laravel Sanctum si estás usando cookies
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
