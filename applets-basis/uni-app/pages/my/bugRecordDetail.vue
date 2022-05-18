<template>
	<view class="container">
		<view class="wrap" v-if="orderInfo.finishPay == 2">
			<view class="time-title-row">
				<image class="icon-time" src="/static/my/icon-time.png"></image>
				<view class="time-title">剩余时间</view>
			</view>
			<view class="time-number">{{timer}}</view>
		</view>
		<view class="wrap">
			<view class="title-wrap" v-if="orderInfo.finishPay != 2">
				<view class="title">{{orderInfo.buyVipType=="VIP"?"TC-1":orderInfo.buyVipType=="SVIP"?"TC-2":orderInfo.buyVipType=="STAR"?"TC-3":"TC-3PRO"}}TODO套餐</view>
				<view class="day">{{orderInfo.description}}</view>
			</view>
			<view class="info-list">
				<view class="info-row">
					<view class="info-title">有效期</view>
					<view class="info-val">{{orderInfo.description}}</view>
				</view>
				<view class="info-row">
					<view class="info-title">TODO数量</view>
					<view class="info-val">{{orderInfo.quantity}}台</view>
				</view>
				<view class="info-row">
					<view class="info-title">商品类型</view>
					<view class="info-val">{{orderInfo.buyVipType=="VIP"?"TC-1":orderInfo.buyVipType=="SVIP"?"TC-2":orderInfo.buyVipType=="STAR"?"TC-3":"TC-3PRO"}}TODO</view>
				</view>
				<view class="info-row">
					<view class="info-title">购买类型</view>
					<!-- <text v-if="orderInfo.payType===5">激活码兑换-</text> -->
					<view class="info-val">{{orderInfo.buyType==0?"充值":orderInfo.buyType==1?"购买":"续费"}}</view>
				</view>
				<view class="info-row" v-if="orderInfo.payType===5">
					<text>激活码</text><text>{{orderInfo.activationCode}}</text>
				</view>
				<view class="info-row" v-else>
					<text>实付金额</text>
					<text v-if="orderInfo.payType===4">{{orderInfo.starCoin}}星币</text>
					<text v-else>￥{{orderInfo.totalAmount}}</text>
				</view>
				<!-- <view class="info-row">
					<view class="info-title">优惠券</view>
					<view class="info-val">-8.00元</view>
				</view> -->
				<view class="info-row">
					<view class="info-title">订单号</view>
					<view class="info-val">{{orderInfo.myOrderNum}}</view>
				</view>
				<view class="info-row">
					<view class="info-title">创建时间</view>
					<view class="info-val">{{orderInfo.ctime}}</view>
				</view>
				<view class="info-row">
					<view class="info-title">到期时间</view>
					<view class="info-val">{{orderInfo.exceptTime.replace(/-/g,'/')}}</view>
				</view>
			</view>
		</view>
		<view class="wrap rest-wrap" v-if="orderInfo.giveStarNum != 0 || orderInfo.preferentialContent">
			<view class="info-list">
				<view class="info-row" v-if="orderInfo.preferentialContent">
					<view class="info-title">优惠</view>
					<view class="info-val">{{orderInfo.preferentialContent}}</view>
				</view>
				<view class="info-row">
					<view class="info-title">赠送星币</view>
					<view class="info-val">{{orderInfo.giveStarNum}}星币</view>
				</view>
			</view>
		</view>
		<view class="wrap rest-wrap">
			<view class="info-list">
				<view class="info-row">
					<view class="info-title">支付状态</view>
					<view class="info-val">{{['未支付','完成','支付中','支付失败','订单失效'][orderInfo.finishPay]}}</view>
				</view>
				<view class="info-row">
					<view class="info-title">支付方式</view>
					<view class="info-val">{{['余额','支付宝','微信','银联','星币','激活码兑换',6,7,8,'支付宝','微信'][orderInfo.payType] || ''}}</view>
				</view>
				<view class="info-row">
					<view class="info-title">支付时间</view>
					<view class="info-val">{{orderInfo.finishTime}}</view>
				</view>
			</view>
		</view>
		<view class="btn-list" v-if="orderInfo.finishPay===2">
			<view class="btn-row" @click="cannelOrder">
				<image class="icon" src="/static/my/cannel-order-img.png"></image>
				<view class="btn">取消订单</view>
			</view>
			<view class="btn-row active" @click="goPay">
				<image class="icon" src="/static/my/wallet.png"></image>
				<view class="btn btn-active">去支付</view>
			</view>
		</view>
	</view>
</template>

