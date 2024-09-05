import { API_BASE_URL } from './config';

export const PedidoService = {

    async getPedidos() {
        const response = await fetch(`${API_BASE_URL}/pedidos`);
        return response.json();
    },

    async getPedido(id) {
        const response = await fetch(`${API_BASE_URL}/pedidos/${id}`);
        return response.json();
    },

    async createPedido(pedido) {
        const response = await fetch(`${API_BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        });
        return response.json();
    }



};
