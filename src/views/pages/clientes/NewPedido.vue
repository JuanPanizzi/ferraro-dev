<script setup>
import { CustomerService } from '@/service/CustomerService';
import { onMounted, ref } from 'vue';

const pedido = ref({
    NUM_CLI: '',
    items: [
        { NUM_LIN: 1, COD_IT: '', DES_IT: '', CAN_IT: 1, PRE_IT: 1 }
    ],
    OBS_FAC: ''
});

const searchArticulo = (cod_it, index) => {
    emit('search-articulo', cod_it, index);
};

const addItem = () => {
    pedido.value.items.push({ 
        NUM_LIN: pedido.value.items.length + 1, 
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

// getClientes from CustomerService
const clients = ref([]);

onMounted(async () => {
    clients.value = await CustomerService.getCustomersMinimal();
});


</script>

<template>  
    <div class="flex items-center gap-4 mb-4">
        <label for="NUM_CLI" class="font-semibold w-24">Cliente: </label>
        <Select v-model="pedido.NUM_CLI" :options="clients" filter optionLabel="LABEL_CLI" placeholder="Seleccione un cliente" class="w-full md:w-full"
        emptyFilterMessage="No se encontraron clientes" emptyMessage="No hay clientes" emptySelectionMessage="Seleccione un cliente">
        
        
        > 
    </Select>
    </div>

    <div class="flex items-center gap-4 mb-4">
        <label for="NUM_CLI" class="font-semibold w-24">Fecha: </label>
        <InputText v-model="pedido.FEC_FAC" id="FEC_FAC" type="date" class="w-full md:w-full" />
 
        <!-- TIPO DE MONEDA -->
        <label for="TIP_MON" class="font-semibold w-24">Moneda: </label>
        <Select v-model="pedido.TIP_MON" :options="[{ label: 'Pesos', value: 'P' }, { label: 'Dólares', value: 'D' }]" class="w-full md:w-full" />
         <!-- cotizacion del dolar -->
        <label for="COT_DOLAR" class="font-semibold w-24">Dólar: </label>
        <InputText v-model="pedido.COT_DOLAR" id="COT_DOLAR" type="number" class="w-full md:w-full" />

    </div>
 

    <div class="my-2">
        <table style="min-width: 50rem; border-collapse: collapse; width: 100%">
            <thead>
                <tr>
                    <th style="border: 1px solid #ccc; padding: 1px; width: 5%">#</th>
                    <th style="border: 1px solid #ccc; padding: 1px; width: 25%">Código</th>
                    <th style="border: 1px solid #ccc; padding: 1px; width: 50%">Descripción</th>
                    <th style="border: 1px solid #ccc; padding: 1px; width: 10%">Cant.</th>
                    <th style="border: 1px solid #ccc; padding: 1px; width: 15%">Precio</th>
                    <th style="border: 1px solid #ccc; padding: 1px; width: 5%"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in pedido.items" :key="index">
                    <td style="border: 1px solid #ccc; padding: 1px; text-align: center">{{ item.NUM_LIN }}</td>
                    <td style="border: 1px solid #ccc; padding: 4px; display: flex; align-items: center; gap: 4px">
                        <input type="text" v-model="item.COD_IT" style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        <Button icon="pi pi-search" outlined severity="info" v-if="item.COD_IT" size="small" @click="searchArticulo(item.COD_IT, index)" />
                    </td>
                    <td style="border: 1px solid #ccc; padding: 1px">
                        <input type="text" v-model="item.DES_IT" style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                    </td>
                    <td style="border: 1px solid #ccc; padding: 1px">
                        <input type="number" v-model="item.CAN_IT" style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                    </td>
                    <td style="border: 1px solid #ccc; padding: 1px">
                        <input type="number" v-model="item.PRE_IT" style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                    </td>
                    <td style="border: 1px solid #ccc; padding: 4px; text-align: center; cursor: pointer" @click="removeItem(index)">
                        <Button icon="pi pi-trash" outlined severity="danger" size="small" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr style="text-align: center; padding: 2px; font-weight: bold; cursor: pointer" class="bg-green-200 hover:bg-green-300">
                    <td colspan="6" @click="addItem"><i class="pi pi-plus"></i> Añadir</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <Textarea v-model="pedido.OBS_FAC" id="OBS_FAC" rows="3" placeholder="Observaciones" class="w-full" />

    <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancelar" severity="secondary" @click="closeDialog"></Button>
        <Button label="Siguiente" class="p-button-primary" @click="nextStep" />
    </div> 
</template>