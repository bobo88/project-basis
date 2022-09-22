import dateUtil from '@/utils/date'
import store from '@/store'
import { getToken } from '@/utils/auth'
const API_BASE_URL = process.env.VUE_APP_BASE_API

export default function({ url, data = {}, fileName = '', cb }) {
  try {
    // 导出文件日期，用于追加在Excel名称后面
    const dataStr = dateUtil.format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')
    const xhr = new XMLHttpRequest()

    xhr.responseType = 'blob' // 返回类型blob
    xhr.open('post', API_BASE_URL + url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      xhr.setRequestHeader('bi-token', 'Admin-Token=' + getToken())
      xhr.setRequestHeader('Authorization', 'Bearer ' + getToken())
      // xhr.setRequestHeader(['X-AUTH-TOKEN'], getToken())
    }
    // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
    xhr.onload = function() {
      // 请求完成
      if (this.status === 200) {
        // 返回200
        const blob = this.response
        const fileUrl = window.URL.createObjectURL(blob)
        console.log(fileUrl)

        const reader = new FileReader()
        reader.readAsDataURL(blob) // 转换为base64，可以直接放入a标签href
        reader.onload = function(e) {
          // 转换完成，创建一个a标签用于下载
          const a = document.createElement('a')
          a.download = fileName + dataStr + '.xlsx'
          // a.href = e.target.result
          a.href = fileUrl
          document.getElementsByTagName('body')[0].appendChild(a) // 修复firefox中无法触发click
          a.click()
          a.remove()
          if (typeof cb === 'function') {
            cb(true)
          }
        }
      }
    }
    // 以json格式为参数发送ajax请求
    xhr.send(JSON.stringify(data))
  } catch (e) {
    console.log(e)
    cb(false, e)
  }
}
