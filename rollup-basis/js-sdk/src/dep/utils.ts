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

export const Tools = {
    a: '123'
}