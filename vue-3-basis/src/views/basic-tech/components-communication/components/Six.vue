<template>
  <div>
    <p>From Parent: {{ title }} -- {{ desc }}</p>
    <a-button type="primary" @click="changeHandle">改变描述内容</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, reactive, watch, watchEffect, computed } from 'vue';
  import { Button } from 'ant-design-vue'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  // pinia
  import { useBasicTechStoreWithOut } from './piniaTest';

  const basicTechStore = useBasicTechStoreWithOut()
  const title = computed(() => basicTechStore.getTitle)
  const desc = computed(() => basicTechStore.getDesc('_'))

  const changeHandle = () => {
    let now = formatToDateTimeSss(new Date().getTime())
    basicTechStore.setDesc('set desc ' + now)
  }
</script>
