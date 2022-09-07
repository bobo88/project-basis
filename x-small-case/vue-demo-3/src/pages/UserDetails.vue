<template>
  <div class="user-details" style="padding: 20px;">
    <div style="padding:20px; border: 2px solid #f00">
      <h1 style="color: #f60;">{{ msg }}</h1>
      <p>$route.query: {{ $route.query }}</p>
      <p>ID: {{ id }}</p>

      <router-link class="link" to="/">返回Home Page</router-link>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  defineProps({
    id: Number
  })
  
  const msg = 'User Details'

  const router = useRouter();

  onMounted(() => {
    console.log('=== Router: ', router);
  })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
