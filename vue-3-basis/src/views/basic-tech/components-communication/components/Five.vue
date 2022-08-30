<template>
  <div>
    <p>From Parent: {{ parentDesc }}</p>
    <a-button type="primary" @click="changeHandle">改变父组件的描述内容</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, onMounted, onUpdated, Ref, ref, reactive, inject } from 'vue';
  import { Button } from 'ant-design-vue'
  import bus from './bus';
  import { formatToDateTimeSss } from '/@/utils/dateUtil';

  const parentDesc = ref('')

  bus.$on('props', (data: string) => {
    parentDesc.value = data
  })

  const changeHandle = () => {
    let now = formatToDateTimeSss(new Date().getTime())
    bus.$emit('desc', 'From子元素 ' + now)
  }
</script>
