<template>
  <div v-for="(value, key) in lifecycle">
    <badge status="processing" :text="'子 - ' + key + ': ' + value" />
    <br />
  </div>
</template>
<script lang="ts" setup>
  import {
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
    onActivated,
    onDeactivated,
  } from 'vue'
  import { Ref, ref, reactive, watch } from 'vue';
  import { Badge } from 'ant-design-vue';
  import { LifecycleType } from './lifecycle'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  const props = defineProps({
    loading: Boolean,
  });
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      // console.log(23333)
    },
    { immediate: true },
  );

  const xx = ref(0)
  const lifecycle = reactive<LifecycleType>({
    onBeforeMount: '',
    onMounted: '',
    onBeforeUpdate: '',
    onUpdated: '',
    onBeforeUnmount: '',
    onUnmounted: '',
    onActivated: '',
    onDeactivated: '',
  })

  onBeforeMount(() => {
    // console.log('The Son -- onBeforeMount...')
    lifecycle.onBeforeMount = formatToDateTimeSss(new Date().getTime())
  })
  onMounted(() => {
    // console.log('The Son -- onMounted...')
    lifecycle.onMounted = formatToDateTimeSss(new Date().getTime())
  })
  onBeforeUpdate(() => {
    // console.log('The Son -- onBeforeUpdate...')
    lifecycle.onBeforeUpdate = formatToDateTimeSss(new Date().getTime())
  })
  onUpdated(() => {
    // console.log('The Son -- onUpdated...')
    lifecycle.onUpdated = formatToDateTimeSss(new Date().getTime())
  })
  onBeforeUnmount(() => {
    // console.log('The Son -- onBeforeUnmount...')
    lifecycle.onBeforeUnmount = formatToDateTimeSss(new Date().getTime())
  })
  onUnmounted(() => {
    lifecycle.onUnmounted = formatToDateTimeSss(new Date().getTime())
  })
  onActivated(() => {
    // console.log('The Son -- onActivated...')
    lifecycle.onActivated = formatToDateTimeSss(new Date().getTime())
  })
  onDeactivated(() => {
    // console.log('The Son -- onDeactivated...')
    lifecycle.onDeactivated = formatToDateTimeSss(new Date().getTime())
  })
</script>
