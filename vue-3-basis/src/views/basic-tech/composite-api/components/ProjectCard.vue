<template>
  <Card title="基础语法" v-bind="$attrs">
    <!-- <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template> -->

    <template v-for="item in items" :key="item">
      <CardGrid class="!md:w-1/3 !w-full">
        <span class="flex">
          <!-- <Icon :icon="item.icon" :color="item.color" size="30" /> -->
          <span class="text-lg ml-4">{{ item.title }}</span>
        </span>
        <div class="flex mt-2 h-10 text-secondary">{{ item.desc }}</div>
        <div class="flex justify-between text-secondary">
          <span>{{ item.interpret }}</span>
        </div>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts" setup>
  import { defineComponent } from 'vue';
  import { Card, CardGrid } from 'ant-design-vue';
  import { groupItems as items } from './data';
</script>
