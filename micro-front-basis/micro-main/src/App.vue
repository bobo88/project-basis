<template>
  <div class="common-layout">
    <el-container>
      <Left />
      <el-main>
        <section class="cns-frame-wrapper">
          1{{$route.name}}2
          <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
          <router-view v-show="$route.name" />

          <!-- 子应用渲染区，用于挂载子应用节点 -->
          <section v-show="!$route.name" id="frame"></section>
        </section>
      </el-main>
    </el-container>
  </div>
</template>

<script lang='ts' setup>
  import Left from '@/components/Left.vue'
</script>

<style lang="scss" src="@/assets/styles/index.scss"></style>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .aside-box {
    width: 180px !important;
    color: #fff;
    background: #2e324b;
  }
</style>
