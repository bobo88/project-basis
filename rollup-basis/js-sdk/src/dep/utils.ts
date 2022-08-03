// 需要暴露出去的状态值
export let GameEventToOutSide = -1;
// 防抖函数 start -------------------------
const bounce = (delay, cb) => {
	var timer
	return function(value) {
		clearTimeout(timer)
		timer = setTimeout(function() {
			cb(value)
		}, delay)
	}
}
const fn = (value) => {
	console.log('### GameEventToOutSide 被设置为：  ', value)
	GameEventToOutSide = value
}
export const bounceFun = bounce(300, fn);
// 防抖函数 end -------------------------

/**
 *  当前手机设备
 * @returns {{isAndroid: boolean, isIOS: boolean}}
 *  0 : android
 *  1 : ios
 *  2 : 未知设备
 */
 export const judgeDeviceType = () => {
    let ua = window.navigator.userAgent.toLocaleLowerCase();
    let isIOS = /iphone|ipad|ipod/.test(ua);
    let isAndroid = /android/.test(ua);
    return { type: isIOS ? 1 : isAndroid ? 0 : 2 }
}

/**
 * 判断 当前浏览器内核
 * @returns {number}
 */
export const isAlipayOrWechat = () => {
    if (/MicroMessenger/.test(window.navigator.userAgent)) {
        return 1;
    } else if (/AlipayClient/.test(window.navigator.userAgent)) {
        return 2;
    } else {
        return 0;
    }
}

export const Tools = {
    a: '123',
	b: '234',
	d: '345'
}