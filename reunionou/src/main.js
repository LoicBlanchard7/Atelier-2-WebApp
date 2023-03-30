import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueGoogleMaps from '@fawmi/vue-google-maps'


const app = createApp(App);

app.use(router).use(store);

app.use(VueGoogleMaps, {
    load: {
        key: 'pk.eyJ1IjoibG9sb2F0ZWxpZXIiLCJhIjoiY2xmdjRqYXl3MDNvNzNjczZoY281cnhyayJ9.aE6a7BJ_XrBE8m9oWUAw7g',
        // language: 'de',
    }
});

app.mount('#app')
