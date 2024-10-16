import apiClient from './api';

export const ArticleService = {
    async searchArticle(code) {
        try {
            const response = await apiClient.get(`api/articulos/search?code=${code}`);
            return await response.data;
        } catch (error) {
            throw new Error("Error al buscar artículo");
        }
    },

    async getArticlesXLarge() {
        try {
            const response = await apiClient.get('api/articulos');
            return await response.data;
        } catch (error) {
            throw new Error('Error al obtener artículos');
        }
    },

    async getArticlesPaginated(page = 1, perPage = 100) {
        // Nuevo método para paginación
        try {
            const response = await apiClient.get(`api/articulos?page=${page}&per_page=${perPage}`);
            return response.data;  // El backend devuelve el objeto paginado completo
        } catch (error) {
            throw new Error('Error al obtener artículos paginados');
        }
    },

    async getArticlesByClient(clienteId) {
        try {
            const response = await apiClient.get(`api/articulos?cliente=${clienteId}`);
            // const response = await apiClient.get(`api/articulos/cliente/${clienteId}`);

            return response.data;
        } catch (error) {
            throw new Error('Error al obtener artículos por cliente');
        }
    },
    async getArticlesByClientPedido(clienteId) {
        try {
            // const response = await apiClient.get(`api/articulos?cliente=${clienteId}`);
            const response = await apiClient.get(`api/articulos/cliente/${clienteId}`);

            return response.data;
        } catch (error) {
            throw new Error('Error al obtener artículos por cliente');
        }
    },
    async createArticle(newArticle) {
        try {
            const response = await apiClient.post(`api/articulos`, newArticle);
            return response;
        } catch (error) {
            throw new Error('Error al crear artículo');
        }
    },

    async editarArticle(article) {
        try {
            const response = await apiClient.put(`api/articulos/${article.id}`, article);
            return response;
        } catch (error) {
            throw new Error('Error al editar artículo');
        }
    }
};
