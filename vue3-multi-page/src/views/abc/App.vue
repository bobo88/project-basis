<template>
  <div>
    <h1 class="mb30">abbccccc 目</h1>
    <p class="test-grey mb10">我是验证全局样式是否生效的（生效了就是灰色）</p>
    <h4 class="text-purple mb10">测试scss样式计算是否OK</h4>
    <p class="test-rem text-primary mb10">验证 rem 适配 (如果宽度满屏则表示OK)</p>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang='scss'>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .test-grey {
    color: $grey-color;
  }
  .test-rem {
    width: 750px;
    height: 100px;
    line-height: 100px;
    font-size: 18px;
    background: rgba(0, 0, 0, 0.8);
  }
</style>
