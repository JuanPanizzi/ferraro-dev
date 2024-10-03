<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/stores/auth'; // Asegúrate de que el path sea correcto
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner'; // Importa el componente de PrimeVue
const email = ref('');
const password = ref('');
const checked = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast()
const loading = ref(false); // Variable para controlar el estado de carga
const handleLogin = async () => {
    loading.value = true; // Activar el spinner de carga
    try {
        await authStore.login({ email: email.value, password: password.value });


        router.push({ name: 'dashboard' });
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: '¡Login correcto!',
            life: 3000
        });

    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el login',
            life: 3000
        });

        console.error('Login failed:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
    } finally {
        loading.value = false; // Desactivar el spinner de carga cuando se reciba una respuesta
    }
};
</script>
<template>
    <FloatingConfigurator />
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div v-if="!loading"  class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg"
                            class="mb-8 w-16 shrink-0 mx-auto">
                            <!-- SVG Content -->
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Ferraro</div>
                        <span class="text-muted-color font-medium">Ingresa a tu cuenta</span>
                    </div>

                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Usuario /
                            Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8"
                            v-model="email" />

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuérdame</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">
                                ¿Olvidaste tu contraseña?</span>
                        </div>
                        <Button label="Ingresar" class="w-full" @click="handleLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex justify-center">
            <ProgressSpinner />
        </div>
    </div>
    <Toast />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
