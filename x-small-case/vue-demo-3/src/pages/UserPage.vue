<template>
  <div class="about" style="border: 2px solid blue;">
    <h1>{{ msg }}</h1>
    <p>$route.query: {{ $route.query }}</p>
    <p>$route.params: {{ $route.params }}</p>
    <p>ID: {{ $route.params.id }}</p>
    <p>简化 ID: {{ id }}</p>
    <router-link class="link" to="/">返回Home Page</router-link>

     <router-view></router-view>
  </div>
</template>

<script setup>
  import { defineProps, onMounted } from 'vue'
  import { useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
  defineProps({
    id: Number
  })
  
  const msg = 'User page'

  const router = useRouter();

  onMounted(() => {
    console.log('=== Router: ', router);
  });

  onBeforeRouteLeave((to, from) => {
    console.log('================= onBeforeRouteLeave: ', to, from)
  });
  onBeforeRouteUpdate((to, from) => {
    console.log('================ onBeforeRouteUpdate: ', to, from)
  });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
