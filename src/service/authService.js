// src/service/authService.js
import apiClient, { initializeCsrfProtection } from './api';

export const authService = {
    async login(credentials) {
        await initializeCsrfProtection(); // Asegúrate de obtener el CSRF token
        return apiClient.post('/login', credentials);
    },
    async register(userData) {
        await initializeCsrfProtection(); // Asegúrate de obtener el CSRF token
        return apiClient.post('/register', userData);
    },
    async logout() {
        await initializeCsrfProtection(); // Asegúrate de obtener el CSRF token
        return apiClient.post('/logout');
    },
    async getUser() {
        await initializeCsrfProtection(); // Asegúrate de obtener el CSRF token
        return apiClient.get('/user');
    }
};
