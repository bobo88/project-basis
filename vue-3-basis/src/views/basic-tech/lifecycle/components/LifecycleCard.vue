<template>
  <Card title="vue3 生命周期顺序 - setup语法糖" :loading="loading">
    <div :style="{ width, height }">
      <!-- {{ lifecycle }} -->
      <div v-for="(value, key) in lifecycle">
        <badge status="success" :text="key + ': ' + value" />
        <br />
        <!-- <badge status="error" text="Error" />
        <br />
        <badge status="default" text="Default" />
        <br />
        <badge status="processing" text="Processing" />
        <br />
        <badge status="warning" text="warning" /> -->
      </div>
    </div>
  </Card>
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
  import { Card, Badge } from 'ant-design-vue';
  import { LifecycleType } from './lifecycle'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '380px',
    },
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
    // console.log('onBeforeMount...')
    lifecycle.onBeforeMount = formatToDateTimeSss(new Date().getTime())
  })
  onMounted(() => {
    // console.log('onMounted...')
    lifecycle.onMounted = formatToDateTimeSss(new Date().getTime())
  })
  onBeforeUpdate(() => {
    // console.log('onBeforeUpdate...')
    lifecycle.onBeforeUpdate = formatToDateTimeSss(new Date().getTime())
  })
  onUpdated(() => {
    // console.log('onUpdated...')
    lifecycle.onUpdated = formatToDateTimeSss(new Date().getTime())
  })
  onBeforeUnmount(() => {
    // console.log('onBeforeUnmount...')
    lifecycle.onBeforeUnmount = formatToDateTimeSss(new Date().getTime())
  })
  onUnmounted(() => {
    lifecycle.onUnmounted = formatToDateTimeSss(new Date().getTime())
  })
  onActivated(() => {
    // console.log('onActivated...')
    lifecycle.onActivated = formatToDateTimeSss(new Date().getTime())
  })
  onDeactivated(() => {
    // console.log('onDeactivated...')
    lifecycle.onDeactivated = formatToDateTimeSss(new Date().getTime())
  })
</script>
