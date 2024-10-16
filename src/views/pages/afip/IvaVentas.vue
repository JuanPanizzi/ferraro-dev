<script setup>
import { ArticleService } from '@/service/ArticleService';
import { ClienteService } from '@/service/ClienteService';
import { VentasService } from '@/service/VentasService';
import { onMounted, ref } from 'vue';

import ComprobanteDialog from './AfipCompVenta.vue';

const selectedMonth = ref(null);
const selectedYear = ref({ label: new Date().getFullYear(), value: new Date().getFullYear() });
const ventasData = ref([]);

const months = [
    { name: 'Enero', value: 1 },
    { name: 'Febrero', value: 2 },
    { name: 'Marzo', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Mayo', value: 5 },
    { name: 'Junio', value: 6 },
    { name: 'Julio', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Septiembre', value: 9 },
    { name: 'Octubre', value: 10 },
    { name: 'Noviembre', value: 11 },
    { name: 'Diciembre', value: 12 }
];

const years = Array.from({ length: 20 }, (_, i) => ({
    label: new Date().getFullYear() - i,
    value: new Date().getFullYear() - i
}));

const search = async () => {
    if (selectedMonth.value && selectedYear.value) {
        try {
            // Fetch IVA Ventas data using ClienteService
            const mes = selectedMonth.value.value;
            const anio = selectedYear.value.value;

            const response = await ClienteService.getIvaVentas(mes, anio);
            ventasData.value = response;
        } catch (error) {
            console.error('Error :', error);
        }
    } else {
        console.warn('Seleccione un mes y un año');
    }
};

function facturaTemplate(rowData) {
    if (!rowData) {
        return '';
    }

    const tipDoc = rowData.TIP_DOC;
    const tipFac = rowData.TIP_FAC;
    const numFac = rowData.NUM_FAC;
    const formattedNumFac = `${numFac.slice(0, 4)}-${numFac.slice(4)}`;

    const tipDocMap = {
        1: 'FAC A', // Factura A
        2: 'DEB A', // Nota de Débito A
        3: 'NCR A', // Nota de Crédito A
        4: 'REC A', // Recibo A
        6: 'FAC B', // Factura B
        7: 'DEB B', // Nota de Débito B
        8: 'NCR B', // Nota de Crédito B
        9: 'REC B', // Recibo B
        11: 'FAC T', // Factura T
        12: 'DEB T', // Nota de Débito T
        13: 'NCR T', // Nota de Crédito T
        201: 'FCE A', // Factura de Crédito Electrónica MiPyMEs (FCE) A
        202: 'FCE A', // Nota de Débito Electrónica MiPyMEs (FCE) A
        203: 'FCE A', // Nota de Crédito Electrónica MiPyMEs (FCE) A
        206: 'FCE B', // Factura de Crédito Electrónica MiPyMEs (FCE) B
        207: 'FCE B', // Nota de Débito Electrónica MiPyMEs (FCE) B
        208: 'FCE B' // Nota de Crédito Electrónica MiPyMEs (FCE) B
    };

    return `<b>${tipDocMap[tipDoc]} </b>  ${formattedNumFac}`;
}
const clients = ref([]);
// onmounted select current month
onMounted(() => {
    const currentMonth = new Date().getMonth() + 1;
    selectedMonth.value = months.find((month) => month.value === currentMonth);
    search();

    // GET CLIENTS
    ClienteService.getCustomersMinimal().then((response) => {
        clients.value = response;
    });
});

const add = () => {
    visibleDialogAdd.value = true;
};

const dialogIvaVentas = () => {
    visibleDialogIvaVentas.value = true;
};
const visibleDialogIvaVentas = ref(false);

const afipComp = ref({
    TIP_DOC: null,
    TIP_FAC: '',
    NUM_FAC: '',
    FEC_FAC: new Date().toISOString().substr(0, 10),
    NUM_CLI: null,
    NOM_CLI: '',
    CUIT_CLI: '',
    SUBT_FAC: 0,
    OBS_FAC: '',
    items: [
        {
            NUM_LIN: 1,
            COD_IT: '',
            DES_IT: '',
            CAN_IT: 1,
            PRE_IT: 1,
            KIL_IT: 0,
            IVA1_IT: 0,
            IVA2_IT: 0,
            TIP_DOC: 0
        }
    ]
});

const visibleDialogAdd = ref(false);
const types = [
    { name: 'Factura A', value: 1 },
    { name: 'Nota de Débito A', value: 2 },
    { name: 'Nota de Crédito A', value: 3 },
    { name: 'Recibo A', value: 4 },
    { name: 'Factura B', value: 6 },
    { name: 'Nota de Débito B', value: 7 },
    { name: 'Nota de Crédito B', value: 8 },
    { name: 'Recibo B', value: 9 },
    { name: 'Factura T', value: 11 },
    { name: 'Nota de Débito T', value: 12 },
    { name: 'Nota de Crédito T', value: 13 },
    { name: 'Factura de Crédito Electrónica MiPyMEs (FCE) A', value: 201 },
    { name: 'Nota de Débito Electrónica MiPyMEs (FCE) A', value: 202 },
    { name: 'Nota de Crédito Electrónica MiPyMEs (FCE) A', value: 203 },
    { name: 'Factura de Crédito Electrónica MiPyMEs (FCE) B', value: 206 },
    { name: 'Nota de Débito Electrónica MiPyMEs (FCE) B', value: 207 },
    { name: 'Nota de Crédito Electrónica MiPyMEs (FCE) B', value: 208 }
];

const searchArticulo = (codigo, index) => {
    //console.log('searchArticulo', codigo, index);

    // search articulo
    ArticleService.searchArticle(codigo).then((response) => {
        //console.log('searchArticulo', response);
        afipComp.value.items[index].DES_IT = response.NOM_ART;
    });
};

const newNext = () => {
    VentasService.save(afipComp.value).then((response) => {
        console.log('save', response);
    });
};

const showComp = (comp) => {
    //   async show(TIP_DOC, TIP_FAC, NUM_FAC) {
    VentasService.show(comp.TIP_DOC, comp.TIP_FAC, comp.NUM_FAC).then((response) => {
        //console.log('show', response);
        afipComp.value = response;
        visibleDialogAdd.value = true;
    });
};

const exportExcel = () => {
    VentasService.exportExcel(selectedMonth.value.value, selectedYear.value.value).then((response) => {
        // the response is an url to download the file
        if (response.file) {
            window.open(response.file);
        } else {
            console.error('Error exporting excel');
        }
    });
};
</script>

<template>
    <div>
        <div class="mt-4 ">
            <Dialog v-model:visible="visibleDialogIvaVentas" modal header="IVA Ventas" :style="{ width: '75rem' }">
                <!-- 4 buttons, download excel, download txt, send mail -->
                <div class="flex justify-center gap-4 ">
                    <div>
                        <Button icon="pi pi-file-excel" label="Excel" class="p-button-success" @click="exportExcel" />
                    </div>
                    <div>
                        <Button icon="pi pi-file" label="TXT" class="p-button-info" disabled />
                    </div>
                    <div>
                        <Button icon="pi pi-envelope" label="Enviar por mail" class="p-button-warning" disabled />
                    </div>
                    <!-- <Button icon="pi pi-times" label="Cerrar" class="p-button-secondary" @click="visibleDialogIvaVentas = false" /> -->
                </div>

                <template #footer>
                    <div class="flex justify-end gap-2 mt-4">
                        <Button icon="pi pi-times" label="Cerrar" class="p-button-secondary"
                            @click="visibleDialogIvaVentas = false" />
                    </div>
                </template>
            </Dialog>

            <ComprobanteDialog v-model:visibleDialog="visibleDialogAdd" :afipComp="afipComp" :clients="clients"
                :types="types" header="Nuevo comprobante" @next="newNext" @search-articulo="searchArticulo" />

            <DataTable :value="ventasData" ref="dt">
                <template #header>
                    <div class="font-semibold text-xl mb-4 text-center sm:text-left">VENTAS</div>
                    <div class="flex flex-wrap justify-center sm:justify-between items-center ">
                        <div class=" flex justify-center flex-wrap p-2 ">
                          <div>

                              MES :
                              
                              <!-- Month Selector -->
                              <Select v-model="selectedMonth" :options="months" :optionLabel="'name'" class="mx-2"
                              placeholder="Mes" />
                            </div>
                            <div class="max-[402px]:mt-3">

                                AÑO :
                                <!-- Year Selector -->
                                <Select v-model="selectedYear" :options="years" :optionLabel="'label'" class="mx-2"
                                placeholder="Año" />
                            </div>
                            <!-- Search Button -->
                            <Button @click="search" class="mx-2 max-[452px]:mt-2" :disabled="!selectedMonth || !selectedYear"
                                icon="pi pi-search" />
                            <Button icon="pi pi-file-export" label="IVA Ventas" @click="dialogIvaVentas"
                                :disabled="ventasData.length === 0" class="mx-2 p-button-info max-[577px]:mt-2" />
                            <!--- download PDF
                            <Button icon="pi pi-file-pdf" label="PDF" @click="exportPDF" :disabled="ventasData.length === 0" class="mx-2 p-button-danger" />-->
                        </div>
                        <div>
                            <Button icon="pi pi-plus" label="Nuevo comprobante" class="mx-2 p-button-primary"
                                @click="add" />
                        </div>
                    </div>
                </template>
                <template #empty>
                    <div class="p-4 text-center">No hay datos para mostrar, seleccione un mes y un año.</div>
                </template>
                <Column field="FEC_FAC" header="Fecha Fac.">
                    <template #body="slotProps">{{ new Date(slotProps.data.FEC_FAC).toLocaleDateString('es-AR')
                        }}</template>
                </Column>
                <!-- NUM_FAC -->
                <Column field="NUM_FAC" header="Nº Comp.">
                    <template #body="slotProps">
                        <Button icon="pi pi-eye" size="small" text @click="showComp(slotProps.data)" />
                        <span v-html="facturaTemplate(slotProps.data)"></span>
                    </template>
                </Column>
                <Column field="NOM_CLI" header="Razon Social" />
                <!-- cuit -->
                <Column field="CUIT_CLI" header="CUIT" />
                <Column field="SUBT_FAC" header="Neto Gravado" style="text-align: right" headerClass="th-text-right">
                    <template #body="slotProps">
                        {{ slotProps.data.SUBT_FAC.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                    <template #footer>
                        <!-- Total -->
                        <b>{{ ventasData.reduce((acc, item) => acc + item.SUBT_FAC, 0).toLocaleString('es-AR', {
                            style:
                            'currency', currency: 'ARS' }) }}</b>
                    </template>
                </Column>
                <Column field="TOT_IVA1" header="Iva Inscripto" style="text-align: right" headerClass="th-text-right">
                    <template #body="slotProps">
                        {{ (slotProps.data.SUBT_FAC * 0.21).toLocaleString('es-AR', {
                            style: 'currency', currency: 'ARS'
                        }) }}
                    </template>
                    <template #footer>
                        <!-- Total -->
                        <b>{{ ventasData.reduce((acc, item) => acc + item.SUBT_FAC * 0.21, 0).toLocaleString('es-AR', {
                            style: 'currency', currency: 'ARS' }) }}</b>
                    </template>
                </Column>
                <!-- <Column field="TOT_IVA2" header="Iva No Insc." style="text-align: right">
                    <template #body="slotProps">
                        {{ slotProps.data.TOT_IVA2.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                </Column>
                <Column field="RET_IB" header="Percep.IB" style="text-align: right">
                    <template #body="slotProps">
                        {{ slotProps.data.RET_IB.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                </Column>
                <Column field="PJERET_IB" header="Exento" style="text-align: right">
                    <template #body="slotProps">
                        {{ slotProps.data.PJERET_IB.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                </Column> -->
                <Column header="Total" style="text-align: right" headerClass="th-text-right">
                    <template #body="slotProps">
                        {{ (slotProps.data.SUBT_FAC + slotProps.data.SUBT_FAC * 0.21).toLocaleString('es-AR', {
                            style:
                                'currency', currency: 'ARS' }) }}
                    </template>
                    <template #footer>
                        <!-- Total -->
                        <b>{{ ventasData.reduce((acc, item) => acc + item.SUBT_FAC + item.SUBT_FAC * 0.21,
                            0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}</b>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
