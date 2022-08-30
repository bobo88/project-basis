<template>
  <div>
    <h1 class="mb30">我是 ABOUT 目录下的项目</h1>
    <p class="test-rem text-primary mb10">验证 rem 适配 (如果宽度满屏则表示OK)</p>
    <test-axios />
  </div>
</template>

<script lang="ts" setup>
  import TestAxios from './components/TestAxios'
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
