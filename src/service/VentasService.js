import { API_BASE_URL } from './config';

export const VentasService = {
    async save(data) {
        // post
        const response = await fetch(`${API_BASE_URL}/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });

        return await response.json();
    },

    async show(TIP_DOC, TIP_FAC, NUM_FAC) {
        // get
        const response = await fetch(`${API_BASE_URL}/ventas/${TIP_DOC}/${TIP_FAC}/${NUM_FAC}`);
        return await response.json();
    },

    //exportExcel
    async exportExcel(MES, ANIO) {
        // get
        const response = await fetch(`${API_BASE_URL}/export_excel/ivaventas/${MES}/${ANIO}`);
        return await response.json();
    }
};
