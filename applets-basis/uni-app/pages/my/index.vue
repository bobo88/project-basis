<template>
	<view class="container">
		<uni-nav-bar title="个人信息" height="100rpx" leftIcon="arrow-left" color="#fff" backgroundColor="#1D1E1F" fixed :border="false" @clickLeft="returnBack"></uni-nav-bar>
		<view class="top-wrap">
			<view v-for="(item, index) in list" :key="item.title" :data-index="index" @click="itemHandle">
				<infoItem :tiitle="item.title" :isActive="index !== 2" :isPic="item.isPic" :isArrow="item.isArrow" :imgUrl="item.imgUrl" :content="item.content"></infoItem>
			</view>
		</view>
		<view class="top-wrap">
			<view v-for="(item, index) in lists" :key="item.title" :data-index="index" @click="itemHandle2">
				<view v-if="index == 1">
					<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
					    <infoItem :tiitle="item.title" :isActive="index === 1" :content="item.content" :isArrow="item.isArrow"></infoItem>
					</pick-regions>
				</view>
				<view v-else>
					<infoItem :tiitle="item.title" :isActive="index !== 3" :content="item.content" :isArrow="item.isArrow"></infoItem>
				</view>
			</view>
		</view>
		<u-action-sheet
			:show="show"
			@close="show = false"
			@select="select"
			:actions="actions"
			cancelText="取消"
		>
		</u-action-sheet>
		<u-picker
			:show="show2"
			:columns="columns"
			:defaultIndex="[defaultIndex2]"
			title="学历"
			confirmText="确认"
			@cancel="cancel2"
			@confirm="confirm2"
			@change="change"
		></u-picker>
		<u-picker
			:show="show3"
			:columns="columns1"
			:defaultIndex="[defaultIndex3]"
			title="职业"
			@cancel="cancel3"
			@confirm="confirm3"
			@change="change1"
		></u-picker>
		<u-no-network
			@disconnected="disconnected"
			@connected="connected"
			@retry="retry"
		></u-no-network>
	</view>
</template>

