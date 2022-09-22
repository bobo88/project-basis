import Vue from 'vue'

import Cookies from 'js-cookie'
import localStore from 'store'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// import i18n from './assets/lang'
// 国际化
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
Vue.use(VueI18n)
/* ---------使用语言包----------- */
const messages = { en: Object.assign({}, require('./assets/lang/en'), { ...enLocale }), zh: Object.assign({}, require('./assets/lang/zh'), { ...zhLocale })
}
// locale语言标识（注意：为了在js中能切换语言，vue实例created时，会先对该属性进行改变操作，以便vue实例能监控$i18n.locale，实现对data默认属性的赋值）
// set locale
const i18n = new VueI18n({ locale: localStorage.getItem('language') ? localStorage.getItem('language') : 'en', messages })
ElementLocale.i18n((key, value) => i18n.t(key, value))

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import echarts from 'echarts'
import chalkData from './utils/chalk.project.json'
import africaData from './utils/africa.json'
// const obj = JSON.parse(chalkData)
// console.log(chalkData)
echarts.registerTheme('chalk', chalkData.theme)
echarts.registerMap('africa', africaData)

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// 添加Vue的原型链(只读)
Object.defineProperty(Vue.prototype, '$echarts', {
  value: echarts
})
Object.defineProperty(Vue.prototype, '$chalk', {
  value: chalkData.theme
})
// 添加Vue的原型链(只读)
Object.defineProperty(Vue.prototype, '$filters', { value: filters })
Object.defineProperty(Vue.prototype, '$localStore', { value: localStore })

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  i18n, // 注入国际化
  router,
  store,
  render: h => h(App)
})
