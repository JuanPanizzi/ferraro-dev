import { API_BASE_URL } from './config';

export const CustomerService = {
    
    async getCuentaCorriente(num_cli, page = 1) {
        const response = await fetch(`${API_BASE_URL}/clientes/cuenta-corriente/${num_cli}?page=${page}`);
        return await response.json();
        
    },

    async getCustomersSmall() {
        const response = await fetch(`${API_BASE_URL}/clientes?limit=10`);
        return await response.json();
    },

    async getCustomersMedium() {
        const response = await fetch(`${API_BASE_URL}/clientes?limit=50`);
        return await response.json();
    },

    async getCustomersLarge() {
        const response = await fetch(`${API_BASE_URL}/clientes?limit=200`);
        return await response.json();
    },

    async getCustomersXLarge() {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        return await response.json();
    },

    async getCustomersMinimal() {
        const response = await fetch(`${API_BASE_URL}/clientes?minimal=true`);
        return await response.json();
    },

    async getCustomerById(num_cli) {
        const response = await fetch(`${API_BASE_URL}/clientes/${num_cli}`);
        return await response.json();
    },

    async createCustomer(cliente) {

        await initializeCsrfProtection(); // Asegúrate de obtener el CSRF token

        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        return await response.json();
    },

    async updateCustomer(num_cli, cliente) {
        const response = await fetch(`${API_BASE_URL}/clientes/${num_cli}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        return await response.json();
    },

    async deleteCustomer(num_cli) {
        const response = await fetch(`${API_BASE_URL}/clientes/${num_cli}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    async getIvaVentas(mes, anio) {
        const response = await fetch(`${API_BASE_URL}/iva-ventas?mes=${mes}&anio=${anio}`);
        return await response.json();
    }
};
