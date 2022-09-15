const path = require('path');
const BUILD_KEY = require('./buildKey');
const merge = require('merge');
const glob = require('glob');
const PAGE_PATH = path.resolve(__dirname, '../src/views');

// pages 多入口配置
exports.setPages = configs => {
    let END_PATH = BUILD_KEY !== null ? `/${BUILD_KEY}/*.js` : '/*/*.js';
    // ===== 注意：如果路径是动态的，则必须替换分隔符
    let replacePath = (PAGE_PATH + END_PATH).replace(/\\/g, '/')
    let entryFiles = glob.sync(replacePath) // 同步读取所有入口文件
    let map = {}

    entryFiles.forEach(filePath => {
        let filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
        let tmp = filePath.substring(0, filePath.lastIndexOf('/')) + '/' + filename
        // console.log(filePath)
        let conf = {
            // page 的入口
            entry: filePath,

            // 2022-08-19 change =================
            // New:
            publicPath: './',
            // Old:
            // publicPath: '../',

            // assetsDir: filename,
            // 模板来源
            template: tmp + '.html', 
            // 在 dist/index.html 的输出

            // 2022-08-19 change =================
            // New:
            filename:  filename + '.html', 
            // Old:
            // filename:  filename + '/' + filename + '.html', 

            // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
            chunks: ['manifest', 'vendor', filename], 
            inject: true, // 是否注入资源
        };

        if (configs) {
            conf = merge(conf, configs)
        }

        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true, // 删除 html 中的注释代码
                    collapseWhitespace: false, // 删除 html 中的空白符
                    // removeAttributeQuotes: true // 删除 html 元素中属性的引号
                },
                chunksSortMode: 'manual'// 按 manual 的顺序引入
            })
        }

        map[filename] = conf
    })
    console.log('============= 多页面配置数据：', map)
    return map
}
