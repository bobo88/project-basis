<template>
<div>
    <div style="margin-bottom: 10px; border:2px solid #000;">
      <h1 style="color:#f00;">Vue 3 (App.vue)</h1>
      <!-- <h1>{{ useTabs.tabs }}</h1>
      <h1>{{ useB.tabs }}</h1> -->
      <h1>{{ useTabs.tabs }}</h1>
      <p>
        {{ Obj }}
      </p>
    </div>

    <router-view></router-view>
</div>
</template>

<script setup>
import { isProxy, reactive } from 'vue'

import useTabs from './hooks/useTabs'
import useB from './hooks/useB'
console.log(666, useTabs, useB)
const Obj = reactive({
  vv: 123,
  data: {
    a: 1,
    b: 2,
    c: 3
  },
  arrs: [1, 2, 3, 4]
});

setTimeout(() => {
  Obj.vv = 234;
  Obj.data.d = 4;
  Obj.data.f = 5;
  Obj.arrs[0] = 8; 
  console.log(666, isProxy(Obj.arrs))
}, 500)

const person = new Proxy({}, {
  getter (target, propKey) {
    console.log(1111)
    return target[propKey]
  },
  setter (target, propKey, value) {
    console.log(2222)
    target[propKey] = value;
  }
})
person.name = 'Bob 大帅哥'
console.log('person.name: ', person.name)


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
