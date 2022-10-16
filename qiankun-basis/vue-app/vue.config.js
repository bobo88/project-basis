const { defineConfig } = require('@vue/cli-service')
const packageName = require('./package.json').name;
 
module.exports = defineConfig({
    lintOnSave: false,
    devServer: {
        port: 8081,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    configureWebpack: {
        output: {
            library: 'vueApp',
            libraryTarget: 'umd',
            // jsonpFunction: `webpackJsonp_${packageName}`
            // 注意 webpack 5要用下面的方式
            chunkLoadingGlobal: `webpackJsonp_${packageName}`,
            // sandbox : { experimentalStyleIsolation: true }
        }
    }
})
