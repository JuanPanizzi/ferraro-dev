<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CustomerService } from '@/service/CustomerService';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute();
const ventas = ref([]);
const clienteNombre = ref('');
const showModal = ref(false);
const selectedVenta = ref(null);
const loading = ref(false);
const currentPage = ref(1);
const totalRecords = ref(0);
const rowsPerPage = ref(10); // Number of rows per page

const remito1 = ref([]); // Normalized array for remito1

onMounted(async () => {
    await loadVentas();
});

async function loadVentas(page = 1) {
    const num_cli = route.params.id;
    loading.value = true;
    const response = await CustomerService.getCuentaCorriente(num_cli, page);
    ventas.value = response.data;
    totalRecords.value = response.total; // Total number of records
    clienteNombre.value = ventas.value.length > 0 ? ventas.value[0].NOM_CLI : '';
    loading.value = false;
}

function onPageChange(event) {
    currentPage.value = event.page + 1; // PrimeVue paginator is zero-based index
    loadVentas(currentPage.value);
}

// Function to format invoice values
function facturaTemplate(rowData) {
    if (!rowData) {
        return '';
    }

    const tipDoc = rowData.TIP_DOC;
    const tipFac = rowData.TIP_FAC;
    const numFac = rowData.NUM_FAC;
    const formattedNumFac = `${numFac.slice(0, 4)}-${numFac.slice(4)}`;

    // Map of TIP_DOC codes to labels
    const tipDocMap = {
        1: 'FC',
        2: 'NC',
        3: 'ND'
    };

    return `${tipDocMap[tipDoc]} ${tipFac} ${formattedNumFac}`;
}

function showDetail(venta) {
    if (!venta || selectedVenta.value === venta) {
        return;
    }
    selectedVenta.value = venta;
    showModal.value = true;
}
</script>

