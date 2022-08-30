// 自定义打包参数 b=[项目名]：比如 yarn build:dev b=about 就是“打包【about】页面的【dev】环境”
const buildKey = process.argv.filter(item => item.indexOf('b=') !== -1)
// 打包【特定】页面的 KEY
let BUILD_KEY = null;
if (buildKey && buildKey.length > 0) {
  BUILD_KEY = buildKey[0].split('=')[1]
}
console.log("🚀 ~ file: vue.config.js ~ line 14 ~ BUILD_KEY", BUILD_KEY)

module.exports = BUILD_KEY
