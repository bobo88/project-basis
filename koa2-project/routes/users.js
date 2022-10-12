// routes/user.js
const router = require('koa-router')()
const { logIn, logOut } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
// const loginCheck = require('../middleware/loginCheck')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../conf/constants')

router.prefix('/users')

// 登录
router.post('/login', async function (ctx, next) {
  const body = ctx.request.body
  if (!body.username || !body.password) {
    ctx.body = new ErrorModel('字段缺失')
  } else {
    // ====== mock 模拟方式
    let payload = {time:new Date().getTime(), timeout: 1000 * 60 * 60 * 2}
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '7d'})
    
    ctx.body = new SuccessModel({
      username: body.username,
      msg: '恭喜您，成功登录',
      token
    })

    // ====== 调用 mysql 方式
    // const data = await logIn(body)
    // if (data.username) {
    //   let payload = {time:new Date().getTime(), timeout: 1000 * 60 * 60 * 2}
    //   const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '7d'})
    //   data.token = token
    //   // 设置session
    //   ctx.session.username = data.username
    //   ctx.session.realname = data.realname
    //   ctx.body = new SuccessModel(data)
    //   return
    // }
    // ctx.body = new ErrorModel('登录失败')
  }
})
// 退出登录
router.post('/logout', async function (ctx, next) {
  const body = ctx.request.body
  const data = await logOut(body)
  ctx.session = null
  ctx.body = new SuccessModel(data)
})

module.exports = router