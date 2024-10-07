<script setup>
import { useAuthStore } from '@/stores/auth'; // Asegúrate de que el path sea correcto
import { useRouter } from 'vue-router';

const router = useRouter();
const $store = useAuthStore();


// $store.fetchUser

const logout = () => {
    $store.logout();
    router.push({ name: 'login' });
};

const fetchUser = () => {
    $store.fetchUser();
};

fetchUser();

</script>
<template>
    <div className="card">
        <div class="font-semibold text-xl mb-4">Tu cuenta</div>

        <div class="font-semibold text-md mb-4">
            <b>Nombre:</b> {{ $store.user.name }}
        </div>
        <!-- 
        <p>

            Nombre: {{ $store.user.name }}
        </p>

        <p>
            Email: {{ $store.user.email }}
        </p>

        <p>
            Token: {{ $store.token }}
        </p>

        <p>
            Rol: {{ $store.user.role }}
        </p> -->

        <!-- Salir -->
        <Button @click="logout" label="Cerrar sesión" icon="pi pi-sign-out" class="p-button-danger" />

        <div class="mt-4">
            <pre>
                {{ $store }}
            </pre>
        </div>
    </div>
</template>