<template>
  <div>
    <p>From Parent: {{ dataProps }} -- {{ dataDesc }}</p>
    <a-button type="primary" @click="changeHandle">改变父组件的描述内容</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, reactive, watch } from 'vue';
  import { Button } from 'ant-design-vue'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  const props = defineProps({
    dataProps: String,
    dataDesc: String,
  });
  const emit = defineEmits(['changeDesc'])
  const changeHandle = () => {
    let now = formatToDateTimeSss(new Date().getTime())
    emit('changeDesc', '我来自子元素 ' + now)
  }
</script>
