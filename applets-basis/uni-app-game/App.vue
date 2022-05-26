<script>
	export default {
		onLaunch() {
			
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
</style>
