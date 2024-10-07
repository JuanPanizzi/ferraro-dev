<script setup>
import { ArticleService } from '@/service/ArticleService';
import { ClienteService } from '@/service/ClienteService';
import { RemitoService } from '@/service/RemitoService';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const clients = ref([]);
const remito = ref({
    NUM_REM: '',
    NUM_CLI: '',
    DIRENT_REM: 'MERCADERÍA ENTREGADA EN PLANTA',
    FEC_REM: '',
    FEC_IVA: '',
    OC_NUMBRE: '',
    items: []
});

onMounted(() => {
    const today = new Date();
    remito.value.FEC_REM = today.toLocaleDateString('es-ES');

    ClienteService.getCustomersMinimal().then((response) => {
        clients.value = response;
    });
});

const addItem = () => {
    remito.value.items.push({
        NUM_LIN: remito.value.items.length + 1,
        NUM_VTA: '',
        NUM_LINVTA: '',
        COD_IT: '',
        NUM_CLI: remito.value.NUM_CLI,
        FEC_REM: remito.value.FEC_REM,
        CANENT_IT: 1,
        DES_IT: ''
    });
};

const removeItem = (index) => {
    remito.value.items.splice(index, 1);
};

const resetForm = () => {
    remito.value = {
        NUM_REM: '',
        NUM_CLI: '',
        DIRENT_REM: 'MERCADERÍA ENTREGADA EN PLANTA',
        FEC_REM: '',
        FEC_IVA: '',
        OC_NUMBRE: '',
        items: []
    };

    router.back();
};

const searchArticulo = (cod_it, index) => {
    ArticleService.searchArticle(cod_it).then((response) => {
        remito.value.items[index].DES_IT = response.NOM_ART;
    });
};

const nextStep = () => {
    // Implementar lógica para el siguiente paso aquí
};

const generate = () => {
    RemitoService.crearRemito(remito.value).then((response) => {
        console.log(response);
    });
};
</script>

<template>
    <div class="p-4 card">
        <h2 class="text-xl font-semibold mb-4">NUEVO REMITO</h2>

        <div class="flex items-center gap-4 mb-4">
            <label for="NUM_CLI" class="font-semibold w-24">Cliente:</label>
            <Select v-model="remito.NUM_CLI" :options="clients" filter optionLabel="LABEL_CLI"
                placeholder="Seleccione un cliente" class="w-full md:w-64" />

            <label for="FEC_REM" class="font-semibold w-24">Fecha:</label>
            <DatePicker v-model="remito.FEC_REM" id="FEC_REM" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="DIRENT_REM" class="font-semibold w-96">Dirección de entrega:</label>
            <InputText v-model="remito.DIRENT_REM" id="DIRENT_REM" placeholder="Dirección de entrega" class="w-full" />
            <label for="TRA_REM" class="font-semibold w-24">Transporte:</label>
            <InputText v-model="remito.TRA_REM" id="TRA_REM" placeholder="Transporte" class="w-64" />
        </div>
        <div class="">
            <table style="min-width: 50rem; border-collapse: collapse; width: 100%">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 5%">#</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 10%">O.C.</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 5%">O.C. Item</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 15%">Código</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 50%">Descripción</th>
                        <th style="border: 1px solid #ccc; padding: 1px; width: 10%">Cant.</th>
                        <th style="border: 1px solid #ccc; padding: 4px; width: 5%"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in remito.items" :key="index">
                        <td style="border: 1px solid #ccc; padding: 1px; text-align: center">{{ item.NUM_LIN }}</td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="text" v-model="item.OC_NUMBRE"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="text" v-model="item.OC_LINE"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 4px; display: flex; align-items: center; gap: 4px">
                            <input type="text" v-model="item.COD_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                            <Button icon="pi pi-search" outlined severity="info" v-if="item.COD_IT" size="small"
                                @click="searchArticulo(item.COD_IT, index)" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="text" v-model="item.DES_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 1px">
                            <input type="number" v-model="item.CAN_IT"
                                style="border: 1px solid #aaa; width: 100%; padding: 4px" />
                        </td>
                        <td style="border: 1px solid #ccc; padding: 4px; text-align: center; cursor: pointer"
                            @click="removeItem(index)">
                            <Button icon="pi pi-trash" outlined severity="danger" size="small" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="text-align: center; padding: 2px; font-weight: bold; cursor: pointer"
                        class="bg-green-200 hover:bg-green-300">
                        <td colspan="7" @click="addItem"><i class="pi pi-plus"></i> Añadir</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Cancelar" severity="secondary" @click="resetForm"></Button>
            <!-- <Button label="Siguiente" class="p-button-primary" @click="nextStep" /> -->
            <Button label="Generar" class="p-button-primary" @click="generate()" />
        </div>
    </div>
</template>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente si es necesario */
</style>
