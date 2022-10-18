// 工具类封装
const path = require('path');
// node的glob模块允许你使用 *等符号, 来写一个glob规则, 像在shell里一样,获取匹配对应规则的文件.
const glob = require('glob');
const BUILD_KEY = require('./buildKey');

// 指向「根目录」
const BASE_DIR = '../../';
/**
 * getDirPath
 * params: dir表示要查找的具体路径， rule 表示一个glob规则
 */
const getDirPath = function(dir) {
    const PAGE_PATH = path.resolve(__dirname, BASE_DIR + dir);
    const rule = BUILD_KEY !== null ? `/${BUILD_KEY}` : '/*';
    // ===== 注意：如果路径是动态的，则必须替换分隔符
    let files = glob.sync(PAGE_PATH + rule).map(i => i.replace(/\\/g, '/'));
    return files
}

module.exports = {
    getDirPath
}