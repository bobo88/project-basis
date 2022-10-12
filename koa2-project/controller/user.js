// 2.4 controller/user.js
// const { exec, escape } = require('../conf/mysql')
const { genPassword } = require('../utils/cryp')

// 登录
const logIn = async (loginData) => {
  // const username = escape(loginData.username)
  // 生成加密密码
  let password = genPassword(loginData.password)
  // password = escape(password)
  // const sql = `SELECT username, realname FROM users WHERE username=${username} AND password=${password}`
  // const rows = await exec(sql)
  // return rows[0] || {}
  return {
    code: 1234,
  }
}
// 退出登录
const logOut = async (logoutData = {}) => {
  return true
}
module.exports = {
  logIn,
  logOut
}