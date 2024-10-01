// src/service/ClienteService.js

import apiClient from './api';


export const ClienteService = {
    async getClientes() {
        try {
            const response = await apiClient.get('api/clientes');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener clientes');
        }
    },

    async crearCliente(cliente) {
        try {
            // Ensure CSRF protection is initialized
            // await initializeCsrfProtection();

            // Make the POST request to create the client
            const response = await apiClient.post('api/clientes', cliente);
            return response.data;
        } catch (error) {
            throw new Error('Error al crear cliente', error);
        }
    },


    async actualizarCliente(cliente) {
        try {
            const response = await apiClient.put(`api/clientes/${cliente.NUM_CLI}`, cliente);
            return response.data;
        } catch (error) {
            throw new Error('Error al actualizar cliente');
        }
    },

    async eliminarCliente(id) {
        try {
            const response = await apiClient.delete(`api/clientes/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al eliminar cliente');
        }
    }
};
