<template>
	<view class="container">
		<view v-if="homeList.length > 0">
			<swiper class="swiper" :current="current" @change="changePhone">
				<block v-for="item in homeList" :key="item.id">
					<swiper-item>
						<view class="my-phone-wrap swiper-item" @click="goCloudPhone">
							<image class="phone-img-bg" src="/static/index/phone.png"></image>
							<view class="no-login-wrap" v-if="!tokens">
								<image class="no-login" src="/static/index/no-login.png"></image>
								<view class="plase-user">欢迎使用YBTODO</view>
								<view class="plase-login">请先登录</view>
								<view class="login-text" @click.stop="login">登录</view>
								<view class="register-text" @click.stop="register">注册</view>
							</view>
							<image v-else-if="item.validTime > 0 && websocketImg" class="phone-img" :src="websocketImg"></image>
							<image v-else-if="item.validTime > 0 && !websocketImg && item.buyVipType === 'SVIP'" class="phone-img" src="/static/index/home_bg_SVIP.png"></image>
							<image v-else-if="item.validTime > 0 && !websocketImg && item.buyVipType === 'VIP'" class="phone-img" src="/static/index/home_bg_VIP.png"></image>
							<image v-else-if="item.validTime > 0 && !websocketImg && item.buyVipType === 'STAR'" class="phone-img" src="/static/index/home_bg_STAR.png"></image>
							<image v-else-if="item.validTime > 0 && !websocketImg && item.buyVipType === 'STARPRO'" class="phone-img" src="/static/index/home_bg_PRO.png"></image>
							<view class="phone-img-wrap" v-else>
								<image class="phone-img-overdue" src="/static/index/phone-overdue.png"></image>
								<view class="overdue-text">TODO过期</view>
							</view>
							<view class="camvas-head" style="z-index: 5555;" v-if="tokens">
							  <view class="tophead">
								<view class="th_left">
								  <image v-if="item.buyVipType=='VIP'" class="item-icon-img" src="/static/my/vip.png"></image>
								  <image v-else-if="item.buyVipType=='SVIP'" class="item-icon-img" src="/static/my/svip.png"></image>
								  <image v-else-if="item.buyVipType=='STAR'" class="item-icon-img" src="/static/my/star.png"></image>
								  <image v-else class="item-icon-img" src="/static/my/pro.png"></image>
								</view>
								<view class="th_right">
								  <view class="thl-font">
									<image class="w34h32" v-if="item.phoneAuthStatus === 1 && item.authPhone === 0" src="/static/index/shou_icon.png"></image>
									<image class="w34h32" v-if="item.phoneAuthStatus === 1 && item.authPhone === 1" src="/static/index/huo_icon.png"></image>
									{{item.diskName}}
								  </view>
								  <!-- <wxs module="filters" src="./filters.wxs"></wxs> -->
								  <view v-if="item.validTime > 0" :class="item.validTime > 4320?'thl-time':'thl-time reds'">剩{{timeStamp(item.validTime) }}</view>
								  <view v-else class="pastdue">已过期</view>
								</view>
							  </view>
							  <view class="battery-wrap" v-if="(item.phoneAuthStatus !== 1 && item.authPhone !== 1) || (item.phoneAuthStatus === 1 && item.authPhone === 0)" @click.stop="goRenew(item)">
								  <image v-if="item.validTime > 10080" class="battery-icon" src="/static/index/battery4.png"></image>
								  <image v-else-if="item.validTime > 4320" class="battery-icon" src="/static/index/battery6.png"></image>
								  <image v-else-if="item.validTime > 1440" class="battery-icon" src="/static/index/battery3.png"></image>
								  <image v-else-if="item.validTime > 0" class="battery-icon" src="/static/index/battery2.png"></image>
								  <image v-else class="battery-icon" src="/static/index/battery5.gif"></image>
							  </view>
							  <!-- <view v-if="item.buyVipType === 'SVIP' && item.userName === username && item.freeTrial === '20'" class="th_renew" style="z-index: 5000;">
								续费
							  </view> -->
							</view>
							<view class="ear" @click.stop="earHandle(item)" v-if="tokens">
								<image class="ear-img" src="/static/index/ear.png"></image>
							</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="left" @click="swiperPrev" v-if="current != 0">
				<image class="left-img" src="/static/index/left.png"></image>
			</view>
			<view class="right" @click="swiperNext" v-if="current != homeList.length - 1">
				<image class="right-img" src="/static/index/right.png"></image>
			</view>
		</view>
		<view class="no-phone-wrap" @click="goBuy" v-else>
			<image class="no-phone-img" src="/static/index/no-phone.png"></image>
			<view class="buy-phone">购买TODO</view>
		</view>
		<view class="phone-tip-wrap" v-if="phoneTipShow">
			<view class="phone-tip-container">
				<image class="ear-tip" src="/static/index/ear-tip.png"></image>
				<image class="headset" src="/static/index/headset.gif"></image>
				<image class="join-phone" src="/static/index/join-phone.png" @click="jonPhone"></image>
			</view>
		</view>
		<view class="battery-tip-wrap" v-if="battetyTipShow">
			<view class="battery-tip-container">
				<image class="battery-tip" src="/static/index/battery-tip.png"></image>
				<image class="battery" src="/static/index/battery.gif"></image>
				<image class="join-battery" src="/static/index/next.png" @click="battetyTip"></image>
			</view>
		</view>
		<u-no-network
			@disconnected="disconnected"
			@connected="connected"
			@retry="retry"
		></u-no-network>
	</view>
