<template>
  <div>
    <p>From Parent: {{ parentDesc }}</p>
    <a-button type="primary" @click="changeHandle">改变父组件的描述内容</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, onMounted, onUpdated, Ref, ref, reactive, inject } from 'vue';
  import { Button } from 'ant-design-vue'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';

  const parentDesc = ref('')

  onMounted(() => {
    // $mybus.$on('bobo', (data: string) => {
    //   console.log(111234)
    //   parentDesc.value = data
    // })
  })


  const changeHandle = () => {
    // let now = formatToDateTimeSss(new Date().getTime())
    // $mybus.$emit('desc', 'From子元素 ' + now)
  }
</script>
