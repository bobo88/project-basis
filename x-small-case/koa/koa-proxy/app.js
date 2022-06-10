const Koa = require('koa')

const app = new Koa()

const proxy = require('koa-server-http-proxy')

app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   const contentType = 'application/json;charset=UTF-8';
  const contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  ctx.set('Content-Type', contentType);
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

app.use(proxy('/yunpos', {
  target: 'http://14.18.190.140:9091',
  pathRewrite: { '^/yunpos': '' },
  changeOrigin: true
}))

app.listen(8081)