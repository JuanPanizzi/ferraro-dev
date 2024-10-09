<script setup>
import { ClienteService } from '@/service/ClienteService';
import { FilterMatchMode } from '@primevue/core/api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


// Usa el router
const router = useRouter();

onMounted(() => {
    ClienteService.getClientes().then((data) => (clientes.value = data));
});

const toast = useToast();
const dt = ref();
const clientes = ref([]);
const clienteDialogo = ref(false);
const eliminarClienteDialogo = ref(false);
const eliminarClientesDialogo = ref(false);
const isEditing = ref(false)
const cliente = ref({
    NUM_CLI: '',
    NOM_CLI: '',
    DIR_CLI: '',
    LOC_CLI: '',
    CP_CLI: '',
    PRO_CLI: '',
    TEL_CLI: '',
    FAX_CLI: '',
    EMAIL_CLI: '',
    DTO_CLI: 0,
    CUIT_CLI: '',
    IVA_CLI: 0,
    OBS_CLI: '',
    CON_VTA: '',
    DIA_FF: 0,
    HOR_CLI: '',
    PERIB_CLI: 0
});
const clientesSeleccionados = ref([]);
const filtros = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const enviado = ref(false);

function abrirNuevo() {
    cliente.value = {
        NUM_CLI: '',
        NOM_CLI: '',
        DIR_CLI: '',
        LOC_CLI: '',
        CP_CLI: '',
        PRO_CLI: '',
        TEL_CLI: '',
        FAX_CLI: '',
        EMAIL_CLI: '',
        DTO_CLI: 0,
        CUIT_CLI: '',
        IVA_CLI: 0,
        OBS_CLI: '',
        CON_VTA: '',
        DIA_FF: 0,
        HOR_CLI: '',
        PERIB_CLI: 0
    };
    enviado.value = false;
    clienteDialogo.value = true;
}

function ocultarDialogo() {
    clienteDialogo.value = false;
    enviado.value = false;
}

async function crearCliente() {

    // toast error if cliente NOM_CLI is empty
    if (!cliente.value.NOM_CLI) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre es obligatorio',
            life: 3000
        });
        return;
    }

    const response = await ClienteService.crearCliente(cliente.value)

    if (response.status >= 200) {
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente creado correctamente',
            life: 3000
        });
        clientes.value.push(response.data);
        clienteDialogo.value = false
        isEditing.value = false
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el cliente',
            life: 3000
        });
        clienteDialogo.value = false;

    }
}
async function actualizarCliente() {

    const response = await ClienteService.actualizarCliente(cliente.value)
    if (response.status >= 200 && response.status <= 299) {
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente editado correctamente',
            life: 3000
        });
        clienteDialogo.value = false

        // update cliente in clientes array
        const index = buscarIndicePorId(cliente.value.NUM_CLI);
        clientes.value[index] = cliente.value;
        isEditing.value = false

    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el cliente',
            life: 3000
        });
        clienteDialogo.value = false

    }
}





function guardarCliente() {
    enviado.value = true;

    if (cliente.value.NOM_CLI?.trim()) {
        if (cliente.value.NUM_CLI) {
            const index = buscarIndicePorId(cliente.value.NUM_CLI);
            if (index >= 0) {
                clientes.value[index] = cliente.value;
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Actualizado', life: 3000 });
            } else {
                cliente.value.NUM_CLI = crearId();
                clientes.value.push(cliente.value);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Creado', life: 3000 });
            }
        } else {
            cliente.value.NUM_CLI = crearId();
            clientes.value.push(cliente.value);
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Creado', life: 3000 });
        }

        clienteDialogo.value = false;
        cliente.value = {};
    }
}

async function editarCliente(cli) {

    isEditing.value = true
    cliente.value = { ...cli };
    clienteDialogo.value = true;

}

function confirmarEliminarCliente(cli) {
    cliente.value = cli;
    eliminarClienteDialogo.value = true;
}

function eliminarCliente() {
    clientes.value = clientes.value.filter((val) => val.NUM_CLI !== cliente.value.NUM_CLI);
    eliminarClienteDialogo.value = false;
    cliente.value = {};
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente Eliminado', life: 3000 });
}

function buscarIndicePorId(id) {
    return clientes.value.findIndex((cliente) => cliente.NUM_CLI === id);
}

function crearId() {
    return (clientes.value.length + 1).toString().padStart(4, '0');
}

function exportarCSV() {
    dt.value.exportCSV();
}

function confirmarEliminarSeleccionados() {
    eliminarClientesDialogo.value = true;
}

function eliminarClientesSeleccionados() {
    clientes.value = clientes.value.filter((val) => !clientesSeleccionados.value.includes(val));
    eliminarClientesDialogo.value = false;
    clientesSeleccionados.value = null;
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Clientes Eliminados', life: 3000 });
}

