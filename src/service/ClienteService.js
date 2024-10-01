// src/service/ClienteService.js
import apiClient from './api';

export const ClienteService = {
    async getClientes() {
        try {
            const response = await apiClient.get('/clientes');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener clientes');
        }
    },

    async crearCliente(cliente) {
        try {
            const response = await apiClient.post('/clientes', cliente);
            return response.data;
        } catch (error) {
            throw new Error('Error al crear cliente');
        }
    },

    async actualizarCliente(cliente) {
        try {
            const response = await apiClient.put(`/clientes/${cliente.NUM_CLI}`, cliente);
            return response.data;
        } catch (error) {
            throw new Error('Error al actualizar cliente');
        }
    },

    async eliminarCliente(id) {
        try {
            const response = await apiClient.delete(`/clientes/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al eliminar cliente');
        }
    }
};
