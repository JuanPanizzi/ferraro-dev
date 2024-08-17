<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Principal',
        items: [
            { label: 'Inicio', icon: '', to: '/' },
            // clientes, proveedores, articulos, categorias, ventas, compras, usuarios
            { label: 'Clientes', icon: '', to: '/clientes' },
            { label: 'Proveedores', icon: '', to: '/empty' },
            { label: 'Artículos', icon: '', to: '/empty' }
            // cotizaciones
            //          { label: 'Cotizaciones', icon: '', to: '/empty' },
            //            { label: 'Ventas', icon: '', to: '/empty' },
            //  { label: 'Compras', icon: '', to: '/empty' }
        ]
    },
    {
        label: 'AFIP',
        items: [
            // movimientos
            // {
            //     label: 'Comprobantes',
            //     icon: '',
            //     to: '/comprobantes',
            //     items: [
            //         { label: 'Compras', icon: '', to: '/afip-compras' },
            //         { label: 'Ventas', icon: '', to: '/afip-ventas' }
            //     ]
            // },
            { label: 'Ventas', icon: '', to: '/iva-ventas' }

            //{ label: 'Compras', icon: '', to: '/afip-compras', items: [] }
            //{ label: 'IVA Compras', icon: '', to: '/iva-compras' },
            //            { label: 'IVA Ventas', icon: '', to: '/iva-ventas' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
