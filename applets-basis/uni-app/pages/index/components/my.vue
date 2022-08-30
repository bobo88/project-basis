<template>
	<view class="container">
		<view class="top-wrap" @click="toMy">
			<image class="top-bg" src="../../../static/my/top-bg.png"></image>
			<view class="info-row">
				<view class="info-left">
					<image v-if="imgUrl" class="header-img" :src="imgUrl"></image>
					<image v-else class="header-img" src="../../../static/index/touxiaong_mr_icon.png" mode=""></image>
					<view class="nickname">{{infoObj.surfaceName}}</view>
				</view>
				<image class="right-arrow" src="../../../static/my/right-arrow.png"></image>
			</view>
		</view>
		<view class="main-wrap">
			<view class="goods-wrap">
				<view class="goods-item" @click="toCoinDetail">
					<view class="goods-item-light"></view>
					<image class="icon-img" src="../../../static/my/coin-img.png"></image>
					<view class="text-item">
						<view class="goods-title">星币</view>
						<view class="goods-number-row">
							<text class="goods-number">{{infoObj.starCoin}}</text>
							<text class="goods-tips">星币</text>
						</view>
					</view>
				</view>
				<view class="goods-item" @click="toCardDetail">
					<view class="goods-item-light"></view>
					<image class="icon-img" src="../../../static/my/block-img.png"></image>
					<view class="text-item">
						<view class="goods-title">卡券</view>
						<view class="goods-number-row">
							<text class="goods-number">{{infoObj.couponNum}}</text>
							<text class="goods-tips">张</text>
						</view>
					</view>
				</view>
			</view>
			<view class="my-list">
				<view class="my-item" @click="toExchangeCenter">
					<view class="main-content">
						<view class="item-icon">
							<image class="item-icon-img" src="../../../static/my/money.png"></image>
						</view>
						<view class="text-wrap">
							<view class="my-title">兑换中心</view>
							<view class="my-tip">激活码兑换</view>
						</view>
					</view>
					<image class="right-arrow" src="../../../static/my/right-arrow.png"></image>
				</view>
				<view class="my-item" @click="toBugRecord">
					<view class="main-content">
						<view class="item-icon">
							<image class="item-icon-img" src="../../../static/my/time.png"></image>
						</view>
						<view class="text-wrap">
							<view class="my-title">购买记录</view>
							<view class="my-tip">购买记录 消费记录</view>
						</view>
					</view>
					<image class="right-arrow" src="../../../static/my/right-arrow.png"></image>
				</view>
				<view class="my-item" @click="showLoginOut=true">
					<view class="main-content">
						<view class="item-icon">
							<image class="item-icon-img" src="../../../static/my/system.png"></image>
						</view>
						<view class="text-wrap">
							<view class="my-title">系统设置</view>
							<view class="my-tip">退出账号</view>
						</view>
					</view>
					<image class="right-arrow" src="../../../static/my/right-arrow.png"></image>
				</view>
			</view>
		</view>
		<u-modal :show="showLoginOut" confirmText="取消" @confirm="showLoginOut=false" @cancel="loginOut" cancelText="确认"
			:showCancelButton="true" content="是否确定退出此账号"></u-modal>
	</view>
</template>

