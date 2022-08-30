<template>
	<view class="container">
		<view class="tabs">
			<u-tabs :list="list" lineColor="#3B7FFF" activeStyle="color:#3B7FFF" @click="tabHandle"></u-tabs>
		</view>
		<scroll-view class="list" :scroll-y="true" @scrolltolower="onReachBottoms">
			<view v-for="(item,index) in orderList" @click="goDetail(item.cloudPhoneVO)">
				<view v-if="item.cloudPhoneVO" class="phone-item">
					<view class="top-wrap">
						<view class="main-content">
							<view class="item-icon">
								<image v-if="item.cloudPhoneVO && item.cloudPhoneVO.buyVipType=='VIP'" class="item-icon-img" src="/static/my/vip.png"></image>
								<image v-else-if="item.cloudPhoneVO && item.cloudPhoneVO.buyVipType=='SVIP'" class="item-icon-img" src="/static/my/svip.png"></image>
								<image v-else-if="item.cloudPhoneVO && item.cloudPhoneVO.buyVipType=='STAR'" class="item-icon-img" src="/static/my/star.png"></image>
								<image v-else class="item-icon-img" src="/static/my/pro.png"></image>
							</view>
							<view class="text-wrap">
								<view class="phone-title" v-if="item.cloudPhoneVO">{{buyTypeTitle[item.cloudPhoneVO.buyVipType]}}</view>
								<view class="phone-tip">
									<text>{{item.cloudPhoneVO && item.cloudPhoneVO.description}}</text>
								</view>
							</view>
						</view>
						<view class="right-wrap">
							<view class="exchange">
								<text v-if="item.cloudPhoneVO && item.cloudPhoneVO.payType===4">{{item.cloudPhoneVO && item.cloudPhoneVO.amountPrice}}</text>
								<text v-else-if="item.cloudPhoneVO && item.cloudPhoneVO.payType===5">激活码</text>
								<text v-else>
									<text class="tip">¥</text>
									<text class="number">{{item.cloudPhoneVO && item.cloudPhoneVO.totalAmount}}</text>
								</text>
							</view>
							<view class="time">{{item.cloudPhoneVO && item.cloudPhoneVO.ctime}}</view>
						</view>
					</view>
					<view class="no-pay-result" v-if="item.cloudPhoneVO && item.cloudPhoneVO.finishPay===2">
						<view class="await-pay">待付款</view>
						<view class="btn-list">
							<view class="cannel-pay" @click.stop="cannelOrder(item.myOrderNum)">取消订单</view>
							<view class="go-pay" @click.stop="goPay(item)">去支付</view>
						</view>
					</view>
					<view class="paied-result" v-else>已付款</view>
				</view>
			</view>
			<view class="loading" v-if="dataStatus == 1"><u-loading-icon :vertical="true"></u-loading-icon></view>
			<view class="loading-text">{{['加载更多','正在加载页面信息...','已经到底了～'][dataStatus]}}</view>
		</scroll-view>
		<view class="no-card-wrap" v-if="noData">
			<image class="no-card-img" src="/static/my/no-record.png"></image>
			<view class="no-card-text">无{{['订单','待付款','已付款'][status]}}记录</view>
		</view>
		<u-no-network
			@disconnected="disconnected"
			@connected="connected"
			@retry="retry"
		></u-no-network>
	</view>
</template>

