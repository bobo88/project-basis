import { createApp } from "vue";
import { createPinia } from "pinia";

// 1. 引入你需要的组件
import {
  List,
  Cell,
  Search,
  Rate,
  Lazyload,
  Skeleton,
  Image as VanImage,
  Toast,
  Button,
} from "vant";
// 2. 引入组件样式
import "vant/lib/index.css";

// 适配
import "amfe-flexible";

import App from "./App.vue";
import router from "./router";

// 引入全局样式
import "./assets/main.scss";

const app = createApp(App);
// 3. 注册你需要的组件
app
  .use(List)
  .use(Cell)
  .use(Search)
  .use(Rate)
  .use(Lazyload, {
    lazyComponent: true,
  })
  .use(Skeleton)
  .use(Toast)
  .use(Button)
  .use(VanImage);
app.use(createPinia());
app.use(router);

app.mount("#app");
