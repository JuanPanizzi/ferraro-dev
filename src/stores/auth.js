import apiClient from '@/service/api'; // Importa apiClient que ya usa la configuración de config.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('auth_token') || ''
    }),
    actions: {
        async login(credentials) {
            const response = await apiClient.post('/login', credentials);
            this.token = response.data.token;
            this.user = response.data.user;
            localStorage.setItem('auth_token', this.token);
        },
        async logout() {
            await apiClient.post('/logout');
            this.token = '';
            this.user = null;
            localStorage.removeItem('auth_token');
        },
        async fetchUser() {
            if (this.token) {
                const response = await apiClient.get('/user');
                this.user = response.data;
            }
        }
    }
});
