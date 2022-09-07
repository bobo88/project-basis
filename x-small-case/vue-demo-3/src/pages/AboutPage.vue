<template>
  <div class="about">
    <h1>{{ msg }}</h1>
    <router-link class="link" to="/">返回Home Page</router-link>
  </div>
</template>

<script setup>
  const msg = 'About page'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
