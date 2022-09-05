<template>
  <footer class="footer">
    <div class="footer-cont">
      <el-row class="foot-main">
        <el-col :span="12" class="tl">
          <el-row class="link-box">
            <el-col :span="6">
              <!-- <h4>算筹产品：</h4>
              <ul>
                <li><a href="javascript:;" target="_blank">云手机</a></li>
                <li><a href="javascript:;" target="_blank">云游戏</a></li>
                <li><a href="javascript:;" target="_blank">算力租赁</a></li>
              </ul> -->
            </el-col>
            <el-col :span="6">
              <!-- <h4>友情链接：</h4>
              <ul>
                <li><a href="https://www.vclusters.com/" target="_blank">瑞驰官网</a></li>
                <li><a href="https://www.androidscloud.com/" target="_blank">双子星云手机</a></li>
                <li><a href="http://beefuncloud.com/" target="_blank">毕方云游戏</a></li>
              </ul> -->
            </el-col>
            <el-col :span="6">
              <!-- <h4>关于我们：</h4>
              <ul>
                <li><a href="http://www.suancho.com/about" target="_blank">关于我们</a></li>
                <li><a href="http://www.suancho.com/contactUs" target="_blank">联系我们</a></li>
              </ul> -->
            </el-col>
          </el-row>
        </el-col>
         <el-col :span="4">&nbsp;</el-col>
        <el-col :span="8" class="tr">
          <el-row class="qrcode-box">
            <!-- <el-col :span="8">
              <div class="qrcode-cont">
                <p><img src="@/assets/images/qrcode_1.png" alt="毕方云游戏公众号"></p>
                <p class="qrcode-tit">毕方云游戏公众号</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="qrcode-cont">
                <p><img src="@/assets/images/qrcode_2.png" alt="算筹云科技公众号"></p>
                <p class="qrcode-tit">算筹云科技公众号</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="qrcode-cont">
                <p><img src="@/assets/images/qrcode_3.png" alt="双子星云手机公众号"></p>
                <p class="qrcode-tit">双子星云手机公众号</p>
              </div>
            </el-col> -->
          </el-row>
        </el-col>
      </el-row>

      <p class="copyright">版权信息：深圳市臂云科技有限公司 <span><a href="https://beian.miit.gov.cn" target="_blank" data-v-4560e5fc="">备案号 ：粤ICP备19093346号-3</a></span></p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
  // xx
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .footer {
    position: absolute;
    z-index: 99;
    bottom: 0;
    left: 0;
    width: 100%;
    min-width: 1200px;
    height: 260px;
    background: #04234E;
  }
  .footer-cont {
    margin: 0 auto;
    padding-top: 40px;
    width: 1200px;
    height: 260px;
    // background: url('@/assets/images/logo_bg.png') center center no-repeat;
    background-size: 194px 260px;
  }
  .foot-main {
    padding-bottom: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .qrcode-box {
    // float: right;
    // width: 500px;
    .qrcode-cont {
      width: 130px;
      text-align: center;
    }
    img {
      margin: 0 auto;
      width: 90px;
      height: 90px;
      border-radius: 5px;
    }
    .qrcode-tit {
      height: 28px;
      line-height: 28px;
      color: #fff;
      font-size: 14px;
    }
  }
  .link-box {
    h4 {
      margin-bottom: 12px;
      height: 28px;
      line-height: 28px;
      font-size: 18px;
      font-family: 'PingFang SC';
      font-style: normal;
    }
    li {
      margin-bottom: 12px;
    }
    a {
      font-family: 'Microsoft YaHei';
      color: #fff;
      opacity: 0.6;
      font-size: 14px;
    }
  }
  .copyright {
    padding-top: 10px;
    height: 38px;
    line-height: 28px;
    color: #fff;
    font-size: 14px;
    text-align: left;
    span {
      padding-left: 50px;
    }
  }
</style>
