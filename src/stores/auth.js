// /stores/auth.js
import apiClient, { initializeCsrfProtection } from '@/service/api';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('auth_token') || null // Recuperar token de localStorage si está disponible
    }),
    actions: {
        async login(credentials) {
            try {
                await initializeCsrfProtection(); // Asegurarte de obtener el token CSRF
                const response = await apiClient.post('/api/login', credentials);
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('auth_token', this.token); // Guardar token en localStorage
            } catch (error) {
                throw new Error('Error al iniciar sesión');
            }
        },
        async logout() {
            await apiClient.post('/logout');
            this.user = null;
            this.token = null;
            localStorage.removeItem('auth_token'); // Eliminar token de localStorage
        },
        async fetchUser() {
            try {
                const response = await apiClient.get('/api/user');
                this.user = response.data;
            } catch (error) {
                throw new Error('Error al obtener el usuario');
            }
        }
        // Otros métodos como register, getUser, etc.
    },


});
