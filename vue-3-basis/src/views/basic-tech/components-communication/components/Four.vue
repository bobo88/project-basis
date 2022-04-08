<template>
  <div>
    <p>From Parent: {{ parentData.title }} -- {{ parentData.desc }}</p>
    <a-button type="primary" @click="changeHandle">改变父组件的描述内容</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, reactive, inject } from 'vue';
  import { Button } from 'ant-design-vue'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';

  const parentData = inject('parent')

  const emit = defineEmits(['changeDesc'])
  const changeHandle = () => {
    let now = formatToDateTimeSss(new Date().getTime())
    emit('changeDesc', 'From子元素 ' + now)
  }
</script>