<template>
    <div>
        <DataTable :loading="loading" :value="ventas" paginator :rows="rowsPerPage" :total-records="totalRecords" :lazy="true" :first="(currentPage - 1) * rowsPerPage" @page="onPageChange">
            <template #header>
                <h1>{{ clienteNombre }}</h1>
            </template>

            <template #loading>
                <div class="p-4 flex justify-center items-center">
                    <ProgressSpinner />
                </div>
            </template>

            <Column field="FEC_FAC" header="Fecha" filter filterField="FEC_FAC" filterPlaceholder="Buscar por fecha">
                <template #body="rowData">{{ new Date(rowData.data.FEC_FAC).toLocaleDateString() }}</template>
            </Column>

            <Column header="Comp." filter filterField="NUM_FAC" filterPlaceholder="Buscar por factura">
                <template #body="rowData">{{ facturaTemplate(rowData.data) }}</template>
            </Column>

            <Column field="SUBT_FAC" header="Subtotal" filter filterField="SUBT_FAC" filterPlaceholder="Buscar por subtotal">
                <template #body="rowData">{{ rowData.data.SUBT_FAC.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</template>
            </Column>

            <Column header="IVA" filter filterField="TOT_IVA1" filterPlaceholder="Buscar por IVA">
                <template #body="rowData">{{ rowData.data.TOT_IVA1.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</template>
            </Column>

            <Column field="TOT_FAC" header="Total" filter filterField="TOT_FAC" filterPlaceholder="Buscar por total">
                <template #body="rowData">{{ (rowData.data.SUBT_FAC + rowData.data.TOT_IVA1).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</template>
            </Column>

            <Column header="Estado">
                <template #body="slotProps">
                    <Tag v-if="slotProps.data.TOT_PAG == slotProps.data.SUBT_FAC + slotProps.data.TOT_IVA1" severity="success" value="Pagada" />
                    <Tag v-else-if="slotProps.data.TOT_PAG >= 1" severity="info" value="Parcial" />
                    <Tag v-else-if="slotProps.data.ANULADA" severity="danger" value="Anulada" />
                    <Tag v-else severity="warn" value="Pendiente" />
                </template>
            </Column>

            <Column>
                <template #body="rowData">
                    <Button icon="pi pi-eye" outlined rounded severity="info" @click="showDetail(rowData.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- Detail Modal -->
        <Dialog :header="facturaTemplate(selectedVenta)" v-model:visible="showModal" :modal="true" :style="{ width: '50vw' }">
            <template v-if="selectedVenta">
                <div class="">
                    <div class="p-2 flex justify-between">
                        <p><strong>Cliente:</strong> {{ selectedVenta.NOM_CLI }}</p>
                        <p><strong>CUIT:</strong> {{ selectedVenta.CUIT_CLI }}</p>
                        <p><strong>Fecha:</strong> {{ new Date(selectedVenta.FEC_FAC).toLocaleDateString() }}</p>
                        <p><strong>Remito:</strong> {{ selectedVenta.NUM_REM }}</p>
                    </div>

                    <div class="p-2" v-if="selectedVenta.OBS_FAC">
                        <p><strong>Observaciones:</strong> {{ selectedVenta.OBS_FAC }}</p>
                    </div>

                    <div class="p-2">
                        <DataTable :value="selectedVenta.items" size="small">
                            <template #header>
                                <b>DETALLE</b>
                            </template>
                            <Column field="COD_IT" header="Código" />
                            <Column field="DES_IT" header="Descripción" />
                            <Column field="CAN_IT" header="Cantidad" />
                            <Column field="PRE_IT" header="Precio">
                                <template #body="rowData">{{ rowData.data.PRE_IT.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</template>
                            </Column>
                            <Column header="Subtotal">
                                <template #body="rowData">
                                    {{ (rowData.data.PRE_IT * rowData.data.CAN_IT).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                                </template>
                                <template #footer>
                                    <div class="flex justify-end">
                                        <strong>
                                            {{ selectedVenta.items.reduce((acc, item) => acc + item.PRE_IT * item.CAN_IT, 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                                        </strong>
                                    </div>
                                </template>
                            </Column>
                            <Column field="IVA1_IT" header="IVA">
                                <template #body="rowData">{{ (((rowData.data.PRE_IT * rowData.data.IVA1_IT) / 100) * rowData.data.CAN_IT).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</template>
                                <template #footer>
                                    <div class="flex justify-end">
                                        <strong>
                                            {{ selectedVenta.items.reduce((acc, item) => acc + ((item.PRE_IT * item.IVA1_IT) / 100) * item.CAN_IT, 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                                        </strong>
                                    </div>
                                </template>
                            </Column>
                            <Column header="Total">
                                <template #body="rowData">
                                    {{ ((rowData.data.PRE_IT + (rowData.data.PRE_IT * rowData.data.IVA1_IT) / 100) * rowData.data.CAN_IT).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                                </template>
                                <template #footer>
                                    <div class="flex justify-end">
                                        <strong>
                                            {{
                                                (selectedVenta.items.reduce((acc, item) => acc + item.PRE_IT * item.CAN_IT, 0) + selectedVenta.items.reduce((acc, item) => acc + ((item.PRE_IT * item.IVA1_IT) / 100) * item.CAN_IT, 0)).toLocaleString(
                                                    'es-AR',
                                                    { style: 'currency', currency: 'ARS' }
                                                )
                                            }}
                                        </strong>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>

                <!-- <div class="p-2" v-if="selectedVenta && selectedVenta.remito1">
                    <DataTable :value="selectedVenta.remito1" size="small">
                        <template #header>
                            <b>REMITOS</b>
                        </template>
                        <Column field="NUM_REM" header="Nro. Remito" />
                        <Column field="FEC_REM" header="Fecha">
                            <template #body="rowData">{{ new Date(rowData.data.FEC_REM).toLocaleDateString() }}</template>
                        </Column>
                        <Column field="DIRENT_REM" header="Observaciones" />
                    </DataTable>
                </div> -->
                <div class="flex justify-end mt-4">
                    <Button label="Cerrar" @click="showModal = false" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
