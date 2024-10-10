<script setup>
import { ClienteService } from '@/service/ClienteService';
import { UserService } from '@/service/UserService';
import { FilterMatchMode } from '@primevue/core/api';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import ConfirmPopup from 'primevue/confirmpopup';


// Usa el router
const router = useRouter();
const confirm = useConfirm();
const isVisible = ref(false);
const loading = ref(false);
const eliminarUserDialog = ref(false);


onMounted(() => {
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
    id: null,
    name: '',
    email: '',
    password: ''
})

const toast = useToast();
const userDialogo = ref(false);
const isEditing = ref(false)

const clientesSeleccionados = ref([]);
const filtros = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const enviado = ref(false);



function ocultarDialogo(type) {

    if (type == 'delete') {
        eliminarUserDialog.value = false;
    } else {
        userDialogo.value = false;
      
    }
}

function openDialog(type, usuario) {

    if (type == 'delete') {
        user.value = usuario 
        eliminarUserDialog.value = true;

    } else if (type == 'edit') {
        isEditing.value = true;
        user.value = usuario
        userDialogo.value = true;
    } 
    else {
        user.value = {
            id: null,
            name: '',
            email: '',
            password: ''
        }
        userDialogo.value = true;
    }
}

async function crearUsuario() {
    loading.value = true
    isEditing.value = false

    try {
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
                detail: 'Usuario creado correctamente',
                life: 3000
            });
            users.value.push(response.data);
            userDialogo.value = false
            isEditing.value = false
        } else {
            throw new Error();
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el usuario',
            life: 3000
        });
    } finally {
        loading.value = false

    }
}


async function editarUsuario() {
    loading.value = true
    try {
        const response = await UserService.updateUser(user.value)

        if (response.status >= 200) {
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usuario editado correctamente',
                life: 3000
            });

            userDialogo.value = false
            const index = buscarIndicePorId(user.value.id);
            users.value[index] = user.value;
            isEditing.value = false

        } else {
            throw new Error()
        }
    } catch (error) {

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo editar el usuario',
            life: 3000
        });

    } finally {
        userDialogo.value = false
        loading.value = false
    }
}

async function eliminarUsuario(usuario) {
    loading.value = true;
    try {

        const response = await UserService.deleteUser(usuario.id)
        if (response.status >= 200) {
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Usario eliminado correctamente',
                life: 3000
            });

            users.value = users.value.filter((user) => user.id !== usuario.id);
            eliminarUserDialog.value = false
        } else {
            throw new Error()
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar al usuario, intente nuevamente.',
            life: 3000
        });
    } finally {
        loading.value = false
    }
}

function buscarIndicePorId(id) {
    return users.value.findIndex((user) => user.id === id);
}


const isValidEmail = ref(true);

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValidEmail.value = regex.test(user.value.email);
    return regex.test(email);
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
                                @click="openDialog()" />
                        </div>
                    </div>
                </template>

                <Column field="id" header="Id" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Nombre" sortable style="min-width: 16rem"></Column>
                <Column field="email" header="Email" sortable style="min-width: 16rem"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <ConfirmPopup group="headless">
                            <template #container="{ message }">
                                <div class="rounded p-4">
                                    <span>{{ message.message }}</span>
                                    <div class="flex items-center gap-2 mt-4">
                                        <Button label="Save" @click="acceptCallback" size="small"></Button>
                                        <Button label="Cancel" outlined @click="rejectCallback" severity="secondary"
                                            size="small" text></Button>
                                    </div>
                                </div>
                            </template>
                        </ConfirmPopup>
                        <Button icon="pi pi-pencil" class="mx-2" @click="openDialog('edit', slotProps.data)" />
                        <Button icon="pi pi-trash" @click="openDialog('delete', slotProps.data)" class="mx-2"
                            severity="danger"></Button>
                        <Toast />

                        <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmarEliminarCliente(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>

        </div>

        <Dialog v-model:visible="userDialogo" :style="{ width: '450px' }" header="Detalles del Usuario" :modal="true">
            <div class="flex flex-col gap-6">
                <div class="flex justify-between gap-6">
                </div>

                <div>
                    <label for="nombre" class="block font-bold mb-3">Nombre</label>
                    <InputText id="nombre" v-model.trim="user.name" required="true" autofocus
                        :invalid="enviado && !user.name" fluid />
                    <small v-if="enviado && !user.name" class="text-red-500">El nombre es obligatorio.</small>
                </div>
                <div>
                    <label for="direccion" class="block font-bold mb-3">Email</label>
                    <InputText id="direccion" v-model="user.email" fluid
                        :class="{ 'p-invalid': !isValidEmail && user.email }" placeholder="email@email.com"
                        @input="validarEmail" />
                    <small v-if="!isValidEmail && user.email" class="p-error text-red-400">Por favor, ingresa un correo
                        electrónico
                        válido.</small>

                </div>
                <div>
                    <label for="direccion" class="block font-bold mb-3">Contraseña</label>
                    <InputText id="direccion" v-model="user.password" fluid />
                </div>

            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="ocultarDialogo" />
                <Button :loading="loading" label="Guardar" icon="pi pi-check"  @click="isEditing ? editarUsuario() : crearUsuario()" />
                <Toast />
            </template>
        </Dialog>

        <Dialog v-model:visible="eliminarUserDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span>¿Estás seguro de que quieres eliminar a <b>{{ user.name }}</b>?</span>
            </div>
            <template #footer>
                <!-- <Button label="No" icon="pi pi-times" text @click="eliminarClienteDialogo = false" />
                <Button label="Sí" icon="pi pi-check" @click="eliminarCliente" /> -->

                <Button @click="ocultarDialogo('delete')" label="Cancelar" outlined></Button>
                <Button @click="eliminarUsuario(user)" label="Eliminar" severity="danger" outlined :loading="loading" ></Button>

            </template>
        </Dialog>


    </div>
</template>
