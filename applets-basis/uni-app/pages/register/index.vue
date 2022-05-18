<template>
	<view class="container">
		<view class="top-img-wrap">
			<image class="top-img" src="../../static/login/top-bg.png"></image>
		</view>
		<view class="back-wrap"></view>
		<view class="logo-wrap">
			<image class="logo-img" src="../../static/login/logo.png"></image>
			<view class="logo-text">欢迎来到YB</view>
			<view class="logo-tip">首次登录手机号将在验证后生成新账号</view>
		</view>
		<view class="register-wrap">
			<view class="register-item">
				<input class="ipt" placeholder="请输入11位手机号码" maxlength="11" type="number" v-model="phone" @input="iptHandle"/>
				<image class="del" v-show="phone.length" src="../../static/login/del.png" @click="delPhone"></image>
			</view>
			<view class="register-item">
				<input placeholder="请输入验证码" type="number" maxlength="6" v-model="code" @input="iptHandle" />
				<image class="del" v-show="code.length" src="../../static/login/del.png" @click="delCode"></image>
				<text class="check-code" @click="getCode">{{codeNumber}}<text v-if="!clickStatus">s</text></text>
			</view>
			<view class="register-item">
				<input class="ipt" placeholder="请输入邀请码（非必填）" maxlength="8" v-model="inviteCode" @input="iptHandle2" />
				<image class="del" v-show="inviteCode.length" src="../../static/login/del.png" @click="delInviteCode"></image>
			</view>
			<u-button
				class="register-btn"
			    loadingText="注册中..."
			    size="normal"
				:loading="loading"
			    loadingMode="circle"
				:class="{'activeBth': isShow}"
				@click="login"
			>立即注册</u-button>
			<view class="go-register-row">已有账号，密码<text class="go-register" @click="goLogin">登录</text></view>
		</view>
		<!-- <view class="other-register-wrap">
			<view class="other-register-item">
				<image class="other-icon-img" src="../../static/register/weChat.png"></image>
				<text class="other-icon-text" @click="wxLogin">微信登录</text>
			</view>
			<view class="other-register-item qq-item">
				<image class="other-icon-img" src="../../static/register/qq.png"></image>
				<text class="other-icon-text">QQ登录</text>
			</view>
		</view> -->
		<view class="bottom-img-wrap">
			<image class="bottom-img" src="../../static/login/bottom-bg.png"></image>
		</view>
	</view>
</template>

<script>
	import urlObj from '../../common/config.js'
	export default {
		data() {
			return {
				loading: false,
				flag: true,
				timers: null,
				phone: '',
				code: '',
				inviteCode: '',
				codeNumber: '获取验证码',
				clickStatus: true,
				timer: null,
				isShow: false,
				uuid: '',
				platform: ''
			}
		},
		methods: {
			delPhone() {
				this.phone = '';
				this.isShow = false;
			},
			delCode() {
				this.code = '';
				this.isShow = false;
			},
			delInviteCode() {
				this.inviteCode = '';
			},
			wxLogin(){
			    window.location.href=`https://open.weixin.qq.com/connect/qrconnect?appid=wxbdc5610cc59c1631&redirect_uri=https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do&response_type=code&scope=snsapi_login&state=3d6be0a4035d839573b04816624a415e#wechat_redirect `
			},
			iptHandle() {
				if (this.phone && this.code) {
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			},
			iptHandle2(e) {
				let inviteCode = e.detail.value;
				this.$nextTick(() => {
					this.inviteCode = inviteCode.replace(/[^\w\/]/ig,'');
				})
			},
			backHandle(val) {
				uni.navigateTo({
					url: '../index/index'
				})
			},
			getCode() {
				this.stopManyClick(() => {
					if (this.phone == '') {
						uni.$u.toast('请输入手机号码');
						return false;
					}
					if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
						uni.$u.toast('手机号码有误，请重填');
						return false;
					}
					if(this.clickStatus){
						uni.request({
						    url: `${urlObj.baseUrl}/api/message/v5/phone/send`,
							method: 'post',
							data: {
								type: 'common',
								authorizationType: 4,
								phone: this.phone
							},
						    success: (res) => {
						        if(res.data.status == 0){
									this.clickStatus = false;
									this.codeNumber = 60;
									this.timer = setInterval(() => {
										this.codeNumber--;
										if(this.codeNumber === 0){
											this.clickStatus = true;
											this.codeNumber = '获取验证码';
											clearInterval(this.timer);
										}
									}, 1000)
									uni.$u.toast('获取成功！');
						        } else {
									uni.$u.toast(res.data.msg);
								}
						    }
						});
					}
				})
			},
			login() {
				if(!this.isShow){
					return
				}
				this.loading = true;
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){
					this.loading = false;
					return uni.$u.toast('手机号格式有误！');
				}
				if(this.code.length < 6){
					this.loading = false;
					return uni.$u.toast('验证码长度为6位！');
				}
				uni.getSystemInfo({
					success: (res) => {
						this.uuid = res.deviceId;
						this.platform = res.platform;
					}
				});
				uni.request({
				    url: `${urlObj.baseUrl}/api/user/v5/client/register/forH5`,
					method: 'post',
					header: {
						client: 7
					},
					data: {
						code: this.code,
						inviteCode: this.inviteCode,
						phone: this.phone,
						uuid: this.uuid
					},
				    success: (res) => {
						setTimeout(() => {
							this.loading = false;
						}, 1000)
				        if(res.data.status == 0){
							let data = res.data.data;
							let username = wx.getStorageSync("username");
							if(username == data.username){
								uni.setStorageSync("noNewUser", true);
							} else {
								uni.setStorageSync("noNewUser", false);
							}
							uni.setStorageSync("token", data.token);
							wx.setStorageSync("username", data.username);
							this.visitDetailed(this.phone);
							this.phone = '';
							this.code = '';
							uni.$u.toast('登录成功！');
							setTimeout(() => {
								uni.navigateTo({
									url: '../index/index'
								})
							},500)
				        } else if(res.data.status == 2101) {
							uni.showModal({
								title: '',
								content: '此账号已注销，请前往APP重新激活',
								cancelText: '取消',
								confirmText: '下载APP',
								success: function(res) {
									if (res.confirm) {
										if(this.platform === 'ios'){
											location.href = 'https://www.pgyer.com/gemini6?timestamp=' + Math.random();
										} else {
											location.href = 'http://www.androidscloud.com/suanchou?timestamp=' + Math.random();
										}
									}
								}
							});
						} else {
							uni.$u.toast(res.data.msg);
						}
				    }
				});
			},
			visitDetailed(phone){
				uni.getSystemInfo({
					success: function (res) {
						uni.$u.http.post('/api/user/v5/visitDetailed/operationVisitDetailed',{
							uuid: res.deviceId,
							operationType: 1,
							phoneNumber: phone
						},{
							header: {
								client: 7,
								versions: 5.1,
								'Authorization': uni.getStorageSync('token')
							}
						}).then(res => {
							wx.setStorageSync("loginId", res);
						})
					}
				});
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
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
			},
			//防止提示一秒内重复显示
			stopManyClick(fn) {
				if (this.flag) {
					fn();
				}
				this.flag = false;
				if(this.timers){clearTimeout(this.timers)}
				this.timers = setTimeout(() => {this.flag = true}, 1500);
			}
		}
	}
