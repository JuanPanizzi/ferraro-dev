import { API_BASE_URL } from './config';
import apiClient from './api';

export const ArticleService = {
    async searchArticle(code) {
        // post
        // const response = await fetch(`${API_BASE_URL}/articulos/search?code=${code}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        try {
            const response = await apiClient.get(`api/articulos/search?code=${code}`);
            return await response.data;
            
        } catch (error) {
            throw new Error("Error al buscar articulo");
            
        }
    },
    async getArticlesXLarge() {
        try {
            const response = await apiClient.get('api/articulos');
        return await response.data;
            
        } catch (error) {
            throw new Error('error al buscar clientes')
        }
        // const response = await fetch(`${API_BASE_URL}/articulos`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
    },
    async getArticlesByClient(clienteId) {
        // const response = await fetch(`${API_BASE_URL}/articulos/cliente/${clienteId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // return await response.json();
        try {
            const response = await apiClient.get(`api/articulos/cliente/${clienteId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener clientes');
        }
    }

};
