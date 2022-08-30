<template>
	<view>
		<view class="card-item">
			<view class="flag-wrap" v-if="dataObj.surplusDay">
				<image class="flag-img" src="/static/my/flag.png"></image>
				<view class="flag-text">{{dataObj.surplusDay}}</view>
			</view>
			<view class="round"></view>
			<view class="rounds"></view>
			<view class="card-status">
				<image v-if="status == 1" class="status-img" src="/static/my/status2.png"></image>
				<image v-if="status == 2" class="status-img" src="/static/my/status3.png"></image>
				<image v-if="status == 3" class="status-img" src="/static/my/status4.png"></image>
			</view>
			<view class="top-wrap">
				<view class="title-wrap">
					<view class="title-val">
						<text v-if="dataObj.couponType == 1" :class="{'active-color': status == 2 || status == 3}">¥</text>
						<text class="title-number" :class="{'active-color': status == 2 || status == 3}">
							{{dataObj.couponValue || dataObj.discount}}
						</text>
						<text v-if="dataObj.couponType == 2" :class="{'active-color': status == 2 || status == 3}">折</text>
					</view>
					<view class="title-tip" :class="{'active-color': status == 2 || status == 3}" v-if="dataObj.maxValue">满{{dataObj.maxValue}}元减</view>
					<view class="title-tip" :class="{'active-color': status == 2 || status == 3}" v-else>{{dataObj.useThreshold}}</view>
					
				</view>
				<view class="main-wrap">
					<view class="main-val">{{dataObj.couponName}}</view>
					<view class="main-time"><text v-if="status == 0"></text>{{dataObj.expirationTime}}</view>
				</view>
			</view>
			<view class="rule-wrap" @click="ruleHandle">
				<view class="rule-title">使用规则</view>
				<view class="btn-wrap">
					<view class="rule-icon">
						<image v-show="!ruleShow" class="rule-img" src="/static/my/down.png"></image>
						<image v-show="ruleShow" class="rule-img" src="/static/my/up.png"></image>
					</view>
					<view class="rule-btn" v-if="status == 0 && dataObj.products != '限云盘可用'" @click="goUse">去使用</view>
				</view>
			</view>
			<view class="rule-list" v-if="ruleShow">
				<view class="rule-row">· {{dataObj.batchBuyExplain}}</view>
				<view class="rule-row">· {{dataObj.explain}}</view>
				<view class="rule-row">· {{dataObj.products}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
		    dataObj: {
		        type: Object,
		        default: {}
		    },
			status: {// 0未使用 1使用中 2已使用 3已过期
		        type: Number,
		        default: 0
		    },
		},
		data() {
			return {
				ruleShow: false
			}
		},
		onLoad(options) {
		    
		},
		methods: {
			ruleHandle(){
				this.ruleShow = !this.ruleShow;
			},
			goUse(){
				uni.navigateTo({
					url: '/pages/order/order'
				})
			}
		}
	}
</script>

<style lang="scss">
	.card-item{
		position: relative;
		width: 630rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background: #292A2E;
		margin-top: 24rpx;
		padding: 10rpx 24rpx 34rpx 24rpx;
		color: #FFFFFF;
		.flag-wrap{
			position: absolute;
			top: 0;
			left: 0;
			width: 92rpx;
			height: 94rpx;
			.flag-img{
				width: 100%;
				height: 100%;
			}
			.flag-text{
				position: absolute;
				left: -6rpx;
				top: 20rpx;
				font-size: 20rpx;
				transform: rotate(-45deg);
			}
		}
		.round{
			position: absolute;
			left: -15rpx;
			top: 170rpx;
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			background-color: #101010;
			transform: translateY(-50%);
		}
		.rounds{
			position: absolute;
			right: -15rpx;
			top: 170rpx;
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			background-color: #101010;
			transform: translateY(-50%);
		}
		.card-status{
			width: 108rpx;
			height: 108rpx;
			position: absolute;
			top: 0;
			right: 0;
			.status-img{
				width: 100%;
				height: 100%;
			}
		}
		.top-wrap{
			display: flex;
			align-items: center;
			padding: 14rpx 0 24rpx 0;
			border-bottom: 1rpx dashed rgba(255, 255, 255, 0.08);
			.title-wrap{
				text-align: center;
				margin-left: 20rpx;
				.title-val{
					font-size: 28rpx;
					font-weight: 600;
					color: #F04646;
					.title-number{
						font-size: 60rpx;
						font-weight: 600;
					}
				}
				.title-tip{
					font-size: 28rpx;
					color: #F04646;
				}
				.active-color{
					color: rgba(255, 255, 255, 0.5);
				}
			}
			.main-wrap{
				flex: 1;
				margin-top: 24rpx;
				position: absolute;
				top: 28rpx;
				left: 224rpx;
				.main-val{
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
				.main-time{
					margin-top: 16rpx;
					font-size: 20rpx;
					color: rgba(255, 255, 255, 0.5);
				}
			}
		}
		.rule-wrap{
			display: flex;
			justify-content: space-between;
			margin-top: 16rpx;
			.rule-title{
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.5);
			}
			.btn-wrap{
				display: flex;
				.rule-icon{
					width: 24rpx;
					height: 24rpx;
					margin-right: 22rpx;
					.rule-img{
						width: 100%;
						height: 100%;
					}
				}
				.rule-btn{
					width: 120rpx;
					height: 44rpx;
					line-height: 44rpx;
					text-align: center;
					border-radius: 8rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
				}
			}
		}
		.rule-list{
			margin-top: 6rpx;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.5);
			.rule-row{
				margin-top: 6rpx;
			}
		}
	}
</style>
