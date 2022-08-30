<template>
  <div class="tst-axios">
    <el-button type="primary" @click="testAxios">验证 Axios 请求</el-button>
    <!-- <button class="btn text-primary" v-loading="loading">验证 Axios 请求</button> -->
    <div class="pt20" v-loading="loading">
      <el-image class="mb10" style="width: 200px; height: 200px" :src="photoData.url" />
      <p class="text-purple">{{ photoData.title }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getPhotos } from '@u/api'
  const loading = ref(false)

  // let list = reactive({
  //   photos: [],
  //   photoData: {}
  // })
  let photoData = reactive({})

  const testAxios = () => {
    if (loading.value) {
      ElMessage.error('别慌，你点击太快了.')
      return false
    }
    loading.value = true;
    // 获取照片列表
    getPhotos({
      num: Math.ceil(Math.random() * 100)
    }).then(res => {
      Object.assign(photoData, res.data)
      loading.value = false
    })
  }
  // console.log(558888, TAOBAO)
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .tst-axios {
    margin: 0 auto;
    padding: 10px;
    width: 80%;
    border: 1px solid #069;
    border-radius: 10px;
  }
</style>
