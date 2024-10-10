<script setup>
import { ClienteService } from '@/service/ClienteService';
import { PedidoService } from '@/service/PedidoService';
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

const pedidosData = ref([]);



const clients = ref([]);
// onmounted select current month
onMounted(() => {
    search();

    // GET CLIENTS
    ClienteService.getCustomersMinimal().then((response) => {
        clients.value = response;
    });


});
const router = useRouter();

const add = () => {
    //visibleDialogAdd.value = true;
    // router push to newPedido
    router.push('/pedidos/new');
};

const hiddenPrices = ref(false);
const selectedClient = ref(null);

const search = async () => {
    try {
        if (selectedClient.value) {

            const response = await PedidoService.getPedidosByClient(selectedClient.value.NUM_CLI);
            pedidosData.value = response.data;
        } else {
            const response = await PedidoService.getPedidos();
            pedidosData.value = response.data;

        }
    } catch (error) {
        console.error('Error :', error);
    }
};

const pdfPedido = (id) => {
    PedidoService.pdfPedido(id, hiddenPrices.value).then((response) => {
        //console.log('response:', response.data.file);
        window.open(response.data.file, '_blank');

    });
};
</script>

<template>
    <div>
        <div class="mt-4">


            <DataTable :value="pedidosData" ref="dt">
                <template #header>
                    <div class="font-semibold text-xl mb-4">PEDIDOS DE CLIENTES</div>
                    <div class="flex justify-between items-center">

                        <div class="flex items-center">
                            <div style="display: flex;">
                                <Select :options="clients" optionLabel="NOM_CLI" v-model="selectedClient" filter
                                    placeholder="Seleccione un cliente" class="w-full" @change="search()"
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
                            <div class="flex items-center mx-3">
                                <Checkbox v-model="hiddenPrices" inputId="hiddenPrices" name="hiddenPrices"
                                    :binary="true" />
                                <label for="hiddenPrices" class="ml-2"> Ocultar precios </label>
                            </div>
                        </div>

                        <div>
                            <Button icon="pi pi-plus" label="Nuevo pedido" class="mx-2 p-button-primary" @click="add" />
                        </div>
                    </div>
                </template>
                <template #empty>
                    <div class="p-4 text-center">No hay datos para mostrar.</div>
                </template>

                <Column field="nom_cli" header="Cliente" sortable>
                </Column>
                <Column field="num_oc" header="N° de Pedido" sortable></Column>
                <Column field="obs_fac" header="Observaciones" sortable></Column>
                <Column header="Total" sortable v-if="!hiddenPrices">
                    <template #body="data">
                        <div class="flex justify-start items-center">
                            {{ data.data.tip_mon == 'P' ? '$' : 'u$d' }} {{ data.data.total }}
                        </div>
                    </template>
                </Column>
                <Column header="Acciones">
                    <template #body="data">
                        <div class="flex justify-start items-center">
                            <Button icon="pi pi-file-pdf" severity="danger" class="mr-2"
                                @click="pdfPedido(data.data.id)" />
                            <Button icon="pi pi-paperclip" severity="help" disabled />
                        </div>
                    </template>
                </Column>



            </DataTable>
        </div>
    </div>
</template>