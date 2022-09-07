<template>
  <div class="hello" style="border: 2px solid #f60">
    <h1>{{ msg }}</h1>
    <router-link class="link" to="/about">About Page</router-link>

    <router-link class="link" to="/user">User Page</router-link>
    <router-link class="link" :to="{ name: 'user', query: { id: 123 }}">User Page 带参数query</router-link>
    <router-link class="link" :to="{ name: 'user'}">User Page(name跳转)</router-link>
    <router-link class="link" :to="{ name: 'userid', params: { id: 688 }}">User Page/ID</router-link>
    <router-link class="link" :to="{ path: '/user/details', query: { id: 123 }}">User Details</router-link>
    <router-link class="link" :to="{ name: 'login', query: { id: 123 }}">登录页面</router-link>
  </div>
</template>

<script setup>
  const msg = 'Home page'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
.link {
  display: block;
  margin-bottom: 20px;
}
</style>
