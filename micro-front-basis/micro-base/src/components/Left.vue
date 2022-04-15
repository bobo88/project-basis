<template>
  <!--  :class="{'is-collapse': isCollapse}" -->
  <el-aside class="left-box">
    <div class="logo-box">
      <img class="logo" :src="require(`@/assets/images/logo.png`)" alt="LOGO">
      <h1>Bob Admin</h1>
    </div>

    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      :router="true"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- :collapse="isCollapse" -->
      <!-- 1、Template 划分 -->
      <template v-for="(fItem, fIndex) in menus" :key="fIndex">
        <!-- First -->
        <el-sub-menu v-if="fItem.child && fItem.child.length > 0" :index="fItem.path">
          <template #title>
            <el-icon><location /></el-icon>
            <span>{{ fItem.title }}</span>
          </template>
          <el-menu-item-group>
            <!-- 2、Template 划分 -->
            <template v-for="(sItem, sIndex) in fItem.child" :key="sIndex">
              <!-- Second -->
              <el-sub-menu v-if="sItem.child && sItem.child.length > 0" :index="fItem.path + sItem.path">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span>{{ sItem.title }}</span>
                </template>
                <el-menu-item-group>
                  <!-- 暂时：做多三级 -->
                  <!-- ...... 可以拓展四级或者更多 -->
                  <!-- Third -->
                  <el-menu-item v-for="(tItem, tIndex) in sItem.child" :key="tIndex" :index="fItem.path + sItem.path + tItem.path">
                    <el-icon><setting /></el-icon>
                    <span>{{ tItem.title }}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>

              <!-- Second: no child -->
              <el-menu-item v-else :index="fItem.path + sItem.path">
                <el-icon><setting /></el-icon>
                <span>{{ sItem.title }}</span>
              </el-menu-item>
            </template>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- First: no child -->
        <el-menu-item v-else :index="fItem.path">
          <el-icon><setting /></el-icon>
          <span>{{ fItem.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps } from 'vue'
  import menus from '@/libs/menu'
  import {
    Location,
    Document,
    Menu as IconMenu,
    Setting,
  } from '@element-plus/icons-vue'
  // import { useMainStore } from '@/store/index';
  // import { storeToRefs } from 'pinia'

  // const main = useMainStore()
  // const { isCollapse } = storeToRefs(main)
  // console.log(666, main.$id) // 获取store实例的ID值
  // const props = defineProps({
  //   dataIndx: Number
  // })

  onMounted(() => {
    console.log('子组件left的onMounted执行')
    return 'From Left onMounted'
  })

  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .left-box {
    width: 200px;
    height: 100vh;
    background: #545c64;
    font-size: 16px;
    &.is-collapse {
      width: 70px;
      .logo-box {
        .logo {
          margin-right: 0;
        }
        h1 {
          display: none;
        }
      }
    }
    .logo-box {
      height: 48px;
      padding: 6px 0;
      line-height: 36px;
      text-align: center;
      .logo {
        margin-right: 10px;
        display: inline-block;
        width: 36px;
        height: 36px;
        line-height: 36px;
        vertical-align: middle;
      }
      h1 {
        display:inline-block;
        height: 36px;
        line-height: 36px;
        color: $colorF;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
      }
    }
  }
</style>
