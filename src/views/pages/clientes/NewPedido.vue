<script setup>
import { ArticleService } from '@/service/ArticleService';
import { ClienteService } from '@/service/ClienteService';
import { DolarService } from '@/service/DolarService';
import { PedidoService } from '@/service/PedidoService';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const toast = useToast()

const pedido = ref({
    NUM_CLI: '',
    items: [
        { NUM_LIN: 1, ART: {}, CAN_IT: 1, PRE_IT: 1 }
    ],
    OBS_FAC: '',
    FEC_FAC: new Date().toISOString().substr(0, 10),
    TIP_MON: { label: 'Pesos', value: 'P' },
    COT_DOLAR: 1,
    // FILES: []
});
const clientSelected = ref(null)
const loading = ref(false)
const itemEditIndex = ref(null);

const articulo = ref({
    id: null,
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

const articuloDialogo = ref(false);

const isEditing = ref(false)

function abrirNuevo(editing, index) {

    if (editing) {
        itemEditIndex.value = index;

    }
    isEditing.value = editing

    if (!editing) {
        articulo.value = {
            id: null,
            COD_ART: '',
            NOM_ART: '',
            MAT_ART: '',
            NROPLANO_ART: '',
            REV_PLANO: '',
            NUM_CLI: '',
            PLANO_ART: '',
            COSMP_ART: 0,
            COSMO_ART: 0,
            PV_ART: 0,
            IVA1_ART: 21,
            UTI_ART: 7
        };
        articuloDialogo.value = true;
    } else {
        articuloDialogo.value = true;


        articulo.value = pedido.value.items[index];
    }
}
function ocultarDialogo() {
    articuloDialogo.value = false;
}

const editArticle = (data) => {
    articulo.value = data.ART;
    itemEditIndex.value = data.index;
    isEditing.value = true;
    articuloDialogo.value = true;
};

async function crearArticle() {

    let newArticle = articulo.value;

    if (!articulo.value.COD_ART || !clientSelected.value || !articulo.value.NOM_ART) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos obligatorios.', life: 3000 });
        return;
    }
    newArticle.NUM_CLI = clientSelected.value.NUM_CLI;

    try {
        const response = await ArticleService.createArticle(newArticle);

        if (response.status >= 200) {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo creado exitosamente.', life: 3000 });

            // add new article to pedido items
            let newItem = {
                id: response.data.id,
                NUM_LIN: pedido.value.items.length + 1,
                COD_ART: newArticle.COD_ART,
                NOM_ART: newArticle.NOM_ART,
                MAT_ART: newArticle.MAT_ART,
                NROPLANO_ART: newArticle.NROPLANO_ART,
                REV_PLANO: newArticle.REV_PLANO,
                PLANO_ART: newArticle.PLANO_ART,
                DES_IT: newArticle.NOM_ART,
                CAN_IT: 1,
                PRE_IT: newArticle.PV_ART,
                ART_LABEL: newArticle.COD_ART + ' - ' + newArticle.NOM_ART
            };

            clientArticles.value.push(newItem);

            // add new item to pedido items
            pedido.value.items.push({
                OC: '',
                OC_ITEM: '',
                NUM_LIN: pedido.value.items.length + 1,
                COD_IT: newItem,
                DES_IT: newItem.DES_IT,
                CAN_IT: 1,
                PRE_IT: newItem.PRE_IT,
                MAT_ART: newItem.MAT_ART,
                NROPLANO_ART: newItem.NROPLANO_ART,
                REV_PLANO: newItem.REV_PLANO,
                PLANO_ART: newItem.PLANO_ART
            });



        } else {

            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el artículo. Intente nuevamente.', life: 3000 });

    } finally {
        articuloDialogo.value = false;

    }
}
async function editarArticle() {

    loading.value = true
    let article = articulo.value;


    try {
        const response = await ArticleService.editarArticle(article);

        if (response.status >= 200) {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo actualizado exitosamente.', life: 3000 });

            articuloDialogo.value = false;

        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el artículo. Intente nuevamente.', life: 3000 });
    } finally {
        loading.value = false
    }

}


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

const router = useRouter();
const cancelPedido = () => {


    // go back to /pedidos
    router.push('/pedidos');

}
// getClientes from ClienteService
const clients = ref([]);

onMounted(async () => {
    await fetchCotizaciones();
    clients.value = await ClienteService.getClientes();
});


const changeMoneda = (e) => {


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


const generate = () => {

    // validate pedido items ids
    if (pedido.value.items.some(item => !item.ART.id)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, seleccione un artículo para cada línea.', life: 3000 });
        return;
    }

    // validate fecha de entrega 
    if (pedido.value.items.some(item => !item.FEC_ENT)) {
        //toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, seleccione una fecha de entrega para cada línea.', life: 3000 });
        //return;
    }

    if (pedido.value.items.some(item => item.CAN_IT <= 0)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'La cantidad de los artículos debe ser mayor a 0.', life: 3000 });
        return;
    }

    if (pedido.value.items.some(item => item.PRE_IT <= 0)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'El precio de los artículos debe ser mayor a 0.', life: 3000 });
        return;
    }

    // si no puso el numero de orden de compra consultar si desea continuar
    if (!pedido.value.NUM_OC) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, ingrese el número pedido del cliente.', life: 3000 });
        return;
    }

    // add selectedFiles to pedido.FILES
    pedido.value.FILES = files.value;
    // add usd_div and usd_bill to pedido
    pedido.value.usd_div = divisaFormatted.value;
    pedido.value.usd_bill = billeteFormatted.value;
    
    PedidoService.createPedido(pedido.value).then((response) => {

        if (response) {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Pedido creado exitosamente.', life: 3000 });
            router.push('/pedidos');
        }
    });

};

