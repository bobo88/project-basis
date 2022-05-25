/* entryFiles.js */
const path = require('path');
const BUILD_KEY = require('./buildKey');
// glob 是 webpack 安装时依赖的一个第三方模块，该模块允许你使用 * 等符号,
// 例如 lib/*.js 就是获取 lib 文件夹下的所有 js 后缀名的文件
const glob = require('glob');

// 取得相应的页面路径，因为之前的配置，所以是 src 文件夹下的 pages 文件夹
const PAGE_PATH = path.resolve(__dirname, '../src/views');

/* 
* 多入口配置
* 通过 glob 模块读取 pages 文件夹下的所有对应文件夹下的 js * 后缀文件，如果该文件存在
* 那么就作为入口处理
*/
exports.getEntries = () => {
    let END_PATH = BUILD_KEY !== null ? `/${BUILD_KEY}/*.js` : '/*/*.js';
    // ===== 注意：如果路径是动态的，则必须替换分隔符
    let replacePath = (PAGE_PATH + END_PATH).replace(/\\/g, '/')
    let entryFiles = glob.sync(replacePath) // 同步读取所有入口文件
    let map = {}
    // console.log('===========xx: ', PAGE_PATH, entryFiles)
    // 遍历所有入口文件
    console.log('\n')
    entryFiles.forEach((filePath, index) => {
        // 获取文件名
        let filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
        console.log(`========================== 文件名 ${index + 1}:  `, filename)
        
        // 以键值对的形式存储
        map[filename] = filePath 
    })
    console.log('-------绝对路径: ', map)
    return map
}
