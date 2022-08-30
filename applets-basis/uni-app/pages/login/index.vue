<template>
	<view class="container">
		<view class="top-img-wrap">
			<image class="top-img" src="../../static/login/top-bg.png"></image>
		</view>
		<view class="back-wrap" @click="backHandle">
			<image class="back" src="../../static/login/back.png"></image>
		</view>
		<view class="logo-wrap">
			<image class="logo-img" src="../../static/login/logo.png"></image>
			<view class="logo-text">登录账号</view>
		</view>
		<view class="login-wrap">
			<view class="login-item">
				<input class="ipt" style="display:none" placeholder="请输入11位手机号码" v-model="phone" maxlength="11" @input="iptHandle1" type="number" />
				<input class="ipt" placeholder="请输入11位手机号码" v-model="phone" maxlength="11" @input="iptHandle1" type="number" />
				<image class="del" v-show="phone.length" src="../../static/login/del.png" @click="delPhone"></image>
			</view>
			<view class="login-item">
				<input class="ipt" style="width: 426rpx;" type="text" :password="showPassword" placeholder="请输入8-16位密码" v-model="password" maxlength="16" @input="iptHandle2" />
				<image class="del del-password" v-show="password.length" src="../../static/login/del.png" @click="delPassword"></image>
				<image class="eye" :src="showPassword ? '../../static/login/eye.png' : '../../static/login/eye-show.png'" @click="eyeHandle"></image>
			</view>
			<u-button
				class="login-btn"
			    loadingText="登录中..."
			    size="normal"
				:loading="loading"
			    loadingMode="circle"
				:class="{'activeBth': isShow}"
				@click="login"
			>登录</u-button>
		</view>
		<view class="bottom-img-wrap">
			<image class="bottom-img" src="../../static/login/bottom-bg.png"></image>
		</view>
		<u-no-network
			@disconnected="disconnected"
			@connected="connected"
			@retry="retry"
		></u-no-network>
	</view>
</template>

<script>
	const Encrypt = require('../../util/jsencrypt.js');
	import md5 from "../../util/md5";
	import urlObj from '../../common/config.js'
	export default {
		data() {
			return {
				number: 1,
				urlObj: {},
				loading: false,
				publicKey: '',
				phone: '',
				password: '',
				showPassword: true,
				isShow: false,
				uuid: '',
				platform: ''
			}
		},
		onLoad() {
			this.getDiskInfo();
		},
		methods: {
			delPhone() {
				this.phone = '';
				this.isShow = false;
			},
			delPassword() {
				this.password = '';
				this.isShow = false;
			},
			eyeHandle() {
				this.showPassword = !this.showPassword;
			},
			backHandle(val) {
				uni.navigateTo({
					url: '../register/index'
				})
			},
			iptHandle1(e) {
				if (this.phone && this.password) {
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			},
			iptHandle2(e) {
				let password = e.detail.value;
				this.$nextTick(() => {
					this.password = password.replace(/[^\w\/]/ig,'');
				})
				if (this.phone && this.password) {
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			},
			// 获取公钥
			getDiskInfo() {
				uni.request({
				    url: `${urlObj.baseUrl}/api/user/v1/client/login/getPbKey`,
					method: 'POST',
				    success: (res) => {
				        if(res.data.status == 0){
				        	this.publicKey = res.data.data.publicKey
				        }
				    }
				});
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
				if(this.password.length < 8){
					this.loading = false;
					return uni.$u.toast('密码长度为8-16位！');
				}
				uni.getSystemInfo({
					success: (res) => {
						this.uuid = res.deviceId;
						this.platform = res.platform;
					}
				});
				// console.log(588, this.uuid, this.platform)
				const encrypt = new Encrypt.JSEncrypt();
				encrypt.setPublicKey(this.publicKey) 
				var encrypted = encrypt.encrypt(md5(this.password));
				
				// --------- Start test 强制登录 ------------
				let data = {token: '111111', username: 'bob'};
				uni.setStorageSync("token", data.token);
				wx.setStorageSync("username", data.username);
				this.visitDetailed(this.phone);
				uni.$u.toast('登录成功！');
				setTimeout(() => {
					this.phone = '';
					this.password = '';
					uni.navigateTo({
						url: '../index/index'
					})
				},500)
				return false;
				// --------- End test 强制登录 ------------
				
				uni.request({
				    url: `${urlObj.baseUrl}/api/user/v1/client/login`,
					method: 'POST',
					data: {
						phone: this.phone,
						password: encrypted,
						client: 7,
						uuid: this.uuid
					},
				    success: (res) => {
						setTimeout(() => {
							this.loading = false;
						}, 1000)
				        if(res.data.status == 0){
							let data = res.data.data;
							uni.setStorageSync("token", data.token);
							wx.setStorageSync("username", data.username);
							this.visitDetailed(this.phone);
							uni.$u.toast('登录成功！');
							setTimeout(() => {
								this.phone = '';
								this.password = '';
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
			.back{
				width: 100%;
				height: 100%;
			}
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
		}
		.login-wrap{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 20rpx;
			.login-item{
				width: 560rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
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
				.del-password{
					width: 40rpx;
					height: 40rpx;
					margin-right: 24rpx;
				}
				.eye{
					width: 40rpx;
					height: 40rpx;
					margin-right: 30rpx;
				}
			}
			.login-btn{
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
