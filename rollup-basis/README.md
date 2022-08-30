## `rollup + gulp 配置项目`
*<font color="#FF6600" >Tips：提供SDK需求</font>*  

### 一、项目基本介绍：
+ 技术栈： 
    + 打包工具：rollup / gulp。 
        - rollup主要整体打包js代码;
        - gulp主要打包ios的worker文件及依赖，还有移动其他文件（比如*.wasm）。
    + 核心点（模块化）：ES + Typescript。
+ 目录简介：
    + main.ts： 入口文件
    + dep文件夹： 
        + aac.js：音频相关文件，已将原有 aac.js 进行【ES模块化】导出调整；
        + config.ts：SDK本身配置文件，包含软硬解码所有全局变量数据；
        + extra.ts：暴露给第三方游戏公司的相关配置文件，包括全局状态等；
        + helper.js：解码相关的工具类函数；
        + jmuxer.js：MSE硬解码文件；
        + keycode.ts：键盘透传配置文件；
        + pcm-player.js：音频相关文件；
        + utils.ts：辅助工具类函数，比如【防抖函数】、【手机设备判断】等；
        + webgl.js：IOS软解码相关文件。
        
+ 打包命令：
    + `npm i`：安装依赖；
    + `npm run build`： 打包命令 --> 生成 【dist】文件夹
    + 将 【dist】文件夹里面的文件 copy 到 【sdk-mse-vue3-rollup】项目中的 【public/sdk/minjs】目录下即可。
    + 运行 【sdk-mse-vue3-rollup】查看 软硬解码 的页面推流效果。
