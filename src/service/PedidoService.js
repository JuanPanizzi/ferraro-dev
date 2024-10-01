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
    },

     // POST PARA ARCHIVOS MULTIMEDIA
     async uploadFiles(files) {

        const formData = new FormData();

        
        files.forEach((fileData, index) => {
            formData.append(`file${index + 1}`, fileData.file);
        });
        // console.log(formData)
        try {
            // VER ESTE ENDPOINT
            const response = await fetch(`${API_BASE_URL}/pedidos`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error en la subida de archivos: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Archivos subidos correctamente:', data);
            
            return {Estado: response.status}

        } catch (error) {
            console.error('Error al subir los archivos:', error);
            return {error: `Estado ${response.status}` }
        }
    }

};
