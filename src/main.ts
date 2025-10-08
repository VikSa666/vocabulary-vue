import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primevue/themes';
import router from './router';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/userStore';
import KeyFilter from 'primevue/keyfilter';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.700}',
          contrastColor: '{zinc.50}',
          hoverColor: '{zinc.600}',
          activeColor: '{zinc.500}',
        },
        highlight: {
          background: '{zinc.300}',
          focusBackground: '{zinc.400}',
          color: '{zinc.800}',
          focusColor: '{zinc.900}',
        },
      },
      dark: {
        primary: {
          color: '{zinc.200}',
          contrastColor: '{zinc.800}',
          hoverColor: '{zinc.300}',
          activeColor: '{zinc.400}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, 0.08)',
          focusBackground: 'rgba(250, 250, 250, 0.16)',
          color: 'rgba(255,255,255,0.87)',
          focusColor: 'rgba(255,255,255,0.9)',
        },
      },
    },
  },
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
});
app.directive('keyfilter', KeyFilter);

const userStore = useUserStore();
await userStore.fetchUser();

app.mount('#app');
