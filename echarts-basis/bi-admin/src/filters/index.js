// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// 年月日 格式化日期 MM-dd
export const dateFormatMmDd = (d) => {
  let s = ''
  const tempArr = d.split('-')
  if (tempArr && tempArr.length > 0) {
    s = tempArr[1] + '-' + tempArr[2]
  }
  return (s) // 返回日期。
}
// 时间戳 格式化日期 MM-dd
export const dateFormatMmDdFromTimestamp = (timestamp) => {
  var s = ''
  var mouth = (timestamp.getMonth() + 1) >= 10 ? (timestamp.getMonth() + 1) : ('0' + (timestamp.getMonth() + 1))
  var day = timestamp.getDate() >= 10 ? timestamp.getDate() : ('0' + timestamp.getDate())
  // s += timestamp.getFullYear() + '-'; // 获取年份。
  s += mouth + '-' // 获取月份。
  s += day // 获取日。
  return (s) // 返回日期。
}
// 格式化日期 yyyy-MM-dd
export const dateFormatYyyyMmDd = (timestamp) => {
  var s = ''
  var mouth = (timestamp.getMonth() + 1) >= 10 ? (timestamp.getMonth() + 1) : ('0' + (timestamp.getMonth() + 1))
  var day = timestamp.getDate() >= 10 ? timestamp.getDate() : ('0' + timestamp.getDate())
  s += timestamp.getFullYear() + '-' // 获取年份。
  s += mouth + '-' // 获取月份。
  s += day // 获取日。
  return (s) // 返回日期。
}
// 格式化日期 yyyyMMdd
export const dateFormatYyyyMmDdNoDivision = (timestamp) => {
  var _timestamp = new Date(timestamp)
  var s = ''
  var mouth = (_timestamp.getMonth() + 1) >= 10 ? (_timestamp.getMonth() + 1) : ('0' + (_timestamp.getMonth() + 1))
  var day = _timestamp.getDate() >= 10 ? _timestamp.getDate() : ('0' + _timestamp.getDate())
  s += _timestamp.getFullYear() + '-' // 获取年份。
  s += mouth + '-' // 获取月份。
  s += day // 获取日。
  return (s) // 返回日期。
}
// 获取格式化日期 yyyy-MM-dd 的日期集合
export const getDateFormatYyyyMmDdArr = (begin, end) => {
  var rtn = []
  var ab = begin.split('-')
  var ae = end.split('-')
  var db = new Date()
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
  var de = new Date()
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
  var unixDb = db.getTime()
  var unixDe = de.getTime()
  for (var k = unixDb; k <= unixDe;) {
    rtn.push(dateFormatYyyyMmDd(new Date(parseInt(k))))

    k = k + 24 * 60 * 60 * 1000
  }
  return rtn
}

/**
 * 格式化日期时间
 *
 * @param timestamp
 * @returns {*}
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) {
    return ''
  }

  return new Date(timestamp).toLocaleDateString()
}

/**
 * 格式化为本地日期时间
 *
 * @param timestamp
 * @returns {*}
 */
export const formatLocalTime = (timestamp) => {
  if (!timestamp) {
    return ''
  }
  const _time = new Date(timestamp).toLocaleString()
  return _time
}
/**
 * 格式化为日期时间 yyyy-MM-dd HH:mm:ss
 *
 * @param timestamp
 * @returns {*}
 */
export const formatYmdhmsTime = (time) => {
  if (!time) {
    return ''
  }
  const dateObj = new Date(time)
  return dateObj.toLocaleDateString() + ' ' + dateObj.toTimeString().split(' ')[0]
}
/**
 * 格式化为日期时间， 只返回HH:mm:ss
 *
 * @param timestamp
 * @returns {*}
 */
export const formatHmsTime = (time) => {
  if (!time) {
    return ''
  }
  const dateObj = new Date(time)
  return dateObj.toTimeString().split(' ')[0]
}
/**
 * 计算时间：将 秒 转换为 时分秒
 *
 * @param timestamp
 * @returns {*}
 */
export const computedHmsTime = (second) => {
  if (!second) {
    return ''
  }
  if (second < 60) {
    return `0分${second}秒`
  } else {
    const m = parseInt(second / 60)
    const s = second % 60
    return `${m}分${s}秒`
  }
}

/**
 * 格式化价格（DB存储时以‘分’为单位，显示时以‘元’为单位）
 * @param price
 * @returns {string}
 */
export const formatPrice = (price) => {
  return parseFloat(price / 100).toFixed(2)
}

export const numberFormat = (val) => {
  if (val) {
    var b = parseInt(val).toString()
    var len = b.length
    if (len <= 3) { return b }
    var r = len % 3
    return r > 0 ? b.slice(0, r) + ',' + b.slice(r, len).match(/\d{3}/g).join(',') : b.slice(r, len).match(/\d{3}/g).join(',')
  } else {
    return val
  }
}
export const toPercent = (val, num) => {
  if (val) {
    if (parseInt(num) > 0) {
      return (val * 100).toFixed(num) + '%'
    } else {
      return (val * 100).toFixed(2) + '%'
    }
  } else {
    return val
  }
}

/**
 * 格式化最大数量
 *
 * @param num 具体数值
 * @param maxNum 最大数值
 *    为空值则默认为 100 000
 * @returns {string} 格式化后的数值
 */
export const formatMaxNum = (num, maxNum) => {
  if (!maxNum) {
    maxNum = 100000
  }
  if (num > maxNum) {
    return maxNum + '+'
  } else {
    return String(num)
  }
}
export const filterReqData = (reqDataObj, recurse) => {
  for (const i in reqDataObj) {
    if (!(i === 'pageIndex')) {
      if (reqDataObj[i] === '' || reqDataObj[i] === 0 || reqDataObj[i] === null) {
        delete reqDataObj[i]
      } else if (reqDataObj[i] === '0') {
        reqDataObj[i] = parseInt(reqDataObj[i])
      } else if (recurse && typeof reqDataObj[i] === 'object') {
        filterReqData(reqDataObj[i], recurse)
      }
    }
  }
}
export const parseParam = function(data) {
  const _result = []
  for (var key in data) {
    var value = data[key]
    if (value.constructor === Array) {
      value.forEach(function(_value) {
        _result.push(key + '=' + _value)
      })
    } else {
      _result.push(key + '=' + value)
    }
  }
  return _result.join('&')
}
export const timeForMat = function(count) {
  // 拼接时间
  const time1 = new Date()
  time1.setTime(time1.getTime())
  const Y1 = time1.getFullYear()
  const M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  const D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
  const timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
  const time2 = new Date()
  time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * (count - 1)))
  const Y2 = time2.getFullYear()
  const M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  const D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
  const timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
  return {
    dayEnd: timer1,
    dayStart: timer2
  }
}
export const validateEmail = function(email) {
  const regEmail = new RegExp(/^[A-Z0-9a-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,5}$/)
  return regEmail.test(email)
}
export const validateTemplate = function(template) {
  const regTemplate = new RegExp(/^[0-9a-zA-Z`~!@$%^&*_+<>{}]+$/ig)
  return regTemplate.test(template)
}
export const deepClone = function(data) {
  const that = this
  const t = that.typeObj(data)
  let o
  let i
  let ni
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }
  if (t === 'array') {
    for (i = 0, ni = data.length; i < ni; i++) {
      o.push(that.deepClone(data[i]))
    }
    return o
  } else if (t === 'object') {
    for (i in data) {
      o[i] = that.deepClone(data[i])
    }
    return o
  }
}
export const typeObj = function(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}
