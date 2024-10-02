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
    ArticleService.getArticlesXLarge().then((data) => (articulos.value = data));
});

const toast = useToast();
const dt = ref();
const clientes = ref([]);
const articulos = ref([]);

const articuloDialogo = ref(false);
const eliminararticuloDialogo = ref(false);
const eliminarClientesDialogo = ref(false);

const priceHistoryDialog = ref(false);

const selectedArticle = ref([]);
const clientSelected = ref(null)

const articulo = ref({
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
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const enviado = ref(false);

function abrirNuevo() {
    articulo.value = {
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
}

function guardarCliente() {
    enviado.value = true;

    if (cliente.value.NOM_CLI?.trim()) {
        if (cliente.value.NUM_CLI) {
            const index = buscarIndicePorId(cliente.value.NUM_CLI);
            if (index >= 0) {
                clientes.value[index] = cliente.value;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Actualizado', life: 3000 });
            } else {
                cliente.value.NUM_CLI = crearId();
                clientes.value.push(cliente.value);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Creado', life: 3000 });
            }
        } else {
            cliente.value.NUM_CLI = crearId();
            clientes.value.push(cliente.value);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Creado', life: 3000 });
        }

        articuloDialogo.value = false;
        cliente.value = {};
    }
}

async function crearArticle(newArticle){

    const response = await ArticleService.createArticle(newArticle);
    
    if(response.status >= 200 && response.status <= 299){
        console.log('articulo creado')
    }else{
        console.log('error al crear articulo')
    }
}
async function editarArticle(article){

const response = await ArticleService.editarArticle(article);

if(response.status >= 200 && response.status <= 299){
    console.log('articulo editado')
}else{
    console.log('error al editar articulo')
}
}

function editarCliente(cli) {
    cliente.value = { ...cli };
    articuloDialogo.value = true;
}

function confirmarEliminarCliente(cli) {
    cliente.value = cli;
    eliminararticuloDialogo.value = true;
}

function eliminarCliente() {
    clientes.value = clientes.value.filter((val) => val.NUM_CLI !== cliente.value.NUM_CLI);
    eliminararticuloDialogo.value = false;
    cliente.value = {};
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Eliminado', life: 3000 });
}

function buscarIndicePorId(id) {
    return clientes.value.findIndex((cliente) => cliente.NUM_CLI === id);
}

function crearId() {
    return (clientes.value.length + 1).toString().padStart(4, '0');
}

function exportarCSV() {
    dt.value.exportCSV();
}

function confirmarEliminarSeleccionados() {
    eliminarClientesDialogo.value = true;
}

function eliminarClientesSeleccionados() {
    clientes.value = clientes.value.filter((val) => !clientesSeleccionados.value.includes(val));
    eliminarClientesDialogo.value = false;
    clientesSeleccionados.value = null;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Clientes Eliminados', life: 3000 });
}

function verCuentaCorriente(cliente) {
    router.push({ name: 'ClienteCuentaCorriente', params: { id: cliente.NUM_CLI } });
}


</script>

<template>
    <div>
        <div class="card">
            <DataTable
                ref="dt"
                :value="articulos"
                dataKey="COD_ART"
                :paginator="true"
                :rows="10"
                :filters="filtros"
                :globalFilterFields="['COD_ART', 'NOM_ART']"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} articulos"
            >
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
                        </div>
                        <div>
                            <Button icon="pi pi-plus" label="Nuevo articulo" class="mx-2 p-button-primary" @click="abrirNuevo" />
                        </div>
                    </div>
                    <!-- <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filtros['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div> -->
                </template>

                <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
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
                    <template #body="slotProps"> {{ slotProps.data.PV_ART.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }} <Button icon="pi pi-history" severity="info" small text @click="priceHistory(slotProps.data)" /> </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <!--  <Button icon="pi pi-list" severity="info" @click="priceHistory(slotProps.data)" />
                         <Button icon="pi pi-pencil" class="mx-2" @click="editarCliente(slotProps.data)" />
                      <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminarCliente(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>
        </div>

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
                    <InputText id="descripcion" v-model="articulo.NOM_ART" class="w-full" :invalid="articulo.NOM_ART == ''" />
                </div>

                <div class="flex gap-4">
                    <label for="nroplano" class="block font-bold mb-2">Nº de Plano</label>
                    <InputText id="nroplano" v-model="articulo.NROPLANO_ART" :invalid="articulo.NROPLANO_ART == ''" />
                    <label for="revision" class="block font-bold mb-2">Rev</label>
                    <InputText id="revision" v-model="articulo.REV_PLANO"  />
                </div>
                <div class="flex gap-4">
                    <label for="cliente" class="block font-bold mb-2">Cliente</label>
                    <!-- <InputText id="cliente" v-model="articulo.NUM_CLI" /> -->
                    <Select :invalid="clientSelected == null" v-model="clientSelected" :options="clients" filter optionLabel="NOM_CLI"
                        placeholder="Seleccione un cliente" class="w-full md:w-full"
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
                        <InputNumber id="costo_mp" v-model="articulo.COSMP_ART" mode="currency" currency="USD" locale="en-US"  />
                    </div>
                    <div>
                        <label for="costo_mp" class="block font-bold mb-2">Costo MO</label>
                        <InputNumber id="costo_mo" v-model="articulo.COSMO_ART" mode="currency" currency="USD" locale="en-US"  />
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
                        <InputNumber id="precio_venta" v-model="articulo.PV_ART" mode="currency" currency="USD" locale="en-US" :invalid="articulo.PV_ART == 0"/>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="ocultarDialogo" />
                <Button label="Guardar" icon="pi pi-check" @click="crearArticle(articulo.value)" />
            </template>
        </Dialog>

        <!-- dialog for priceHistory -->
        <Dialog v-model:visible="priceHistoryDialog" :style="{ width: '450px' }" header="Historial de precios" :modal="true">
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
                        <td style="text-align: right">{{ price.PRE_IT.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</td>
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
                <span v-if="cliente"
                    >¿Estás seguro de que quieres eliminar <b>{{ cliente.NOM_CLI }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="eliminararticuloDialogo = false" />
                <Button label="Sí" icon="pi pi-check" @click="eliminarCliente" />
            </template>
        </Dialog>

        <Dialog v-model:visible="eliminarClientesDialogo" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="cliente">¿Estás seguro de que quieres eliminar los clientes seleccionados?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="eliminarClientesDialogo = false" />
                <Button label="Sí" icon="pi pi-check" text @click="eliminarClientesSeleccionados" />
            </template>
        </Dialog>
    </div>
</template>
