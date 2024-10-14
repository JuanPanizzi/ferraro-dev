import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import { definePreset, updatePreset, updateSurfacePalette } from '@primevue/themes'
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const pinia = createPinia();
const app = createApp(App);

const primaryColor = localStorage.getItem('primaryColor') || 'emerald';
const storedSurfaceColor = localStorage.getItem('surfaceColor');

app.use(pinia);
app.use(router);

// Chequear si el dark mode está activado en localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Si el dark mode está activado, aplicar la clase correspondiente
if (isDarkMode) {
    document.documentElement.classList.add('app-dark');
}

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: `{${primaryColor}.50}`,
            100: `{${primaryColor}.100}`,
            200: `{${primaryColor}.200}`,
            300: `{${primaryColor}.300}`,
            400: `{${primaryColor}.400}`,
            500: `{${primaryColor}.500}`,
            600: `{${primaryColor}.600}`,
            700: `{${primaryColor}.700}`,
            800: `{${primaryColor}.800}`,
            900: `{${primaryColor}.900}`,
            950: `{${primaryColor}.950}`
        },
      
    },

});
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.app-dark',
        }
    }
});
// app.use(PrimeVue, {
//     theme: {
//         preset: Aura,
//         options: {
//             darkModeSelector: '.app-dark',
//             styles: {
//                 primaryColor: '#EC4899' // Cambia este valor al color que desees
//             }
//         }
//     }
// });

if (storedSurfaceColor) {
    const color = JSON.parse(storedSurfaceColor);
    updateSurfacePalette(color.palette);  
}

app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
