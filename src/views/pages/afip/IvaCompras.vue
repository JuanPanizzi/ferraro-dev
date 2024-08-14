<script setup>
import { ref } from 'vue';
import { ProviderService } from '@/service/ProviderService';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const dates = ref([]);
const pagosProData = ref([]);

const search = async () => {
    if (dates.value.length === 2) {
        try {
            const startDate = dates.value[0].toISOString().split('T')[0];
            const endDate = dates.value[1].toISOString().split('T')[0];

            const response = await ProviderService.getIvaCompras(startDate, endDate);
            pagosProData.value = response;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.warn('Please select a valid date range.');
    }
};
</script>

<template>
    <div>
        <div class="card">
            <div class="font-semibold text-xl mb-4">IVA COMPRAS</div>
            <p>Seleccione el periodo para ver el detalle de las compras.</p>

            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-12 sm:col-span-6">
                    <DatePicker v-model="dates" selectionMode="range" :manualInput="false" showButtonBar />
                </div>
                <div class="col-span-12">
                    <Button label="Buscar" @click="search" />
                </div>
            </div>
        </div>

        <div v-if="pagosProData.length > 0" class="mt-4">
            <h3 class="font-semibold text-lg mb-4">Resultados</h3>
            <DataTable :value="pagosProData" paginator :rows="10">
                <Column field="NOM_PRO" header="Proveedor" />
                <Column field="FEC_REC" header="Fecha Recibo">
                    <template #body="slotProps">{{ new Date(slotProps.data.FEC_REC).toLocaleDateString() }}</template>
                </Column>
                <!-- FEC_IVA -->
                <Column field="FEC_IVA" header="Fecha IVA">
                    <template #body="slotProps">{{ new Date(slotProps.data.FEC_IVA).toLocaleDateString() }}</template>
                </Column>
                <!--- NUM_FAC -->
                <Column field="NUM_FAC" header="N° Comp." />
                <Column field="IMP_REC" header="Importe Recibido" />
                <Column field="RET_GAN" header="Ret. Ganancias" />
                <Column field="RET_IVA" header="Ret. IVA" />
                <Column field="RET_IB" header="Ret. IIBB" />
                <!-- Add more columns as needed -->
            </DataTable>
        </div>
    </div>
</template>
