import { API_BASE_URL } from './config';

export const ArticleService = {
    async searchArticle(code) {
        // post
        const response = await fetch(`${API_BASE_URL}/articulos/search?code=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    },
    async getArticlesXLarge() {
        const response = await fetch(`${API_BASE_URL}/articulos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    },
    async getArticlesByClient(clienteId) {
        const response = await fetch(`${API_BASE_URL}/articulos/cliente/${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    }

};
