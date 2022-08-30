<template>
	<view>
		<view class="top-item" :class="{'top-item-active': isActive}">
			<view class="top-title">{{tiitle}}</view>
			<view class="right-wrap">
				<image v-if="isPic" class="header-img" :src="imgUrl"></image>
				<view v-else-if="isTip" class="top-content" :class="{'active-content': content == '待完善'}">{{content}}</view>
				<image v-if="isArrow" class="right-arrow" src="/static/my/right-arrow.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
		    tiitle: {
		        type: String,
		        default: ''
		    },
			isActive: {
			    type: Boolean,
			    default: false
			},
			isPic: {
			    type: Boolean,
			    default: false
			},
			imgUrl: {
			    type: String,
			    default: '/static/my/defalt-header-img.png'
			},
			content: {
			    type: String,
			    default: '待完善'
			},
			isTip: {
			    type: Boolean,
			    default: true
			},
			isArrow: {
			    type: Boolean,
			    default: true
			}
		},
		data() {
			return {
			}
		},
		onLoad(options) {
		    
		},
		methods: {
		
		}
	}
</script>

<style lang="scss">
	.top-item-active{
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
	}
	.top-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		.top-title{
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.5);
		}
		.right-wrap{
			display: flex;
			align-items: center;
			
			.header-img{
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 16rpx;
				// border: 2rpx solid #E2E8F2;
			}
			.top-content{
				max-width: 460rpx;
				margin-right: 16rpx;
				font-size: 30rpx;
				color: rgba(255, 255, 255, 0.8);
				overflow:hidden; //超出的文本隐藏
				text-overflow:ellipsis; //用省略号显示
				white-space:nowrap; //不换行
			}
			.active-content{
				color: #F04646;
			}
			.right-arrow{
				width: 28rpx;
				height: 28rpx;
			}
		}
	}
</style>
