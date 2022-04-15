const fs = require('fs');
const path = require('path');
function resolve (dir) {
	return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('assets', resolve('src/assets'))
			.set('components', resolve('src/components'));
	},
	css: {
		// extract: true,  // 是否提取css生成单独的文件 默认 true  不进行设置时，可以正常进行css热更新
		sourceMap: false, // 开启 CSS source maps
		loaderOptions: {
			sass: {
        // sass-loader v7 以上的版本，将选项名从 data 更改为 prependData
        // 注意： 10.2.0 -- additionalData
				additionalData: fs.readFileSync('src/assets/styles/_variables.scss', 'utf-8')//将色值定为变量
			}
		}, // css预设器配置项
		modules: false // 启用 CSS modules for all css / pre-processor files.
	},
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  devServer: {
    port: 9688,
    open: true,
    disableHostCheck: true,
  },
};
