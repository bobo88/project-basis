<template>
	<view class="u-page">
		<uni-nav-bar title="支付结果" height="100rpx" leftIcon="arrow-left" rightIcon="home-filled" color="#fff" backgroundColor="#1D1E1F" fixed :border="false" @clickLeft="returnBack" @clickRight="urlToHome"></uni-nav-bar>
		<image class="status-icon" :src="status[active].url" mode=""></image>
		<view :class="status[active].type === 0 ? 'txt cF04646' : 'txt cfff'">{{status[active].txt}}</view>
		<view v-if="starcoin" class="txt1">
			{{starcoin}}星币
		</view>
		<view v-if="price && !starcoin" class="txt1">
			￥{{price}}
		</view>
	</view>
</template>

<script>
	const options = {
		'0': 'none',
		'1': 'success',
		'2': 'fail',
		'3': 'loading'
	}
	export default {
		data() {
			return {
				status: {
					fail: {type: 0, url: '../../static/order/shibai_icon.png', txt: '支付失败'},
					success: {type: 1, url: '../../static/order/zhifu_chengong_icon.png', txt: '支付成功'},
					loading: {type: 2, url: '../../static/order/zhifu_zhong_icon.png', txt: '正在支付'},
					none: {type: 0, url: '../../static/order/zhifu_zhong_icon.png', txt: '未支付'}
				},
				active: 'success',
				starcoin: 0,
				price: 0
			}
		},
		onLoad: function(option) {
			if (uni.getStorageSync('myOrderNum')) {
				this.getOrderStatus(uni.getStorageSync('myOrderNum'))
				this.price = uni.getStorageSync('price')
				uni.removeStorageSync('price')
			}
			if (option.starcoin) {
				this.starcoin = option.starcoin
			}
		},
		methods: {
			urlToHome() {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			},
			returnBack() {
				uni.navigateTo({
					url: "/pages/order/order"
				})
			},
			getOrderStatus(myorderNum) {
				uni.$u.http.get('/api/pay/v1/alipay/h5/spend/getPayStatus?myOrderNum=' + myorderNum, {}).then(res => {
					this.active = options[res]
				})
			}
		}
	}
</script>

<style>
.txt1 {
	font-size: 44rpx;
	color: rgba(102, 102, 102, 0.8);
	line-height: 60rpx;
	margin-top: 10rpx;
	text-align: center;
}
.status-icon {
	width: 192rpx;
	height: 180rpx;
	display: block;
	margin: 200rpx auto 0;
}
.txt {
	font-size: 28rpx;
	line-height: 40rpx;
	font-weight: 600;
	text-align: center;
	margin-top: 20rpx;
}
.cF04646 {
	color: #F04646;
}

.cfff {
	color: rgba(255, 255, 255, 0.8);
}
</style>
