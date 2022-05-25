<template>
	<view class="container">
		<view class="index-icon" @click="toSearch">
			<view class="enter-text">搜索</view>
			<!-- <image class="img" src="/static/index/index-what.png"></image> -->
			<!-- <view class="enter-text have-bg"></view> -->
		</view>
		<view class="index-icon" @click="toPhone">
			<view class="enter-text">进入主页面</view>
		</view>
		<view class="index-icon" @click="toHome">
			<view class="enter-text goto-test">个人信息页面TEST</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectItem: 1
			}
		},
		methods: {
			toSearch(){
				location.href = 'https://www.baidu.com'
			},
			toPhone(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			toHome(){
				uni.navigateTo({
					url: '/pages/my/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		width: 100%;
		height: 98vh;
		padding-top: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(16, 16, 16, 1);
		.index-icon{
			width: 650rpx;
			height: 228rpx;
			line-height: 228rpx;
			padding-top: 36rpx;
			.img {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
		.enter-text {
			width: 100%;
			height: 100%;
			line-height: 228rpx;
			text-align: center;
			background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
			border-radius: 20rpx;
			color: #FFFFFF;
			&.have-bg {
				width: 100%;
				height: 228rpx;
				background: url('/static/index/index-what.png') center center no-repeat;
				background-size: 100% 228rpx;
			}
			&.goto-test {
				width: 100%;
				height: 228rpx;
				background: #f60;
			}
		}
	}
</style>
