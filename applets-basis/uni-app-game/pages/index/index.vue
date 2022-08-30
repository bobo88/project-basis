<template>
	<view id="container" class="container-box">
		<!-- <web-view :webview-styles="webviewStyles" src="https://uniapp.dcloud.io/static/web-view.html"></web-view> -->
		<!-- <web-view  src="../h5-webview/index.html"></web-view> -->
		<!-- <web-view  src="http://192.168.11.104:2688/index.html"></web-view> -->
		<web-view  src="/hybrid/html/game.html"></web-view>
		<!-- 11111 -->
		<!-- width="542" height="300" -->
		<!-- <video class="video-item" disablePictureInPicture="true" style='object-fit: fill;' playsinline="true"
			autoplay="true" webkit-playsinline="true" x5-playsinline="true" x5-video-player-type="h5"
			x5-video-player-fullscreen="false" poster="/static/index/cover.png" id="player"></video> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tokens: '',
				selectItem: 1,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		onLoad(options) {
			// xx
		},
		onShow() {
			// xx
		},
		methods: {
			// xx
		}
	}
</script>

<style lang="scss">
	.container-box {
		width: 100vw;
		height: 100vh;
		.video-item {
			width: 100%;
			height: 100%;
		}
	}
</style>
