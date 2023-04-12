import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useTigDataStore } from '@/stores/tigData';

import App from './App.vue';

import './assets/main.css';

const app = createApp(App);
app.use(createPinia());

async function init() {
    const tigDataStore = useTigDataStore();
    try {
        // 正常にデータ取得完了後、マウントする
        await tigDataStore.fetchDataFromAPI();
    } catch (error) {
        tigDataStore.error = true;
    } finally {
        app.mount('#app');
    }
}

init();
