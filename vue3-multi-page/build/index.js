const merge = require('merge');
const { getDirPath } = require('./tools');
const { seoTitleData } = require('./config/seo');

// pages 多入口配置
const EntryPagesInfo = configs => {
  let entryDir = getDirPath('src/views');
  let map = {}
    
  entryDir.forEach(dirPath => {
    let filename = dirPath.substring(dirPath.lastIndexOf('/') + 1);
    let conf = {
      // page 的入口
      entry: dirPath + '/index.js',
      // 路径配置
      publicPath: './',
      // 模板来源
      template: dirPath + '/index.html', 
      // 标题
      title: seoTitleData[filename] || filename,
      // 在 dist/index.html 的输出
      // 输出文件
      filename:  filename + '.html', 
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
  // console.log('============= 多页面配置数据：', map)
  return map
}

module.exports = {
  EntryPagesInfo
}