const clientArticles = ref([]);
const loadingArticles = ref(false);
const changeCliente = async (e) => {

    try {
        loadingArticles.value = true;
        const articles = await ArticleService.getArticlesByClientPedido(e.value.NUM_CLI);
        clientArticles.value = Array.isArray(articles) ? articles : [];
        clientSelected.value = e.value
        loadingArticles.value = false;
    } catch (error) {
        console.error('Error fetching client articles:', error);
        clientArticles.value = [];
    }
};

const setArticulo = (cod_it, index) => {

    // find in ClientArticles
    const cod_it_index = clientArticles.value.findIndex(a => a.id === cod_it);

    pedido.value.items[index].COD_ART = clientArticles.value[cod_it_index].COD_ART;
    pedido.value.items[index].NOM_ART = clientArticles.value[cod_it_index].NOM_ART;
    pedido.value.items[index].MAT_ART = clientArticles.value[cod_it_index].MAT_ART;
    pedido.value.items[index].NROPLANO_ART = clientArticles.value[cod_it_index].NROPLANO_ART;
    pedido.value.items[index].REV_PLANO = clientArticles.value[cod_it_index].REV_PLANO;
    pedido.value.items[index].PLANO_ART = clientArticles.value[cod_it_index].PLANO_ART;

    // NROPLANO_ART, REV_PLANO, PLANO_ART

    // Actualizamos todos los campos del artículo seleccionado
    //pedido.value.items[index] = { ...pedido.value.items[index], ...cod_it };
    //articulo.value = { ...cod_it }; // Asignamos el artículo para editar
    /* Llenamos articulo */
    //articulo.value = { ...cod_it };


};


const openPlane = (url) => {
    window.open(url, '_blank');
};

// Estado para almacenar los archivos
const files = ref([]);

