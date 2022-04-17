import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from 'store'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import startQiankun from "./micro";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

startQiankun();

const app = createApp(App)
const piniaStore = createPinia()
piniaStore.use(piniaPluginPersist)
app.config.globalProperties.$store = store

app.use(ElementPlus).use(piniaStore).use(router).mount('#app')
