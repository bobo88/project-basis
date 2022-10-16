module.exports = {
  plugins: {
    'postcss-selector-namespace': {
      namespace(css) {
          if (
            // 不想被添加「别名前缀」 的样式文件，可以在这里过滤掉
            css.includes('demo.scss')
          ) {
            return ''
          }
          return '.vueapp-space'
      }
    }
  }
}