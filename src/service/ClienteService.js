import axios from 'axios';
import { API_BASE_URL } from './config';


export const ClienteService = {
    // Obtener todos los clientes
    async getClientes() {
        return axios
            .get(`${API_BASE_URL}/clientes`)
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al traer los datos de los clientes:', error);
            });
    },

    // Crear un nuevo cliente
    async crearCliente(cliente) {
        return axios
            .post(`${API_BASE_URL}/clientes`, cliente)
            .then((res) =>{
                console.log('abajo res.data')
                console.log(res.data)
                return res.data
            } )
            .catch((error) => {
                console.error('Hubo un problema al crear el cliente:', error);
            });
    },

    // Actualizar un cliente existente
    async actualizarCliente(cliente) {
        return axios
            .put(`${API_BASE_URL}/clientes/${cliente.NUM_CLI}`, cliente)
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al actualizar el cliente:', error);
            });
    },

    // Eliminar un cliente
    async eliminarCliente(id) {
        return axios
            .delete(`/api/clientes/${id}`)
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al eliminar el cliente:', error);
            });
    }
}