</script>

<style lang="scss">
	.container{
		min-height: 100vh;
		background-color: #101010;
		position: relative;
		.top-img-wrap{
			width: 750rpx;
			height: 200rpx;
			position: absolute;
			top: 0;
			.top-img{
				width: 100%;
				height: 100%;
			}
		}
		.back-wrap{
			width: 40rpx;
			height: 40rpx;
			padding: 30rpx 0 0 50rpx;
		}
		.logo-wrap{
			padding: 50rpx 0 0 80rpx;
			.logo-img{
				width: 120rpx;
				height: 120rpx;
			}
			.logo-text{
				margin-top: 30rpx;
				font-size: 34rpx;
				color: #FFFFFF;
			}
			.logo-tip{
				margin-top: 30rpx;
				font-size: 26rpx;
				color: #999999;
			}
		}
		.register-wrap{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 20rpx;
			.register-item{
				width: 560rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				color: #FFFFFF;
				background: #2C2C2E;
				margin-top: 30rpx;
				border-radius: 20rpx;
				font-size: 28rpx;
				.ipt{
					width: 490rpx;
				}
				.del{
					width: 40rpx;
					height: 40rpx;
					margin-right: 30rpx;
				}
			}
			.check-code{
				width: 180rpx;
				text-align: right;
				margin-right: 30rpx;
				font-size: 28rpx;
				color: rgba(59, 127, 255, 0.6);
			}
			.register-btn{
				width: 590rpx;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				margin-top: 24rpx;
				background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
				border: none;
				border-radius: 20rpx;
				font-size: 32rpx;
				color: #FFFFFF;
				opacity: 0.35;
			}
			.activeBth{
				opacity: 1;
			}
			.go-register-row{
				margin-top: 40rpx;
				color: rgba(255,255,255,0.7);
				.go-register{
					color: rgba(255,255,255,1);
					text-decoration: underline;
				}
			}
		}
		.other-register-wrap{
			display: flex;
			justify-content: center;
			margin-top: 64rpx;
			.other-register-item{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 240rpx;
				height: 84rpx;
				background: linear-gradient(90deg, #0A1938 0%, #21102E 100%);
				border-radius: 20rpx;
				.other-icon-img{
					width: 40rpx;
					height: 40rpx;
				}
				.other-icon-text{
					margin-left: 10rpx;
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.5);
				}
			}
			.qq-item{
				margin-left: 40rpx;
			}
		}
		.bottom-img-wrap{
			position: absolute;
			bottom: 0;
			right: 0;
			.bottom-img{
				width: 268rpx;
				height: 200rpx;
			}
		}
	}
</style>
