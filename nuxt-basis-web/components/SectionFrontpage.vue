<template>
  <div class="section-frontpage">
    深圳市臂云科技有限公司 -- 首页
    <el-button type='primary' size='small' class="ml20" @click="testAxios">点我验证Axios接口</el-button>
  </div>
</template>

<script>
  export default {
    name: 'SectionFrontpage',
    data () {
      return {
        // x
      }
    },
    methods: {
      testAxios () {
        // console.log(1111, this.$axios.get('/xxx'))
        this.$axios.get('/xxx').then(res => {
          console.log(res, 6666)
        })
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .section-frontpage {
    margin-bottom: 30px !important;
    height: 500px;
    line-height: 300px;
    display: flex;
    color: #fff;
    font-size: 30px;
    background: #f60;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
</style>
