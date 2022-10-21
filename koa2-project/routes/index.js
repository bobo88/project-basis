const router = require('koa-router')()
const { getDirNames, getChildren } = require('../readdirDocs');
const path = require('path')

const BASE_PATH = '../docs/.vuepress/dist'
// console.log(getDirNames(BASE_PATH + '/'))
// console.log(path.dirname(), path.basename())
// console.log(getChildren(BASE_PATH + '/react/'))

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.get('/getAllArticles', async (ctx, next) => {
  const allArticles = {};
  const dirNames = getDirNames(BASE_PATH + '/');
  // console.log(dirNames, 111)
  dirNames.map(item => {
    allArticles[item] = getChildren(BASE_PATH + `/${item}/`)
  });
  // console.log(555, allArticles)
  ctx.body = allArticles
})

module.exports = router
