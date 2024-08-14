import axios from 'axios';

export class ClienteService {
    // Obtener todos los clientes
    getClientes() {
        return axios
            .get('/api/clientes')
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al traer los datos de los clientes:', error);
            });
    }

    // Crear un nuevo cliente
    crearCliente(cliente) {
        return axios
            .post('/api/clientes', cliente)
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al crear el cliente:', error);
            });
    }

    // Actualizar un cliente existente
    actualizarCliente(cliente) {
        return axios
            .put(`/api/clientes/${cliente.NUM_CLI}`, cliente)
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al actualizar el cliente:', error);
            });
    }

    // Eliminar un cliente
    eliminarCliente(id) {
        return axios
            .delete(`/api/clientes/${id}`)
            .then((res) => res.data)
            .catch((error) => {
                console.error('Hubo un problema al eliminar el cliente:', error);
            });
    }
}
