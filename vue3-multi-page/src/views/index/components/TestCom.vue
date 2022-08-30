<template>
  <div class="hello">
    <p><em class="inline-block pr30">{{ msg }}</em><span>我是测试 Sass 是否OK的(生效就是蓝色字体)</span></p>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  const msg = ref('我是测试的msg而已, 我有右padding')
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  p {
    color: #f60;
    em {
      font-size: 14px;
    }
    span {
      color: #069;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
