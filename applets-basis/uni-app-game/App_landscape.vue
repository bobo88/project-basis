<script>
	export default {
		onLaunch() {
			// 初始化横屏
			// 利用 CSS3 旋转 对根容器逆时针旋转 90 度
			var detectOrient = function() {
				// var width = document.documentElement.clientWidth,
				// 	height = document.documentElement.clientHeight,
				// 	$wrapper = document.getElementsByTagName('body')[0],
				// 	style = "";
				// console.log(width, height)
				// if (width >= height) {
			 //     // 横屏
				// 	style += "width:" + width + "px;"; // 注意旋转后的宽高切换
				// 	style += "height:" + height + "px;";
				// 	style += "-webkit-transform: rotate(0); transform: rotate(0);";
				// 	style += "-webkit-transform-origin: 0 0;";
				// 	style += "transform-origin: 0 0;";
				// 	console.log(1)
				// } else {
			 //     // 竖屏 -- 需要转为横屏
				// 	style += "width:" + height + "px;";
				// 	style += "height:" + width + "px;";
				// 	style += "-webkit-transform: rotate(0); transform: rotate(0);";
				// 	// 注意旋转中点的处理
				// 	style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
				// 	style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
				// 	console.log(2)
				// }
				// $wrapper.style.cssText = style;
			}
			window.onresize = detectOrient;
			detectOrient();
		},
		onShow: function() {
			
		},
		onHide: function() {
			var pages = getCurrentPages() //获取加载的页面
			var currentPage = pages[pages.length - 1] //获取当前页面的对象
			var url = currentPage.route //当前页面url 
			if (url === 'pages/index/webView') {
			 //  uni.switchTab({
				// url: "/pages/home/home",
			 //  });
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "common/demo.scss";
	html{
		width: 100vh;
		height: 100vw;
		-webkit-transform: rotate(90deg);
		-webkit-transform-origin: 50vw 50vw;
		transform: rotate(90deg);
		transform-origin: 50vw 50vw;
	}
</style>
