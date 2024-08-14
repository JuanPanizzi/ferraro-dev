import { API_BASE_URL } from './config';

export const ProviderService = {
    async getCuentaCorriente(num_pro, page = 1) {
        const response = await fetch(`${API_BASE_URL}/proveedores/cuenta-corriente/${num_pro}?page=${page}`);
        return await response.json();
    },

    async getProveedoresSmall() {
        const response = await fetch(`${API_BASE_URL}/proveedores?limit=10`);
        return await response.json();
    },

    async getProveedoresMedium() {
        const response = await fetch(`${API_BASE_URL}/proveedores?limit=50`);
        return await response.json();
    },

    async getProveedoresLarge() {
        const response = await fetch(`${API_BASE_URL}/proveedores?limit=200`);
        return await response.json();
    },

    async getProveedoresXLarge() {
        const response = await fetch(`${API_BASE_URL}/proveedores`);
        return await response.json();
    },

    async getProveedorById(num_pro) {
        const response = await fetch(`${API_BASE_URL}/proveedores/${num_pro}`);
        return await response.json();
    },

    async createProveedor(proveedor) {
        const response = await fetch(`${API_BASE_URL}/proveedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedor)
        });
        return await response.json();
    },

    async updateProveedor(num_pro, proveedor) {
        const response = await fetch(`${API_BASE_URL}/proveedores/${num_pro}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedor)
        });
        return await response.json();
    },

    async deleteProveedor(num_pro) {
        const response = await fetch(`${API_BASE_URL}/proveedores/${num_pro}`, {
            method: 'DELETE'
        });
        return await response.json();
    },

    //const response = await ProviderService.getIvaCompras(startDate, endDate);
    async getIvaCompras(startDate, endDate) {
        const response = await fetch(`${API_BASE_URL}/proveedores/iva-compras?startDate=${startDate}&endDate=${endDate}`);
        return await response.json();
    }
};
