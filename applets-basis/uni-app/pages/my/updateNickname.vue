<template>
	<view class="container">
		<uni-nav-bar title="修改昵称" height="100rpx" leftIcon="arrow-left" color="#fff" backgroundColor="#1D1E1F" fixed :border="false" @clickLeft="returnBack"></uni-nav-bar>
		<view class="nickname-wrap">
			<view class="nickname-item">
				<input class="ipt" placeholder="请输入昵称" v-model="nickname" maxlength="12" @input="iptHandle" />
				<image class="del" v-show="nickname.length" src="../../static/login/del.png" @click="delNickname"></image>
			</view>
			<view class="nickname-tip">昵称限制12个字符</view>
			<view class="nickname-btn" :class="{'activeBth': isShow}" @click="upadtePersonInfo">确认</view>
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
				nickname: '',
				isShow: false
			}
		},
		onLoad(options) {
			this.nickname = options.name;
			this.iptHandle();
		},
		methods: {
			returnBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			delNickname(){
				this.nickname = '';
				this.isShow = false;
			},
			iptHandle() {
				if (this.nickname) {
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			},
			upadtePersonInfo(){
				if(!this.isShow){
					return
				}
				uni.$u.http.put('/api/user/v1/client/personalInfo/updatePersonalInfo',{
					surfaceName: this.nickname
				}).then(res => {
					uni.$u.toast('昵称修改成功');
					setTimeout(() => {
						uni.navigateBack();
					},1500)
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
		.nickname-wrap{
			display: flex;
			flex-direction: column;
			align-items: center;
			.nickname-item{
				width: 660rpx;
				height: 110rpx;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				color: #FFFFFF;
				background: #2C2C2E;
				margin-top: 30rpx;
				border-radius: 20rpx;
				font-size: 28rpx;
				.ipt{
					width: 584rpx;
					caret-color: #3B7FFF;
					color: rgba(255, 255, 255, 0.8);
					font-weight: 500;
				}
				.del{
					width: 40rpx;
					height: 40rpx;
					margin-right: 30rpx;
				}
			}
			.nickname-tip{
				align-self: start;
				margin-left: 60rpx;
				margin-top: 20rpx;
				font-size: 24rpx;
				color: rgba(255, 255, 255, 0.4);
			}
			.nickname-btn{
				width: 690rpx;
				height: 110rpx;
				line-height: 100rpx;
				text-align: center;
				margin-top: 72rpx;
				background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
				border-radius: 20rpx;
				font-weight: 500;
				font-size: 32rpx;
				color: #FFFFFF;
				opacity: 0.35;
			}
			.activeBth{
				opacity: 1;
			}
		}
	}
</style>