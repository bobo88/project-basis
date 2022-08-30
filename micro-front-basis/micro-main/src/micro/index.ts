// 一个进度条插件
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from 'element-plus'
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
} from "qiankun";

// 子应用注册信息
import apps from "./apps";

/**
 * 注册子应用
 * 第一个参数 - 子应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 * 当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，
 * 所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 加载前
  beforeLoad: (app: any) => {
    console.log('************ beforeLoad *****************')
    // 加载子应用前，加载进度条
    NProgress.start();
    console.log("before load", app.name);
    return Promise.resolve();
  },
  // qiankun 生命周期钩子 - 挂载后
  afterMount: (app: any) => {
    console.log('************ afterMount *****************')
    // 加载子应用前，进度条加载完成
    NProgress.done();
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event: Event | string) => {
  console.error(event);
  const { message: msg } = event as any;
  // 加载失败时提示
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    ElMessage.error("子应用加载失败，请检查应用是否可运行");
  }
});

// 导出 qiankun 的启动函数
export default start;
