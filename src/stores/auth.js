// authStore.js
import apiClient, { initializeCsrfProtection } from '@/service/api';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    actions: {
        async login(credentials) {
            try {
                await initializeCsrfProtection(); // Asegúrate de obtener el CSRF token
                const response = await apiClient.post('/api/login', credentials);
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('auth_token', this.token);
            } catch (error) {
                throw new Error('Error al iniciar sesión');
            }
        },
        async logout() {
            await apiClient.post('/logout');
            this.user = null;
            this.token = null;
            localStorage.removeItem('auth_token');
        }
        // Otros métodos como register, getUser, etc.
    }
});
