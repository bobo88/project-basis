<template>
	<view class="container">
		<view class="header-wrap">
			<view class="back-wrap" @click="backHandle">
				<image class="back" src="../../static/login/back.png"></image>
			</view>
			<view class="header-title">激活码兑换TODO</view>
		</view>
		<view class="top-img-wrap">
			<image class="top-img" src="../../static/my/phone-bg.png"></image>
			<view class="card-wrap">
				<view class="card-container">
					<image class="card-img" src="../../static/my/block.png"></image>
				</view>
				<view class="title">{{codeValue}}天{{mealTypeName}}TODO套餐</view>
				<view class="content">兑换TODO套餐</view>
			</view>
		</view>
		<view class="main-wrap">
			<view class="exchange-type">兑换类型</view>
			<view class="btn-list">
				<view class="btn" :class="{'active':type === 1}" @click="typeHandle(1)">购买</view>
				<view class="btn" :class="{'active':type === 2}" @click="typeHandle(2)">续费</view>
			</view>
			<view v-show="type === 2">
				<view class="renewal-wrap">
					<view class="select-renewal">选择续费的TODO</view>
				</view>
				<view class="phone-item" @click="changeHandle">
					<view class="main-content">
						<view class="item-icon">
							<image v-if="mealTypeName=='TC-1'" class="item-icon-img" src="../../static/my/vip.png"></image>
							<image v-else-if="mealTypeName=='TC-2'" class="item-icon-img" src="../../static/my/svip.png"></image>
							<image v-else-if="mealTypeName=='TC-3'" class="item-icon-img" src="../../static/my/star.png"></image>
							<image v-else class="item-icon-img" src="/static/my/pro.png"></image>
						</view>
						<view class="text-wrap">
							<view class="phone-title">{{diskName}}</view>
							<view class="phone-tip">
								<image class="icon-time" src="../../static/my/icon-time.png"></image>
								<text v-if="dayNum > 0">剩{{dayNum}}天</text>
								<text v-else class="red">已到期</text>
							</view>
						</view>
					</view>
					<view class="right-wrap">
						<view class="exchange">更换</view>
						<image class="right-arrow" src="../../static/my/right-arrow.png"></image>
					</view>
				</view>
			</view>
			<view class="select-wrap" v-show="selectShow">
				<view class="title-row">
					<view class="title">请选择TODO</view>
					<view class="cannel" @click="cannelHandle">取消</view>
				</view>
				<view class="select-phone-list">
					<view class="phone-item select-phone-item" v-for="(item, index) in phoneList" :key="index" @click="itemHandle(item.id)">
						<view class="main-content">
							<view class="item-icon">
								<image v-if="mealTypeName=='TC-1'" class="item-icon-img" src="../../static/my/vip.png"></image>
								<image v-else-if="mealTypeName=='TC-2'" class="item-icon-img" src="../../static/my/svip.png"></image>
								<image v-else-if="mealTypeName=='TC-3'" class="item-icon-img" src="../../static/my/star.png"></image>
								<image v-else class="item-icon-img" src="/static/my/pro.png"></image>
							</view>
							<view class="text-wrap">
								<view class="phone-title">{{item.diskName}}</view>
								<view class="phone-tip">
									<image class="icon-time" src="../../static/my/icon-time.png"></image>
									<text v-if="item.dayNum > 0">剩{{item.dayNum}}天</text>
									<text v-else class="red">已到期</text>
								</view>
							</view>
						</view>
						<view class="select-icon-wrap">
							<image v-if="item.id === phoneId" class="icon-select" src="../../static/my/selected.png"></image>
							<image v-else class="icon-select" src="../../static/my/no-select.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-list">
			<view class="title">兑换{{codeValue}}天{{mealTypeName}}TODO</view>
			<view class="sure-exchange" @click="sureExchange">确定兑换</view>
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
				code: '',
				type: 1,
				codeType: null,
				codeValue: null,
				mealTypeName: null,
				phoneList: [],
				phoneId: null,
				diskName: null,
				dayNum: null,
				code: null,
				selectShow: false
			}
		},
		onLoad(options) {
			console.log(options);
			this.code = options.code
			var value = uni.getStorageSync('meal')
			var phoneId = value.phoneList[0].id
			var diskName = value.phoneList[0].diskName
			var dayNum = value.phoneList[0].dayNum
			this.codeType = value.codeType
			this.mealTypeName = value.mealTypeName
			this.codeValue = value.codeValue
			this.phoneList = value.phoneList
			this.phoneId = phoneId
			this.diskName = diskName
			this.dayNum = dayNum
		},
		methods: {
			typeHandle(type) {
				this.type = type;
			},
			backHandle(val) {
				uni.navigateBack();
			},
			changeHandle() {
				this.selectShow = true
			},
			cannelHandle() {
				this.selectShow = false
			},
			itemHandle(id) {
				this.selectShow = false
				this.phoneId = id
				this.phoneList.forEach(item => {
				  if (item.id === id) {
					this.diskName = item.diskName
					this.dayNum = item.dayNum
				  }
				})
			},
			sureExchange(){
				const form = this.type === 1 ? {
				  code: this.code,
				  buyType: 1
				} : {
				  code: this.code,
				  phoneId: this.phoneId
				};
				uni.showLoading({
					title: '正在兑换…'
				})
				uni.$u.http.post('/api/pay/v1/activation/exchangeActivationCode', form).then(data => {
					uni.hideLoading();
					uni.redirectTo({
						url: '/pages/my/exchangeSuccess'
					})
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
		overflow: hidden;
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
		.top-img-wrap{
			position: absolute;
			top: 0;
			.top-img{
				width: 750rpx;
				height: 510rpx;
			}
			.card-wrap{
				position: absolute;
				top: 124rpx;
				left: 50%;
				transform: translateX(-50%);
				.card-container{
					width: 690rpx;
					height: 192rpx;
					.card-img{
						width: 100%;
						height: 100%;
					}
				}
				.title{
					width: 372rpx;
					position: absolute;
					top: 42rpx;
					left: 50%;
					transform: translateX(-50%);
					font-size: 40rpx;
					font-weight: 600;
					color: #FE6104;
				}
				.content{
					position: absolute;
					bottom: 50rpx;
					left: 50%;
					transform: translateX(-50%);
					font-size: 28rpx;
					color: #F57B00;
				}
			}
		}
		.main-wrap{
			position: absolute;
			z-index: 99;
			top: 338rpx;
			width: 750rpx;
			min-height: 358rpx;
			background: #101010;
			border-radius: 40rpx 40rpx 0 0;
			.exchange-type{
				padding: 40rpx 0 20rpx 30rpx;
				font-size: 26rpx;
				color: #FFFFFF;
			}
			.btn-list{
				display: flex;
				justify-content: space-around;
				.btn{
					width: 330rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background: #FFFFFF;
					border-radius: 20rpx;
					font-size: 26rpx;
				}
				.active{
					color: #FFFFFF;
					background: #3B7FFF;
				}
			}
			.renewal-wrap{
				.select-renewal{
					padding: 40rpx 0 20rpx 30rpx;
					font-size: 26rpx;
					color: rgba(255, 255, 255, 0.73);
				}
			}
			.phone-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #292A2E;
				border-radius: 20rpx;
				margin: 0 30rpx;
				padding: 30rpx 40rpx 30rpx 26rpx;
				.main-content{
					display: flex;
					align-items: center;
					.item-icon{
						width: 68rpx;
						height: 68rpx;
						.item-icon-img{
							width: 100%;
							height: 100%;
						}
					}
					.text-wrap{
						margin-left: 16rpx;
						.phone-title{
							font-size: 30rpx;
							color: #FFFFFF;
						}
						.phone-tip{
							margin-top: 4rpx;
							font-size: 24rpx;
							color: rgba(255, 255, 255, 0.5);
							display: flex;
							align-items: center;
							.icon-time{
								width: 25rpx;
								height: 25rpx;
								margin-top: 4rpx;
								margin-right: 20rpx;
							}
							.red{
								color: red;
							}
						}
					}
				}
				.right-wrap{
					display: flex;
					.exchange{
						font-size: 24rpx;
						color: rgba(255, 255, 255, 0.5);
					}
					.right-arrow{
						width: 36rpx;
						height: 36rpx;
					}
				}
				.select-icon-wrap{
					width: 28rpx;
					height: 28rpx;
					.icon-select{
						width: 100%;
						height: 100%;
					}
				}
			}
			.select-phone-item{
				margin-top: 24rpx;
			}
		}
		.select-wrap{
			width: 706rpx;
			position: absolute;
			z-index: 999;
			top: -60rpx;
			left: 0;
			height: calc(100vh - 290rpx);
			background-color: #1D1E1F;
			border-radius: 20rpx;
			margin: 0 22rpx;
			.title-row{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 622rpx;
				height: 92rpx;
				padding: 0 40rpx;
				background: #2E2F2F;
				border-radius: 20rpx 20rpx 0 0;
				.title{
					font-size: 32rpx;
					font-weight: 600;
					color: #FFFFFF;
				}
				.cannel{
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.5);
				}
			}
			.select-phone-list{
				// padding-bottom: 30rpx;
				height: calc(100vh - 400rpx);
				overflow-y: scroll;
			}
		}
		.bottom-list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 690rpx;
			height: 110rpx;
			background: #FFFFFF;
			box-shadow: 0 0 26rpx 0 rgba(206, 206, 206, 0.5);
			border-radius: 55rpx;
			position: fixed;
			bottom: 30rpx;
			left: 50%;
			transform: translateX(-50%);
			.title{
				margin-left: 40rpx;
				font-size: 30rpx;
				font-weight: 600;
				color: #313131;
			}
			.sure-exchange{
				width: 244rpx;
				height: 110rpx;
				line-height: 110rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 600;
				color: #FFFFFF;
				border-top-right-radius: 55rpx;
				border-bottom-right-radius: 55rpx;
				letter-spacing: 1rpx;
				background: linear-gradient(135deg, #38AEFC 0%, #3B7FFF 100%);
			}
		}
	}
</style>