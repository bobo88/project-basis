import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { registerMicroApps, start } from 'qiankun';

// 在主应用中注册子应用
registerMicroApps([{
        name: 'vueApp', // 微应用的名称 要求唯一
        entry: '//localhost:8081',  // 通俗理解就是（微应用的访问地址）
        // entry: 'http://demo.ycy88.com:8081',  // 通俗理解就是（微应用的访问地址）
        container: '#vue',  // 微应用挂载到主应用上的容器
        activeRule: '/micro-vue', // 微应用激活条件
    }]
)
console.log(start, 888)
// 启动 qiankun
// start();
start({
    prefetch: 'all'
});
// start({ sandbox : { experimentalStyleIsolation: true } });

createApp(App).use(router).mount("#base-app");
