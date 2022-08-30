<template>
	<view class="container">
		<view class="coin-wrap">
			<image class="coin-bg" src="/static/my/coin-bg.png"></image>
			<view class="coin-content">
				<view class="my-coin">我的星币</view>
				<view class="coin-number-row">
					<text class="coin-number">{{starCoin}}</text>
					<text class="coin-tip">星币</text>
				</view>
				<view class="tips">星币可以购买TODO了，快去试试吧~</view>
			</view>
		</view>
		<u-tabs :list="list" lineColor="#3B7FFF" activeStyle="color:#3B7FFF" @click="tabHandle"></u-tabs>
		<scroll-view class="list-wrap" :scroll-y="true" @scrolltolower="onReachBottoms">
			<view class="list-row" v-for="(item,index) in orderList" :key="index">
				<view class="title-wrap">
					<view class="title">{{item.type}}</view>
					<view class="time">{{item.ctime}}</view>
				</view>
				<view class="number">{{['+','-'][status]}}{{item.singleCoins}}</view>
			</view>
			<view class="loading" v-if="dataStatus == 1"><u-loading-icon :vertical="true"></u-loading-icon></view>
			<view class="loading-text">{{['加载更多','正在加载页面信息...','已经到底了～'][dataStatus]}}</view>
		</scroll-view>
		<view class="no-record-wrap" v-if="noData">
			<image class="no-record" src="/static/my/no-record.png"></image>
			<view class="no-record-text">没有星币{{['获取', '使用'][status]}}记录哦~</view>
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
				noData: false,
				dataStatus: -1,
				pageNum: 1,
				list: [{
					name: '获取记录'
				}, {
					name: '使用记录',
				}],
				orderList: [],
				status: 0
			}
		},
		onLoad(options) {
			this.starCoin = options.starCoin;
			this.getList();
		},
		methods: {
			tabHandle(e){
				this.pageNum = 1;
				this.orderList = [];
				this.status = e.index;
				this.getList();
			},
			onReachBottoms(){
				this.pageNum++;
				if(this.dataStatus != 2){
					this.getList();
				}
			},
			getList(){
				this.dataStatus = this.orderList.length > 10 ? 1 : -1;
				const type = ['get', 'use'][this.status];
				uni.$u.http.get(`/api/pay/v1/starCoins/info/${type}/coin/page`,{
					data: {
						pageNum: this.pageNum,
						pageSize: 10
					}
				}).then(res => {
					  const resData = res.list;
					  if ((resData && resData.length > 0) || (this.orderList.length > 0 && resData.length == 0)) {
						this.orderList = [...this.orderList, ...resData];
						this.dataStatus = 0;
						if (resData.length < 10) {
							this.dataStatus = 2;
						}
					  }
					  if (this.orderList.length === 0) {
						  this.noData = true;
						  this.dataStatus = -1;
					  } else {
						this.noData = false;
					  }
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
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	.container{
		min-height: 100vh;
		background-color: #101010;
		position: relative;
		padding-top: 1rpx;
		.coin-wrap{
			width: 670rpx;
			height: 312rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			position: relative;
			.coin-bg{
				width: 100%;
				height: 100%;
			}
			.coin-content{
				position: absolute;
				left: 10rpx;
				top: 30rpx;
				color: #FFFFFF;
				width: 100%;
				text-align: center;
				.my-coin{
					font-size: 34rpx;
					font-weight: 600;
					color: #FFFFFF;
				}
				.coin-number-row{
					margin-top: 30rpx;
					.coin-number{
						font-size: 48rpx;
						font-weight: 600;
					}
					.coin-tip{
						margin-left: 6rpx;
						font-size: 24rpx;
					}
				}
				.tips{
					margin-top: 90rpx;
					font-size: 24rpx;
					color: rgba(255, 238, 207, 0.72);
				}
			}
		}
		.list-wrap{
			height: calc(100vh - 520rpx);
			.list-row{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 624rpx;
				margin: 24rpx auto;
				padding: 18rpx 28rpx;
				background: #292A2E;
				border-radius: 20rpx;
				.title{
					font-size: 32rpx;
					color: rgba(255, 255, 255, 0.8);
				}
				.time{
					margin-top: 10rpx;
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.2);
				}
				.number{
					font-size: 40rpx;
					font-weight: 600;
					color: #FF4C59;
				}
			}
			.loading{
				margin-top: 20rpx;
			}
			.loading-text{
				padding: 30rpx 0;
				color: #FFFFFF;
				font-size: 26rpx;
				text-align: center;
			}
		}
		.no-record-wrap{
			width: 200rpx;
			height: 206rpx;
			position: fixed;
			bottom: 25%;
			left: 50%;
			transform: translate(-50%, -50%);
			.no-record{
				width: 100%;
				height: 100%;
			}
			.no-record-text{
				margin-top: 20rpx;
				margin-left: -20rpx;
				width: 300rpx;
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>