// Método para manejar la selección de archivos
const onFileSelect = (event) => {
    const selectedFiles = Array.from(event.files); // Convierte FileList a un array
    selectedFiles.forEach((file) => {
        // Guardamos el archivo completo y sus propiedades necesarias
        // pedido.value.FILES.push({
        files.value.push({

            file: file,  // El archivo completo
            name: file.name,
            size: file.size,
            type: file.type
        });
    });
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
                    <Select v-model="pedido.NUM_CLI" :loading="clients.length === 0" :options="clients" filter
                        optionLabel="NOM_CLI" placeholder="Seleccione un cliente"
                        class="w-full md:w-full border-red-500" emptyFilterMessage="No se encontraron clientes"
                        emptyMessage="No hay clientes" @change="changeCliente"
                        emptySelectionMessage="Seleccione un cliente">
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
                    :disabled="!pedido.NUM_CLI" :invalid="pedido.NUM_CLI && !pedido.NUM_OC || pedido.NUM_OC == ''" />
                <label for="NUM_OC" class="font-semibold w-56">Pedido de Cliente</label>
            </FloatLabel>


            <FloatLabel class="w-full md:w-56">
                <Select v-model="pedido.TIP_MON" optionLabel="label" @change="changeMoneda"
                    :options="[{ label: 'Pesos', value: 'P' }, { label: 'Dólar Div.', value: 'DV' }, { label: 'Dólar Bill.', value: 'DB' }]"
                    class="w-full md:w-full" :disabled="!pedido.NUM_CLI" />
                <label for="TIP_MON" class="font-semibold w-24">Moneda </label>
            </FloatLabel>
            <!-- cotizacion del dolar -->

            <FloatLabel class="w-full md:w-56" v-if="pedido.TIP_MON.value !== 'P'">
                <InputText v-model="pedido.COT_DOLAR" id="COT_DOLAR" type="number" class="w-full md:w-full" />
                <label for="COT_DOLAR" class="font-semibold w-24">Cot. Dólar </label>
            </FloatLabel>


        </div>

        <DataTable stripedRows :value="pedido.items" size="small" showGridLines>

            <template #empty>
                <div class="p-text-center">
                    <span v-if="!pedido.NUM_CLI">Seleccione un cliente para agregar artículos</span>
                </div>
            </template>
            <Column field="NUM_LIN" header="#"></Column>
            <Column header="Código" field="COD_IT">
                <template #body="slotProps">
                    <div style="display: flex;">

                        <!-- v-model debe apuntar al artículo completo, no solo a un campo -->
                        <Select v-model="slotProps.data.ART" :options="clientArticles" filter
                            placeholder="Seleccione un artículo" class="w-full"
                            :virtualScrollerOptions="{ itemSize: 38 }" emptyFilterMessage="No se encontraron artículos"
                            emptyMessage="No hay artículos" emptySelectionMessage="Seleccione un artículo"
                            :loading="loadingArticles" :disabled="!pedido.NUM_CLI" style=" max-width: 300px;">

                            <template #option="slotProps">
                                <div class="flex items center">
                                    <span>{{ slotProps.option.COD_ART }}</span>
                                    <span class="ml-2">{{ slotProps.option.NOM_ART }}</span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div class="flex items center">
                                    <span>{{ slotProps.value?.COD_ART }}</span>
                                    <span v-if="!slotProps.value?.COD_ART" class="ml-2"> Buscar por artículo</span>
                                </div>
                            </template>

                        </Select>

                    </div>
                </template>
            </Column>
            <Column header="Descripción">
                <template #body="slotProps">
                    <InputText v-model="slotProps.data.ART.NOM_ART" v-if="slotProps.data.ART" />
                </template>
            </Column>
            <Column header="Material">
                <template #body="slotProps">
                    <InputText v-model="slotProps.data.ART.MAT_ART" v-if="slotProps.data.ART"
                        style="max-width: 150px;" />
                </template>
            </Column>
            <Column field="NROPLANO_ART" header="Plano">
                <template #body="slotProps">
                    <Button icon="pi pi-file" size="small" severity="info" link
                        @click="openPlane(slotProps.data.ART.NROPLANO_ART)" :label="slotProps.data.ART.NROPLANO_ART"
                        v-if="slotProps.data.ART" />

                </template>
            </Column>
            <Column field="REV_PLANO" header="Rev">
                <template #body="slotProps">
                    <InputText v-model="slotProps.data.ART.REV_PLANO" v-if="slotProps.data.ART"
                        style="max-width: 50px;" />
                </template>
            </Column>
            <Column field="FEC_ENT" header="Entrega">
                <template #body="slotProps">
                    <DatePicker v-model="slotProps.data.FEC_ENT" showButtonBar dateFormat="dd/mm/yy"
                        :disabled="!pedido.NUM_CLI"
                        :invalid="pedido.NUM_CLI && !slotProps.data.FEC_ENT || slotProps.data.FEC_ENT == ''" />
                </template>
            </Column>
            <Column field="CAN_IT" header="Cant.">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.CAN_IT" mode="decimal" fluid :disabled="!pedido.NUM_CLI"
                        :invalid="slotProps.data.CAN_IT <= 0" />
                </template>
            </Column>
            <Column field="PRE_IT" header="Precio">
                <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.PRE_IT" mode="currency" currency="ARS" locale="es-AR" fluid
                        :disabled="!pedido.NUM_CLI" :invalid="slotProps.data.PRE_IT <= 0" />
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
                    <div class="flex">
                        <Button icon="pi pi-trash" outlined severity="danger" @click="removeItem(slotProps.index)"
                            :disabled="!pedido.NUM_CLI" />
                        <!-- Mostrar el botón de editar solo si hay un artículo seleccionado -->
                        <Button outlined icon="pi pi-pencil" class="ml-2 p-button-sm p-button-success"
                            @click="editArticle(slotProps.data)" />
                    </div>
                </template>
            </Column>
            <template #footer>
                <Button disabled icon="pi pi-box" class="p-button-sm p-button-text" label="Crear nuevo articulo"
                    @click="abrirNuevo(false)" />
                <Button :disabled="!pedido.NUM_CLI" icon="pi pi-plus" class="p-button-sm p-button-text" @click="addItem"
                    label="Agregar otra linea" />

            </template>

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

        <!-- <pre>
    {{ clientArticles }}
</pre>
        <pre>
    {{ pedido.items }}
</pre> -->

        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Cancelar" severity="secondary" @click="cancelPedido"></Button>
            <Button label="Guardar" icon="pi pi-save" class="p-button-primary" @click="generate"
                :disabled="!pedido.NUM_CLI" />
        </div>

    </div>
    <Toast />

    <Dialog v-model:visible="articuloDialogo" :style="{ width: '650px' }" header="Detalles del ARTICULO" :modal="true">
        <div class="flex flex-col gap-4">
            <!-- Código y Descripción -->
            <div class="flex justify-start gap-4">
                <label for="codigo" class="block font-bold mb-2">Código</label>
                <InputText id="codigo" v-model="articulo.COD_ART" :invalid="articulo.COD_ART == ''" />

                <label for="material" class="block font-bold mb-2">Material</label>
                <InputText id="material" v-model="articulo.MAT_ART" :invalid="articulo.MAT_ART == ''" />
            </div>

            <div class="flex gap-4">
                <label for="descripcion" class="block font-bold mb-2">Descripción</label>
                <InputText id="descripcion" v-model="articulo.NOM_ART" class="w-full"
                    :invalid="articulo.NOM_ART == ''" />
            </div>

            <div class="flex gap-4">
                <label for="nroplano" class="block font-bold mb-2">Nº de Plano</label>
                <InputText id="nroplano" v-model="articulo.NROPLANO_ART" :invalid="articulo.NROPLANO_ART == ''" />
                <label for="revision" class="block font-bold mb-2">Rev</label>
                <InputText id="revision" v-model="articulo.REV_PLANO" />
            </div>
            <div class="flex gap-4">
                <label for="cliente" class="block font-bold mb-2">Cliente</label>
                <!-- <InputText id="cliente" v-model="articulo.NUM_CLI" /> -->
                <InputText id="cliente" v-model="clientSelected.NOM_CLI" readonly />

                <!-- <Select :invalid="clientSelected == null" v-model="clientSelected" :options="clients" filter
                    optionLabel="NOM_CLI" placeholder="Seleccione un cliente" class="w-full md:w-full"
                    emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes"
                    @change="changeCliente" emptySelectionMessage="Seleccione un cliente">
                </Select> -->


            </div>

            <hr />
            <!-- Ubicación del Plano
                <div>
                    <label for="ubicacion_plano" class="block font-bold mb-2">Ubicación del Plano</label>
                    <InputText id="ubicacion_plano" v-model="articulo.PLANO_ART" />
                </div>-->

            <!-- Costo y Precio de Venta -->
            <div class="flex justify-between gap-4">
                <div>
                    <label for="costo_mp" class="block font-bold mb-2">Costo MP</label>
                    <InputNumber id="costo_mp" v-model="articulo.COSMP_ART" mode="currency" currency="USD"
                        locale="en-US" />
                </div>
                <div>
                    <label for="costo_mp" class="block font-bold mb-2">Costo MO</label>
                    <InputNumber id="costo_mo" v-model="articulo.COSMO_ART" mode="currency" currency="USD"
                        locale="en-US" />
                </div>

                <div>
                    <label for="costo_total" class="block font-bold mb-2">Costo Total</label>
                    <!-- <InputNumber id="costo_total" v-model="articulo.PV_ART" mode="currency" currency="USD" locale="en-US" /> --->
                </div>
            </div>

            <!-- IVA y Utilidad -->
            <div class="flex justify-between gap-4">
                <div>
                    <label for="utilidad" class="block font-bold mb-2">Utilidad</label>
                    <InputNumber id="utilidad" v-model="articulo.UTI_ART" suffix="%" />
                </div>

                <div>
                    <label for="precio_venta" class="block font-bold mb-2">Precio de Venta</label>
                    <InputNumber id="precio_venta" v-model="articulo.PV_ART" mode="currency" currency="USD"
                        locale="en-US" />
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="ocultarDialogo" />
            <Button label="Guardar" icon="pi pi-check" @click="isEditing ? editarArticle() : crearArticle()" :loading="loading" />
        </template>
    </Dialog>
</template>