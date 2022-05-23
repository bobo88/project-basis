const { defineConfig } = require('@vue/cli-service')
const htmlPlugin = require('./build/htmlPlugin')
const entryFile = require('./build/entryFiles')
const utils = require('./build/utils')
module.exports = defineConfig({
  transpileDependencies: true,
  // 多页面配置
  pages: utils.setPages(),
  configureWebpack: config => {
    config.entry = entryFile.getEntries()
    // output: {
    //   filename: './js/[name].js',
    //   path: resolve(__dirname, 'build')
    // }
    // config.outputDir = entryFile.getEntries()
    config.outputDir = {
      filename: './js/[name].js',
      // path: resolve(__dirname, 'build')
    }
    // config.output.filename = utils.setPages()  //打包生成的文件
    
    // config.output.filename = `[name].${Version}.${Timestamp}.js`  //打包生成的文件
    // config.output.chunkFilename = `[name].${Version}.${Timestamp}.js`
    console.log(588888888888,  utils.setPages())
    // 使用 return 一个对象会通过 webpack-merge 进行合并，plugins 不会置空
    return {
      // output: utils.setPages(),
      plugins: [...htmlPlugin.htmlPlugin()]
    }
  },
})
