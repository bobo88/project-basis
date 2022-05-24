> *<font color="#FF6600">注意：</font>*
>> views 目录下可以有 index 目录， 但 index 目录下不能有 index.html，否则会报错。  
>> views 目录下的 非index 目录，里面可以有 index.html。

# vue3多页面打包配置项目（vue3-multi-page）：
+ 本项目的搭建背景： 
    + 基于vue技术栈开发的H5单页面，在需求不断累加的情况下，会出现疲于`【搭建框架 - 下载依赖 - copy重复逻辑 - 修改页面】`等工作；
    + 所以：`【多页面打包配置】`的出现，就是将`【搭建框架 - 下载依赖 - copy重复逻辑】`进行统一封装，能有效提升工作效率，并对H5有良好的归纳汇总效果。
+ 项目介绍：
    + 技术栈： vue3 + axios + element-plus + TS
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
    3. 重启项目： `yarn run serve`
        + 通过 http://localhost:8080/h5-abc 即可访问
    4. 部署项目：
        + 页面资源（js / css / images）带有【哈希】标识，打包时仅会改动特定资源
        + 打包完成后生成【dist】目录，如果需要部署【h5-abc】，只需要部署`【dist/h5-abc】`和`【dist/static】`两个目录即可。
+ 还需完善的部分（Todo）：
    + 【按需构建打包】功能：
    + 【自动化部署】：


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
