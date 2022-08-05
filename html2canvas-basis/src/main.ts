import { author } from './config'
console.log('============= 一个对H5页面进行截图的SDK ====================')

// 第三方依赖
import html2canvas from './base/html2canvas'
import canvas2image from './base/canvas2image'
// console.log(888888, html2canvas)
//  html2canvas = function (element, options)
// Func: convertToBMP, convertToGIF, convertToImage, convertToJPEG, convertToPNG
// Func: saveAsBMP, saveAsGIF, saveAsImage, saveAsJPEG, saveAsPNG
// console.log(111, canvas2image)
// console.log(2222, author)

// 工具类
import { html2canvasInitValidate } from './config/utils'

// 额外配置：
// import { } from './config/extra'

export {
	// 第三方依赖
	html2canvas,
	canvas2image,

	// 导出：SDK配置集合（相关变量）
	author,

	// 导出： 额外配置
	// todo

	// 导出： 工具类
	// todo
}

// 基于【html2canvas】进行二次封装
export const html2canvasInit = (options) => {
	// 1. 【options.cb】 配置时，appendTo 无效 ----- 自定义回调函数 优先级高于 默认回调函数
	// 2. 【options.download】配置时，cb 无效，appendTo 亦无效 ----- 一键下载截图
	
	// 参数验证
	if (!html2canvasInitValidate(options)) {
		return false
	}

	let content = document.getElementById(options.from);
	let boxWidth = (content && content.offsetWidth) || 100;
	let boxHeight = (content && content.offsetHeight) || 100;
	// 默认回调函数
	let cb = function(canvas) {
		let appendBox;
		options.to ? (appendBox = document.getElementById(options.to)) : (appendBox = document.body);
		appendBox.appendChild(canvas);
    };
	options.cb && (cb = options.cb);

	if (options.download && options.downloadOptions) {
		let { width, height, type, fileName } = options.downloadOptions;
		width = width || options.width || boxWidth;
		height = height || options.height || boxHeight;
		type = type || 'png';
		fileName = fileName || ('download-' + new Date().getTime());
		// 将canvas转为图片并从网页中下载
		html2canvas(content, options).then(function(canvas) {
			canvas2image.saveAsImage(canvas, width, height, type, fileName);
		});
	} else {
		html2canvas(content, options).then(cb);
	}

}

// ============================ SDK Init ======================================
export const HTML2CANVAS_SDK: html2canvas_sdk = {
    version: '1.0.0',
    // 配置信息
    sdkInit: (options) => {
		// todo
    },

    // todo
};