<script>
	import urlObj from '@/common/config.js'
	export default {
		data() {
			return {
				infoObj: {},
				imgUrl: '/static/my/defalt-header-img.png',
				showLoginOut: false
			}
		},
		methods: {
			//获取用户当前信息
			getStarCoin() {
				uni.$u.http.get('/api/pay/v1/client/left/info').then(res => {
					this.infoObj = res
				})
			},
			getHeadPortrait(send) {
				uni.$u.http.get('/api/user/v5/user/getHeadPortrait').then(res => {
					this.imgUrl = res ?
						`${urlObj.fileUrl}/document/newFile/download/0/${urlObj.uploadKey}?fileKey=${res}` : ''
					console.log(this.imgUrl)
				})
			},
			loginOut() {
				this.showLoginOut = false;
				uni.$u.http.post('/api/user/v5/visitDetailed/operationVisitDetailed', {
					operationType: 2,
					id: uni.getStorageSync('loginId')
				}, {
					header: {
						client: 7,
						versions: 5.1,
						'Authorization': uni.getStorageSync('token')
					}
				}).then(res => {
					uni.setStorageSync('token', '')
					uni.navigateTo({
						url: '../login/index'
					})
				})
			},
			toMy() {
				uni.navigateTo({
					url: '../my/index'
				})
			},
			toCoinDetail() {
				uni.navigateTo({
					url: `../my/starCoin?starCoin=${this.infoObj.starCoin}`
				})
			},
			toCardDetail() {
				uni.navigateTo({
					url: '../my/card'
				})
			},
			toExchangeCenter() {
				uni.navigateTo({
					url: '/pages/my/exchangeCenter'
				})
			},
			toBugRecord() {
				uni.navigateTo({
					url: '/pages/my/bugRecord'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		background-color: #101010;

		.top-wrap {
			width: 750rpx;
			height: 430rpx;
			position: relative;

			.top-bg {
				width: 100%;
				height: 100%;
			}

			.info-row {
				width: 680rpx;
				position: absolute;
				left: 70rpx;
				top: 76rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.info-left {
					display: flex;
					align-items: center;

					.header-img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}

					.nickname {
						margin-left: 20rpx;
						color: #FFFFFF;
					}
				}

				.right-arrow {
					width: 28rpx;
					height: 28rpx;
					margin-right: 70rpx;
				}
			}
		}

		.main-wrap {
			position: relative;
			z-index: 9;
			margin-top: -166rpx;
			width: 750rpx;
			height: calc(100vh - 300rpx);
			background: linear-gradient(180deg, #12161F 0%, #18181A 100%);
			border-radius: 40rpx 40rpx 0 0;

			.goods-wrap {
				display: flex;
				justify-content: space-between;
				padding: 30rpx;

				.goods-item {
					width: 274rpx;
					height: 140rpx;
					background: #141421;
					display: flex;
					align-items: center;
					padding-left: 60rpx;
					position: relative;
					border: 2rpx solid transparent;
					border-radius: 20rpx;
					background-clip: padding-box;

					&::after {
						position: absolute;
						top: -2rpx;
						bottom: -2rpx;
						left: -2rpx;
						right: -2rpx;
						background: linear-gradient(180deg, rgba(47, 60, 107, 1), rgba(26, 26, 34, 1));
						content: '';
						z-index: -1;
						border-radius: 20rpx;
					}

					.goods-item-light {
						width: 166rpx;
						height: 26rpx;
						background: linear-gradient(180deg, #6EE9FF 0%, rgba(110, 233, 255, 0) 100%);
						filter: blur(18px);
						position: absolute;
						top: 18rpx;
						left: 50%;
						margin-left: -83rpx;
					}

					.icon-img {
						width: 52rpx;
						height: 52rpx;
					}

					.text-item {
						margin-left: 20rpx;

						.goods-title {
							color: #FFFFFF;
						}

						.goods-number-row {
							display: flex;
							align-items: center;

							.goods-number {
								max-width: 130rpx;
								color: #3B7FFF;
								font-size: 36rpx;
								font-weight: 600;
								color: #3B7FFF;
								line-height: 50rpx;
								overflow: hidden; //超出的文本隐藏
								text-overflow: ellipsis; //用省略号显示
								white-space: nowrap;
							}

							.goods-tips {
								margin-left: 6rpx;
								font-size: 24rpx;
								color: rgba(255, 255, 255, 0.5);
							}
						}
					}
				}
			}

			.my-list {
				width: 620rpx;
				background: rgba(255, 255, 255, 0.05);
				border-radius: 20rpx;
				margin: 30rpx;
				padding: 0 28rpx 0 40rpx;

				.my-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx 0;

					.main-content {
						display: flex;
						align-items: center;

						.item-icon {
							width: 48rpx;
							height: 48rpx;

							.item-icon-img {
								width: 100%;
								height: 100%;
							}
						}

						.text-wrap {
							margin-left: 16rpx;

							.my-title {
								font-size: 30rpx;
								color: #FFFFFF;
							}

							.my-tip {
								font-size: 24rpx;
								color: rgba(255, 255, 255, 0.5);
							}
						}
					}

					.right-arrow {
						width: 28rpx;
						height: 28rpx;
					}
				}
			}
		}
	}
</style>
