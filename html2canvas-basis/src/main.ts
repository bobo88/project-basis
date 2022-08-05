console.log('============= HTML2CANVAS_SDK ====================')

// 第三方依赖
// import {html2canvas} from './base/Html2Canvas'
// console.log(111, html2canvas)

import canvas2image from './base/canvas2image'
// Func: convertToBMP, convertToGIF, convertToImage, convertToJPEG, convertToPNG
// Func: saveAsBMP, saveAsGIF, saveAsImage, saveAsJPEG, saveAsPNG
console.log(111, canvas2image)

import { init } from './config'
console.log(2222, init)

// 工具类
// import { } from './config/utils'

// 额外配置：
// import { } from './config/extra'

export {
	// 导出：SDK配置集合（相关变量）
	init,
	// 导出： 额外配置
	// todo
	// 导出： 工具类
	// todo
}

// ============================ SDK Init ======================================
export const HTML2CANVAS_SDK: html2canvas_sdk = {
    version: '1.0.0',
    // 配置信息
    sdkInit: (options) => {
		

    },

    // todo
};