function verCuentaCorriente(cliente) {
    router.push({ name: 'ClienteCuentaCorriente', params: { id: cliente.NUM_CLI } });
}
</script>

<template>
    <div>
        <div class="card">
            <!-- <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" @click="abrirNuevo" />
                   <Button label="Eliminar" icon="pi pi-trash" severity="secondary" @click="confirmarEliminarSeleccionados" :disabled="!clientesSeleccionados || !clientesSeleccionados.length" />
                </template>
</Toolbar> -->
            <!--
                v-model:selection="clientesSeleccionados" -->
            <DataTable ref="dt" :value="clientes" dataKey="NUM_CLI" :paginator="true" :rows="10" :filters="filtros"
                :globalFilterFields="['NUM_CLI', 'NOM_CLI']"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes" sortField="NUM_CLI"
                :sortOrder="-1">
                <template #header>
                    <div class="font-semibold text-xl mb-4">CLIENTES</div>
                    <div class="flex justify-between items-center">
                        <div class="">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filtros['global'].value" placeholder="Buscador" />
                            </IconField>
                        </div>
                        <div>
                            <Button icon="pi pi-plus" label="Nuevo cliente" class="mx-2 p-button-primary"
                                @click="abrirNuevo" />
                        </div>
                    </div>
                    <!-- <div class="flex flex-wrap gap-2 items-center justify-between">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filtros['global'].value" placeholder="Buscar..." />
                        </IconField>
                    </div> -->
                </template>

                <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
                <Column field="NUM_CLI" header="Código" sortable style="min-width: 12rem"></Column>
                <Column field="NOM_CLI" header="Nombre" sortable style="min-width: 16rem"></Column>
                <Column field="CUIT_CLI" header="Nombre" sortable style="min-width: 16rem"></Column>

                <!-- <Column field="DIR_CLI" header="Dirección" sortable style="min-width: 16rem"></Column> -->
                <!-- <Column field="LOC_CLI" header="Localidad" sortable style="min-width: 12rem"></Column> -->
                <Column field="PRO_CLI" header="Provincia" sortable style="min-width: 12rem"></Column>
                <Column field="TEL_CLI" header="Teléfono" sortable style="min-width: 12rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        
                        <Button icon="pi pi-list" severity="info" @click="verCuentaCorriente(slotProps.data)" />
                        <Button icon="pi pi-pencil" class="mx-2" @click="editarCliente(slotProps.data)" />
                        <Toast />
                        <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminarCliente(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="clienteDialogo" :style="{ width: '450px' }" header="Detalles del Cliente"
            :modal="true">
            <div class="flex flex-col gap-6">
                <div class="flex justify-between gap-6">
                    <div>
                        <label for="codigo" class="block font-bold mb-3">Código</label>
                        <InputText id="codigo" v-model="cliente.NUM_CLI" readonly />
                    </div>
                    <div>
                        <label for="cuit" class="block font-bold mb-3">CUIT</label>
                        <InputText id="cuit" v-model="cliente.CUIT_CLI" fluid />
                    </div>
                </div>

                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="cliente.NOM_CLI" required="true" autofocus
                        :invalid="enviado && !cliente.NOM_CLI" fluid />
                    <small v-if="enviado && !cliente.NOM_CLI" class="text-red-500">El nombre es obligatorio.</small>
                </div>
                <div>
                    <label for="direccion" class="block font-bold mb-3">Dirección</label>
                    <InputText id="direccion" v-model="cliente.DIR_CLI" fluid />
                </div>
                <div>
                    <label for="localidad" class="block font-bold mb-3">Localidad</label>
                    <InputText id="localidad" v-model="cliente.LOC_CLI" fluid />
                </div>
                <div>
                    <label for="provincia" class="block font-bold mb-3">Provincia</label>
                    <InputText id="provincia" v-model="cliente.PRO_CLI" fluid />
                </div>
                <div>
                    <label for="telefono" class="block font-bold mb-3">Teléfono</label>
                    <InputText id="telefono" v-model="cliente.TEL_CLI" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="ocultarDialogo" />
                <Button label="Guardar" icon="pi pi-check" @click="isEditing ? actualizarCliente() : crearCliente()" />
                <Toast />
            </template>
        </Dialog>

        <Dialog v-model:visible="eliminarClienteDialogo" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="cliente">¿Estás seguro de que quieres eliminar <b>{{ cliente.NOM_CLI }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="eliminarClienteDialogo = false" />
                <Button label="Sí" icon="pi pi-check" @click="eliminarCliente" />
            </template>
        </Dialog>

        <Dialog v-model:visible="eliminarClientesDialogo" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="cliente">¿Estás seguro de que quieres eliminar los clientes seleccionados?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="eliminarClientesDialogo = false" />
                <Button label="Sí" icon="pi pi-check" text @click="eliminarClientesSeleccionados" />
            </template>
        </Dialog>
    </div>
</template>
