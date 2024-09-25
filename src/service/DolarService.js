import { API_BASE_URL } from './config';

export const DolarService = {

    async getCotizaciones() {
        const response = await fetch(`${API_BASE_URL}/dolar`);
        return await response.json();
    }

};
