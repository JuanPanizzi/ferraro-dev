import axios from 'axios';
import { API_BASE_URL } from './config';

export const RemitoService = {
    // Obtener todos los remitos
    async getRemitos() {
        try {
            const response = await axios.get(`${API_BASE_URL}/remitos`);
            return response.data;
        } catch (error) {
            console.error('Hubo un problema al traer los datos de los remitos:', error);
        }
    },

    // Crear un nuevo remito
    async crearRemito(remito) {
        try {
            const response = await axios.post(`${API_BASE_URL}/remitos`, remito);
            return response.data;
        } catch (error) {
            console.error('Hubo un problema al crear el remito:', error);
        }
    },

    // dameItems
    async dameItems(nro_remito) {
        console.log('dameItems', nro_remito);
        try {
            const response = await axios.get(`${API_BASE_URL}/rem_dame_items?nro=${nro_remito}`);
            return response.data;
        } catch (error) {
            console.error('Hubo un problema al traer los datos de los items:', error);
        }
    },

    // Actualizar un remito existente
    async actualizarRemito(remito) {
        try {
            const response = await axios.put(`${API_BASE_URL}/remitos/${remito.NUM_REM}`, remito);
            return response.data;
        } catch (error) {
            console.error('Hubo un problema al actualizar el remito:', error);
        }
    },

    // Eliminar un remito
    async eliminarRemito(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/remitos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Hubo un problema al eliminar el remito:', error);
        }
    }
};
