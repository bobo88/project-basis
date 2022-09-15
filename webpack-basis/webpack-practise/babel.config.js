module.exports = {
    plugins: ['@babel/plugin-transform-runtime'],
    presets: [
      [
        '@babel/preset-env',
        {
          // 项目所支持的浏览器的配置
          targets: [ // 告诉@babel/preset-env遇到了这样的浏览器需要通过Polyfills使用添加垫片
            '> 1%', // 支持市场份额超过 1% 的浏览器
            'last 2 version', // 支持每一个浏览器最后两个版本
            'safari >= 7', // 大于等于7版本的 safari
          ],
          useBuiltIns: 'usage',
          corejs: 3
        },
      ],
    ],
  }
  