<template>
 <Six />
</template>
<script lang="ts" setup>
  import { onBeforeMount, onMounted, onUpdated, defineComponent, reactive, toRefs, ref, provide, nextTick, watch, watchEffect, computed } from 'vue';
  // import One from './One.vue'
  // import Two from './Two.vue'
  // import Three from './Three.vue'
  // import Four from './Four.vue'
  // import Five from './Five.vue'
  import Six from './Six.vue'
  // // import Seven from './Seven.vue'
  // import { groupItems } from './data';
  // import bus from '/@/utils/bus';
  // // pinia
  // import { useBasicTechStoreWithOut } from './piniaTest';



    const title = ref('我是标题')
    const desc = ref('我是描述 bus')
    // const changeDesc = (value) => {
    //   console.log(1111)
    //   desc.value = value
    // }
    // 组件五
    // const busData = ref<string>('')
    // // console.log(555, desc.value);
    // onMounted(() => {
    //   console.log($mybus, 2345)
    //   // $mybus.$on('desc', (data: string) => {
    //   //   console.log(6666, data)
    //   //   desc.value = data
    //   // })

    //   // console.log(135235151)

    //   // $mybus.$emit('bobo', desc.value)
    // })
    // watchEffect(() => {
    //   console.log(3333)
    //   bus.$emit('props', desc.value)
    // })
    // watch(items[3], () => {
    //   bus.$emit('props', items[3].desc)
    // })
    
    // 注意： bus.$on写在onMounted里面 不会执行
    // onBeforeMount(() => {
    //   console.log('######### Left onBeforeMount ##################')
    // })

    // provide('parent', {
    //   title,
    //   desc,
    //   changeDesc
    // })

  // const items = reactive(groupItems)

  // // 组件六
  // const basicTechStore = useBasicTechStoreWithOut()
  // let now = formatToDateTimeSss(new Date().getTime())
  // // 设置值
  // basicTechStore.setTitle('Set ->' + now)
  // watchEffect(() => {
  //   items[4].desc = basicTechStore.getDesc('#')
  // })


  // 组件四（因为组件三单独拎出去了）
  // provide('parent', items[2])
  // const changeFourDesc = (value) => {
  //   items[2].desc = value
  // }

  // // 组件三
  // const threeDesc = ref('ref「特殊attribute」 被用来注册引用信息')
  // 给子组件定义一个ref变量
  // const refChild = ref(null);
  // watchEffect(() => {
  //   if (refChild.value) {
  //     refChild.value.sayHi = desc.value
  //   }
  // })
  // // ??? 这里需要用「onUpdated」，而不能用「onMounted」：原因可能是onMounted时，子组件 defineExpose 的暴露内容还没成功 ???
  // onUpdated(async () => {
  //   // await nextTick()
  //   root.value.sayHi = '我是从父组件change的值'
  //   console.log(root.value.sayHi)
    
  //   // setTimeout(() => {
  //   //   root.value.sayHi = '我是从父组件change的值'
  //   //   console.log(root.value.sayHi)
  //   // }, 3000)
  // })
  // const tranDesc = () => {
  //   let now = formatToDateTimeSss(new Date().getTime())
  //   root.value.sayHi = '我是从父组件change的值' + now
  //   console.log(root.value.sayHi)
  // }
  // const changeThreeDesc = (value) => {
  //   threeDesc.value = value
  // }
  
  // const desc = ref('我是描述')
  // // 组件一
  // const changeDesc = (value) => {
  //   desc.value = value
  // }
</script>
<style lang="less" scoped>
  .son-box {
    border-radius: 5px;
    border: 1px dashed @border-color-dark;
    background: @content-bg;
  }
  html[data-theme='dark'] {
    .son-box {
      border-radius: 5px;
      border: 1px dashed var(--sider-dark-bg-color);
      background: var(--sider-dark-bg-color);
    }
  }
</style>
