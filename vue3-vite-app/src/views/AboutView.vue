<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h2>
      项目当前环境为：<span>{{ C_MODE }}</span>
    </h2>
    <h2>
      项目当前配置的 VITE_BASE_URL 为：<span>{{ C_BASE_URL || "--" }}</span>
    </h2>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
h1 {
  font-size: 20px;
}
h2 {
  font-size: 16px;
}
span {
  color: #f60;
  font-weight: bold;
}
</style>

<script setup>
import { C_APP_NAME, C_BASE_URL, C_MODE } from "../utils/envConfig";
console.log(C_APP_NAME, C_BASE_URL, C_MODE);
</script>
