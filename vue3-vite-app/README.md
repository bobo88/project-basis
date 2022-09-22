# vue-project

## 一、项目介绍：

### 1. 技术栈：

- `Vue / axios / pinia / vue-router`: vue 全家桶系列
- `Vite`: vue 打包相关
- `Typescript / sass`: JS 类型编程 / css 预处理器
- `vant`: 移动端 UI 组件库
- `postcss-pxtorem / amfe-flexible`: 移动端适配工具
- `swiper`: 滑动特效插件

### 2. 实现功能：

- 包含 10 个最受欢迎的 Apps 列表，可横向滑动查看，显示应用图标/应用名/应用类别。
- 包含 100 个下载量最多的免费 Apps 列表，可竖向滑动查看，显示应用图标/应用名/应用类别/应用星级/评论数等，列表奇数位图标为圆角正方形，偶数位图标为圆形。
- 通过顶部搜索实时过滤当前列表 Apps，基于当前列表的应用名/开发者名/应用描述进行搜索展示。

### 3. 版块简介：

- src/assets: 静态资源相关的文件夹目录
- src/components: 组件相关
  - TopSwipe.vue: 「热门 top10 组件」，基于 swiper 滑动特效插件封装。
- src/plugins: 相关插件依赖的封装文件夹目录
  - plAxios: 封装 Axios
    - config.ts: 配置 axios 的 baseUrl，请求头 Headers 等；
    - http.ts: 封装 axios 的请求拦截和响应拦截等；
    - index.ts: 集成 axios 实例，进一步封装 get/post 等请求方法；
    - type.ts: 定义相关 TS 类型
- src/router: 页面路由相关
- src/stores: vue 存储库 pinia 相关（暂未使用）
- src/utils: 工具类函数（暂未使用）
- src/views: 页面相关文件
  - home 文件夹:
    - api.ts: 包含封装的请求接口函数以及数据过滤工具函数；
    - index.vue: UI 主页，集成「搜索 Hook」/「热门 top10 组件」/「免费 top100 Hook」
    - useFreeTopList.tsx: 「免费 top100 Hook」
    - useSearch.tsx:「搜索 Hook」
    - type.ts: TS 相关的类型检测
  - AboutView.vue: 路由测试文件（脚手架自动生成）。
- src/App.vue: 组件主入口，页面入口文件
- src/main.ts: vue3 项目初始化入口文件
  - vue 初始化 / 引入 vant 组件库 / 引入设备适配工具 / 引入全局 sass 样式文件 / 引入 vue-router
- types 文件夹：定义一些全局的 TS 类型声明等；

## 二、项目操作：

- 安装依赖：

  ```sh
  pnpm install
  ```

- 运行项目：

  ```sh
  pnpm dev
  ```

- 打包部署：

  ```sh
  pnpm build
  ```

## 三、备注：

- 「免费 Top100 Hook」列表页面做了【图片懒加载】功能，且做了背景灰色占位处理（当网络较慢时避免图标显示空白）；
- 【Search 搜索栏】有悬浮定位顶部效果；
- 项目引入【@vitejs/plugin-legacy】：为打包后的文件提供传统浏览器兼容性支持；
- 配置多环境：
  ```jsx
  // 放开此段代码：可以展示按钮 跳转到/about页面，验证打包后的环境（具体打包可参考「package.json」)
  {
    /*
        <div class="env-test">
            <van-button plain hairline type="primary" size="mini" class="linkto">
            <router-link to='/about'>To About Page</router-link>
            </van-button>
        </div>
        */
  }
  ```
- Vue3 中文官网：https://cn.vuejs.org/
- Vant 中文官网：https://vant-contrib.gitee.io/vant/#/zh-CN/home
- Swiper-vue 官网：https://swiperjs.com/vue

## 四、项目预览效果截图：

<div align="center">
    <img src=./cover.png width=60% />
</div>