<script>
	var RSA = require('../../util/wx_rsa.js');
	export default {
		data() {
			return {
				timer: '',
				orderInfo: {}
			}
		},
		onLoad(options) {
			this.orderInfo = JSON.parse(options.dataObj);
			this.timerHamdle();
			console.log(this.orderInfo)
		},
		methods: {
			//格式化时间
			checkAddZone: function (num) {
				return num<10 ? '0' + num.toString() : num
			},
			timerHamdle(){
				const result = this.orderInfo.closeTime - this.orderInfo.systemTime;
				let min = parseInt(result/60);
				min = this.checkAddZone(min);
				let se = result%60;
				const timeInterval = setInterval(() =>{
				  if(se > 0){
					se--;
					se = this.checkAddZone(se)
					if(min == '00' && se == '00'){
					  clearInterval(timeInterval);
					}
				  } else {
					se = 59;
					min--;
					min = this.checkAddZone(min)
				  }
				  let time = min + ':' + se ;
				  this.timer = time;
				},1000)
			},
			goPay(){
				let taocan = {
					buyType: 1,
					couponId: 0,
					id: this.orderInfo.id,
					mealType: 0,
					phoneType: this.orderInfo.buyVipType,
					quantity: this.orderInfo.quantity
				}
				taocan = this.sort_ASCII(taocan);
				var sign = this.jiaqian(JSON.stringify(taocan));
				if (this.orderInfo.buyType === 1 || this.orderInfo.buyType === 9) {
					uni.$u.http.get('/api/pay/v1/alipay/h5/spend', {
						data: {
							myOrderNum: this.orderInfo.myOrderNum
						},
						header: {
							sign: sign
						}
					}).then(res => {
						// 将接口返回的form表单显示到页面
						document.querySelector('body').innerHTML = res;
						// 调用submit方法
						document.forms[0].submit()
					})
				} else if (this.orderInfo.buyType === 2 || this.orderInfo.buyType === 10) {
					uni.$u.http.get('/api/pay/v1/wxPay/h5/spend', {
						data: {
							myOrderNum: this.orderInfo.myOrderNum
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
			cannelOrder(){
				uni.showModal({
					title: '',
					content: '确定取消所选择订单？取消后将不可恢复。',
					cancelText: '确定',
					confirmText: '取消',
					success: (res) => {
						if (res.cancel) {
							uni.$u.http.get('/api/pay/v1/order/info/cancelOrderHandle', {
								data: {
									myOrderNum: this.orderInfo.myOrderNum
								}
							}).then(res => {
								this.cancelResult()
							})
							
						}
					}
				});
			},
			//取消结果
			cancelResult() {
				uni.$u.http.get('/api/pay/v1/order/info/cancelOrder', {
					data: {
						myOrderNum: this.orderInfo.myOrderNum
					}
				}).then(res => {
					wx.showToast({
					  title: '取消成功！',
					  icon: 'none',
					  duration: 500,
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1000)
				})
			},
		}
	}
</script>

<style lang="scss">
	.container{
		min-height: 90vh;
		background-color: #101010;
		position: relative;
		padding-top: 1rpx;
		padding-bottom: 44rpx;
		.wrap{
			width: 630rpx;
			margin: auto;
			margin-top: 20rpx;
			background: #292A2E;
			border-radius: 20rpx;
			padding: 30rpx 40rpx;
			text-align: center;
			.time-title-row{
				display: flex;
				justify-content: center;
				align-items: center;
				.icon-time{
					width: 36rpx;
					height: 36rpx;
					margin-top: 2rpx;
					margin-right: 20rpx;
				}
				.time-title{
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.5);
				}
			}
			.time-number{
				margin-top: 14rpx;
				font-size: 52rpx;
				font-weight: 600;
				color: #3B7FFF;
			}
			.title-wrap{
				padding-bottom: 30rpx;
				border-bottom: 1rpx dashed rgba(255, 255, 255, 0.1);
				.title{
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.5);
				}
				.day{
					margin-top: 10rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: rgba(255, 255, 255, 0.8);
				}
			}
			.info-list{
				padding-top: 6rpx;
				margin-bottom: 24rpx;
				.info-row{
					display: flex;
					justify-content: space-between;
					margin: 0 10rpx;
					margin-top: 20rpx;
					font-size: 28rpx;
					color: rgba(255, 255, 255, 0.5);
				}
			}
		}
		.rest-wrap{
			padding: 10rpx 40rpx;
		}
		.btn-list{
			display: flex;
			justify-content: space-around;
			margin-top: 42rpx;
			.btn-row{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 322rpx;
				height: 92rpx;
				border-radius: 20rpx;
				border: 2rpx solid #999999;
				.icon{
					width: 36rpx;
					height: 36rpx;
				}
				.btn{
					margin-left: 6rpx;
					font-size: 32rpx;
					color: rgba(255, 255, 255, 0.5);
				}
				.btn-active{
					color: rgba(255, 255, 255, 1);
				}
			}
			.active{
				border: none;
				background: #3B7FFF;
			}
		}
	}
</style>
