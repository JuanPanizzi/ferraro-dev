<script setup>
import { ArticleService } from '@/service/ArticleService';
import { ClienteService } from '@/service/ClienteService';
import { DolarService } from '@/service/DolarService';
import { PedidoService } from '@/service/PedidoService';
// import Dialog from 'primevue/dialog';
import ArticuloDialog from '../../../components/ArticleModal.vue'
import { computed, onMounted, ref } from 'vue';
import apiClient from '../../../service/api';


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
const articulo = ref({
    COD_ART: '',
    NOM_ART: '',
    MAT_ART: '',
    NROPLANO_ART: '',
    REV_PLANO: '',
    NUM_CLI: '',
    PLANO_ART: '',
    COSMP_ART: 0,
    PV_ART: 0,
    IVA1_ART: 21,
    UTI_ART: 7
});
const showArticleModal = ref(false);

const handleArticleModal = (boolean) => {
    showArticleModal.value = boolean;
};
const handleCloseModal = () => showArticleModal.value = false

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

// getClientes from ClienteService
const clients = ref([]);

onMounted(async () => {
    clients.value = await ClienteService.getClientes().then((data) => (clients.value = data));;
    // console.log(clients.value)
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





const openPlane = (url) => {
    window.open(url, '_blank');
};
// const onFileSelect = (e) => {
//     console.log(e);
// };

// Estado para almacenar los archivos
const files = ref([]);

// Método para manejar la selección de archivos
const onFileSelect = (event) => {
    const selectedFiles = Array.from(event.files); // Convierte FileList a un array
    selectedFiles.forEach((file) => {
        // Guardamos el archivo completo y sus propiedades necesarias
        files.value.push({
            file: file,  // El archivo completo
            name: file.name,
            size: file.size,
            type: file.type
        });
    });
};


//FUNCION PARA ENVIAR ARCHIVOS AL BACKEND
const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((fileData, index) => {
        // Aquí agregamos el archivo completo al FormData
        formData.append(`file${index + 1}`, fileData.file);  // Accede al archivo completo
    });

    try {
        // const response = await fetch(`${API_BASE_URL}/pedidos`, {
        //     method: 'POST',
        //     body: formData,
        // });
        const response = await apiClient.post('api/pedidos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the appropriate content type
                }
            });
        if (!response.ok) {
            throw new Error(`Error en la subida de archivos: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Archivos subidos correctamente:', data);

        return { Estado: response.status };

    } catch (error) {
        console.error('Error al subir los archivos:', error);
        return { error: `Estado ${response.status}` };
    }
};



</script>

<template>


    <div class="card">

        <div class="mb-3">
            <h3>NUEVO PEDIDO</h3>
        </div>


        <div class="flex items-center gap-4 mb-4 mt-8">
            <div class="flex flex-col" :class="{ 'mt-5': !pedido.NUM_CLI }">
                <FloatLabel class="w-full md:w-56 ">
                    <Select v-model="pedido.NUM_CLI" :options="clients" filter optionLabel="NOM_CLI"
                        placeholder="Seleccione un cliente" class="w-full md:w-full border-red-500"
                        emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes"
                        @change="changeCliente" emptySelectionMessage="Seleccione un cliente">
                    </Select>
                    <label for="NUM_CLI" class="font-semibold w-24 border-red-500">Cliente</label>
                </FloatLabel>
                <small v-if="!pedido.NUM_CLI" class="text-red-500">Seleccione un cliente</small>
            </div>
            <FloatLabel class="w-full md:w-56">

                <InputText v-model="pedido.FEC_FAC" id="FEC_FAC" type="date" class="w-full md:w-full"
                    :disabled="!pedido.NUM_CLI" />
                <label for="FEC_FAC" class="font-semibold w-24">Fecha: </label>
            </FloatLabel>

            <!-- Orden de compra -->
            <FloatLabel class="w-full md:w-56">
                <InputText v-model="pedido.NUM_OC" id="NUM_OC" type="text" class="w-full md:w-full"
                    :disabled="!pedido.NUM_CLI" />
                <label for="NUM_OC" class="font-semibold w-56">Orden de Compra</label>
            </FloatLabel>


            <FloatLabel class="w-full md:w-56">
                <Select v-model="pedido.TIP_MON" optionLabel="label" @change="changeMoneda"
                    :options="[{ label: 'Pesos', value: 'P' }, { label: 'Dólar Div.', value: 'DB' }, { label: 'Dólar Bill.', value: 'DV' }]"
                    class="w-full md:w-full" :disabled="!pedido.NUM_CLI" />
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
                { label: 'Transferencia', value: 'T' }]" class="w-full md:w-full" :disabled="!pedido.NUM_CLI" />
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
                            emptySelectionMessage="Seleccione un artículo" :disabled="!pedido.NUM_CLI"></Select>
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
                    <DatePicker v-model="slotProps.data.FEC_ENT" showButtonBar dateFormat="dd/mm/yy"
                        :disabled="!pedido.NUM_CLI" />
                </template>
            </Column>
            <Column field="CAN_IT" header="Cant.">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.CAN_IT" mode="decimal" fluid :disabled="!pedido.NUM_CLI" />
                </template>
            </Column>
            <Column field="PRE_IT" header="Precio">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.PRE_IT" mode="currency" currency="ARS" locale="es-AR" fluid
                        :disabled="!pedido.NUM_CLI" />
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
                    <Button icon="pi pi-trash" outlined severity="danger" @click="removeItem(slotProps.index)"
                        :disabled="!pedido.NUM_CLI" />
                </template>
            </Column>
            <template #footer>
                <Button :disabled="!pedido.NUM_CLI" icon="pi pi-box" class="p-button-sm p-button-text"
                    label="Crear nuevo articulo" @click="handleArticleModal(true)" />
                <Button :disabled="!pedido.NUM_CLI" icon="pi pi-plus" class="p-button-sm p-button-text" @click="addItem"
                    label="Agregar otra linea" />

            </template>

            <ArticuloDialog :visible="showArticleModal" :articulo="articulo" :clients="clients"
                :onCancelar="handleCloseModal" />
        </DataTable>
        <div class="my-2">

        </div>

        <Textarea v-model="pedido.OBS_FAC" id="OBS_FAC" rows="3" placeholder="Observaciones" class="w-full"
            :disabled="!pedido.NUM_CLI" />

        <!-- adjuntar archivos -->
        <div class="my-2">
            <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary"
                class="p-button-outlined" chooseLabel="Adjuntar Archivos" uploadLabel="Subir Archivos"
                cancelLabel="Cancelar" multiple :disabled="!pedido.NUM_CLI" />
        </div>
    <!-- Archivos seleccionados -->
<div class="my-4">
    <h4 class="text-center">Archivos Seleccionados:</h4>
    <ul class="flex flex-wrap justify-evenly">
        <li v-for="(file, index) in files" :key="index" class="p-4 border border-gray-400 rounded-lg m-2">
            <h2><strong>Archivo: {{ index + 1 }}</strong></h2>
            <span>Nombre:</span> {{ file.name }} <br />
            <span>Tamaño:</span> {{ (file.size / 1024).toFixed(2) }} KB <br />
            <span>Tipo:</span> {{ file.type }} <br />
            <!-- Opcional: Si quisieras mostrar alguna información adicional sobre el archivo en sí, podrías acceder a file.file -->
        </li>
    </ul>
</div>



        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Cancelar" severity="secondary" @click="closeDialog"></Button>
            <Button label="Guardar" icon="pi pi-save" class="p-button-primary" @click="uploadFiles(files)"
                :disabled="!pedido.NUM_CLI" />
        </div>

    </div>
</template>