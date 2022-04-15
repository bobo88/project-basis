// ------------ 使用pinia ----------------
import { defineStore } from 'pinia'
import ConstantsPinia from '@/constants/pinia'

interface StateType {
  isCollapse: boolean,
  counter: number,
  name: string,
}

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useMainStore = defineStore({
  id: 'main',
  // a function that returns a fresh state
  state: (): StateType => ({
    // isCollapse: true - 折叠, false - 展开, default - false
    isCollapse: false,
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    // getters receive the state as first parameter
    doubleCount: (state) => state.counter * 2,
    // use getters in other getters
    doubleCountPlusOne(): number {
      return this.doubleCount + 1
    },
  },
  // optional actions
  actions: {
    [ConstantsPinia.SET_LEFT_COLUMN](isCollapse: boolean){
      this.isCollapse = isCollapse
    },
    reset() {
      // `this` is the store instance
      this.counter = 0
    },
    increment() {
      this.counter++;
    },
    countPlus(num: number) {
      this.counter += num;
    }
  },
  // // 开启缓存
  persist: {
    enabled: true,
    // 自定义 key
    strategies: [
      {
        key: 'my_user',
        storage: localStorage,
      },
      {
        // 持久化部分 state
        // 默认所有 state 都会进行缓存，你可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
        // 未指定 key 的话，则直接存到当前store的名下
        storage: localStorage,
        paths: ['name']
      },
      {
        // 未指定 storage，则缓存到 Session Storage里面
        key: 'Counter'
      }
    ]
  }
})
