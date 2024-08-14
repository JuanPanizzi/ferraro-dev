<script setup>
import { ref } from 'vue';
import { CustomerService } from '@/service/CustomerService';

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
            // Fetch IVA Ventas data using CustomerService
            const mes = selectedMonth.value.value;
            const anio = selectedYear.value.value;

            const response = await CustomerService.getIvaVentas(mes, anio);
            ventasData.value = response;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.warn('Please select both a month and a year.');
    }
};
const dt = ref();
const exportCSV = () => {
    dt.value.exportCSV();
};

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
</script>

<template>
    <div>
        <div class="mt-4">
            <DataTable :value="ventasData" ref="dt">
                <template #header>
                    <div class="font-semibold text-xl mb-1">IVA VENTAS</div>

                    <!-- Year Selector -->
                    <Select v-model="selectedYear" :options="years" :optionLabel="'label'" class="mx-2" placeholder="Año" />

                    <!-- Month Selector -->
                    <Select v-model="selectedMonth" :options="months" :optionLabel="'name'" class="mx-2" placeholder="Mes" />

                    <!-- Search Button -->
                    <Button label="Buscar" @click="search" class="mx-2" />
                    <Button icon="pi pi-external-link" label="Exportar" @click="exportCSV($event)" />
                </template>
                <Column field="FEC_FAC" header="Fecha Fac.">
                    <template #body="slotProps">{{ new Date(slotProps.data.FEC_FAC).toLocaleDateString() }}</template>
                </Column>
                <!-- NUM_FAC -->
                <Column field="NUM_FAC" header="Nº Comp.">
                    <template #body="slotProps">
                        {{ facturaTemplate(slotProps.data) }}
                    </template>
                </Column>
                <Column field="NOM_CLI" header="Razon Social" />
                <Column field="SUBT_FAC" header="Neto Gravado" style="text-align: right" :headerStyle="{ 'text-align': 'right' }">
                    <template #body="slotProps">
                        {{ slotProps.data.SUBT_FAC.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                </Column>
                <Column field="TOT_IVA1" header="Iva Inscripto" style="text-align: right">
                    <template #body="slotProps">
                        {{ slotProps.data.TOT_IVA1.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                </Column>
                <Column field="TOT_IVA2" header="Iva No Insc." style="text-align: right">
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
                </Column>
                <Column header="Total" style="text-align: right">
                    <template #body="slotProps">
                        {{ (slotProps.data.SUBT_FAC + slotProps.data.TOT_IVA1).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
