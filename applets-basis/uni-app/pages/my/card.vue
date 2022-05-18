<template>
	<view class="container">
		<u-tabs :list="list" lineColor="#3B7FFF" activeStyle="color:#3B7FFF" @click="tabHandle"></u-tabs>
		<scroll-view class="card-list" :scroll-y="true" @scrolltolower="onReachBottoms">
			<view v-for="(item, index) in cartList" :key="index">
				<cardItem :dataObj="item" :status="status"></cardItem>
			</view>
			<view class="loading-text" v-if="cartList.length > 4">已经到底了～</view>
		</scroll-view>
		<view class="no-card-wrap" v-if="noData">
			<image class="no-card-img" src="/static/my/noCard.png"></image>
			<view class="no-card-text">还没有{{['未使用','使用中','已使用','已过期'][status]}}的优惠券哦～</view>
		</view>
		<u-no-network
			@disconnected="disconnected"
			@connected="connected"
			@retry="retry"
		></u-no-network>
	</view>
</template>

<script>
	import cardItem from './components/card-item.vue'
	export default {
		components:{
			cardItem
		},
		data() {
			return {
				cartList:[],
				list: [
					{
						name: '未使用'
					}, {
						name: '使用中',
					}, {
						name: '已使用',
					}, {
						name: '已过期'
					}
				],
				status: 0,
				pageNum: 1,
				noData: false
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			onReachBottoms(){
				
			},
			tabHandle(e){
				if(this.status === e.index){
					return
				}
				this.status = e.index;
				this.cartList = [];
				this.getList();
			},
			getList(){
				uni.$u.http.get(`/api/pay/v3/invitation/client/getCoupon`,{
					data: {
						pageNum: this.pageNum,
						pageSize: 10,
						list: ['effective','useing','use','invalid'][this.status]
					}
				}).then(res => {
					const type = ['effective','useing','use','invalid'][this.status]
					const resData = res[type];
					if (resData && resData.length > 0) {
						this.cartList = [...this.cartList, ...resData];
					}
					this.noData = this.cartList.length === 0 ? true : false;
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
		.card-list{
			height: calc(100vh - 200rpx);
			padding-bottom: 10rpx;
			.loading-text{
				padding: 30rpx 0;
				color: #FFFFFF;
				font-size: 26rpx;
				text-align: center;
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
