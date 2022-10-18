/* htmlPlugin.js */
const path = require('path');
const BUILD_KEY = require('./buildKey');
const merge = require('merge');
const HtmlWebpackPlugin = require('html-webpack-plugin') // 安装后引用插件
const { getDirPath } = require('./tools');

// glob 是 webpack 安装时依赖的一个第三方模块，该模块允许你使用 * 等符号,
// 例如 lib/*.js 就是获取 lib 文件夹下的所有 js 后缀名的文件
// const glob = require('glob');

// 取得相应的页面路径，因为之前的配置，所以是 src 文件夹下的 pages 文件夹
// const PAGE_PATH = path.resolve(__dirname, '../src/views');

// 多页面输出配置
// 与上面的多页面入口配置相同，读取 page 文件夹下的对应的 html 后缀文件，然后放入数组中
exports.htmlPlugin = configs => {
    // views的子目录
    let entryDir = getDirPath('src/views', '/*');
    // let entryDir = glob.sync(PAGE_PATH + '/*').map(item => item.replace(/\\/g,"/"));
    // console.log(555, entryDir)

    // let END_PATH = BUILD_KEY !== null ? `/${BUILD_KEY}/*.html` : '/*/*.html';
    // console.log(33333, glob.sync(PAGE_PATH + '/*'))
    // let entryHtml = glob.sync(PAGE_PATH + END_PATH)
    let arr = []
    
    entryDir.forEach(dirPath => {
        let filename = dirPath.substring(dirPath.lastIndexOf('/') + 1);
        // console.log(4444, filename)
        // let filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            template: dirPath + '/index.html', // 模板路径
            filename: filename + Math.random() + '.html', // 生成 html 的文件名
            chunks: ['manifest', 'vendor',  filename],
            inject: true,
        }
        
        // 如果有自定义配置可以进行 merge
        if (configs) {
            conf = merge(conf, configs)
        }
        
        // 针对生产环境配置
        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true, // 删除 html 中的注释代码
                    collapseWhitespace: false, // 删除 html 中的空白符
                    // removeAttributeQuotes: true // 删除 html 元素中属性的引号
                },
                chunksSortMode: 'manual' // 按 manual 的顺序引入
            })
        }
        arr.push(new HtmlWebpackPlugin(conf))
    })
    
    return arr
}


