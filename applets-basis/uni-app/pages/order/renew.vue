<template>
	<view class="u-page">
		<uni-nav-bar :title="`续费${buyTypeTitle[buyVipType]}TODO`" height="100rpx" leftIcon="arrow-left" color="#fff" backgroundColor="#1D1E1F" fixed :border="false" @clickLeft="returnBack"></uni-nav-bar>
		<view class="meal-icon">
			<view class="meal-icon-in">
				<view class="frn">
					<image class="left-top-icon" src="../../static/order/zhuangshi_y_icon.png" mode=""></image>
					<image class="card-icon" src="../../static/order/kapian_tb_icon.png" mode=""></image>
					<image class="text-icon" v-if="current===0" src="../../static/order/xingdong_w_icon.png" mode="">
					</image>
					<image class="text-icon" v-if="current===1" src="../../static/order/xingyao_w_icon.png" mode="">
					</image>
					<image class="text-icon" v-if="current===2" src="../../static/order/wuji_w_icon.png" mode="">
					</image>
					<image class="text-icon" v-if="current===3" src="../../static/order/pro_w_icon.png" mode=""></image>
					<image class="show-icon" v-if="!isShow" src="../../static/order/zhankai_icon.png" mode=""
						@click="isShow=true"></image>
					<image class="show-icon" v-if="isShow" src="../../static/order/shouqi_k_icon.png" mode=""
						@click="isShow=false"></image>
				</view>
				<view v-if="isShow" class="service-icon-list">
					<view class="service-icon-list-title">
						增值服务7大特权功能
					</view>
					<view>
						<view v-for="item in mealFunList" :key="item.title" class="f4">
							<image class="wh70" :src="mealFunStr.includes(item.title) ? item.you : item.wu" mode="">
							</image>
							<view :class="mealFunStr.includes(item.title) ? 'txt1' : 'txt1 cfff'">{{item.title}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="meal-num">
			<text class="txt2">续费的手机数量</text>
			<view class="meal-num-bar" @click="showMobile">
				{{userCardIdStr.length}}台
				<uni-icons type="right" color="rgba(255, 255, 255, 0.8)" style="float: right;"></uni-icons>
			</view>
		</view>
		<view class="meal-detail-list">
			<view class="txt2">
				TODO套餐
			</view>
			<view :class="isExpand ? 'meal-detail-container' : 'meal-detail-container h448'">
				<view v-for="(item, index) in mealList" :key="item.id"
					:class="active === index ? 'meal-detail-item bactive' : 'meal-detail-item'"
					@click="handleClickMeal(item, index)">
					<view :class="active === index ? 'meal-detail-line active' : 'meal-detail-line'"></view>
					<view v-if="item.preferentialContent.length" class="meal-detail-tip">
						{{item.preferentialContent}}
					</view>
					<view class="txt3">{{item.day}}天</view>
					<view class="cFF4C59">
						<text class="fs28">￥</text>
						<text class="fs48">{{Math.trunc(item.actualPrice)}}</text>
						<text class="fs36">.{{item.actualPrice.toFixed(2).toString().split('.')[1]}}</text>
					</view>
					<view class="txt4">{{item.originalPrice ? '￥' + Number(item.originalPrice).toFixed(2) : ''}}</view>
					<view class="txt5">{{item.customStatement ? item.customStatement : '不限次数'}}</view>
					<view v-if="item.giveStarNum" class="btn1">赠送{{item.giveStarNum}}星币</view>
				</view>
			</view>
			<view class="meal-detail-bottom">
				<view class="txt6" @click="isExpand = !isExpand">
					<uni-icons :type="isExpand ? 'top' : 'bottom'" color="#fff" size="28rpx"
						style="margin-right: 10rpx;"></uni-icons>
					{{isExpand ? '收起' : '展开更多套餐'}}
				</view>
			</view>
		</view>		
		<view v-show="mealList.length && mealList[active].support" class="meal-coupon" @click="showCoupon()">
			<view class="frc">
				<image class="wh40" src="../../static/order/quan_icon.png" mode=""></image>
				<text class="txt8">优惠券</text>
			</view>
			<view class="frc">
				<text v-if="couponObj.id" class="txt9">{{couponObj.couponType == 1 ? '-¥' : ''}}{{couponObj.couponType == 1 ? couponObj.couponValue : couponObj.deductionPrice}}{{couponObj.couponType == 2 ? '折' : ''}}</text>
				<text v-else class="txt9">不使用优惠券</text>
				<uni-icons type="right" color="#fff" size="28rpx"></uni-icons>
			</view>
		</view>
		<view class="meal-pay">
			<view class="txt2">
				支付方式
			</view>
			<view class="mr-12">
				<view v-for="item in payTypeList" :key="item.payActive"
					:class="payActive === item.payActive ? 'meal-pay-item active' : 'meal-pay-item'"
					@click="changePayActive(item)">
					<view>
						<image class="wh40" :src="payActive === item.payActive ? item.active : item.unactive" mode="">
						</image>
						<text>{{item.text}}</text>
					</view>
					<view v-if="!item.payActive" class="txt7">{{userStarNum}}枚</view>
				</view>
			</view>
		</view>
		<view class="meal-bottom-bar">
			<text class="txt10">需支付金额:</text>
			<text v-if="payActive" class="txt11">¥</text>
			<text class="txt12">{{xbPrice}}</text>
			<text v-if="!payActive" class="txt15">星币</text>
			<view class="meal-bottom-btn" @click="debounce">
				确定购买
			</view>
		</view>
		<uni-popup ref="popup_limit" type="center" :mask-click="false" mask-background-color="rgba(0, 0, 0, 0.65)">
			<view class="popup-content">
				<view class="txt13">
					购买数量超限
				</view>
				<view class="txt14">
					一个账号最多可以同时购买60台TODO。
				</view>
				<view class="pop-confirm" @click="hideLimit">
					好的
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup_coupon_tip" type="center" mask-background-color="rgba(0, 0, 0, 0.65)"
			background-color="##292A2E">
			<view class="popup-content">
				<view class="txt13">
					优惠券已过期
				</view>
				<view class="txt14">
					您选择的优惠券已过期
				</view>
				<view class="pop-confirm">
					确定
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup_coupon" type="bottom" mask-background-color="rgba(0, 0, 0, 0.65)" :mask-click="false">
			<view class="popup-coupon-content">
				<view class="popup-coupon-top">
					<text class="txt2">选择优惠券</text>
					<text class="cannel-btn" @click="cancelCoupon">取消</text>
				</view>
				<view v-if="cartList.length">
					<view class="coupon-view">
						<coupon v-for="(item, index) in cartList" :key="index" :select="couponObj.id===item.id" :dataObj="item" @setCouponObj="setCouponObj"></coupon>
					</view>
					<view class="btn-coupon" @click="hideCoupon">
						确认
					</view>
				</view>
				<view v-else>
					<image class="no-coupon-img" src="../../static/order/youhuiquan_pic.png" mode=""></image>
					<view class="no-coupon-txt">还没有优惠券哦~</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup_mobile" type="bottom" mask-background-color="rgba(0, 0, 0, 0.65)" :mask-click="false">
			<view class="popup-mobile-content">
				<view class="popup-coupon-top">
					<text class="txt2">已选择{{userCardIdStr.length}}台TODO</text>
					<image v-if="userCardIdStr.length===diskInfo.length" class="round-icon" style="margin-left: 50rpx;vertical-align: middle;" src="../../static/order/danxuan_xuan_icon.png" mode=""></image>					
					<image v-else class="round-icon" @click="handleSelectAll" style="margin-left: 50rpx;vertical-align: middle;" src="../../static/order/duoxuan_wei_icon.png" mode=""></image>					
					<text style="font-size: 24rpx;margin-left: 10rpx;color: rgba(255, 255, 255, 0.6);">全选</text>
					<text class="cannel-btn" @click="cancelMobile">取消</text>
				</view>
				<scroll-view scroll-y="true" class="coupon-view" style="height: 666rpx;">
					<view class="mobile-item" :key="item.id" v-for="item in diskInfo" @click="handleClickMobile(item.id)">
						<view style="display: flex;align-items: center;">
							<image class="wh68" :src="icons[item.buyVipType]" mode=""></image>
							<view style="margin-left: 14rpx;">
								<view class="txt16">{{item.diskName}}</view>
								<view class="txt17 cF04646" v-if="item.validTime === 0"><image class="wh25" src="../../static/my/icon-time.png"></image>{{'已过期' }}</view>
								<view :class="item.validTime > 4320 ? 'txt17' : 'txt17 cF04646'" v-else><image class="wh25" src="../../static/my/icon-time.png"></image>{{item.validTime | timeStamp(item.validTime) }}</view>
							</view>
						</view>
						<image v-if="userCardIdStr.includes(item.id)" class="round-icon" src="../../static/order/danxuan_xuan_icon.png" mode=""></image>
						<image v-else class="round-icon" src="../../static/order/duoxuan_wei_icon.png" mode=""></image>
					</view>
				</scroll-view>
				<view class="btn-coupon" @click="cancelMobile">
					确认
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import coupon from './component/coupon.vue'
	const buyType = {
		'VIP': 0,
		'SVIP': 1,
		'STAR': 2,
		'STARPRO': 3
	}
	const products = {
		0: '10',
		1: '20',
		2: '30',
		3: '40'
	}
	var RSA = require('../../util/wx_rsa.js');
	export default {
		components: {
			coupon
		},
		data() {
			return {
				timer: null,
				buyTypeTitle: {
					'VIP': 'TC-1',
					'SVIP': 'TC-2',
					'STAR': 'TC-3',
					'STARPRO': 'TC-4'
				},
				couponObj: {id: 0},
				cartList: [],
				icons: {
					'VIP': '../../static/my/vip.png',
					'SVIP': '../../static/my/svip.png',
					'STAR': '../../static/my/star.png',
					'STARPRO': '../../static/my/pro.png'
				},
				current: 1,
				isShow: false,
				mealList: [],
				mealFunList: [{
						you: '../../static/order/huanji_you_icon.png',
						wu: '../../static/order/huanji_wu_icon.png',
						title: '一键换机'
					},
					{
						you: '../../static/order/canshu_you_icon.png',
						wu: '../../static/order/canshu_wu_icon.png',
						title: '修改云机参数'
					},
					{
						you: '../../static/order/root_you_icon.png',
						wu: '../../static/order/root_wu_icon.png',
						title: 'ROOT开关'
					},
					{
						you: '../../static/order/sxt_you_icon.png',
						wu: '../../static/order/sxt_wu_icon.png',
						title: '云机摄像头'
					}
					// ,{
					// 	you: '../../static/order/qianyi_you_icon.png',
					// 	wu: '../../static/order/qianyi_wu_icon.png',
					// 	title: '数据迁移'
					// },
					// {
					// 	you: '../../static/order/dingwei_you_icon.png',
					// 	wu: '../../static/order/dingwei_wu_icon.png',
					// 	title: '虚拟定位'
					// }
				],
				payTypeList: [{
						unactive: '../../static/order/weixin_wei_icon.png',
						active: '../../static/order/weixin_xuan_icon.png',
						text: '微信',
						payActive: 2
					},
					{
						unactive: '../../static/order/zhifubao_wei_icon.png',
						active: '../../static/order/zhifubao_xuan_icon.png',
						text: '支付宝',
						payActive: 1
					},
					{
						unactive: '../../static/order/xingbi_wei_icon.png',
						active: '../../static/order/xingbi_xuan_icon.png',
						text: '星币',
						payActive: 0
					},
				],
				isExpand: false,
				payActive: 2,
				phoneRemainQuantity: 0,
				active: 0,
				xbPrice: 0,
				userStarNum: 0,
				userCardId: 0,
				buyVipType: 'SVIP',
				userCardIdStr: [],
				diskInfo: [],
				mealFunStr: ''
			}
		},
		onShow: function(){
			this.userCardId = uni.getStorageSync('userCardId')
			this.userCardIdStr.push(uni.getStorageSync('userCardId'))
			this.buyVipType = uni.getStorageSync('buyVipType')
			this.current = buyType[uni.getStorageSync('buyVipType')]
			this.getMealInfo()
			this.getStarNum()
			this.getDiskInfo()
		},
		filters: {
			timeStamp: function (StatusMinute) {
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
			}
		},
		methods: {
			returnBack() {
				uni.navigateTo({
				  url: "/pages/index/index"
				});
			},
			showMobile() {
				this.$refs.popup_mobile.open()
			},
			handleSelectAll() {
				this.userCardIdStr = []
				this.userCardIdStr = this.diskInfo.map(item => item.id)
			},
			handleClickMobile(id) {
				const index = this.userCardIdStr.findIndex(item => item === id)
				if (index >= 0) {
					this.userCardIdStr.splice(index, 1)
				} else {
					this.userCardIdStr.push(id)
				}
			},
			cancelMobile() {
				if(!this.userCardIdStr.length) {
					uni.showToast({
						title: '至少选择一台TODO',
						icon: 'none',
						duration: 1000
					})
					return
				}
				this.countPrice();
				if (this.payActive && this.mealList[this.active].support && this.mealList[this.active].renewalType === 1) {
					this.getUserCouponSort()
				} else {
					this.couponObj = {
						id: 0
					}
				}
				this.$refs.popup_mobile.close()
			},
			getDiskInfo() {
				uni.$u.http.get('/api/resources/v5/client/disk/info', {}).then(res => {
					this.diskInfo = res.diskInfo.filter(item => item.buyVipType === this.buyVipType && item.phoneAuthStatus !== 1 && item.authPhone !== 1);
				});
			},
			changePayActive(item) {
				this.payActive = item.payActive;
				this.countPrice();
				if (this.payActive && this.mealList[this.active].support &&  this.mealList[this.active].renewalType === 1) {
					this.getUserCouponSort()
				} else {
					this.couponObj = {
						id: 0
					}
				}
			},
			handleClickMeal(item, index) {
				this.active = index;
				this.mealFunStr = item.menuAddedService.map(item => item.serviceName).join(',');
				this.countPrice();
				this.phoneRemainQuantity = item.phoneRemainQuantity;
				if (this.payActive && item.support && item.renewalType === 1) {
					this.getUserCouponSort()
				} else {
					this.couponObj = { id: 0 }
				}
			},
			hideCoupon() {
				this.$refs.popup_coupon.close()
			},
			hideLimit() {
				this.$refs.popup_limit.close()
			},
			// 选择优惠券
			setCouponObj(id) {
				const obj = this.cartList.filter(item => item.id === id)[0]
				if(this.couponObj.id !== id && id && !obj.batchBuy && this.userCardIdStr.length > 1) {
					uni.showToast({
						title: '该优惠券不支持批量购买',
						duration: 1000,
						icon: 'none'
					})
					return
				}
				this.couponObj = this.couponObj.id === id ? {id: 0} : obj
				this.countPrice()
				this.useCoupon()
			},
			useCoupon() {
				if (this.couponObj.couponType === 1) {
					this.xbPrice = this.xbPrice - Number(this.couponObj.couponValue) > 0 ? parseFloat((this.xbPrice - Number(this.couponObj.couponValue)).toFixed(2)) : 0.01
				} else if (this.couponObj.couponType === 2) {
					this.xbPrice = parseFloat((this.xbPrice * this.couponObj.deductionPrice / 10).toFixed(2)) <= 0 ? 0.01 : parseFloat((this.xbPrice * this.couponObj.deductionPrice / 10).toFixed(2))
				}
			},
			cancelCoupon() {
				this.couponObj = {id: 0}
				this.countPrice()
				this.$refs.popup_coupon.close()
			},
			showCoupon() {
				if(!this.payActive) {
					uni.showToast({
						title: '星币支付不支持使用优惠券',
						icon: 'none',
						duration: 1000
					})
					return
				}
				if(this.payActive && this.mealList[this.active].support && this.mealList[this.active].renewalType === 1) {
					this.$refs.popup_coupon.open()
				}
			},
			// 获取TODO套餐列表
			getMealInfo() {
				uni.$u.http.get('/api/pay/v2/meal/info', {
					data: {
						"phoneType": this.buyVipType,
					}
				}).then(res => {
					this.mealList = res.list;
					this.phoneRemainQuantity = res.list[0].phoneRemainQuantity;
					this.mealFunStr = res.list[0].menuAddedService.map(item => item.serviceName).join(',');
					this.countPrice();
					if (this.payActive && res.list[0].support && res.list[0].renewalType === 1) {
						this.getUserCouponSort()
					} else {
						this.couponObj = {id: 0}
					}
				});
			},
			//立即执行版本
			debounce() {
				if (this.timer) {
					// 如果有定时器,则清除掉
					clearTimeout(this.timer)
					this.timer = null
				}
				// 设置定时器和事件
				uni.showLoading({
					mask: true
				})
				this.timer = setTimeout(() => {
					this.sureBug()
				}, 1000)
			},
			countPrice() {
				if (this.mealList[this.active].remainQuantity === -1) {
					this.xbPrice = this.payActive === 0 ? parseFloat((this.mealList[this.active].actualPrice * 10 * this.userCardIdStr.length).toFixed(2)) : parseFloat((this.mealList[this.active].actualPrice * this.userCardIdStr.length).toFixed(2))
				} else {
					if (this.payActive === 0) {
						if (this.userCardIdStr.length > this.mealList[this.active].remainQuantity) {
							this.xbPrice = this.mealList[this.active].originalPrice === '' ? parseFloat((this.mealList[this.active].actualPrice * 10 * this.userCardIdStr.length).toFixed(2)) : 
								parseFloat((((this.userCardIdStr.length - this.mealList[this.active].remainQuantity) * this.mealList[this.active].originalPrice) * 10 + (this.mealList[this.active].remainQuantity * this.mealList[this.active].actualPrice) * 10).toFixed(2))
						} else {
							this.xbPrice = parseFloat((this.mealList[this.active].actualPrice * 10 * this.userCardIdStr.length).toFixed(2))
						}
					} else { // remainQuantity == 0 时的微信支付
						if (this.userCardIdStr.length > this.mealList[this.active].remainQuantity) {
							this.xbPrice = this.mealList[this.active].originalPrice === '' ? 
								parseFloat((this.mealList[this.active].actualPrice * this.userCardIdStr.length).toFixed(2)) : parseFloat((((this.userCardIdStr.length - this.mealList[this.active].remainQuantity) * this.mealList[this.active].originalPrice) + (this.mealList[this.active].remainQuantity * this.mealList[this.active].actualPrice)).toFixed(2))
						} else {
							this.xbPrice = parseFloat((this.mealList[this.active].actualPrice * this.userCardIdStr.length).toFixed(2))
						}
					}
				}
			},
			sureBug() {
				const diskList = this.diskInfo.filter(item => this.userCardIdStr.includes(item.id))
				let taocan = {
					buyType: 2,
					couponId: this.couponObj.id,
					id: this.mealList[this.active].id,
					mealType: 0,
					phoneType: this.buyVipType,
					quantity: this.userCardIdStr.length,
					diskName: diskList.map(item => {return item.diskName}).join(','),
					userCardIdStr: this.userCardIdStr.join(',')
				}
				taocan = this.sort_ASCII(taocan);
				var sign = this.jiaqian(JSON.stringify(taocan));
				uni.$u.http.post('/api/pay/v1/order/create', taocan, {
					header: {
						sign: sign
					}
				}).then(res => {
					const myOrderNum = res.myOrderNum;
					uni.setStorageSync('myOrderNum', res.myOrderNum);
					if (this.payActive === 1) {
						uni.setStorageSync('price', this.xbPrice);
						uni.$u.http.get('/api/pay/v1/alipay/h5/spend', {
							data: {
								myOrderNum: myOrderNum
							},
							header: {
								sign: sign
							}
						}).then(res => {
							// 将接口返回的form表单显示到页面
							document.querySelector('body').innerHTML = res;
							//调用submit 方法
							 document.forms[0].submit();
						})
					} else if (this.payActive === 2) {
						uni.setStorageSync('price', this.xbPrice);
						uni.$u.http.get('/api/pay/v1/wxPay/h5/spend', {
							data: {
								myOrderNum: myOrderNum
							},
							header: {
								sign: sign
							}
						}).then(res => {
							window.location.href = res
						})
					} else if (this.payActive === 0) {
						uni.$u.http.post('/api/pay/v2/starCoins/spend', { myOrderNum: myOrderNum }, {
							header: {
								sign: this.jiaqian(JSON.stringify({ myOrderNum: myOrderNum }))
							}
						}).then(res => {
							uni.navigateTo({
								url: '/pages/order/result?active=success&starcoin=' + this.xbPrice
							});
						})
					}
					uni.hideLoading();
				})
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
			//获取星币数量
			getStarNum() {
				uni.$u.http.get("/api/pay/v5/starCoins", {}).then(res => {
					this.userStarNum = res
				})
			},
			// 获取优惠券
			getUserCouponSort() {
				uni.$u.http.post("/api/pay/v3/invitation/client/getUserCouponSort", {
					products: products[this.current],
					payAmount: this.xbPrice
				}).then(res => {
					this.cartList = res.list.filter(item => item.maxValue < this.xbPrice)
					if (this.cartList.length) {
						this.selectCoupon()
					}
				})
			},
			selectCoupon() {
				const discount = this.userCardIdStr.length > 1 ? this.cartList.filter(item => item.couponType === 2 && item.batchBuy).sort((a,b)=>{ return Number(a.deductionPrice)-Number(b.deductionPrice)}) : this.cartList.filter(item => item.couponType === 2).sort((a,b)=>{ return Number(a.deductionPrice)-Number(b.deductionPrice)})
				const deduction = this.userCardIdStr.length > 1 ? this.cartList.filter(item => item.couponType === 1 && item.batchBuy).sort((a,b)=>{ return Number(b.couponValue)-Number(a.couponValue)}) : this.cartList.filter(item => item.couponType === 1).sort((a,b)=>{ return Number(b.couponValue)-Number(a.couponValue)})
				if (deduction.length && deduction[0].couponValue > this.xbPrice) {
					this.couponObj = deduction[0]
					this.useCoupon()
					return
				}
				if (deduction.length === 0) {
					this.couponObj = discount[0]
					this.useCoupon()
					return
				}
				if (discount.length === 0) {
					this.couponObj = deduction[0]
					this.useCoupon()
					return
				}
				this.couponObj = Number(discount[0].deductionPrice) * this.xbPrice > this.xbPrice - Number(deduction[0].couponValue) ? deduction[0] : discount[0]
				this.useCoupon()
			}
		}
	}
</script>

<style>
	@import "@/static/iconfont.css";
	.wh25 {
		width: 25rpx;
		height: 25rpx;
		vertical-align: middle;
		margin-right: 20rpx;
	}
	.cF04646 {
		color: #F04646 !important;
	}
	.txt16 {
		font-size: 32rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
		line-height: 44rpx;
	}
	.txt17 {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.4);
		line-height: 34rpx;
		margin-bottom: 6rpx;
	}
	.wh68 {
		width: 68rpx;
		height: 68rpx;
	}
	.mobile-item {
		width: 612rpx;
		height: 130rpx;
		background: #292A2E;
		border-radius: 12rpx;
		margin: 24rpx auto 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx 0 20rpx;
	}
	.round-icon {
		width: 28rpx;
		height: 28rpx;
	}
	.popup-mobile-content {
		width: 702rpx;
		height: 886rpx;
		background: #1D1E1F;
		border-radius: 20rpx;
		margin: 0 auto 24rpx;
		overflow: hidden;
	}
	.meal-num-bar {
		width: 594rpx;
		height: 64rpx;
		padding: 0 24rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8rpx;
		line-height: 64rpx;
		border: 2rpx solid rgba(233, 236, 241, 0.15);
		margin-top: 20rpx;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}
	.no-coupon-txt {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.5);
		line-height: 40rpx;
		margin: 30rpx auto 0;
		text-align: center;
	}
	.no-coupon-img {
		width: 200rpx;
		height: 186rpx;
		display: block;
		margin: 280rpx auto 0;
	}
	.coupon-view {
		overflow-y: auto;
		height: 780rpx;
		position: relative;
	}
	.btn-coupon {
		width: 660rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-weight: 500;
		color: #fff;
		font-size: 32rpx;
		background: linear-gradient(90deg, #38AEFC 0%, #3B7FFF 100%);
		border-radius: 20rpx;
		margin: 20rpx auto 0;
	}
	.txt1.cfff {
		color: rgba(255, 255, 255, 0.4);
	}

	.txt15 {
		font-size: 26rpx;
		font-weight: 600;
		color: #FF2232;
		line-height: 36rpx;
	}

	.cannel-btn {
		float: right;
		color: rgba(255, 255, 255, 0.5);
		font-size: 28rpx;
	}

	.popup-coupon-top {
		height: 92rpx;
		background: #2E2F2F;
		line-height: 92rpx;
		padding: 0 40rpx;
		border-bottom: 2rpx solid rgba(255, 255, 255, 0.08);
	}

	.popup-coupon-content {
		width: 702rpx;
		height: 1000rpx;
		background: #1D1E1F;
		border-radius: 20rpx;
		margin: 0 auto 24rpx;
		overflow: hidden;
	}

	.pop-confirm {
		height: 106rpx;
		line-height: 106rpx;
		text-align: center;
		border-top: 2rpx solid rgba(255, 255, 255, 0.08);
		font-size: 32rpx;
		font-weight: 500;
		color: #3B7FFF;
		bottom: 0;
		position: absolute;
		width: 100%;
		background: #292A2E;
	}

	.txt13 {
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 44rpx;
		text-align: center;
		margin-top: 60rpx;
	}

	.txt14 {
		width: 520rpx;
		height: 84rpx;
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.8);
		line-height: 42rpx;
		text-align: center;
		margin: 30rpx auto 0;
	}

	.popup-content {
		width: 600rpx;
		height: 366rpx;
		background: #292A2E;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
	}

	.txt12 {
		font-weight: bold;
		color: #FF2232;
		margin-left: 4rpx;
		font-size: 44rpx;
		font-weight: 600;
		line-height: 60rpx;
	}

	.txt11 {
		font-size: 26rpx;
		font-weight: bold;
		color: #FF2232;
		line-height: 30rpx;
		margin-left: 10rpx;
	}

	.txt10 {
		line-height: 36rpx;
		color: #313131;
		font-size: 26rpx;
		margin-left: 30rpx;
	}

	.meal-bottom-btn {
		width: 272rpx;
		height: 110rpx;
		line-height: 110rpx;
		background: linear-gradient(135deg, #38AEFC 0%, #3B7FFF 100%);
		float: right;
		text-align: center;
		font-weight: 600;
		color: #FFFFFF;
		letter-spacing: 1rpx;
		font-size: 32rpx;
	}

	.meal-bottom-bar {
		width: 690rpx;
		height: 110rpx;
		line-height: 110rpx;
		background: #FFFFFF;
		box-shadow: 0 0 26rpx 0 rgba(189, 189, 189, 0.5);
		border-radius: 55rpx;
		position: fixed;
		bottom: 26rpx;
		left: 30rpx;
		overflow: hidden;
	}

	.mr-12 {
		margin-right: -12rpx;
		margin-top: 20rpx;
	}

	.meal-pay-item {
		width: 208rpx;
		height: 120rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 20rpx;
		border: 4rpx solid rgba(233, 236, 241, 0.15);
		margin-right: 10rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		flex-direction: column;
		float: left;
		justify-content: center;
	}

	.meal-pay-item.active {
		background: #3B7FFF;
		border-color: #3B7FFF;
	}

	.meal-pay {
		width: 642rpx;
		height: 180rpx;
		background: #292A2E;
		border-radius: 20rpx;
		margin: 24rpx auto 0;
		padding: 24rpx;
		margin-bottom: 186rpx;
	}

	.frc {
		display: flex;
		align-items: center;
	}

	.txt9 {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.7);
		margin-right: 10rpx;
		line-height: 40rpx;
	}

	.wh40 {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
		vertical-align: top;
	}

	.txt8 {
		font-size: 28rpx;
		font-weight: 500;
		color: #F04646;
	}

	.meal-coupon {
		box-sizing: border-box;
		width: 690rpx;
		height: 92rpx;
		background: rgba(255, 178, 178, 0.13);
		border-radius: 20rpx;
		border: 4rpx solid #B14D4D;
		margin: 24rpx auto 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
	}

	.meal-number-input {
		width: 92rpx;
		height: 44rpx;
		line-height: 44rpx;
		background: #F5F7FA;
		border-radius: 8rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #333333;
		margin: 0 12rpx;
	}

	.meal-number {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
	}

	.meal-tab {
		height: 80rpx;
		background: #1D1E1F;
		border-radius: 0 0 20rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.meal-tab-item {
		flex: 1;
		font-size: 28rpx;
		color: #BBBBBB;
		line-height: 40rpx;
		text-align: center;
	}

	.meal-tab-item-line {
		width: 50rpx;
		height: 6rpx;
		background: #3B7FFF;
		border-radius: 3rpx;
		margin: 2rpx auto 0;
	}

	.active {
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
	}

	.meal-icon {
		width: 690rpx;
		box-sizing: border-box;
		padding: 2rpx;
		background-image: linear-gradient(134deg, rgba(107, 105, 103, 1), rgba(188, 169, 150, 1), rgba(119, 114, 108, 1));
		border-radius: 20rpx;
		margin: 24rpx auto 0;
	}

	.meal-icon-in {
		width: 100%;
		border-radius: 20rpx;
		background: linear-gradient(315deg, #383837 0%, #4B4B4B 100%);
	}

	.card-icon {
		width: 48rpx;
		height: 54rpx;
		margin-left: 26rpx;
	}

	.text-icon {
		height: 50rpx;
		margin-left: 8rpx;
	}

	.show-icon {
		width: 48rpx;
		height: 48rpx;
		margin-right: 22rpx;
	}

	.frn {
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 92rpx;
		position: relative;
	}

	.left-top-icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 172rpx;
		height: 102rpx;
	}

	.service-icon-list-title {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.4);
		line-height: 40rpx;
		text-align: center;
		margin-bottom: 28rpx;
	}

	.service-icon-list-title::before,
	.service-icon-list-title::after {
		content: '';
		display: inline-block;
		width: 112rpx;
		height: 2rpx;
		background: rgba(255, 255, 255, 0.4);
		margin: 0 24rpx;
		vertical-align: middle;
	}

	.wh70 {
		width: 70rpx;
		height: 70rpx;
	}

	.txt1 {
		height: 36rpx;
		font-size: 26rpx;
		color: #FFF2D8;
		line-height: 36rpx;
		margin-top: 10rpx;
	}

	.f4 {
		width: 25%;
		display: inline-block;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.meal-detail-list {
		width: 690rpx;
		padding: 24rpx 24rpx 0 24rpx;
		box-sizing: border-box;
		background: #292A2E;
		border-radius: 20rpx;
		margin: 25rpx auto 0;
		position: relative;
	}

	.txt2 {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 40rpx;
	}

	.meal-detail-item {
		width: 200rpx;
		height: 276rpx;
		border-radius: 20rpx;
		background: rgba(255, 255, 255, 0.1);
		text-align: center;
		margin-bottom: 24rpx;
		margin-right: 20rpx;
		position: relative;
		border: 4rpx solid rgba(233, 236, 241, 0.15);
		display: inline-block;
		box-sizing: border-box;
	}

	.meal-detail-item.bactive {
		background: rgba(254, 201, 132, 0.18);
		border: 4rpx solid #FFE39F;
	}

	.meal-detail-tip {
		height: 40rpx;
		background: linear-gradient(315deg, #FFC133 0%, #F04672 100%);
		border-radius: 16rpx 0 16rpx 0;
		font-size: 20rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 40rpx;
		position: absolute;
		left: 0;
		top: -18rpx;
		overflow: hidden;
	}

	.txt3 {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 40rpx;
		padding-top: 42rpx;
	}

	.cFF4C59 {
		color: #FF4C59;
		text-align: center;
	}

	.fs28 {
		font-size: 28rpx;
	}

	.fs48 {
		font-size: 48rpx;
		line-height: 56rpx;
	}

	.fs36 {
		font-size: 36rpx;
	}

	.txt4 {
		height: 34rpx;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.6);
		line-height: 34rpx;
		text-decoration: line-through;
	}

	.txt5 {
		height: 28rpx;
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.5);
		line-height: 28rpx;
	}

	.btn1 {
		height: 40rpx;
		background: linear-gradient(135deg, #38AEFC 0%, #3B7FFF 100%);
		border-radius: 28rpx;
		font-size: 20rpx;
		color: #FFFFFF;
		line-height: 40rpx;
		padding: 0 11rpx;
		display: inline-block;
		margin: 2rpx auto 0;
	}

	.meal-detail-line {
		width: 40rpx;
		height: 8rpx;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 4rpx;
		position: absolute;
		top: 24rpx;
		left: 80rpx;
	}

	.meal-detail-line.active {
		background: #FFE39F;
	}

	.meal-detail-container {
		margin-right: -20rpx;
		padding-top: 48rpx;
		padding-bottom: 58rpx;
		display: flex;
		flex-wrap: wrap;
		overflow: hidden;
	}

	.h448 {
		height: 448rpx;
	}

	.meal-detail-bottom {
		width: 690rpx;
		height: 128rpx;
		background: linear-gradient(180deg, rgba(41, 42, 46, 0) 0%, rgba(41, 42, 46, 0.97) 49%, #292A2E 100%);
		border-radius: 0 0 20rpx 20rpx;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.txt6 {
		margin-top: 70rpx;
		height: 34rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		line-height: 34rpx;
		text-align: center;
	}

	.meal-num {
		width: 654rpx;
		height: 168rpx;
		background: #292A2E;
		border-radius: 20rpx;
		margin: 24rpx auto 0;
		padding: 0 12rpx 0 24rpx;
	}

	.txt7 {
		min-width: 106rpx;
		height: 32rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.5);
		line-height: 32rpx;
		margin-top: 7rpx;
	}
</style>
