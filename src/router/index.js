import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                    //meta: { requiresAuth: true }
                },
                {
                    path: '/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/clientes',
                    name: 'clientes',
                    component: () => import('@/views/pages/clientes/Clientes.vue')
                    //meta: { requiresAuth: true }
                },
                {
                    path: '/articulos',
                    name: 'articulos',
                    component: () => import('@/views/pages/articulos/Articulos.vue')
                    //meta: { requiresAuth: true }
                },
                // pedidos
                {
                    path: '/pedidos',
                    name: 'pedidos',
                    component: () => import('@/views/pages/clientes/Pedidos.vue')
                    //meta: { requiresAuth: true }
                },
                // new pedido
                {
                    path: '/pedidos/new',
                    name: 'NewPedido',
                    component: () => import('@/views/pages/clientes/NewPedido.vue')
                },
                // remitos
                {
                    path: '/remitos',
                    name: 'remitos',
                    component: () => import('@/views/pages/remitos/Remitos.vue')
                    //meta: { requiresAuth: true }
                },
                // new remito
                {
                    path: '/remitos/new',
                    name: 'NewRemito',
                    component: () => import('@/views/pages/remitos/New.vue')
                    //meta: { requiresAuth: true }
                },

                {
                    path: '/clientes/cuenta-corriente/:id',
                    name: 'ClienteCuentaCorriente',
                    component: () => import('@/views/pages/clientes/CC.vue')
                    //meta: { requiresAuth: true }
                },
                // ivacompras
                {
                    path: '/iva-compras',
                    name: 'ivacompras',
                    component: () => import('@/views/pages/afip/IvaCompras.vue')
                    //meta: { requiresAuth: true }
                },
                // ivaventas
                {
                    path: '/iva-ventas',
                    name: 'ivaventas',
                    component: () => import('@/views/pages/afip/IvaVentas.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                    //meta: { requiresAuth: true }
                },
                // profile
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/pages/auth/Profile.vue'),
                    meta: { requiresAuth: true }
                },
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token');
    if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;
