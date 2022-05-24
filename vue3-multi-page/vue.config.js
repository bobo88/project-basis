const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const htmlPlugin = require('./build/htmlPlugin')
const entryFile = require('./build/entryFiles')
const utils = require('./build/utils')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  // 多页面配置
  pages: utils.setPages(),
  assetsDir: 'static',
  // outputDir: `dist`,
  // 这行代码很重要
  // outputDir: process.env.NODE_ENV === 'production' ? `dist/${moduleName}` : 'dist',
  // indexPath: './[name].html',
  // 静态资源文件名哈希
  filenameHashing: true,
  // 产环境的 source map
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@v", resolve("src/views"))
      .set("@c", resolve("src/components"))
      .set("@u", resolve("src/utils"))
      .set("@s", resolve("src/service")); /* 别名配置 */
    config.optimization.runtimeChunk("single");
  },
  // webpack配置， 通过 webpack-merge 合并到最终的配置中
  configureWebpack: config => {
    config.entry = entryFile.getEntries()
    // 使用 return 一个对象会通过 webpack-merge 进行合并，plugins 不会置空
    return {
      plugins: [...htmlPlugin.htmlPlugin({
        // minify: {
        //   collapseWhitespace: false, // 删除 html 中的空白符
        // }
      })]
    }
  },
  // css预设器配置项
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // sass-loader版本V8以上
        // prependData: `@import "~@/assets/styles/common.scss";`
        // sass-loader版本V8以下
        additionalData: '@import "~@/assets/styles/common.scss";'
      },
      postcss: {
        postcssOptions: {
          plugins: [
            // 'postcss-preset-env',
            // 把px单位换算成rem单位
            require('postcss-pxtorem')({
              rootValue: 75, //换算基数
              propList: ["*"], // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
              unitPrecision: 3, //允许REM单位增长到的十进制数字,小数点后保留的位数。
              exclude: /(node_module)/,
              mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
              minPixelValue: 1 //设置要替换的最小像素值
            })
          ]
        }
      }
    }
  },
  // other -------------------------------------
  // 配置 webpack-dev-server 行为。
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    // https: true,
    proxy: {
      // 接口地址代理
      '/api': {
        target: 'http://jsonplaceholder.typicode.com', // 接口的域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { "^/api": "" }
      },
    }
  },
})
