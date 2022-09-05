<template>
  <header class="top">
    <el-row class="top-cont"  justify="space-between">
      <el-col :span="4">
        <h1 class="logo">
          <img src="@/assets/images/logo.png" width="100" height="54" alt="Logo">
        </h1>
      </el-col>
      <el-col :span="20" class="clearfix">
        <el-scrollbar>
          <ul class="scrollbar-flex-content">
            <li class="scrollbar-item"  :class="{ 'active': dataIdx === index }" v-for="(item,index) in tabList" :key="index" @click="changeAnchor(index)">
              {{ item }}
            </li>
          </ul>
        </el-scrollbar>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default {
  name: 'Top',
  comments: {},
  props: {
    dataIdx: {
      required: true,
      type: Number
    },
    topValues: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      tabList: ['首页', '解决方案', '方案优势', '应用场景', '上云指南', '合作伙伴', '关于我们', '企业动态', '联系我们', '登录', '立即注册'],
    }
  },
  methods: {
    // tab点击滚动到特定位置
    changeAnchor (index) {
      console.log(66666, index, this.topValues)
      window.scrollTo({
        top: this.topValues?.data[index] + 1,
        behavior: 'smooth'
      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .top {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    padding: 13px 0;
    height: 80px;
    background: rgba(18, 170, 156, 1);
    .top-cont {
      margin: 0 auto;
      padding: 0 20px;
    }
    .logo {
      width: 100px;
      height: 54px;
    }
    .scrollbar-flex-content {
      display: flex;
    }
    .scrollbar-item {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      margin: 0 8px;
      padding: 0 8px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      &.active {
        border-bottom: 1px solid #fff;
      }
    }

    // .login-box {
    //   padding: 0 24px;
    //   .login-btn {
    //     width: 88px;
    //     height: 32px;
    //     line-height: 32px;
    //     color: #fff;
    //     border: 1px solid #1A77FF !important;
    //     background: #1A77FF !important;
    //     a {
    //       text-decoration: none;
    //     }
    //   }
    // }
  }
</style>
