<template>
  <div id="app">
    <h1 style="color:#000;">Vue 2</h1>
    <p>{{ a }}</p>
    <p>{{ b }}</p>
    <p>{{ c }}</p>
    <p @click="showA">点击我 a</p>
    <p @click="showB">点击我 b</p>
    <p @click="showC">点击我 C</p>
    <br/>
    <p @click="addArrs">数组加一</p>
    <p @click="editArrs">数组第一项变更</p>
    <ul>
      <li v-for="item in arrs" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
import a from './mixins/a'
import b from './mixins/b'
export default {
  name: 'App',
  mixins: [a, b],
  data () {
    return {
      a: 8,
      b: 9,
      c: 10,
      arrs: [1, 2, 3, 4]
      // showA: 123
    }
  },
  watch: {
    arrs (newVal, oldVal) {
      console.log(111111, newVal, oldVal)
    }
  },
  methods: {
    showC: () => {
      alert('CCCC')
    },
    addArrs () {
      this.arrs.push(5)
    },
    editArrs() {
      console.log('触发变化')
      this.arrs[0] = 688
    }
  },
}
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
