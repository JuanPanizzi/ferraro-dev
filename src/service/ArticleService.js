import { API_BASE_URL } from './config';

export const ArticleService = {
    async searchArticle(code) {
        // post
        const response = await fetch(`${API_BASE_URL}/articles_search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code })
        });

        return await response.json();
    }
};
