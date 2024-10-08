

// src/service/UserService.js

import apiClient from './api';

export const UserService = {
    async getUsers() {
        try {
            const response = await apiClient.get('api/users');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener usuarios');
        }
    },
    async createUser(user) {
        try {
            const response = await apiClient.post('api/users', user);
            return response;
        } catch (error) {
            throw new Error('Error al crear usuario', error);
        }
    },

    async updateUser(user) {
        try {
            const response = await apiClient.put(`api/users/${user.id}`, user);
            return response;
        } catch (error) {
            throw new Error('Error al actualizar usuario');
        }
    },

    async deleteUser(id) {
        try {
            const response = await apiClient.delete(`api/users/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al eliminar usuario');
        }
    },

   
};
