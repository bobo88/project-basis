<template>
  <div class="p-4">
    <div class="md:flex enter-y">
      <keep-alive>
        <LifecycleCard class="md:w-1/2 w-full" :loading="loading" />
      </keep-alive>
      <keep-alive>
        <LifecycleCardSon class="md:w-1/2 !md:ml-4 w-full" :loading="loading" />
      </keep-alive>
    </div>
    <p class="p-4 md:flex enter-y">
      结论一(setup)： 父onBeforeMount --> 父onMounted --> 子onBeforeMount --> 子onMounted<br/>
      结论二(setup)： 父onBeforeUpdate --> 父onUpdated --> 子onBeforeUpdate --> 子onUpdated
    </p>
    <div class="md:flex enter-y">
      <keep-alive>
        <OptionsLifecycleCard class="md:w-1/2 w-full" :loading="loading" />
      </keep-alive>
    </div>
    <p class="p-4 md:flex enter-y">
      setup --> beforeCreate --> created --> onBeforeMount --> beforeMount --> onMounted --> mounted
      --> onActivated --> onBeforeUpdate --> beforeUpdate --> onUpdated --> updated
      <br />
      结论： 「setup」里面的钩子函数比「options方式」的钩子函数执行的时机「更早」一点
    </p>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import LifecycleCard from './components/LifecycleCard.vue';
  import LifecycleCardSon from './components/LifecycleCardSon.vue';
  import OptionsLifecycleCard from './components/OptionsLifecycleCard.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
<style lang="less" scoped>
  .tc {
    text-align: center;
  }
</style>
