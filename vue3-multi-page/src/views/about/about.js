import { createApp } from 'vue'
import App from './App.vue'

import '@u/flexible.js'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// echarts

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
