<script setup>
import { ArticleService } from '@/service/ArticleService';
import { ClienteService } from '@/service/ClienteService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


// Usa el router
const router = useRouter();
// getClientes from CustomerService

const clients = ref([]);
// onMounted(async () => {
//     clients.value = await CustomerService.getCustomersMinimal();
// });

onMounted(() => {
    ClienteService.getClientes().then((data) => (clients.value = data));
    ArticleService.getArticlesXLarge().then((data) => (articulos.value = data.data));
});

const changeCliente = async (e) => {
    clientSelected.value = e.value
    console.log('clientSelected')
    console.log(e.value)
    // try {
    //     const articles = await ArticleService.getArticlesByClient(e.value.NUM_CLI);
    //     // console.log('articles by client', articles) //--> No trae el id
    //     clientArticles.value = Array.isArray(articles) ? articles : [];
    //     clientSelected.value = e.value
    // } catch (error) {
    //     console.error('Error fetching client articles:', error);
    //     clientArticles.value = [];
    // }
};

const toast = useToast();
const dt = ref();
const clientes = ref([]);
const articulos = ref([
    {
        id: null,
        COD_ART: '',
        NOM_ART: '',
        MAT_ART: '',
        NROPLANO_ART: '',
        REV_PLANO: '',
        NUM_CLI: '',
        PLANO_ART: '',
        COSMP_ART: 0,
        COSM0_ART: 0,
        PV_ART: 0,
        IVA1_ART: 21,
        UTI_ART: 7
    }
]);

const articuloDialogo = ref(false);
const eliminararticuloDialogo = ref(false);

const priceHistoryDialog = ref(false);

const selectedArticle = ref([]);
const clientSelected = ref(null)
const loading = ref(false)


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
    COSM0_ART: 0,
    PV_ART: 0,
    IVA1_ART: 21,
    UTI_ART: 7
});

function priceHistory(data) {
    selectedArticle.value = data;
    priceHistoryDialog.value = true;
}

const clientesSeleccionados = ref([]);
const filtros = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    MAT_ART: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const enviado = ref(false);

function abrirNuevo() {
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
    enviado.value = false;
    articuloDialogo.value = true;
}

function ocultarDialogo() {
    articuloDialogo.value = false;
    enviado.value = false;
    clientSelected.value = null;
}


async function crearArticle() {


    if (!articulo.value.COD_ART || !clientSelected.value || !articulo.value.NOM_ART) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos obligatorios.', life: 3000 });
        return;
    }
    let newArticle = articulo.value;
    newArticle.NUM_CLI = clientSelected.value.NUM_CLI;
    try {
        loading.value = true;
        const response = await ArticleService.createArticle(newArticle);

        if (response.status >= 200) {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo creado exitosamente.', life: 3000 });
            console.log('articulo creado');

            articuloDialogo.value = false;
            articulos.value.push(response.data);

            // go to last page
            // dt.value.paginate({ first: Math.ceil(articulos.value.length / 50) * 50, rows: 50 });
        } else {

            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el artículo. Intente nuevamente.', life: 3000 });
        
    } finally {
        loading.value = false;
        clientSelected.value = null;
    }
}

// modalEdit
function modalEdit(article) {
    articulo.value = { ...article };
    articuloDialogo.value = true;
    clientSelected.value = article.client
}

