import { API_BASE_URL } from './config';

export const VentasService = {
    async save(data) {
        // post
        const response = await fetch(`${API_BASE_URL}/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        return await response.json();
    }
};
