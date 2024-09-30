import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { definePreset, updatePreset } from '@primevue/themes';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const pinia = createPinia();
const app = createApp(App);

const primaryColor = localStorage.getItem('primaryColor') || 'emerald';

app.use(pinia);
app.use(router);


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
        }
    }
});
app.use(PrimeVue, {
    theme: {
        preset: MyPreset
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
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