<script>
	import urlObj from '../../common/config.js'
	import infoItem from './components/info-item.vue'
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	export default {
		components:{
			infoItem
		},
		data() {
			return {
				list:[{
					title: '头像',
					imgUrl: '/static/my/defalt-header-img.png',
					isPic: true
				},{
					title: '昵称',
					content: ''
				},{
					title: '性别',
					content: ''
				}],
				lists: [{
					title: '手机号',
					content: '',
					isArrow: false
				},{
					title: '所在地',
					content: ''
				},{
					title: '学历',
					content: ''
				},{
					title: '职业',
					content: ''
				}],
				show: false,
				actions: [{
						name: '男',
					},
					{
						name: '女',
				}],
				region:[],
				defaultRegion:['广东省','广州市'],
				defaultRegionCode:'440123',
				show2: false,
				defaultIndex2: 0,
				defaultIndex3: 0,
				columns: [
					['博士', '硕士', '本科', '大专', '高中/中专', '初中', '小学']
				],
				show3: false,
				columns1: [
					['国家机关、党群组织、企业、事业单位负责人', '专业技术人员', '办事人员和有关人员', '商业、服务业人员', '农、林、牧、渔、水利生产人员', '其他']
				],
				index: 0
			}
		},
		onShow() {
			this.getList();
			this.getHeadPortrait();
		},
		computed:{
			regionName(){
				// 转为字符串
				return this.region.map(item=>item.name).join(' ')
			}
		},
		methods: {
			returnBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			getList(){
				uni.$u.http.get('/api/user/v1/client/personalInfo').then(res => {
					  this.list[1].content = res.surfaceName || '待完善';
					  this.list[2].content = res.sex || '待完善';
					  this.lists[0].content = res.phone || '待完善';
					  this.lists[1].content = res.workAddr || '待完善';
					  this.lists[2].content = res.education || '待完善';
					  this.columns[0].map((item, index) => {
						if(item === res.education){
							this.defaultIndex2 = index
						}
					  })
					  this.lists[3].content = res.job || '待完善';
					  this.columns1[0].map((item, index) => {
						if(item === res.job){
							this.defaultIndex3 = index
						}
					  })
					  this.defaultRegion = res.workAddr.split(' ');
					  console.log(this.defaultRegion)
				})
			},
			itemHandle(e) {
				let index = e.currentTarget.dataset.index;
				if(index == 0){
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: (res) => {
							console.log(res)
							const files = res.tempFiles[0];
							console.log(files)
							uni.uploadFile({
								url: 'http://110.53.221.195:8210/document/file/lowLevelMultipartUpload',
								filePath: files,
								name: 'file',
								header: {
									Authorization: uni.getStorageSync('token'),
									'file-access-key': urlObj.uploadKey,
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes)
									const data = JSON.parse(uploadFileRes.data);
									if(data.code == 200){
										const fileId = data.data.fileKey;
										this.upadteImg(fileId);
									}
								}
							});
						}
					});
				}else if(index == 1){
					uni.navigateTo({
						url: `/pages/my/updateNickname?name=${this.list[1].content}`
					})
				} else if(index == 2){
					this.show = true
				}
			},
			upadteImg(fileId){
				uni.$u.http.get('/api/user/v5/user/headPortrait/upload',{
					data: {
						fileId: fileId
					}
				}).then(res => {
					uni.$u.toast('修改成功！');
					this.getList();
				})
			},
			itemHandle2(e){
				this.index = e.currentTarget.dataset.index;
				this[`show${this.index}`] = true;
			},
			select(obj){
				this.upadtePersonInfo({
					sex: obj.name
				})
			},
			getHeadPortrait(send){
				uni.$u.http.get('/api/user/v5/user/getHeadPortrait').then(res => {
					this.list[0].imgUrl = res ? `${urlObj.fileUrl}/document/newFile/download/0/${urlObj.uploadKey}?fileKey=${res}` : '/static/my/defalt-header-img.png'
				})
			},
			upadtePersonInfo(send){
				uni.$u.http.put('/api/user/v1/client/personalInfo/updatePersonalInfo',send).then(res => {
					uni.$u.toast('修改成功！');
					this.getList();
				})
			},
			// 获取选择的地区1
			handleGetRegion(region){
				this.region = region;
				this.upadtePersonInfo({
					workAddr: this.region[0].name + ' ' + this.region[1].name
				})
			},
			change(e) {
				this.index = e.index;
			},
			change1(e) {
				this.index1 = e.index;
			},
			confirm2(obj) {
				this.show2 = false
				this.upadtePersonInfo({
					education: obj.value[0]
				})
			},
			cancel2() {
				this.show2 = false
			},
			confirm3(obj) {
				this.show3 = false
				this.upadtePersonInfo({
					job: obj.value[0]
				})
			},
			cancel3() {
				this.show3 = false
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
				this.getHeadPortrait();
			}
		}
	}
</script>

<style lang="scss">
	/deep/ .u-action-sheet__item-wrap__item__name{
		color: #FFFFFF;
	}
	/deep/ .u-gap{
		background-color: #101010 !important;
	}
	/deep/ .uni-picker-view-mask{
		background: none !important;
	}
	/deep/ .u-toolbar__title{
		color: #FFFFFF !important;
		background-color: #292A2E;
	}
	/deep/ .uni-picker-container .uni-picker-header{
		background-color: #292A2E !important;
	}
	/deep/ .u-picker__view__column__item{
		color: rgba(255, 255, 255, 0.5);
		border: none;
	}
	.container{
		height: 100vh;
		background-color: #101010;
		position: relative;
		padding-top: 1rpx;
		.top-wrap{
			width: 630rpx;
			background: #292A2E;
			border-radius: 20rpx;
			margin: 30rpx auto;
			padding: 0 28rpx;
			
		}
	}
</style>
