import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
// import type { RouteRecordRaw } from 'vue-router';
import App from './App.vue'
import routes from './router'
import store from './store'
import './public-path'

const app = createApp(App)
// 获取原型
const prototype = app.config.globalProperties
// 绑定参数
prototype.name = 'Bob'

let router = null;
let instance: any = null;
function render(props = {}) {
//   const { container } = props;
    router = createRouter({
        // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
        history: createWebHashHistory(),
        routes: routes as any, // `routes: routes` 的缩写
    })

  instance = app.use(store).use(router).mount('#app')
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props: any) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}

// app.use(store).use(router).mount('#app')
