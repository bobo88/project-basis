<template>
	<view>
		<web-view :src="urls"></web-view>
	</view>
</template>

<script>
	import urlObj from '../../common/config.js'
	export default {
		data() {
			return {
				urls: '',
				networkType: '',
				diskInfo: []
			}
		},
		onLoad: function (options) {
		    console.log("进入TODO获取列表", options)
			this.getDiskInfo(options); //  获取TODO列表
			uni.getNetworkType({
			  success: (res) => {
				this.networkType = res.networkType
			  }
			})
			uni.onNetworkStatusChange((res) => {
			  if (!res.isConnected) {
				uni.navigateTo({
				  url: "/pages/index/index"
				});
			  }
			  if (res.networkType !== this.networkType) {
				uni.navigateTo({
				  url: "/pages/index/index"
				});
			  }
			})
		},
		methods: {
			// 获取TODO列表
			getDiskInfo(data) {
				let token = uni.getStorageSync('token')
				uni.$u.http.get('/api/resources/v5/client/disk/info').then(res => {
					this.diskInfo = res.diskInfo;
					var infoJson = {}
					res.diskInfo.forEach((element, index) => {
						if (element.id === Number(data.record)) {
						  infoJson = this.diskInfo[index]
						}
					});
					console.log("------------options", data);
					console.log(data.domainName);
					let cardToken = data.cardToken.replace(/=/g, "@");
					// cardToken = cardToken.replace(/\+/g, "%2B");
					this.urls = `${urlObj.baseUrl}/h5/screenIos/WXtrialInterface.html?token=${token}&ip=${data.ip}&rm=${infoJson.room}&domainName=${data.domainName}&appletPushAddress=${data.appletPushAddress}&userCardId=${data.userCardId}&cardToken=${cardToken}&mealType=${data.mealType}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.bottom-wrap{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 106rpx;
		background: #292A2E;
		border-radius: 50rpx 50rpx 0px 0px;
		.icon-img{
			width: 48rpx;
			height: 48rpx;
		}
		.buy-phone-wrap{
			position: absolute;
			left: 50%;
			top: -36rpx;
			z-index: 99;
			background-color: #FFFFFF;
			transform: translateX(-50%);
			.buy-phone-img{
				width: 213rpx;
				height: 142rpx;
				overflow: hidden;
			}
		}
		.selected-bg{
			width: 264rpx;
			height: 106rpx;
			position: absolute;
			top: 0;
			.selected-bg-img{
				width: 100%;
				height: 100%;
			}
		}
		.active-left{
			left: 0;
		}
		.active-right{
			right: 0;
		}
		.phone-wrap{
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
			width: 280rpx;
			height: 106rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.phone-text{
				margin-top: 6rpx;
				font-size: 24rpx;
				color: #3B7FFF;
			}
		}
		.my-wrap{
			position: absolute;
			top: 0;
			right: 0;
			z-index: 99;
			width: 280rpx;
			height: 106rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.phone-text{
				margin-top: 6rpx;
				font-size: 24rpx;
				color: #3B7FFF;
			}
		}
	}
</style>
