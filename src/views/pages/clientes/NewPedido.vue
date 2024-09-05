<script setup>
import { ArticleService } from '@/service/ArticleService';
import { CustomerService } from '@/service/CustomerService';
import { DolarService } from '@/service/DolarService';
import { PedidoService } from '@/service/PedidoService';

import { computed, onMounted, ref } from 'vue';

const pedido = ref({
    NUM_CLI: '',
    items: [
        { OC: '', OC_ITEM: '', NUM_LIN: 1, COD_IT: '', DES_IT: '', CAN_IT: 1, PRE_IT: 1 }
    ],
    OBS_FAC: '',
    FEC_FAC: new Date().toISOString().substr(0, 10),
    TIP_MON: { label: 'Pesos', value: 'P' },
    COT_DOLAR: 1
});

const searchArticulo = (cod_it, index) => {

    ArticleService.searchArticle(cod_it).then((response) => {
        if (response) {
            pedido.value.items[index].DES_IT = response.NOM_ART;
        }
    });

};

const addItem = () => {
    pedido.value.items.push({
        NUM_LIN: pedido.value.items.length + 1,
        OC: '',
        OC_ITEM: '',
        COD_IT: '',
        DES_IT: '',
        CAN_IT: 1,
        PRE_IT: 1
    });
};

const removeItem = (index) => {
    pedido.value.items.splice(index, 1);
};

const closeDialog = () => {
    // Implement closeDialog logic here
};

const nextStep = () => {
    // Implement nextStep logic here
};

// getClientes from CustomerService
const clients = ref([]);

onMounted(async () => {
    clients.value = await CustomerService.getCustomersMinimal();
});

const changeMoneda = (e) => {

    console.log(e.value);

    if (e.value.value === 'P') {
        pedido.value.COT_DOLAR = 1;
    }

    if (e.value.value === 'DB') {
        pedido.value.COT_DOLAR = billeteFormatted.value;
    }

    if (e.value.value === 'DV') {
        pedido.value.COT_DOLAR = divisaFormatted.value;
    }

};

const cotizaciones = ref({
    billete: '',
    divisa: ''
});

const formatNumber = (value) => {
    const number = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    return isNaN(number) ? '0.00' : number.toFixed(2);
};

const billeteFormatted = computed(() => formatNumber(cotizaciones.value.billete));
const divisaFormatted = computed(() => formatNumber(cotizaciones.value.divisa));

const fetchCotizaciones = async () => {
    try {
        const response = await DolarService.getCotizaciones();
        const data = response;
        cotizaciones.value = {
            billete: data.billetes.cotizaciones.find(c => c[0] === 'Dolar U.S.A')[2],
            divisa: data.divisas.cotizaciones.find(c => c[0] === 'Dolar U.S.A')[2]
        };
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
    }
};

onMounted(fetchCotizaciones);

const generate = () => {
    console.log(pedido.value);

    PedidoService.createPedido(pedido.value).then((response) => {
        console.log(response);

        if (response) {
            alert('Pedido generado correctamente');
        }
    });

};

</script>

<template>


    <div class="card">

        <div class="mb-3">
            <h3>NUEVO PEDIDO</h3>
        </div>


        <div class="flex items-center gap-4 mb-4 mt-8">

            <FloatLabel class="w-full md:w-56">
                <Select v-model="pedido.NUM_CLI" :options="clients" filter optionLabel="LABEL_CLI"
                    placeholder="Seleccione un cliente" class="w-full md:w-full"
                    emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes"
                    emptySelectionMessage="Seleccione un cliente">
                </Select>
                <label for="NUM_CLI" class="font-semibold w-24">Cliente</label>
            </FloatLabel>
            <FloatLabel class="w-full md:w-56">

                <InputText v-model="pedido.FEC_FAC" id="FEC_FAC" type="date" class="w-full md:w-full" />
                <label for="FEC_FAC" class="font-semibold w-24">Fecha: </label>
            </FloatLabel>

            <FloatLabel class="w-full md:w-56">
                <Select v-model="pedido.TIP_MON" optionLabel="label" @change="changeMoneda"
                    :options="[{ label: 'Pesos', value: 'P' }, { label: 'Dólar Div.', value: 'DB' }, { label: 'Dólar Bill.', value: 'DV' }]"
                    class="w-full md:w-full" />
                <label for="TIP_MON" class="font-semibold w-24">Moneda </label>
            </FloatLabel>
            <!-- cotizacion del dolar -->

            <FloatLabel class="w-full md:w-56" v-if="pedido.TIP_MON.value !== 'P'">
                <InputText v-model="pedido.COT_DOLAR" id="COT_DOLAR" type="number" class="w-full md:w-full" />
                <label for="COT_DOLAR" class="font-semibold w-24">Cot. Dólar </label>
            </FloatLabel>
            <!-- forma de pago -->
            <FloatLabel class="w-full md:w-56">
                <Select v-model="pedido.FOR_PAG" optionLabel="label" :options="[{ label: 'Efectivo', value: 'E' }, { label: 'Cheque', value: 'C' },
                { label: 'Transferencia', value: 'T' }]" class="w-full md:w-full" />
                <label for="FOR_PAG">Forma de Pago</label>
            </FloatLabel>


        </div>


        <div class="my-2">
            <table style="min-width: 50rem; border-collapse: collapse; width: 100%">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 5%">#</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 10%">OC</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 5%">Item OC</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 25%">Código</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 40%">Descripción</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 5%">Cant.</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 15%">Precio</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 5%"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in pedido.items" :key="index">
                        <td style="border: 1px solid #ccc; padding: 1px; text-align: center">{{ item.NUM_LIN }}</td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="text" v-model="item.OC"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="text" v-model="item.OC_ITEM"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px; display: flex; align-items: center; gap: 4px">
                            <input type="text" v-model="item.COD_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                            <Button icon="pi pi-search" outlined severity="info" v-if="item.COD_IT" size="small"
                                @click="searchArticulo(item.COD_IT, index)" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="text" v-model="item.DES_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="number" v-model="item.CAN_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="number" v-model="item.PRE_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px; text-align: center; cursor: pointer"
                            @click="removeItem(index)">
                            <Button icon="pi pi-trash" outlined severity="danger" size="small" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="text-align: center; padding: 2px; font-weight: bold; cursor: pointer"
                        class="bg-primary hover:bg-primary-300">
                        <td colspan="8" @click="addItem"><i class="pi pi-plus"></i> Añadir</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <Textarea v-model="pedido.OBS_FAC" id="OBS_FAC" rows="3" placeholder="Observaciones" class="w-full" />

        <!-- adjuntar archivos -->
        <div class="my-2">
            <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
                class="p-button-outlined" chooseLabel="Adjuntar Archivos" uploadLabel="Subir Archivos"
                cancelLabel="Cancelar" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Cancelar" severity="secondary" @click="closeDialog"></Button>
            <Button label="Guardar" icon="pi pi-save" class="p-button-primary" @click="generate" />
        </div>

    </div>
</template>