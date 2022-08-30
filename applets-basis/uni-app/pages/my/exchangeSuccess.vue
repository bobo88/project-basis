<template>
	<view class="container">
		<view class="success-wrap">
			<image class="success-img" src="/static/my/success.png"></image>
			<view class="success-title">兑换成功</view>
			<view v-if="codeType === 1" class="success-val">
			      成功兑换{{codeValue}}天{{mealTypeName}}TODO套餐
			    </view>
			    <view v-else class="success-val">
			      成功兑换{{codeValue}}星币
			    </view>
			<view class="back" @click="backHandle">返回</view>
			<view v-if="codeType === 1" class="back look-order" @click="lookOrder">查看订单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mealTypeName: '',
				codeValue: false,
				codeType: false
			}
		},
		onLoad() {
			var value = wx.getStorageSync('meal')
			this.mealTypeName = value.mealTypeName
			this.codeValue = value.codeValue
			this.codeType = value.codeType
		},
		methods: {
			backHandle(val) {
				uni.navigateTo({
					url: '/pages/my/exchangeCenter'
				});
			},
			lookOrder() {
				uni.navigateTo({
					url: '/pages/my/bugRecord'
				});
			}
		}
	}
</script>

<style lang="scss">
	.container{
		min-height: 100vh;
		background-color: #101010;
		.success-wrap{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 100rpx;
			.success-img{
				width: 180rpx;
				height: 180rpx;
			}
			.success-title{
				margin-top: 30rpx;
				font-size: 28rpx;
				font-weight: 600;
				color: rgba(255, 255, 255, 0.8);
			}
			.success-val{
				margin-top: 10rpx;
				font-size: 28rpx;
				color: rgba(102, 102, 102, 0.8);
			}
			.back{
				width: 460rpx;
				height: 92rpx;
				line-height: 92rpx;
				text-align: center;
				margin-top: 60rpx;
				color: #FFFFFF;
				background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
				border-radius: 20rpx;
			}
			.look-order{
				border: 1rpx solid rgba(238,238,238,1);
				background: #FFFFFF;
				color: #333333;
			}
		}
	}
</style>