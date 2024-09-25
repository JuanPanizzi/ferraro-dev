<script setup>
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
    if (authStore.token) {
        authStore.fetchUser();
    }
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
