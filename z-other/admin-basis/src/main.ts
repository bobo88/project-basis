import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'
import { useStore } from '@/store'
import { useTable, useTzui, useFrameBridge, useTzDb } from '@/plugins'
import '@/styles/base.scss'
import components from '@/components'
import directives from '@/directives'
import icons from '@/icons'
import './utils/number'
import ResizeObserver from 'resize-observer-polyfill'
window.ResizeObserver = ResizeObserver;
useTzDb();
useFrameBridge();
const app = createApp(App);
useStore(app);
setupRouter(app);
useTzui(app);
useTable(app);

app.use(components).use(directives).use(icons).mount('#app');