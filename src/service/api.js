// src/service/api.js
import { useAuthStore } from '@/stores/auth'; // Importar el store de auth
import axios from 'axios';
import { API_BASE_URL } from './config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // Esto asegura que las cookies se envíen con la solicitud
});

// Interceptor para agregar el token de autorización a cada solicitud
apiClient.interceptors.request.use((config) => {
    const authStore = useAuthStore(); // Usar el store de auth para obtener el token

    // Si el token está presente en el store, agregarlo al encabezado
    if (authStore.token) {
        config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return config;
}, (error) => {
    // Manejar errores en la solicitud
    return Promise.reject(error);
});

// Función para inicializar la protección CSRF
export async function initializeCsrfProtection() {
    try {
        await apiClient.get('/sanctum/csrf-cookie'); // Esto configurará la cookie XSRF-TOKEN
    } catch (error) {
        console.error('Error al inicializar la protección CSRF:', error);
    }
}

export default apiClient;
