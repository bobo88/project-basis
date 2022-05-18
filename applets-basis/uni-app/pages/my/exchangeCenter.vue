<template>
	<view class="container">
		<view class="top-img-wrap">
			<image class="top-img" src="/static/my/exchange-bg.png"></image>
		</view>
		<view class="header-wrap">
			<view class="back-wrap" @click="backHandle">
				<image class="back" src="../../static/login/back.png"></image>
			</view>
			<view class="header-title">兑换中心</view>
		</view>
		<view class="exchange-wrap">
			<view class="exchange-title">激活码兑换</view>
			<view class="exchange-item">
				<input class="exchange-ipt" placeholder="请输入15位数的激活码" v-model="code" maxlength="15" @input="iptHandle" />
			</view>
			<u-button
				class="exchange-btn"
			    loadingText="兑换中..."
			    size="normal"
				:loading="loading"
			    loadingMode="circle"
				:class="{'activeBth': isShow}"
				@click="changeHandle"
			>兑换</u-button>
		</view>
		<view class="tips-wrap">
			<view class="tips-title">兑换说明</view>
			<view class="tips-content">1、每个激活码只能激活一次；</view>
			<view class="tips-content">2、您通过非官方渠道获取的激活码，若无法激活，YB将概不负责；</view>
			<view class="tips-content">3、YB对激活码拥有最终的解释权。</view>
		</view>
		<u-no-network
			@disconnected="disconnected"
			@connected="connected"
			@retry="retry"
		></u-no-network>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				code: '',
				isShow: false
			}
		},
		onShow() {
			this.loading = false;
			this.code = '';
		},
		methods: {
			backHandle(val) {
				uni.navigateTo({
				  url: '/pages/index/index?type=exchange'
				})
			},
			iptHandle(e) {
				let code = e.detail.value;
				this.$nextTick(() => {
					this.code = code.replace(/^\s*|\s*$/g,'');
				})
				if (this.code.length === 15) {
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			},
			changeHandle() {
				if(!this.isShow){
					return
				}
				this.loading = true;
				uni.$u.http.post('/api/pay/v1/activation/exchangeActivationCode',{
					code: this.code
				}).then(data => {
					setTimeout(() => {
						this.loading = false;
					}, 1000)
					if (data.codeType === 2) {
						this.code = ''
						uni.setStorage({
						  key: "meal",
						  data: data
						})
						uni.navigateTo({
						  url: '/pages/my/exchangeSuccess'
						})
					} else if (data.codeType === 1) {
						uni.setStorage({
						  key: "meal",
						  data: data
						})
						if (data.status === 0) {
						  uni.navigateTo({
							url: '/pages/my/exchangeSuccess'
						  })
						} else if (data.status === 1) {
						  uni.navigateTo({
							url: '/pages/my/exchangePhone?code=' + this.code
						  })
						}
					} else if (data.codeType === 3) {
						uni.showModal({
							title: '',
							cancelText: '知道了',
							confirmText: '查看优惠券',
							content: `成功兑换了${data.couponName}，已放入你的卡券。`,
							success: function (res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/my/card'
									})
								}
							}
						});
					}
				}, (err) => {
					this.loading = false;
				})
			},
			disconnected() {
				console.log('disconnected');
			},
			connected() {
				console.log('connected');
			},
			retry() {
				console.log('retry');
			}
		}
	}
</script>

<style lang="scss">
	.container{
		min-height: 100vh;
		background-color: #101010;
		position: relative;
		.top-img-wrap{
			width: 750rpx;
			height: 340rpx;
			position: absolute;
			top: 0;
			.top-img{
				width: 100%;
				height: 100%;
			}
		}
		.header-wrap{
			display: flex;
			align-items: center;
			padding: 30rpx 50rpx;
			position: relative;
			z-index: 9;
			.back-wrap{
				width: 40rpx;
				height: 40rpx;
				.back{
					width: 100%;
					height: 100%;
				}
			}
			.header-title{
				flex: 1;
				text-align: center;
				font-size: 36rpx;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
		.exchange-wrap{
			display: flex;
			flex-direction: column;
			width: 642rpx;
			padding: 50rpx 24rpx;
			margin: auto;
			margin-top: 20rpx;
			background: #1D1E1F;
			border-radius: 20rpx;
			position: relative;
			z-index: 9;
			.exchange-title{
				text-align: left;
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
			}
			.exchange-item{
				width: 612rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				color: #FFFFFF;
				background: #2C2C2E;
				margin-top: 30rpx;
				border-radius: 20rpx;
				font-size: 28rpx;
				.exchange-ipt{
					width: 100%;
				}
			}
			.exchange-btn{
				width: 642rpx;
				height: 90rpx;
				line-height: 100rpx;
				text-align: center;
				margin-top: 30rpx;
				background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
				border: none;
				border-radius: 20rpx;
				font-size: 32rpx;
				color: #FFFFFF;
				opacity: 0.35;
			}
			.activeBth{
				opacity: 1;
			}
		}
		.tips-wrap{
			padding: 50rpx 30rpx;
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.8);
			.tips-title{
				margin-bottom: 10rpx;
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.8);
			}
			.tips-content{
				font-size: 26rpx;
				color: rgba(255, 255, 255, 0.5);
				line-height: 50rpx;
			}
		}
	}
</style>