<script>
	var RSA = require('../../util/wx_rsa.js');
	export default {
		data() {
			return {
				buyTypeTitle: {
					'VIP': 'TC-1TODO',
					'SVIP': 'TC-2TODO',
					'STAR': 'TC-3TODO',
					'STARPRO': 'TC-3PROTODO'
				},
				page: 1,
				orderList: [],
				list: [{
						name: '全部'
					}, {
						name: '待付款'
					}, {
						name: '已付款'
					}],
				status: 0,
				noData: false,
				dataStatus: -1
			}
		},
		onShow() {
			this.page = 1;
			this.orderList = [];
			this.getList();
		},
		methods: {
			onReachBottoms(){
				this.page++;
				if(this.dataStatus != 2){
					this.getList('reachBottom');
				}
			},
			getList(type){
				this.dataStatus = this.orderList.length > 20 ? 1 : -1;
				uni.$u.http.post('/api/pay/v1/order/info/qryDegreeOrder',{
						buyType: 0,
						pageNum: this.page,
						pageSize: 20,
						finishPay: [0, 2, 1][this.status]
					}).then(res => {
						const resData = res.list;
						if(type != 'reachBottom') {
							this.orderList = [];
						}
					  if ((resData && resData.length > 0) || (this.orderList.length > 0 && resData.length == 0)) {
						this.orderList = [...this.orderList, ...resData];
						this.dataStatus = 0;
						if (resData.length < 20) {
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
			goPay(item){
				let taocan = {
					buyType: 1,
					couponId: 0,
					id: item.id,
					mealType: 0,
					phoneType: item.buyVipType,
					quantity: item.quantity
				}
				taocan = this.sort_ASCII(taocan);
				var sign = this.jiaqian(JSON.stringify(taocan));
				if (item.payType === 1 || item.payType === 9) {
					uni.$u.http.get('/api/pay/v1/alipay/h5/spend', {
						data: {
							myOrderNum: item.myOrderNum
						},
						header: {
							sign: sign
						}
					}).then(res => {
						console.log(res);
						uni.setStorageSync('myOrderNum', item.myOrderNum);
						// 将接口返回的form表单显示到页面
						document.querySelector('body').innerHTML = res;
						// 调用submit方法
						document.forms[0].submit()
					})
				} else if (item.payType === 2 || item.payType === 10) {
					uni.$u.http.get('/api/pay/v1/wxPay/h5/spend', {
						data: {
							myOrderNum: item.myOrderNum
						},
						header: {
							sign: sign
						}
					}).then(res => {
						window.location.href = res
					})
				}
			},
			sort_ASCII(obj) {
				var arr = new Array();
				var num = 0;
				for (var i in obj) {
					arr[num] = i;
					num++;
				}
				var sortArr = arr.sort();
				var sortObj = {};
				for (var i in sortArr) {
					sortObj[sortArr[i]] = obj[sortArr[i]];
				}
				return sortObj;
			},
			jiaqian(content) {
				const PrivateKey =
					'-----BEGIN PRIVATE KEY-----TODO-----END PRIVATE KEY-----';
				const signature = new RSA.KJUR.crypto.Signature({
					alg: 'SHA256withRSA'
				})
				signature.init(PrivateKey);
				signature.updateString(content)
				const signData = signature.sign()
				// 将内容转成base64
				return RSA.hex2b64(signData)
			},
			cannelOrder(myOrderNum){
				wx.showModal({
				    title: '提示',
				    content: '是否确认取消订单？',
				    success: (res) => {
				        if (res.confirm) {
							uni.$u.http.get('/api/pay/v1/order/info/cancelOrderHandle', {
								data: {
									myOrderNum: myOrderNum
								}
							}).then(res => {
								this.cancelResult(myOrderNum);
							})
				        } else if (res.cancel) {
							this.page = 1;
							this.dataStatus = 0;
							this.orderList = [];
							this.getList();
							console.log('用户点击取消')
				        }
				    }
				})
			},
			//取消结果
			cancelResult(myOrderNum) {
				uni.$u.http.get('/api/pay/v1/order/info/cancelOrder', {
					data: {
						myOrderNum: myOrderNum
					}
				}).then(res => {
					wx.showToast({
					  title: '取消成功！',
					  icon: 'none',
					  duration: 500,
					});
					setTimeout(() => {
						this.page = 1;
						this.dataStatus = 0;
						this.orderList = [];
						this.getList();
					}, 500)
				})
			},
			tabHandle(e){
				if(this.status == e.index) {
					return
				}
				this.status = e.index;
				this.page = 1;
				// this.dataStatus = -1;
				this.getList();
			},
			goDetail(obj){
				uni.navigateTo({
					url: `/pages/my/bugRecordDetail?dataObj=${JSON.stringify(obj)}`
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
				this.page = 1;
				this.orderList = [];
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	body{
	}
	.container{
		min-height: 100vh;
		overflow-y:hidden;
		background-color: #101010;
		position: relative;
		.tabs{
			margin-top: -4rpx;
			background-color: #1D1E1F;
		}
		.list{
			height: calc(100vh - 190rpx);
			overflow-y: scroll;
		}
		.phone-item{
			border-radius: 20rpx;
			margin: 0 30rpx;
			margin-top: 24rpx;
			padding: 30rpx 40rpx 24rpx 26rpx;
			background: #292A2E;
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
		.top-wrap{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 16rpx;
			border-bottom: 1rpx solid rgba(255,255,255,0.1);
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
					}
				}
			}
			.right-wrap{
				.exchange{
					text-align: right;
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.5);
					.tip{
						font-size: 24rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
					.number{
						font-size: 40rpx;
						font-weight: 600;
						color: #FFFFFF;
					}
				}
				.time{
					margin-top: 6rpx;
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.4);
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
		.paied-result{
			margin-top: 24rpx;
			text-align: right;
			font-size: 28rpx;
			color: rgba(255, 255, 255, 0.5);
		}
		.no-pay-result{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16rpx 0;
			.await-pay{
				font-size: 28rpx;
				color: #F03231;
			}
			.btn-list{
				display: flex;
				.cannel-pay{
					width: 152rpx;
					height: 56rpx;
					line-height: 56rpx;
					text-align: center;
					border-radius: 28rpx;
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.5);
					border: 2rpx solid #7F8081;
				}
				.go-pay{
					width: 152rpx;
					height: 56rpx;
					line-height: 56rpx;
					text-align: center;
					font-size: 28rpx;
					color: #3B7FFF;
					border-radius: 28rpx;
					margin-left: 24rpx;
					border: 2rpx solid #3B7FFF;
				}
			}
		}
		.no-card-wrap{
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			.no-card-img{
				width: 200rpx;
				height: 186rpx;
			}
			.no-card-text{
				margin-top: 30rpx;
				font-size: 28rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
