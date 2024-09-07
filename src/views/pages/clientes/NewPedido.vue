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
        MAT_ART: '',
        NROPLANO_ART: '',
        REV_PLANO: '',
        PLANO_ART: '',
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

const clientArticles = ref([]);

const changeCliente = async (e) => {
    try {
        const articles = await ArticleService.getArticlesByClient(e.value.NUM_CLI);
        clientArticles.value = Array.isArray(articles) ? articles : [];
    } catch (error) {
        console.error('Error fetching client articles:', error);
        clientArticles.value = [];
    }
};

const setArticulo = (cod_it, index) => {
    console.log(cod_it, index);
    pedido.value.items[index].DES_IT = cod_it.NOM_ART;
    pedido.value.items[index].MAT_ART = cod_it.MAT_ART;
    // NROPLANO_ART, REV_PLANO, PLANO_ART
    pedido.value.items[index].NROPLANO_ART = cod_it.NROPLANO_ART;
    pedido.value.items[index].REV_PLANO = cod_it.REV_PLANO;
    pedido.value.items[index].PLANO_ART = cod_it.PLANO_ART;
};


const onFileSelect = (e) => {
    console.log(e);
};

const openPlane = (url) => {
    window.open(url, '_blank');
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
                    @change="changeCliente" emptySelectionMessage="Seleccione un cliente">
                </Select>
                <label for="NUM_CLI" class="font-semibold w-24">Cliente</label>
            </FloatLabel>
            <FloatLabel class="w-full md:w-56">

                <InputText v-model="pedido.FEC_FAC" id="FEC_FAC" type="date" class="w-full md:w-full" />
                <label for="FEC_FAC" class="font-semibold w-24">Fecha: </label>
            </FloatLabel>

            <!-- Orden de compra -->
            <FloatLabel class="w-full md:w-56">
                <InputText v-model="pedido.NUM_OC" id="NUM_OC" type="text" class="w-full md:w-full" />
                <label for="NUM_OC" class="font-semibold w-56">Orden de Compra</label>
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

        <DataTable stripedRows :value="pedido.items" size="small" showGridLines>

            <template #empty>
                <div class="p-text-center">
                    <span v-if="!pedido.NUM_CLI">Seleccione un cliente para agregar artículos</span>
                </div>
            </template>
            <Column field="NUM_LIN" header="#"></Column>
            <Column field="COD_IT" header="Artículo">

                <template #body="slotProps">

                    <div style="display: flex;">

                        <Select v-model="slotProps.data.COD_IT" :options="clientArticles" filter optionLabel="ART_LABEL"
                            placeholder="Seleccione un artículo" class="w-full"
                            @change="setArticulo(slotProps.data.COD_IT, slotProps.index)"
                            emptyFilterMessage="No se encontraron artículos" emptyMessage="No hay artículos"
                            emptySelectionMessage="Seleccione un artículo"></Select>
                        <Button outlined icon="pi pi-pencil" class="ml-2 p-button-sm p-button-success"
                            v-if="slotProps.data.COD_IT" />
                    </div>

                </template>
            </Column>
            <Column field="MAT_ART" header="Material">
            </Column>
            <Column field="NROPLANO_ART" header="Plano">
                <template #body="slotProps">
                    <Button v-if="slotProps.data.PLANO_ART" icon="pi pi-file" size="small" severity="info" link
                        @click="openPlane(slotProps.data.PLANO_ART)" :label="slotProps.data.NROPLANO_ART" />

                </template>
            </Column>
            <Column field="REV_PLANO" header="Rev">
            </Column>
            <Column field="FEC_ENT" header="Entrega">
                <template #body="slotProps">
                    <DatePicker v-model="slotProps.data.FEC_ENT" showButtonBar dateFormat="dd/mm/yy" />
                </template>
            </Column>
            <Column field="CAN_IT" header="Cant.">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.CAN_IT" mode="decimal" fluid />
                </template>
            </Column>
            <Column field="PRE_IT" header="Precio">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.PRE_IT" mode="currency" currency="ARS" locale="es-AR" fluid />
                </template>
            </Column>

            <Column field="SUBTOTAL" header="Subtotal">
                <template #body="slotProps">
                    {{ (slotProps.data.CAN_IT * slotProps.data.PRE_IT).toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS'
                    }) }}

                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <Button icon="pi pi-trash" outlined severity="danger" @click="removeItem(slotProps.index)" />
                </template>
            </Column>
            <template #footer>
                <Button :disabled="!pedido.NUM_CLI" icon="pi pi-box" class="p-button-sm p-button-text" @click=""
                    label="Crear nuevo articulo" />
                <Button :disabled="!pedido.NUM_CLI" icon="pi pi-plus" class="p-button-sm p-button-text" @click="addItem"
                    label="Agregar otra linea" />

            </template>
        </DataTable>
        <div class="my-2">

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