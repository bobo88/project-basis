import request from '@/utils/request'
// import { options } from 'runjs'

// -------------------------- 通用配置 --------------------------------------
// 2.8. 配置数据
// 2.8.1. 配置数据-品牌
export function commonConfigBrand(token) {
  return request({
    url: '/common_config/brand?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 2.8.2. 配置数据-渠道 #### normal
export function commonConfigChannel(token) {
  return request({
    url: '/common_config/channel?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 2.8.3. 配置数据-国家 #### normal
export function commonConfigCountry(token) {
  return request({
    url: '/common_config/country?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 2.8.4. 配置数据-首次启动渠道
export function commonConfigFristStartupChannel(options) {
  return request({
    url: '/common_config/first_startup_channel?project=' + localStorage.getItem('project') + '&startMode=' + options.startMode,
    method: 'get',
    params: {}
  })
}
// 2.8.5. 配置数据-首次启动方式
export function commonConfigFirstStartupMode(token) {
  return request({
    url: '/common_config/first_startup_mode?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 2.8.6. 配置数据-网络状态
export function commonConfigNetType(token) {
  return request({
    url: '/common_config/net_type?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 2.8.7. 配置数据-流量来源
export function commonConfigTrafficSource(token) {
  return request({
    url: '/common_config/traffic_source?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 2.8.8. 配置数据-版本 #### normal
export function commonConfigVersion(options = {}) {
  let _url = '/common_config/version?project=' + localStorage.getItem('project')
  if (options && options.versionRange) {
    _url += '&versionRange=' + options.versionRange
  }
  return request({
    url: _url,
    method: 'get'
    // params: { token }
  })
}
// 系统版本
export function commonConfigOsVersion(token) {
  return request({
    url: '/common_config/os_version?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// -------------------------- 综合概览 --------------------------------------
// 昨日用户渠道分布
export function getUserByChannelYesterday(token) {
  console.log(localStorage.getItem('project'), 88888)
  return request({
    url: '/dashboard/user_by_channel_yesterday?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 用户按国家分布
export function getUserByCountry(token) {
  return request({
    url: '/dashboard/user_by_country?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 昨日用户版本分布
export function getUserByVersionYesterday(token) {
  return request({
    url: '/dashboard/user_by_version_yesterday?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 最近7日用户
export function getUsersIn7day(token) {
  return request({
    url: '/dashboard/user_in_7day?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 用户独立数字记录
export function getUsersNumber(token) {
  return request({
    url: '/dashboard/user_number?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 视频生产数据
export function getVideoProduct(token) {
  return request({
    url: '/dashboard/video_product?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 最近7天vv数
export function getVV(token) {
  return request({
    url: '/dashboard/vv?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 最近VS_App7天vv数
export function getVS_AppVV(token) {
  return request({
    url: '/dashboard/VS_App_vv_download?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}
// 最近7天vv分布
// 注意: 因为Mock的原因， 这里 vvRange 改成了vRange
export function getVvRange(token) {
  return request({
    url: '/dashboard/vvRange?project=' + localStorage.getItem('project'),
    method: 'get',
    params: { token }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
