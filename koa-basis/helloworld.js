const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000, () => {
    console.log('服务器已经运行在 3000 端口了')
});