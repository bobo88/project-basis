const { src, dest, parallel, watch, series } = require('gulp');
const concat = require('gulp-concat');
const uglify=require('gulp-uglify'); //js压缩
// const clean = require('gulp-clean');
// const gulp = require('gulp');
const stripDebug = require('gulp-strip-debug');

// ====== 全局路径配置 ======
const gulpPath = {
  src: './src/dep/ios',
  wasm: './src/dep/wasm',
  decoder: './src/dep/ios/decoder',
  websocket: './src/dep/ios/websocket',
  output: './dist',
}
// 2. JS - decoder
function decoderJs() {
  return src([gulpPath.decoder + '/spsParser.js', gulpPath.decoder + '/ffmpeghelper.js', gulpPath.decoder + '/decoder.js'], { sourcemaps: true })
    .pipe(uglify())
	  .pipe(stripDebug())
    .pipe(concat('decoder.worker.js'))
    .pipe(dest(gulpPath.output, { sourcemaps: true }))
}
// 3. JS - websocket
function websocketJs() {
  return src([gulpPath.websocket + '/helper.js', gulpPath.websocket + '/websocket.worker.js'], { sourcemaps: true })
    .pipe(uglify())
	  .pipe(stripDebug())
    .pipe(concat('websocket.worker.js'))
    .pipe(dest(gulpPath.output, { sourcemaps: true }))
}
// 4. 其他资源
function other() {
  return src(gulpPath.wasm + '/*.wasm')
    .pipe(dest(gulpPath.output))
}
// 或者关联一个任务组合
// watch(gulpPath.src + '**/*.js', { ignoreInitial: false }, series(decoderJs, websocketJs));

exports.decoderJs = decoderJs;
exports.websocketJs = websocketJs;
exports.default = parallel(decoderJs, websocketJs, other);