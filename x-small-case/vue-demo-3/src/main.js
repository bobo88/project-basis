import { createApp } from 'vue'
import App from './App.vue'

import VueRouter from './routers'

const app = createApp(App)
app.use(VueRouter); // 挂载
app.mount('#app');
