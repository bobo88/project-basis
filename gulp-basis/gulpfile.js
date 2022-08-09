const { src, dest, parallel, watch, series } = require('gulp');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const uglify=require('gulp-uglify'); //js压缩
const cheerio = require('gulp-cheerio');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin'); // 备注： 版本4.0.0，如果版本太高，会有小bug。
const javascriptObfuscator = require('gulp-javascript-obfuscator'); // 深层混淆（加小图标），有点小问题（todo)
// ==== 其他备用的依赖插件
// const obfuscate = require('gulp-obfuscate'); // 深层混淆（加小图标），有点小问题（todo)
// const gulpImg = require('gulp-image');
// const pug = require('gulp-pug');
// const del = require('del');
// const rename=require('gulp-rename'); //文件重命名
// const notify=require('gulp-notify'); //提示

// ====== 全局路径配置 ======
const gulpPath = {
  src: '../src/',
  output: '../build/',
}
// 1. CSS
function css() {
  return src(gulpPath.src + 'less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(dest(gulpPath.output +'mincss'))
}
// 2. JS
function js() {
  return src(gulpPath.src + 'js/*.js', { sourcemaps: true })
    .pipe(uglify())    //压缩混淆，此依赖需要引入
    // .pipe(javascriptObfuscator())
    .pipe(concat('app.min.js'))
    .pipe(dest(gulpPath.output +'minjs', { sourcemaps: true }))
}
// 3. 图片
function images() {
  return src(gulpPath.src + 'images/*')
    .pipe(imagemin())
    .pipe(dest(gulpPath.output + 'images'))
}
// 4. 其他资源
function other() {
  return src(gulpPath.src + 'js/*.wasm')
    .pipe(dest(gulpPath.output +'minjs'))
}
// 5. HTML
function html() {
  return src(gulpPath.src + 'index.html')
    .pipe(cheerio(($ => {
      $('script').remove()
      $('link').remove()
      $('body').append('<script src="./minjs/app.min.js"></script>')
      $('head').append('<link rel="stylesheet" href="./mincss/index.css">')
    })))
    .pipe(dest(gulpPath.output))
}

// function cleanBuild(){
//   return src(gulpPath.output+ '**', {read: false})
//     .pipe(clean({force: true}));
// }

// 可以只关联一个任务
watch(gulpPath.src + 'less/*.less', { ignoreInitial: false }, css);
// 或者关联一个任务组合
watch(gulpPath.src + 'js/*.js', { ignoreInitial: false }, series(js));
// html
watch(gulpPath.src + 'index.html', { ignoreInitial: false }, html);

exports.js = js;
exports.css = css;
exports.html = html;
exports.default = parallel(html, css, js, images, other);
// exports.default = series(cleanBuild, parallel(html, css, js, images)); // gulp-clean有点小问题