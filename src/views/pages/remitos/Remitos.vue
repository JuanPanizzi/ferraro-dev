<script setup>
import { RemitoService } from '@/service/RemitoService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

const router = useRouter();

const toast = useToast();
const dt = ref();
const remitos = ref([]);
const remitoDialogo = ref(false);
const eliminarRemitoDialogo = ref(false);
const eliminarRemitosDialogo = ref(false);
const remito = ref({
    NUM_REM: '',
    NUM_CLI: '',
    FEC_REM: '',
    DIRENT_REM: ''
});
const remitosSeleccionados = ref([]);
const filtros = ref({
    global: { value: null, matchMode: 'contains' }
});
const enviado = ref(false);

const remitoService = new RemitoService();

onMounted(() => {
    remitoService.getRemitos().then((data) => (remitos.value = data));
});

function abrirNuevo() {
    // go to new_remito route
    router.push({ name: 'NewRemito' });
}

function ocultarDialogo() {
    remitoDialogo.value = false;
    enviado.value = false;
}

function guardarRemito() {
    enviado.value = true;

    if (remito.value.NUM_CLI?.trim()) {
        if (remito.value.NUM_REM) {
            remitoService.updateRemito(remito.value).then(() => {
                const index = buscarIndicePorId(remito.value.NUM_REM);
                if (index >= 0) {
                    remitos.value[index] = remito.value;
                    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Remito Actualizado', life: 3000 });
                }
            });
        } else {
            remito.value.NUM_REM = crearId();
            remitoService.createRemito(remito.value).then(() => {
                remitos.value.push(remito.value);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Remito Creado', life: 3000 });
            });
        }

        remitoDialogo.value = false;
        remito.value = {};
    }
}

function editarRemito(rem) {
    remito.value = { ...rem };
    remitoDialogo.value = true;
}

function confirmarEliminarRemito(rem) {
    remito.value = rem;
    eliminarRemitoDialogo.value = true;
}

function eliminarRemito() {
    remitoService.deleteRemito(remito.value).then(() => {
        remitos.value = remitos.value.filter((val) => val.NUM_REM !== remito.value.NUM_REM);
        eliminarRemitoDialogo.value = false;
        remito.value = {};
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Remito Eliminado', life: 3000 });
    });
}

function buscarIndicePorId(id) {
    return remitos.value.findIndex((remito) => remito.NUM_REM === id);
}

function crearId() {
    return (remitos.value.length + 1).toString().padStart(12, '0');
}
</script>

<template>
    <div>
        <div class="card">
            <DataTable
                ref="dt"
                :value="remitos"
                dataKey="NUM_REM"
                :paginator="true"
                :rows="10"
                :filters="filtros"
                :globalFilterFields="['NUM_REM', 'NUM_CLI']"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} remitos"
            >
                <template #header>
                    <div class="font-semibold text-xl mb-4">REMITOS</div>
                    <div class="flex justify-between items-center">
                        <div>
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filtros['global'].value" placeholder="Buscador" />
                            </IconField>
                        </div>
                        <div>
                            <Button icon="pi pi-plus" label="Nuevo Remito" class="mx-2 p-button-primary" @click="abrirNuevo" />
                        </div>
                    </div>
                </template>

                <Column field="FEC_REM" header="Fecha" sortable></Column>
                <Column field="NUM_REM" header="N° Remito" sortable>
                    <!-- template body slot props-->
                    <template #body="slotProps">
                        <Button :label="slotProps.data.NUM_REM" icon="pi pi-file-pdf" iconPos="left" text severity="danger" class="p-button-outlined" :href="`/api/remitos/${slotProps.data.NUM_REM}/pdf`" target="_blank" />
                    </template>
                </Column>
                <Column field="NOMCLIEN" header="Cliente" sortable></Column>
                <Column field="DIRENT_REM" header="Dirección Entrega" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <!-- <Button icon="pi pi-pencil" class="mx-2" @click="editarRemito(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminarRemito(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="remitoDialogo" :style="{ width: '450px' }" header="Detalles del Remito" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="num_rem" class="block font-bold mb-3">N° Remito</label>
                    <InputText id="num_rem" v-model="remito.NUM_REM" readonly />
                </div>
                <div>
                    <label for="num_cli" class="block font-bold mb-3">Cliente</label>
                    <InputText id="num_cli" v-model="remito.NUM_CLI" fluid />
                </div>
                <div>
                    <label for="fec_rem" class="block font-bold mb-3">Fecha Remito</label>
                    <InputText id="fec_rem" v-model="remito.FEC_REM" fluid />
                </div>
                <div>
                    <label for="dirent_rem" class="block font-bold mb-3">Dirección Entrega</label>
                    <InputText id="dirent_rem" v-model="remito.DIRENT_REM" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="ocultarDialogo" />
                <Button label="Guardar" icon="pi pi-check" @click="guardarRemito" />
            </template>
        </Dialog>

        <Dialog v-model:visible="eliminarRemitoDialogo" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="remito"
                    >¿Estás seguro de que quieres eliminar <b>{{ remito.NUM_REM }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="eliminarRemitoDialogo = false" />
                <Button label="Sí" icon="pi pi-check" @click="eliminarRemito" />
            </template>
        </Dialog>
    </div>
</template>
