import { createApp } from 'troisjs';
import App from './App.vue';

import Store from '@/store';

createApp(App).use(Store).mount('#app');
