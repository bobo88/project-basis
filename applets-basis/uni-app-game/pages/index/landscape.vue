<template>
	<view class="container">
		<view class="index-icon" @click="toHome">
			<image class="img" src="/static/index/cover.png"></image>
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
			toHome(){
				console.log(1111)
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		width: 100vh;
		height: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: rgba(16, 16, 16, 1);
		.index-icon{
			width: 100vh;
			height: 100vw;
			.img {
				width: 100vh;
				height: 100vw;
				border-radius: 20rpx;
			}
		}
	}
</style>
