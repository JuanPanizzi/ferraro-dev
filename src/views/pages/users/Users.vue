<script setup>
import { ClienteService } from '@/service/ClienteService';
import { UserService } from '@/service/UserService';
import { FilterMatchMode } from '@primevue/core/api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


// Usa el router
const router = useRouter();


onMounted(() => {
    // ClienteService.getClientes().then((data) => (clientes.value = data));
    UserService.getUsers()
        .then((response) => {

            users.value = response.data; 
        })
        .catch((error) => {
            console.error("Error al obtener los usuarios: ", error); 
        });
});

const users = ref([])
const user = ref({
name: '',
email: '',
password: ''
})

const toast = useToast();
const dt = ref();
const clientes = ref([]);
const userDialogo = ref(false);
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
    userDialogo.value = true;
}

function ocultarDialogo() {
    userDialogo.value = false;
    enviado.value = false;
}

function openDialog(){
    userDialogo.value = true;

}

async function crearUsuario() {
    // toast error if cliente NOM_CLI is empty
    if (!user.value.name) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre es obligatorio',
            life: 3000
        });
        return;
    }

    const response = await UserService.createUser(user.value)

    if (response.status >= 200) {
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente creado correctamente',
            life: 3000
        });
        users.value.push(response.data);
        userDialogo.value = false
        isEditing.value = false
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el cliente',
            life: 3000
        });
        userDialogo.value = false;

    }
}


async function actualizarUser() {

    const response = await UserService.updateUser(user.value)
    if (response.status >= 200 ) {
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente editado correctamente',
            life: 3000
        });
        userDialogo.value = false

        // update cliente in clientes array
        const index = buscarIndicePorId(user.value.id);
        users.value[index] = user.value;
        isEditing.value = false

    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el cliente',
            life: 3000
        });
        userDialogo.value = false

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

        userDialogo.value = false;
        cliente.value = {};
    }
}

async function editarCliente(usuario) {

    isEditing.value = true
    user.value = { ...usuario };
    userDialogo.value = true;

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
    return users.value.findIndex((user) => user.id === id);
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
           
            <!--
                v-model:selection="clientesSeleccionados" -->
                <DataTable :value="users" dataKey="id" :paginator="true" :rows="10" 
    :globalFilterFields="['id', 'name', 'email']"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios" sortField="id"
    :sortOrder="-1">
    <template #header>
        <div class="font-semibold text-xl mb-4">USUARIOS</div>
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
                <Button icon="pi pi-plus" label="Nuevo usuario" class="mx-2 p-button-primary"
                    @click="abrirNuevo" />
            </div>
        </div>
    </template>

    <Column field="id" header="Id" sortable style="min-width: 12rem"></Column>
    <Column field="name" header="Nombre" sortable style="min-width: 16rem"></Column>
    <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
    <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="mx-2" @click="editarCliente(slotProps.data)" />
                        <Toast />
                        {{ slotProps.name }}
                        <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminarCliente(slotProps.data)" /> -->
                    </template>
                </Column>
</DataTable>

        </div>

        <Dialog v-model:visible="userDialogo" :style="{ width: '450px' }" header="Detalles del Cliente"
            :modal="true">
            <div class="flex flex-col gap-6">
                <div class="flex justify-between gap-6">
                    <!-- <div>
                        <label for="codigo" class="block font-bold mb-3">Código</label>
                        <InputText id="codigo" v-model="cliente.NUM_CLI" readonly />
                    </div> -->
                    
                </div>

                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="user.name" required="true" autofocus
                        :invalid="enviado && !user.name" fluid />
                    <small v-if="enviado && !user.name" class="text-red-500">El nombre es obligatorio.</small>
                    <!-- {{ user.name }} -->
                </div>
                <div>
                    <label for="direccion" class="block font-bold mb-3">Email</label>
                    <InputText id="direccion" v-model="user.email" fluid />
                </div>
                <div>
                    <label for="direccion" class="block font-bold mb-3">Contraseña</label>
                    <InputText id="direccion" v-model="user.password" fluid />
                </div>
               
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="ocultarDialogo" />
                <Button label="Guardar" icon="pi pi-check" @click="isEditing ? actualizarUser() : crearUsuario()" />
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