</template>

<script>
	import urlObj from '../../../common/config.js'
	export default {
		data() {
			return {
				newUser: null,
				urlObj: {},
				phoneTipShow: false,
				battetyTipShow: false,
				current: 0,
				homeList: [],
				myurl: '',
				socketOpen: true,
				websocketImg: '',
				time: '',
				tokens: '',
				username: uni.getStorageSync('username')
			}
		},
		mounted() {
			this.tokens = uni.getStorageSync('token');
			if(!this.tokens){
				this.homeList.push(111)
			}
			this.init();
		},
		methods: {
			goRenew(item){
				uni.setStorageSync('userCardId', item.id)
				uni.setStorageSync('buyVipType', item.buyVipType)
				uni.navigateTo({
					url: '/pages/order/renew'
				})
			},
			goBuy(){
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			battetyTip() {
				this.battetyTipShow = false;
				this.phoneTipShow = true;
			},
			jonPhone() {
				this.phoneTipShow = false;
				this.newUser.push({
					username: this.username
				})
				uni.setStorageSync("newUser", JSON.stringify(this.newUser));
				if(this.homeList[0]){
					this.earHandle(this.homeList[0])
				}
			},
			earHandle(item) {
				if(item.validTime <= 0){
					return
				}
				uni.$u.http.get(`/api/resources/api/usercard/reboot?userCardId=${item.id}`).then(res => {
					uni.$u.toast('重启中...');
				})
			},
			changePhone(event){
				this.websocketImg = ''
				this.current = event.detail.current
				if(this.current < this.homeList.length && this.homeList[this.current].validTime > 0) {
				  this.isMount(this.homeList[this.current].userCardId);
				}
			},
			// 向左滑动
			swiperPrev: function () {
				this.websocketImg = ''
			    var current = this.current;
			    this.current = current > 0 ? current - 1 : this.homeList.length - 1;
				this.isMount(this.homeList[this.current].userCardId);
			},
			// 向右滑动
			swiperNext: function () {
				this.websocketImg = ''
			    var current = this.current;
			    this.current = current <= (this.homeList.length - 1) ? current + 1 : 0;
			    if(this.current < this.homeList.length - 1){
					this.isMount(this.homeList[this.current].userCardId);
				}
			},
			//与socket建立连接
			connectStart() {
			    uni.connectSocket({
			      url: this.myurl,
			      success: (res) => {
			      console.log(res)
			      },
			      fail: (err) => {
			        // uni.showToast({
			        //   title: '网络异常！',
			        // })
			        console.log(err)
			      },
			    })
			      
			    // 连接成功
			    uni.onSocketOpen((res) => {
			      console.log('WebSocket 成功连接', res)
			      this.resMes()
			    })
			    //连接失败
			    uni.onSocketError((err) => {
			      console.log('websocket连接失败', err);
			    })
			},
			resMes() {
			    var joinData = {
			      type: 'getScreenPic',
			      data: {
			        taskUid: '346789',
			        intervalTime: 0
			      }
			    }
			    this.sendSocketMessage({
			      msg: JSON.stringify(joinData),
			      data: JSON.stringify(joinData),
			      success:  (res) => {
			        //接收数据
			        uni.onSocketMessage((data) => {
			          let unit8Arr = new Uint8Array(data.data);
			          unit8Arr = unit8Arr.slice(12,unit8Arr.length-2);
			          let base64 = uni.arrayBufferToBase64(unit8Arr);
			          this.websocketImg = `data:image/jpg;base64,${base64}`
			          uni.closeSocket();
			        })
			      },
			      fail: function (err) {
			        console.log('失败',err);
			      },
			    })
			},
			  // 通过 WebSocket 连接发送数据
			sendSocketMessage(options) {
			    if (this.socketOpen) {
			      uni.sendSocketMessage({
			        data: options.msg,
			        success: (res) => {
			          if (options) {
			            options.success && options.success(res);
			          }
			        },
			        fail: (res) => {
			          if (options) {
			            options.fail && options.fail(res);
			          }
			        }
			      })
			    } else {
			      socketMsgQueue.push(options.msg)
			    }
			},
			init() {
			    if (this.tokens) {
					uni.showLoading({
						title: '加载中'
					})
					uni.$u.http.get('/api/resources/v5/client/disk/info').then(res => {
						uni.hideLoading()
						this.homeList = res.diskInfo;
						if(this.homeList.length > 0){
							this.newUser = wx.getStorageSync("newUser");
							if(this.newUser){
								this.newUser = JSON.parse(this.newUser);
								let flag = this.newUser.find(item => item.username === this.username);
								if(!flag){
									this.battetyTipShow = true;
								}
							}
							if(this.newUser === ''){
								this.newUser = [];
								this.battetyTipShow = true;
							}
						}
						if (this.homeList.length) {
						  this.isMount(this.homeList[0].userCardId);
						}
					})
			    }
			},
			//获取wss路径
			isMount(userCardId) {
				uni.request({
				    url: `${urlObj.baseUrl}/api/resources/user/cloud/isMount`,
					method: 'get',
					data: {
						userCardId: userCardId
					},
				    success: (res) => {
				        if(res.data.status == 0){
							if(res.data.data.internetHttps){
								this.myurl = `wss://${res.data.data.internetHttps}businessChannel?cardIp=${res.data.data.localIp}&token=${res.data.data.cardToken}`
								this.connectStart()
							}
				        }
				    }
				});
			},
			async isDischarge() {
				return new Promise((resolve, reject) => {
					uni.getNetworkType({
						complete: function (res) {
							resolve();
							// if(res.networkType !== 'wifi'){
							// 	uni.showModal({
							// 		title: '',
							// 		content: '即将控制TODO，会采用视频流的方式，将消耗您的手机流量',
							// 		success: function (res) {
							// 			if (res.confirm) {
							// 				resolve();
							// 			}
							// 		}
							// 	});
							// } else {
							// 	resolve();
							// }
						}
					});
					
				})
			},
			async goCloudPhone() { // 进入TODO
				if(!this.tokens){
					return
				}
				await this.isDischarge();
			    if (this.homeList[this.current].buyVipType === 'STARPRO' && this.platform) {
					uni.$u.toast('该TODO目前小程序暂不支持，请移步客户端使用！')
					return
			    }
			    uni.showLoading({
			      title: '加载中',
			      mask: true
			    })
			    const address = uni.getStorageSync('address');
				uni.$u.http.post('/api/resources/user/cloud/connect',{
					userCardId: this.homeList[this.current].id,
					coordinatesLat: address.latitude,
					coordinatesLng: address.longitude
				}).then(res => {
					uni.hideLoading();
					  if (this.timer) {
					    uni.hideLoading()
					    this.timer = clearTimeout()
					  }
					  if (res.internetHttps) {
						setTimeout(() => {
							uni.getClipboardData({
							  complete: (ress) => {
								  // alert(JSON.stringify(ress))
								  // console.log(ress)
								  // return
								if (ress) {
								  this.shear(ress.data)
								}
								let cardToken = res.cardToken.replace(/=/g, "@");
								cardToken = cardToken.replace(/\+/g, "%2B");
								uni.navigateTo({
								  url: `/pages/index/webView?record=${this.homeList[this.current].id}&sn=${res.sn}&domainName=${res.internetHttps}/businessChannel&appletPushAddress=${res.internetHttps}/plugflow&userCardId=${res.userCardId}&ip=${res.localIp}&cardToken=${cardToken}&mealType=${this.homeList[this.current].buyVipType}`
								})
							  }
							})
						}, 1000)
					  } else {
						uni.$u.toast('网络异常，请稍后重试！');
					    uni.showToast({
					      title: "",
					      icon: 'none',
					      duration: 1000
					    })
					  }
					if (res.status === 5200) {
					  if (this.time >= 30) {
					    uni.$u.toast('网络异常，请稍后重试！');
					    uni.hideLoading()
					    this.timer = clearTimeout()
					    return
					  }
					  this.timer = setTimeout(() => {
					    uni.showLoading({
					      title: '加载中',
					      mask: true
					    })
					    this.goCloudPhone()
					    this.time += 1
					  }, 1000)
					}
				})
			},
			// 新增用户剪切板记录
			shear(cut) {
			    if(!cut){
			      return
			    }
				uni.$u.http.post('/api/public/v5/shear/content',{
					content: cut
				}).then(res => {})
			},
			timeStamp(StatusMinute) {
			  var day = parseInt(StatusMinute / 60 / 24);
			  var hour = parseInt(StatusMinute / 60 % 24);
			  var min = parseInt(StatusMinute % 60);
			  StatusMinute = "";
			  if (day > 0) {
			    StatusMinute = day + "天";
			  }
			  if (hour > 0) {
			    StatusMinute += hour + "小时";
			  }
			  if (day === 0 && min > 0) {
			    StatusMinute += parseFloat(min) + "分钟";
			  }
			  return StatusMinute;
			},
			disconnected() {
				console.log('disconnected');
			},
			connected() {
				console.log('connected');
			},
			retry() {
				console.log('retry');
				this.init();
			},
			//登录
			login() {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			register() {
				uni.navigateTo({
					url: '/pages/register/index'
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.container{
		width: 100vw;
		height: 100vh;
		background-color: #101010;
	}
	.swiper{
		height: 100vh;
	}
	.swiper-item{
		color: #FFFFFF;
	}
	.my-phone-wrap{
		position: absolute;
		top: calc(50% - 96rpx);
		left: 50%;
		transform: translate(-50%, -50%);
		width: 522rpx;
		height: 908rpx;
		background: #15191F;
		margin: auto;
		margin-top: 30rpx;
		.phone-img-bg{
			width: 100%;
			height: 100%;
		}
		.no-login-wrap{
			width: 92%;
			height: 880rpx;
			background: #15191F;
			border-radius: 30rpx;
			border: 4% solid #1E293D;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.no-login{
				width: 422rpx;
				height: 264rpx;
			}
			.plase-user{
				margin-top: 36rpx;
				font-size: 28rpx;
				color: #FFFFFF;
			}
			.plase-login{
				margin-top: 12rpx;
				font-size: 28rpx;
				color: #FFFFFF;
			}
			.login-text{
				margin-top: 54rpx;
				width: 336rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
				border-radius: 20rpx;
				color: #FFFFFF;
			}
			.register-text{
				margin-top: 36rpx;
				width: 336rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				border-radius: 20rpx;
				border: 2rpx solid #0080FF;
			}
		}
		.phone-img{
			width: 494rpx;
			height: 880rpx;
			border-radius: 30rpx;
			position: absolute;
			top: 1vh;
			left: 14rpx;
		}
		.phone-img-wrap{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.phone-img-overdue{
			width: 372rpx;
			height: 300rpx;
		}
		.overdue-text{
			width: 100%;
			font-size: 28rpx;
			text-align: center;
			color: rgba(255, 255, 255, 0.8);
		}
	}
	.camvas-head {
	  position: absolute;
	  top: 14rpx;
	  height: 110rpx;
	  width: calc(100% - 32rpx);
	  background: rgba(0, 0, 0, 0.2);
	  color: rgba(255, 255, 255, 1);
	  border-radius: 40rpx 40rpx 0 0;
	  box-sizing: border-box;
	  padding: 0 24rpx;
	  left: 16rpx;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	}
	
	.th_right {
	  margin-left: 20rpx;
	}
	
	.th_left image {
	  width: 60rpx;
	  height: 60rpx;
	}
	
	.battery-wrap{
		height: 110rpx;
		line-height: 110rpx;
		.battery-icon{
			width: 64rpx;
			height: 50rpx;
		}
	}
	
	.th_renew {
	  width: 96rpx;
	  height: 44rpx;
	  line-height: 44rpx;
	  text-align: center;
	  background: rgba(245, 245, 245, 0);
	  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
	  border-radius: 26rpx;
	  border: 2rpx solid #FF9F3A;
	  font-size: 26rpx;
	  font-weight: 500;
	  color: #FF9F3A;
	}
	
	.tophead {
	  display: flex;
	}
	
	.thl-font {
	  display: flex;
	  align-items: center;
	  font-size: 24rpx;
	  font-weight: 600;
	  color: #FFFFFF;
	  margin-bottom: 4rpx;
	}
	
	.w34h32{
		width: 34rpx;
		height: 32rpx;
		margin-right: 6rpx;
	}
	
	.thl-time {
	  font-size: 20rpx;
	  color: #FFFFFF;
	}
	.reds{
		color: #F04646;
	}
	.ear{
		width: 14rpx;
		height: 160rpx;
		position: fixed;
		left: -14rpx;
		top: 20%;
		transform: translateY(-50%);
		.ear-img{
			width: 100%;
			height: 100%;
		}
	}
	.left{
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		left: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		.left-img{
			width: 100%;
			height: 100%;
		}
	}
	.right{
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		right: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		.right-img{
			width: 100%;
			height: 100%;
		}
	}
	.no-phone-wrap{
		position: fixed;
		top: 46%;
		left: 50%;
		transform: translate(-50%, -50%);
		.no-phone-img{
			width: 300rpx;
			height: 308rpx;
		}
		.buy-phone{
			width: 336rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
			border-radius: 20rpx;
		}
	}
	.phone-tip-wrap{
		height: 100vh;
		position: fixed;
		z-index: 9999;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.6);
		.phone-tip-container{
			margin-top: calc(26% + 42rpx);
			margin-left: 50rpx;
			.ear-tip{
				width: 236rpx;
				height: 272rpx;
			}
			.headset{
				width: 560rpx;
				height: 518rpx;
				margin-top: 34rpx;
				margin-left: 46rpx;
			}
			.join-phone{
				width: 500rpx;
				height: 90rpx;
				margin-top: 34rpx;
				margin-left: 76rpx;
			}
		}
	}
	.battery-tip-wrap{
		width: 100%;
		height: 100vh;
		position: fixed;
		z-index: 9999;
		top: 0;
		right: 0;
		background-color: rgba(0,0,0,0.6);
		.battery-tip-container{
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			margin-top: calc(30% - 72rpx);
			margin-right: 80rpx;
			.battery-tip{
				width: 176rpx;
				height: 260rpx;
				margin-right: 46rpx;
			}
			.battery{
				width: 560rpx;
				height: 518rpx;
				margin-top: 54rpx;
			}
			.join-battery{
				width: 500rpx;
				height: 90rpx;
				margin-top: 54rpx;
				margin-right: 36rpx;
			}
		}
	}
</style>
