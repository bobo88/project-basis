<template>
  <Card title="组件间通信方式汇总" v-bind="$attrs">
    <template v-for="(item, index) in items" :key="item">
      <CardGrid class="!md:w-1/2 !w-full">
        <span class="flex">
          <span class="text-lg ml-4">方式{{ index + 1 }}: {{ item.title }}</span>
        </span>
        <div class="flex mt-2 h-10 text-secondary">{{ item.desc }}</div>
        <div class="flex justify-between text-secondary">
          <span>{{ item.interpret }}</span>
        </div>
        <div class="son-box p-4">
          <p>我是子组件</p>
          <One :data-props="item.title" :data-desc="item.desc" @changeDesc="changeOneDesc" v-if="item.childSlotName === 'One'" />
          <Two v-model="item.title" v-model:desc="item.desc" v-if="item.childSlotName === 'Two'" />
          <!-- <Three ref="root" v-if="item.childSlotName === 'Three'" /> -->
          <Four @changeDesc="changeFourDesc" v-if="item.childSlotName === 'Four'" />
          <Five v-if="item.childSlotName === 'Five'" />
          <Six v-if="item.childSlotName === 'Six'" />
          <!-- <Seven v-if="item.childSlotName === 'Seven'" /> -->
        </div>
      </CardGrid>
    </template>

    <!-- ? 组件三 ref / emits 不能if判断 -->
    <CardGrid class="!md:w-1/2 !w-full">
      <span class="flex">
        <span class="text-lg ml-4">
          方式{{ items.length + 1 }}:(ref + expose) / emits
          <a-button type="success" @click="tranDesc">传数据给子组件</a-button>
        </span>
      </span>
      <div class="flex mt-2 h-10 text-secondary">{{ threeDesc }}</div>
      <div class="flex justify-between text-secondary">
        <span>TODO</span>
      </div>
      <div class="son-box p-4">
        <p>我是子组件</p>
        <Three ref="root" @changeDesc="changeThreeDesc" />
      </div>
    </CardGrid>
  </Card>

</template>
<script lang="ts" setup>
  import { onMounted, onUpdated, defineComponent, reactive, toRefs, ref, provide, nextTick, watch, watchEffect, computed } from 'vue';
  import { Card, CardGrid, Button} from 'ant-design-vue';
  import { formatToDateTimeSss } from '/@/utils/dateUtil';
  import One from './One.vue'
  import Two from './Two.vue'
  import Three from './Three.vue'
  import Four from './Four.vue'
  import Five from './Five.vue'
  import Six from './Six.vue'
  // import Seven from './Seven.vue'
  import { groupItems } from './data';
  import bus from './bus';
  // pinia
  import { useBasicTechStoreWithOut } from './piniaTest';

  const items = reactive(groupItems)

  // 组件六
  const basicTechStore = useBasicTechStoreWithOut()
  let now = formatToDateTimeSss(new Date().getTime())
  // 设置值
  basicTechStore.setTitle('Set ->' + now)
  watchEffect(() => {
    items[4].desc = basicTechStore.getDesc('#')
  })

  // 组件五
  const busData = ref<string>('')
  bus.$on('desc', (data: string) => {
    items[3].desc = data
  })
  console.log(555, items[3].desc);
  onUpdated(() => {
    bus.$emit('props', items[3].desc)
  })
  watchEffect(() => {
    bus.$emit('props', items[3].desc)
  })
  // watch(items[3], () => {
  //   bus.$emit('props', items[3].desc)
  // })
  
  // 注意： bus.$on写在onMounted里面 不会执行
  // onBeforeMount(() => {
  //   console.log('######### Left onBeforeMount ##################')
  // })

  // 组件四（因为组件三单独拎出去了）
  provide('parent', items[2])
  const changeFourDesc = (value) => {
    items[2].desc = value
  }

  // 组件三
  const threeDesc = ref('ref「特殊attribute」 被用来注册引用信息')
  // 给子组件定义一个ref变量
  const root = ref(null);
  // ??? 这里需要用「onUpdated」，而不能用「onMounted」：原因可能是onMounted时，子组件 defineExpose 的暴露内容还没成功 ???
  onUpdated(async () => {
    // await nextTick()
    root.value.sayHi = '我是从父组件change的值'
    console.log(root.value.sayHi)
    
    // setTimeout(() => {
    //   root.value.sayHi = '我是从父组件change的值'
    //   console.log(root.value.sayHi)
    // }, 3000)
  })
  const tranDesc = () => {
    let now = formatToDateTimeSss(new Date().getTime())
    root.value.sayHi = '我是从父组件change的值' + now
    console.log(root.value.sayHi)
  }
  const changeThreeDesc = (value) => {
    threeDesc.value = value
  }
  watchEffect(() => {
    if (root.value) {
      let now = formatToDateTimeSss(new Date().getTime())
      root.value.sayHi = threeDesc.value
    }
  })

  // 组件一
  const changeOneDesc = (value) => {
    items[0].desc = value
  }
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
