<template>
  <div class="p-4">
    <div class="lg:flex">
      <div class="w-full enter-y">
        <ProjectCard :loading="loading" class="enter-y" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import ProjectCard from './components/ProjectCard.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
