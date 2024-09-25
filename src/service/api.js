// src/service/api.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // Esto es crucial para que las cookies se envíen con la solicitud
});

// Función para inicializar la protección CSRF
export function initializeCsrfProtection() {
    return apiClient.get('/sanctum/csrf-cookie');
}

export default apiClient;
