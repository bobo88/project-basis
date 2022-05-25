/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
        const data = response.data
        // 自定义参数
        const custom = response.config?.custom
        if (data.status !== 0) { // 服务端返回的状态码不等于200，则reject()
            // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
            if (custom.toast !== false) {
                // uni.$u.toast(data.msg)
            }
			if(data.status == 6013) {
				uni.setStorageSync("token", "");
				uni.$u.toast('账号已在别处登录！')
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/register/index'
					})
				},1500)
			}  else if(data.status == 6014) {
				uni.setStorageSync("token", "");
				uni.$u.toast('登录信息已过期，请重新登录。')
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/register/index'
					})
				},1500)
			} else if(data.status == 2 || data.status == 4) {
				uni.setStorageSync("token", "");
				uni.$u.toast('账号已在其他端登录，请重新登录')
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/register/index'
					})
				},1500)
			} else if(data.status == 5106) {
				return data || {}
			} else if(data.status == 5200) {
				return data || {}
			} else {
				uni.$u.toast(data.msg || '服务器错误')
				return Promise.reject(data)
			}
            // 如果需要catch返回，则进行reject
            if (custom?.catch) {
                return Promise.reject(data)
            } else {
                // 否则返回一个pending中的promise
                return new Promise(() => { })
            }
        }
        return data.data
    }, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
		uni.$u.toast(data.data)
        return Promise.reject(response)
    })
}