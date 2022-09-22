import request from '@/utils/request'
import exportExcel from '@/utils/exportExcel'

export function login(data) {
  // console.log(688, data, data.password)
  return request({
    url: '/login',
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  })
}
export function getPermInfo(options) {
  // console.log(688, data, data.password)
  return request({
    url: '/getPermInfo',
    method: 'get',
    params: options
  })
}

export function getInfo(options) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: options
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

// =================== 导出数据 =========================
// export - 召回用户数据： 导出流失用户数
export function excel_lose_user(options) {
  return exportExcel({
    url: '/recall_user/excel_lose_user',
    method: 'post',
    data: options,
    fileName: '流失用户数'
  })
}
// export - 召回用户数据： 导出push召回率
export function excel_push_racall(options) {
  return exportExcel({
    url: '/recall_user/excel_push_racall',
    method: 'post',
    data: options,
    fileName: 'push召回率'
  })
}
// export - 召回用户数据： 导出召回用户数
export function excel_recall_user(options) {
  return exportExcel({
    url: '/recall_user/excel_recall_user',
    method: 'post',
    data: options,
    fileName: '召回用户数'
  })
}
// export - 召回用户数据： 导出沉默用户数
export function excel_silence_user(options) {
  return exportExcel({
    url: '/recall_user/excel_silence_user',
    method: 'post',
    data: options,
    fileName: '沉默用户数'
  })
}
// export - 召回用户数据： 导出卸载率
export function excel_uninstall_rate(options) {
  return exportExcel({
    url: '/recall_user/excel_uninstall_rate',
    method: 'post',
    data: options,
    fileName: '卸载率'
  })
}
// export - 新增用户页面数据： 导出新增用户
export function excel_new_user(options) {
  return exportExcel({
    url: '/new_user/excel_new_user',
    method: 'post',
    data: options,
    fileName: '新增用户'
  })
}
// export - 新增用户页面数据：  导出新增注册用户
export function excel_registered_user(options) {
  return exportExcel({
    url: '/new_user/excel_registered_user',
    method: 'post',
    data: options,
    fileName: '新增注册用户'
  })
}
// export - 活跃用户数据：  导出活跃度
export function excel_activation(options) {
  return exportExcel({
    url: '/active_user/excel_activation',
    method: 'post',
    data: options,
    fileName: '活跃度'
  })
}
// export - 活跃用户数据：  导出活跃用户构成
export function excel_active_structure(options) {
  return exportExcel({
    url: '/active_user/excel_active_structure',
    method: 'post',
    data: options,
    fileName: '活跃用户构成'
  })
}
// export - 活跃用户数据：  导出活跃用户
export function excel_active_user(options) {
  return exportExcel({
    url: '/active_user/excel_active_user',
    method: 'post',
    data: options,
    fileName: '活跃用户'
  })
}
// export - 活跃用户数据：  导出平均启动间隔时长
export function excel_avg_between(options) {
  return exportExcel({
    url: '/active_user/excel_avg_between',
    method: 'post',
    data: options,
    fileName: '平均启动间隔时长'
  })
}
// export - 活跃用户数据：  导出人均启动次数
export function excel_avg_start(options) {
  return exportExcel({
    url: '/active_user/excel_avg_start',
    method: 'post',
    data: options,
    fileName: '人均启动次数'
  })
}
// export - 活跃用户数据：  导出平均使用时长
export function excel_avg_use_time(options) {
  return exportExcel({
    url: '/active_user/excel_avg_use_time',
    method: 'post',
    data: options,
    fileName: '平均使用时长'
  })
}
// export - 活跃用户数据：  导出后台活跃用户
export function excel_back_active(options) {
  return exportExcel({
    url: '/active_user/excel_back_active',
    method: 'post',
    data: options,
    fileName: '后台活跃用户'
  })
}
// export - 活跃用户数据：  导出登录活跃用户
export function excel_login_active(options) {
  return exportExcel({
    url: '/active_user/excel_login_active',
    method: 'post',
    data: options,
    fileName: '登录活跃用户'
  })
}
// export - 活跃用户数据：  导出启动天频
export function excel_start_frequency(options) {
  return exportExcel({
    url: '/active_user/excel_start_frequency',
    method: 'post',
    data: options,
    fileName: '启动天频'
  })
}
// export - 活跃用户数据：  导出升级用户数
export function excel_update_active(options) {
  return exportExcel({
    url: '/active_user/excel_update_active',
    method: 'post',
    data: options,
    fileName: '升级用户数'
  })
}
// export - 留存用户数据：  导出活跃留存用户
export function excel_active_remain(options) {
  return exportExcel({
    url: '/remain_user/excel_active_remain',
    method: 'post',
    data: options,
    fileName: '活跃留存用户'
  })
}
// export - 留存用户数据：  导出新增留存用户
export function excel_new_remain(options) {
  return exportExcel({
    url: '/remain_user/excel_new_remain',
    method: 'post',
    data: options,
    fileName: '新增留存用户'
  })
}
// export - 留存用户数据：  导出老用户留存数据
export function excel_old_remain(options) {
  return exportExcel({
    url: '/remain_user/excel_old_remain',
    method: 'post',
    data: options,
    fileName: '老用户留存数据'
  })
}
// export - 裂变用户数据：  导出k因子
export function excel_k_factor(options) {
  return exportExcel({
    url: '/fission_user/excel_k_factor',
    method: 'post',
    data: options,
    fileName: 'k因子'
  })
}
// export - 裂变用户数据：  导出用户分享率
export function excel_share_rate(options) {
  return exportExcel({
    url: '/fission_user/excel_share_rate',
    method: 'post',
    data: options,
    fileName: '用户分享率'
  })
}
// export - 裂变用户数据：  导出分享回流率
export function excel_share_reflux_rate(options) {
  return exportExcel({
    url: '/fission_user/excel_share_reflux_rate',
    method: 'post',
    data: options,
    fileName: '分享回流率'
  })
}
// =================== 2.1. 召回用户数据 =========================
// 2.1.1. 流失用户数
export function recallUserLostUser(options) {
  return request({
    url: '/recall_user/lost_user',
    method: 'post',
    data: options
  })
}
// 2.1.2. push召回率
export function recallUserPushRecallRate(options) {
  return request({
    url: '/recall_user/push_recall_rate',
    method: 'post',
    data: options
  })
}
// 2.1.3. 召回用户数
export function recallUserRecallUserInfo(options) {
  return request({
    url: '/recall_user/recall_user_info',
    method: 'post',
    data: options
  })
}
// 2.1.4. 沉默用户数
export function recallUserSilenceUser(options) {
  return request({
    url: '/recall_user/silence_user',
    method: 'post',
    data: options
  })
}
// 2.1.5. 卸载率
export function recallUserUninstallRate(options) {
  return request({
    url: '/recall_user/uninstall_rate',
    method: 'post',
    data: options
  })
}
// =================== 2.3. 新增用户页面数据 =========================
// 2.3.1. 新增注册用户
export function newUserNewRegisteredUser(options) {
  return request({
    url: '/new_user/new_registered_user',
    method: 'post',
    data: options
  })
}
// 2.3.2. 新增用户
export function newUserNewUserInfo(options) {
  return request({
    url: '/new_user/new_user_info',
    method: 'post',
    data: options
  })
}
// =================== 2.4. 活跃用户数据 =========================
// 2.4.1. 活跃度
export function activeUserActivation(options) {
  return request({
    url: '/active_user/activation',
    method: 'post',
    data: options
  })
}
// 2.4.2. 活跃用户
export function activeUserActiveUserInfo(options) {
  return request({
    url: '/active_user/active_user_info',
    method: 'post',
    data: options
  })
}
// 2.4.3. 活跃用户构成
export function activeUserActiveUserStructure(options) {
  return request({
    url: '/active_user/active_user_structure',
    method: 'post',
    data: options
  })
}
// 2.4.4. 人均启动次数
export function activeUserAvgStartNum(options) {
  return request({
    url: '/active_user/avg_start_num',
    method: 'post',
    data: options
  })
}
// 2.4.5. 平均启动间隔时长
export function activeUserAvgTimeBetweenStart(options) {
  return request({
    url: '/active_user/avg_time_between_start',
    method: 'post',
    data: options
  })
}
// 2.4.6. 平均使用时长
export function activeUserAvgUseTime(options) {
  return request({
    url: '/active_user/avg_use_time',
    method: 'post',
    data: options
  })
}
// 2.4.7. 后台活跃用户
export function activeUserBackActiveUser(options) {
  return request({
    url: '/active_user/back_active_user',
    method: 'post',
    data: options
  })
}
// 2.4.8. 登录活跃用户
export function activeUserLoginActiveUser(options) {
  return request({
    url: '/active_user/login_active_user',
    method: 'post',
    data: options
  })
}
// 2.4.9. 启动天频
export function activeUserStartDayFrequency(options) {
  return request({
    url: '/active_user/start_day_frequency',
    method: 'post',
    data: options
  })
}
// 2.4.10. 升级用户数
export function activeUserUpdateUser(options) {
  return request({
    url: '/active_user/update_user',
    method: 'post',
    data: options
  })
}
// =================== 2.6. 留存用户数据 =========================
// 2.6.1. 活跃用户留存
export function remainUserActiveUserRemain(options) {
  return request({
    url: '/remain_user/active_user_remain',
    method: 'post',
    data: options
  })
}
// 2.6.2. 新增用户留存
export function remainUserNewUserRemain(options) {
  return request({
    // url: '/remain_user/new_user_remain',
    url: '/remain_user/new_user_remain',
    method: 'post',
    data: options
  })
}
// 2.6.3. 老用户留存
export function remainUserOldUserRemain(options) {
  return request({
    url: '/remain_user/old_user_remain',
    method: 'post',
    data: options
  })
}
// 2.6.4. 留存用户维度对比平均值
export function remainUserRemainCompare(options) {
  return request({
    url: '/remain_user/remain_compare',
    method: 'post',
    data: options
  })
}
// =================== 2.7. 裂变用户数据 =========================
// 2.7.1. k因子
export function fissionUserKFactor(options) {
  return request({
    url: '/fission_user/k_factor',
    method: 'post',
    data: options
  })
}
// 2.7.2. 分享回流率
export function fissionUserShareRefluxRate(options) {
  return request({
    url: '/fission_user/share_reflux_rate',
    method: 'post',
    data: options
  })
}
// 2.7.3. 用户分享率
export function fissionUserUserShareRate(options) {
  return request({
    url: '/fission_user/user_share_rate',
    method: 'post',
    data: options
  })
}

