const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');

  let options = {};
  const cookieCustom = ctx.cookies.get('Bob', [options])
  // 如果没有cookie值，默认设置一个随机数
  if (!cookieCustom) {
    ctx.cookies.set('Bob', Math.random(), [options])
  }
  console.log('----------------------------------------')
  console.log(ctx.request)
  console.log('----------------------------------------')
  console.log('=================')
  console.log(ctx.hostname)
  console.log(ctx.ips)
  console.log('=================')
  console.log(`${ctx.method} ${ctx.url} - ${rt} - ${cookieCustom}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);