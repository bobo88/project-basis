<template>
  <div>
    <p>From Parent: {{ modelValue }} -- {{ desc }}</p>
    <a-button type="primary" @click="changeHandle">改变父组件的描述内容</a-button>
  </div>
</template>
<script lang="ts" setup>
  import { Ref, ref, reactive, watch } from 'vue';
  import { Button } from 'ant-design-vue'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  const props = defineProps({
    modelValue: String,
    desc: String,
  });
  const emit = defineEmits(['update:modelValue', 'update:desc'])
  const changeHandle = () => {
    let now = formatToDateTimeSss(new Date().getTime())
    emit('update:modelValue', 'Change Title')
    emit('update:desc', '我来自子元素 ' + now)
  }
</script>
