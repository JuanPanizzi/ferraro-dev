<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
    visibleDialog: {
        type: Boolean,
        required: true
    },
    afipComp: {
        type: Object,
        required: true
    },
    clients: {
        type: Array,
        required: true
    },
    types: {
        type: Array,
        required: true
    },
    header: {
        type: String,
        default: 'Nuevo comprobante'
    }
});

const emit = defineEmits(['update:visibleDialog', 'next', 'search-articulo']);

// Esto emitirá el evento cuando cambie la visibilidad del diálogo
const updateVisible = (visible) => {
    emit('update:visibleDialog', visible);
};

const closeDialog = () => {
    emit('update:visibleDialog', false);
};

const nextStep = () => {
    emit('next');
};

const searchArticulo = (cod_it, index) => {
    emit('search-articulo', cod_it, index);
};

const addItem = () => {
    props.afipComp.items.push({ NUM_LIN: props.afipComp.items.length + 1, COD_IT: '', DES_IT: '', CAN_IT: 1, PRE_IT: 1, IVA1_IT: 0, IVA2_IT: 0, TIP_DOC: 0 });
};

const removeItem = (index) => {
    props.afipComp.items.splice(index, 1);
};
</script>

<template>
    <Dialog :visible="visibleDialog" modal :header="header" :style="{ width: '75rem' }" @update:visible="updateVisible">
        <div class="flex items-center gap-4 mb-4">
            <label for="NUM_CLI" class="font-semibold w-24">Cliente:</label>
            <Select v-model="afipComp.NUM_CLI" :options="clients" filter optionLabel="LABEL_CLI" placeholder="Seleccione un cliente" class="w-full md:w-full"> </Select>

            <label for="TIP_DOC" class="font-semibold w-24">Tipo:</label>
            <Select v-model="afipComp.TIP_DOC" :options="types" :optionLabel="'name'" class="w-full" placeholder="Tipo de comprobante" />

            <label for="NUM_FAC" class="font-semibold w-24">Número:</label>
            <InputText v-model="afipComp.NUM_FAC" id="NUM_FAC" placeholder="00000-0000000" />
        </div>

        <div class="flex items-center gap-4 mb-4">
            <label for="NUM_NVTA" class="font-semibold w-12">OC:</label>
            <InputText v-model="afipComp.NUM_NVTA" id="NUM_NVTA" placeholder="Orden de Compra" />
            <label for="FEC_FAC" class="font-semibold w-24">Fecha FAC:</label>
            <DatePicker v-model="afipComp.FEC_FAC" id="FEC_FAC" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" />

            <label for="FEC_IVA" class="font-semibold w-24">Fecha IVA:</label>
            <DatePicker v-model="afipComp.FEC_IVA" id="FEC_IVA" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" />
        </div>

        <div class="">
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
                    <tr v-for="(item, index) in afipComp.items" :key="index">
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

        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Cancelar" severity="secondary" @click="closeDialog"></Button>
            <Button label="Siguiente" class="p-button-primary" @click="nextStep" />
        </div>
    </Dialog>
</template>
<style scoped>
/* Aquí puedes agregar estilos específicos para este componente si es necesario */
</style>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente si es necesario */
</style>