async function editarArticle() {
    let article = articulo.value;
    // set article.NUM_CLI to the selected client
    article.NUM_CLI = clientSelected.value.NUM_CLI;

    try {
        loading.value = true;
        const response = await ArticleService.editarArticle(article);

        if (response.status >= 200) {
            // Aquí asumimos que los datos actualizados vienen en response.data
            const updatedArticle = response.data;

            // Buscar el artículo en el arreglo 'articulos' por su ID
            const index = articulos.value.findIndex(a => a.id === article.id);
            if (index !== -1) {
                // Actualizar el artículo en el arreglo
                articulos.value[index] = { ...articulos.value[index], ...updatedArticle };
               
            }

            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo actualizado exitosamente.', life: 3000 });
            articuloDialogo.value = false;
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el artículo. Intente nuevamente.', life: 3000 });
        console.log('error al actualizar artículo', error);
    } finally {
        loading.value = false;

    }
}



function eliminarCliente() {
    clientes.value = clientes.value.filter((val) => val.NUM_CLI !== cliente.value.NUM_CLI);
    eliminararticuloDialogo.value = false;
    cliente.value = {};
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Eliminado', life: 3000 });
}


function saveArticle() {


    if (!articulo.value.id) {

        crearArticle();

    } else {

        editarArticle();
    }
}

async function filterByClient(client) {
    // articulos.value = articulos.value.filter(art => art.NUM_CLI === client.NOM_CLI)
    console.log(articulos)
    try {
        if (clientSelected.value) {

            const response = await ArticleService.getArticlesByClient(client.NUM_CLI);
            articulos.value = response;
        } else {
            const response = await ArticleService.getArticlesXLarge()
            articulos.value = response.data;

        }
    } catch (error) {
        console.error('Error :', error);
    }
};

</script>

<template>
    <div>
        <div class="card">

            <DataTable ref="dt" :value="articulos" dataKey="COD_ART" :paginator="true" :rows="50" :filters="filtros"
                :totalRecords="totalRecords" @page="onPageChange"
                :globalFilterFields="['COD_ART', 'NOM_ART', 'MAT_ART', 'NROPLANO_ART', 'CLIENT_LABEL']"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[50]" sortField="id" :sortOrder="-1"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} articulos">
                <template #header>
                    <div class="font-semibold text-xl mb-4">ARTICULOS</div>
                    <div class="flex justify-between items-center">
                        <div class="">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filtros['global'].value" placeholder="Buscador" />
                            </IconField>
                            <div style="display: flex;">
                                <Select :options="clients" optionLabel="NOM_CLI" v-model="clientSelected" filter
                                    placeholder="Seleccione un cliente" class="w-full" @change="filterByClient(clientSelected)"
                                    :virtualScrollerOptions="{ itemSize: 38 }" showClear
                                    emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes"
                                    emptySelectionMessage="Seleccione un cliente" style="max-width: 300px;">
                                    <template #option="slotProps">
                                        <div class="flex items center">
                                            <span>{{ slotProps.option.NUM_CLI }}</span>
                                            <span class="ml-2">{{ slotProps.option.NOM_CLI }}</span>
                                        </div>
                                    </template>
                                    <template #value="slotProps">
                                        <div class="flex items center">
                                            <span>{{ slotProps.value?.NOM_CLI }}</span>
                                            <span v-if="!slotProps.value?.NUM_CLI" class="ml-2"> Filtrar por cliente
                                            </span>
                                        </div>
                                    </template>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Button icon="pi pi-plus" label="Nuevo articulo" class="mx-2 p-button-primary"
                                @click="abrirNuevo" />
                        </div>
                    </div>
                </template>

                <Column field="COD_ART" header="Código" sortable style="min-width: 12rem"></Column>
                <Column field="NOM_ART" header="Nombre" sortable style="min-width: 16rem"></Column>
                <Column field="MAT_ART" header="Material" sortable style="min-width: 16rem"></Column>
                <Column field="NROPLANO_ART" header="Plano" sortable style="min-width: 16rem">
                    <template #body="slotProps"> {{ slotProps.data.NROPLANO_ART }} </template>
                </Column>
                <!-- <Column field="REV_PLANO" header="Rev." sortable style="min-width: 6rem"></Column> -->
                <Column field="CLIENT_LABEL" header="Cliente" sortable="">
                    <template #body="slotProps"> {{ slotProps.data.CLIENT_LABEL }} </template>
                </Column>
                <Column field="PV_ART" header="Ultimo precio" sortable style="text-align: right">
                    <template #body="slotProps"> {{ slotProps.data.PV_ART.toLocaleString('es-AR', {
                        style: 'currency',
                        currency: 'ARS'
                    }) }} </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-history" severity="info" small text @click="priceHistory(slotProps.data)" />
                        <Button icon="pi pi-pencil" class="mx-2" @click="modalEdit(slotProps.data)" />
                        <!--  <Button icon="pi pi-list" severity="info" @click="priceHistory(slotProps.data)" />
                      <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminarCliente(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="articuloDialogo" :style="{ width: '650px' }" header="Detalles del ARTICULO"
            :modal="true">
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
                    <Select :invalid="clientSelected == null" v-model="clientSelected" :options="clients" filter
                        optionLabel="NOM_CLI" placeholder="Seleccione un cliente" class="w-full md:w-full"
                        emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes"
                        @change="changeCliente" emptySelectionMessage="Seleccione un cliente">
                    </Select>


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
                <Button label="Guardar" icon="pi pi-check" @click="saveArticle()" :loading="loading"/>
            </template>
        </Dialog>

        <!-- dialog for priceHistory -->
        <Dialog v-model:visible="priceHistoryDialog" :style="{ width: '450px' }" header="Historial de precios"
            :modal="true">
            <table class="w-full">
                <thead>
                    <th style="text-align: left">Fecha</th>
                    <th style="text-align: left">Comp.</th>
                    <th style="text-align: left">Cant.</th>
                    <th style="text-align: right">Precio</th>
                </thead>
                <tbody>
                    <tr v-for="price in selectedArticle.precios">
                        <td>{{ price.FEC_FAC }}</td>
                        <td>{{ price.NUM_FAC }}</td>
                        <td>{{ price.CAN_IT }}</td>
                        <td style="text-align: right">{{ price.PRE_IT.toLocaleString('es-AR', {
                            style: 'currency',
                            currency:
                                'ARS'
                        }) }}</td>
                    </tr>
                </tbody>
            </table>
            <pre>
        {{ selectedArticle.precios }}
    </pre>
            <template #footer>
                <Button label="Cerrar" icon="pi pi-times" text @click="priceHistoryDialog = false" />
            </template>
        </Dialog>

        <Dialog v-model:visible="eliminararticuloDialogo" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="cliente">¿Estás seguro de que quieres eliminar <b>{{ cliente.NOM_CLI }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="eliminararticuloDialogo = false" />
                <Button label="Sí" icon="pi pi-check" @click="eliminarCliente" />
            </template>
        </Dialog>

    </div>
</template>
