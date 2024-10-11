
import apiClient from './api';

export const CotizacionService = {

    async getCotizaciones() {
        try {
            const response = await apiClient.get('api/cotizaciones');
            return response.data;
        } catch (error) {
            console.error('Error fetching cotizaciones:', error);
            throw error;
        }
    },
    async getCotizacionesByClient(clientId) {
        try {
            const response = await apiClient.get(`api/cotizaciones?cliente=${clientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching cotizaciones:', error);
            throw error;
        }
    },

    async getCotizacion(id) {
    
        try {
            const response = await apiClient.get(`api/cotizaciones/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching cotizacion with id ${id}:`, error);
            throw error;
        }
    },

    async createCotizacion(cotizacion) {
   
        try {
            const response = await apiClient.post('api/cotizaciones', cotizacion, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;

        } catch (error) {
            console.error('Error creating cotizacion:', error);
            throw error; // Opcional: puedes lanzar el error nuevamente o manejarlo de otra manera
        }
    },

    async updateCotizacion(cotizacion) {
        try {
            const response = await apiClient.put(`api/cotizaciones/${cotizacion.id}`, cotizacion);
            return response;
        } catch (error) {
            throw new Error('Error al actualizar cliente');
        }
    },

    async eliminarCotizacion(id) {
        try {
            const response = await apiClient.delete(`api/cotizacion/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al eliminar cotizacion');
        }
    },

};
