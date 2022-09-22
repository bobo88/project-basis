'user strict'
const date = {}

/**
 * 分割符类型
 * @type {string[]}
 */
date.dividers = ['-', ':']

/**
 * 格式化时间数值
 * @param num
 * @returns {string}
 */
date.formatTimeNumber = function(num) {
  return parseInt(num) < 10 ? '0' + num : num
}

/**
 * 格式化日期
 * @param mS
 * @param dividerType
 * @returns {*}
 */
date.date = function(mS, dividerType) {
  if (!mS) {
    mS = new Date().valueOf()
  }
  dividerType = parseInt(dividerType || 0)
  var divider = this.dividers[dividerType]
  var date = new Date(parseInt(mS))
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var monthDate = date.getDate()
  return year + divider + this.formatTimeNumber(month) + divider + this.formatTimeNumber(monthDate)
}

/**
 * 格式化时间
 * @param nS
 * @param dividerType
 * @returns {string}
 */
date.time = function(mS, dividerType) {
  if (!mS) return ''
  dividerType = parseInt(dividerType || 1)
  var divider = this.dividers[dividerType]
  var date = new Date(parseInt(mS))
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return this.formatTimeNumber(hour) + divider + this.formatTimeNumber(minute) + divider + this.formatTimeNumber(second)
}

/**
 * 格式化日期时间
 * @param mS
 * @param dateDividerType
 * @param timeDividerType
 * @returns {*}
 */
date.dateTime = function(mS, dateDividerType, timeDividerType) {
  if (!mS) return ''
  dateDividerType = parseInt(dateDividerType || 0)
  timeDividerType = parseInt(timeDividerType || 1)
  var dateStr = this.date(mS, dateDividerType)
  var timeStr = this.time(mS, timeDividerType)
  return dateStr + ' ' + timeStr
}

/**
 * 格式化距离当前时间过去了多久
 *
 * @param createTimestamp   创建时间
 * @param currentTimestamp  当前时间（服务器时间），为空则使用本地时间（本地时间可能不准确）
 * @returns {*} 距离当前时间过去了多久
 */
date.dateDistance = function(createTimestamp, currentTimestamp) {
  if (!createTimestamp) return ''

  if (!currentTimestamp) {
    currentTimestamp = new Date().getTime()
  }
  var time = currentTimestamp - createTimestamp // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return ''
  } else if ((time < 30)) {
    return '刚刚'
  } else if (time < 60) {
    return parseInt((time)) + '秒前'
  } else if ((time / 60) < 60) {
    return parseInt((time / 60)) + '分钟前'
  } else if ((time / 3600) < 24) {
    return parseInt(time / 3600) + '小时前'
  } else if ((time / 86400) < 31) {
    return parseInt(time / 86400) + '天前'
  } else if ((time / 2592000) < 12) {
    return parseInt(time / 2592000) + '月前'
  } else {
    return parseInt(time / 31536000) + '年前'
  }
}

date.format = function(t, formater) {
  const date = t ? new Date(t) : new Date()
  const Y = date.getFullYear() + ''
  const M = date.getMonth() + 1
  const D = date.getDate()
  const H = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return formater.replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/gi, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/gi, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/gi, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/gi, (s < 10 ? '0' : '') + s)
}

export default date
