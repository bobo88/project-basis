<template>
  <Card title="vue3 生命周期顺序 - options方式" :loading="loading">
    <div :style="{ width, height }">
      <div v-for="(value, key) in lifecycle">
        <badge status="warning" :text="key + ': ' + value" />
        <br />
      </div>

      <div>
        <badge status="processing" :text="'beforeCreate: ' + beforeCreate" />
        <br />
        <badge status="processing" :text="'created: ' + created" />
        <br />
        <badge status="processing" :text="'beforeMount: ' + beforeMount" />
        <br />
        <badge status="processing" :text="'mounted: ' + mounted" />
        <br />
        <badge status="processing" :text="'beforeUpdate: ' + beforeUpdate" />
        <br />
        <badge status="processing" :text="'updated: ' + updated" />
        <br />
        <badge status="processing" :text="'beforeDestroy: ' + beforeDestroy" />
        <br />
        <badge status="processing" :text="'destroyed: ' + destroyed" />
        <br />
      </div>

    </div>
  </Card>
</template>
<script lang="ts">
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
  import { Card, Badge, Divider } from 'ant-design-vue';
  import { LifecycleType } from './lifecycle'
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  export default {
    name: 'xxx',
    components: {
      Card,
      Badge,
      Divider
    },
    data () {
      return {
        beforeCreate: '',
        created: '',
        beforeMount: '',
        mounted: '',
        beforeUpdate: '',
        updated: '',
        beforeDestroy: '',
        destroyed: '',
      }
    },
    props: ['loading', 'width', 'height'],
    setup() {
      // console.log('-------- setup ------------')
      const lifecycle = reactive<LifecycleType>({
        onBeforeMount: '',
        onMounted: '',
        onBeforeUpdate: '',
        onUpdated: '',
        onBeforeUnmount: '',
        onUnmounted: '',
        onActivated: '',
        onDeactivated: '',
      });
      onBeforeMount(() => {
        // console.log('1111 onBeforeMount...')
        lifecycle.onBeforeMount = formatToDateTimeSss(new Date().getTime())
      }),
      onMounted(() => {
        // console.log('2222 onMounted...')
        lifecycle.onMounted = formatToDateTimeSss(new Date().getTime())
      }),
      onBeforeUpdate(() => {
        // console.log('3333 onBeforeUpdate...')
        lifecycle.onBeforeUpdate = formatToDateTimeSss(new Date().getTime())
      }),
      onUpdated(() => {
        // console.log('4444 onUpdated...')
        lifecycle.onUpdated = formatToDateTimeSss(new Date().getTime())
      }),
      onBeforeUnmount(() => {
        // console.log('5555 onBeforeUnmount...')
        lifecycle.onBeforeUnmount = formatToDateTimeSss(new Date().getTime())
      }),
      onUnmounted(() => {
        // console.log('6666 onUnmounted...')
        lifecycle.onUnmounted = formatToDateTimeSss(new Date().getTime())
      }),
      onActivated(() => {
        // console.log('7777 onActivated...')
        lifecycle.onActivated = formatToDateTimeSss(new Date().getTime())
      }),
      onDeactivated(() => {
        // console.log('8888 onDeactivated...')
        lifecycle.onDeactivated = formatToDateTimeSss(new Date().getTime())
      })
      return {
        lifecycle
      }
    },
    beforeCreate () {
      // console.log('beforeCreate')
      let beforeCreate = formatToDateTimeSss(new Date().getTime())
      setTimeout(() => {
        this.beforeCreate = beforeCreate
      }, 2000)
    },
    created () {
      // console.log('created')
      let created = formatToDateTimeSss(new Date().getTime())
      setTimeout(() => {
        this.created = created
      }, 2000)
    },
    beforeMount () {
      // console.log('beforeMount')
      this.beforeMount = formatToDateTimeSss(new Date().getTime())
    },
    mounted () {
      // console.log('mounted')
      this.mounted = formatToDateTimeSss(new Date().getTime())
    },
    beforeUpdate () {
      // console.log('beforeUpdate')
      this.beforeUpdate = formatToDateTimeSss(new Date().getTime())
    },
    updated () {
      // console.log('updated')
      this.updated = formatToDateTimeSss(new Date().getTime())
    },
    beforeDestroy () {
      // console.log('beforeDestroy')
      this.beforeDestroy = formatToDateTimeSss(new Date().getTime())
    },
    destroyed () {
      // console.log('destroyed')
      this.destroyed = formatToDateTimeSss(new Date().getTime())
    },
    
  }
</script>
