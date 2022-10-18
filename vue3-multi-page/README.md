# vue3多页面打包配置项目（vue3-multi-page）：
+ 本项目的搭建背景： 
    + 基于vue技术栈开发的H5单页面，在需求不断累加的情况下，会出现疲于`【搭建框架 - 下载依赖 - copy重复逻辑 - 修改页面】`等工作；
    + 所以：`【多页面打包配置】`的出现，就是将`【搭建框架 - 下载依赖 - copy重复逻辑】`进行统一封装，能有效提升工作效率，并对H5有良好的归纳汇总效果。
+ 项目介绍：
    + 技术栈： vue3 + axios + element-plus + TS + sass
    + 项目引入 flexible + rem ，能自适应主流设备浏览器（UI稿以 `750px` 为基准）。
    + 项目自带三个demo页面：index / user / about
        + 本地运行项目后可以通过以下方式查看效果：
        + http://localhost:8080/index
        + http://localhost:8080/user
        + http://localhost:8080/about
+ 新建H5页面的流程：
    1. 在【views】目录下新建目录 `h5-abc`, h5-abc可以随便自定义
    2. 在 `h5-abc` 目录下，新建三个文件：
        + h5-abc.js：名称需要和 `h5-abc` 目录名一致；
        + index.html： 可以直接copy项目自带demo页面，也可自定义
        + App.vue：可以直接copy项目自带demo页面，也可自定义
    3. 重启项目： `yarn serve`
        + 通过 http://localhost:8080/h5-abc 即可访问
    4. 部署项目：
        + 页面资源（js / css / images）带有【哈希】标识，打包时仅会改动特定资源
        + 打包完成后生成【dist】目录，如果需要部署【h5-abc】，只需要部署`【dist/h5-abc】`和`【dist/static】`两个目录即可。

+ 【多环境配置】： 本地环境 / 开发环境 / 测试环境 / 生产环境 ......
    + 本地环境（可开proxy代理）： `.env`
    + 开发环境： `.env.development`
    + 测试环境： `.env.test`
    + 生产环境： `.env.production`

+ 【按需构建打包】功能：
    + 打【开发环境包】：`yarn build:dev`
    + 打【测试环境包】：`yarn build:test`
    + 打【生成环境包】：`yarn build`
    + 打【所有环境包】：`yarn build:all`
    + 打【特定环境特定包】：`yarn build:[环境后缀]  b=[项目名]`
        + 【环境后缀】：dev / test / prod。【注意：特定包时暂不支持 all】
        + 【项目名】： views 目录下的【单个页面目录名】，比如 index / about / user ......
        + 比如我要打包 about 这个H5的测试版本，则运行命令： `yarn build:test b=about` 即可。

+ 还需完善的部分（Todo）：
    + 【自动化部署】：


+ 项目DEMO截图：
    <!-- > ![nuxt-web-pc](./assets/images/beauty_1.png) -->
    <div align="center">
        <img src=./cover.png width=60% />
    </div> 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
