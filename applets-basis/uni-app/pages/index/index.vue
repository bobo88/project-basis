<template>
	<view>
		<view class="bottom-wrap">
			<view class="phone-wrap" @click="selectItemHandle(1)">
				<image v-show="selectItem === 2" class="icon-img" src="../../static/icons/no-select-phone.png"></image>
				<image v-show="selectItem === 1" class="icon-img" src="../../static/icons/selected-phone.png"></image>
				<view class="phone-text" :class="{'white': selectItem === 2}">TODO</view>
			</view>
			<view class="buy-phone-wrap" @click="goBuy">
				<image class="buy-phone-img" src="../../static/icons/buy-phone.png"></image>
			</view>
			<view class="selected-bg" :class="selectItem === 1?'active-left':'active-right'">
				<image class="selected-bg-img" src="../../static/icons/selectedBg.png"></image>
			</view>
			<view class="my-wrap" @click="selectItemHandle(2)">
				<image v-show="selectItem === 1" class="icon-img" src="../../static/icons/my.png"></image>
				<image v-show="selectItem === 2" class="icon-img" src="../../static/icons/selected-my.png"></image>
				<view class="phone-text" :class="{'white': selectItem === 1}">我的</view>
			</view>
		</view>
		<phone ref="phone" v-show="selectItem === 1"></phone>
		<my ref="my" v-show="selectItem === 2"></my>
	</view>
</template>

<script>
	import phone from './components/phone.vue'
	import my from './components/my.vue'
	export default {
		components:{
			phone,
			my
		},
		data() {
			return {
				tokens: '',
				selectItem: 1
			}
		},
		onLoad(options) {
			if(options.type === 'exchange'){
				this.selectItem = 2;
			}
		},
		onShow() {
			this.tokens = uni.getStorageSync('token');
			setTimeout(() => {
				if(this.selectItem == 1){
					this.$refs.phone.init();
				}else{
					this.$refs.my.getStarCoin();
					this.$refs.my.getHeadPortrait();
				}
			})
		},
		methods: {
			selectItemHandle(val) {
				if(!this.tokens && val == 2){
					uni.$u.toast('登录后可以使用');
					return
				}
				this.selectItem = val;
				if(this.selectItem == 1){
					this.$refs.phone.init();
				}else{
					this.$refs.my.getStarCoin();
					this.$refs.my.getHeadPortrait();
				}
			},
			goBuy(){
				if(!this.tokens){
					uni.$u.toast('登录后可以使用');
					return
				}
				uni.navigateTo({
					url: '/pages/order/order'
				})
			}
		}
	}
</script>

<style lang="scss">
	.bottom-wrap{
		position: fixed;
		z-index: 999;
		bottom: 0;
		width: 100%;
		height: 106rpx;
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
			// background-color: #101010;
			transform: translateX(-50%);
			.buy-phone-img{
				width: 213rpx;
				height: 142rpx;
				overflow: hidden;
			}
		}
		.buy-phone-active{
			background-color: #18181A;
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
			background: #292A2E;
			.phone-text{
				margin-top: 6rpx;
				font-size: 24rpx;
				color: #3B7FFF;
			}
			.white{
				color: rgba(255,255,255,1);
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
			background: #292A2E;
			.phone-text{
				margin-top: 6rpx;
				font-size: 24rpx;
				color: #3B7FFF;
			}
			.white{
				color: rgba(255,255,255,1);
			}
		}
	}
</style>
