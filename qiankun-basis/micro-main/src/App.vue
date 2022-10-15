<template>
  <div>
    <h3>VUE 子应用</h3>
    <!-- 与 基座配置 2 中的「 container: '#vue', 」 保持一致 -->
    <div id="vue" />

    <h3>其他页面</h3>
    <!-- todo -->
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';

  onMounted(() => {
    console.log(666, window.__POWERED_BY_QIANKUN__)
    // if (!window.qiankunStart) {
    //   window.qiankunStart = true;
    //   console.log(666,start)
    //   // start({
    //   //   // 开启沙箱严格模式 防止主应用的样式污染到微应用
    //   //   sandbox: { strictStyleIsolation: true }
    //   // });
    // }
    console.log(111);
  });
</script>

<style></style>
