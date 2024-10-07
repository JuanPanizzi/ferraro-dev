<script setup>
import { ClienteService } from '@/service/ClienteService';
import { PedidoService } from '@/service/PedidoService';
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

const pedidosData = ref([]);

const search = async () => {
    try {

        const response = await PedidoService.getPedidos();
        pedidosData.value = response.data;
    } catch (error) {
        console.error('Error :', error);
    }
};


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

                        <div class="card flex flex-wrap justify-center gap-4">
                            <div class="flex items-center">
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

                <!-- <Column field="fec_fac" header="Fecha" sortable>
                </Column> -->

                <Column field="num_oc" header="Nro OC" sortable></Column>
                <Column field="nom_cli" header="Cliente" sortable>
                </Column>
                <Column field="obs_fac" header="Observaciones" sortable></Column>
                <Column header="Total" sortable >
                    <template #body="data">
                        <div class="flex justify-start items-center">
                            {{ data.data.tip_mon == 'P' ? '$' : 'u$d' }} {{ data.data.total }}
                        </div>
                    </template>
                </Column>
                <!-- <Column field="for_pag" header="Forma de Pago" sortable>

                    <template #body="data">
                        <div class="flex justify-center items-center">
                            <span v-if="data.data.for_pag == 'E'">Efectivo</span>
                            <span v-if="data.data.for_pag == 'T'">Transferencia</span>
                            <span v-if="data.data.for_pag == 'C'">Cheque</span>
                        </div>
                    </template>
                </Column> -->
                <!-- buttons: pdf, attachments -->
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