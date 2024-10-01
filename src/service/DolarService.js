// src/service/DolarService.js
import apiClient from './api'; // Importar el apiClient

export const DolarService = {
    async getCotizaciones() {
        try {
            const response = await apiClient.get('/api/dolar'); // Usar apiClient para realizar la solicitud
            return response.data; // Retornar los datos directamente
        } catch (error) {
            console.error('Error al obtener las cotizaciones de Dólar:', error);
            throw new Error('No se pudieron obtener las cotizaciones de Dólar');
        }
    }
};
