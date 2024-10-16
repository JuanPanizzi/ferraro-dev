
import apiClient from './api';

export const PedidoService = {

    async getPedidos() {
        // const response = await fetch(`${API_BASE_URL}/pedidos`);
        // return response.json();
        try {
            const response = await apiClient.get('api/pedidos');
            return response.data;
        } catch (error) {
            console.error('Error fetching pedidos:', error);
            throw error;
        }
    },
    async getPedidosByClient(id) {
        try {
            console.log(id)
            const response = await apiClient.get(`api/pedidos?cliente=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pedidos:', error);
            throw error;
        }
    },

    async getPedido(id) {
        // const response = await fetch(`${API_BASE_URL}/pedidos/${id}`);
        // return response.json();

        try {
            const response = await apiClient.get(`api/pedidos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching pedido with id ${id}:`, error);
            throw error;
        }
    },

    async createPedido(pedido) {
        // const response = await fetch(`${API_BASE_URL}/pedidos`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(pedido),
        // });
        // return response.json();
        try {
            const response = await apiClient.post('api/pedidos', pedido, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;

        } catch (error) {
            console.error('Error creating pedido:', error);
            throw error; // Opcional: puedes lanzar el error nuevamente o manejarlo de otra manera
        }
    },

    // POST PARA ARCHIVOS MULTIMEDIA
    //  async uploadFiles(files) {

    // }

    // pdfPedido
    async pdfPedido(id, hiddenprices) {
        try {
            const response = await apiClient.get(`api/pedidos/${id}/pdf?hiddenprices=${hiddenprices}`, {

            });
            return response;
        } catch (error) {
            console.error(`Error fetching pdf pedido with id ${id}:`, error);
            throw error;
        }
    },

};
