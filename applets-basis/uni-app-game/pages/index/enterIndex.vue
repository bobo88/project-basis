<template>
	<view class="container">
		<!-- <view class="index-icon" @click="toHome">
			<image class="img" src="/static/index/cover.png"></image>
		</view> -->
		<view class="index-icon" @click="toGame">
			<view class="enter-text">进入游戏主页面</view>
		</view>
		<view class="index-icon" @click="toMap">
			<view class="enter-text">进入地图页面</view>
		</view>
		<view class="index-icon" @click="toAbout">
			<view class="enter-text">About</view>
		</view>
		<view class="index-icon" @click="toUser">
			<view class="enter-text">User</view>
		</view>
		<view class="index-icon" @click="toLandscape">
			<view class="enter-text">demo-landscape-project</view>
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
			toAbout(){
				uni.navigateTo({
					url: '/pages/about/about'
				})
			},
			toUser(){
				uni.navigateTo({
					url: '/pages/user/user'
				})
			},
			toLandscape(){
				uni.navigateTo({
					url: '/pages/land/land'
				})
			},
			toHome(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			toGame(){
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			toMap() {
				uni.navigateTo({
					url: '/pages/demo/map/map'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(16, 16, 16, 1);
		.index-icon{
			width: 650rpx;
			height: 100rpx;
			line-height: 100rpx;
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
			line-height: 100rpx;
			text-align: center;
			background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
			border-radius: 20rpx;
			color: #FFFFFF;
			&.have-bg {
				width: 100%;
				height: 100rpx;
				background-size: 100% 100rpx;
			}
			&.goto-test {
				width: 100%;
				height: 100rpx;
				background: #f60;
			}
		}
	}
</style>
