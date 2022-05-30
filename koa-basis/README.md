# koa框架的基础实现
*Tips: <font color="#FF6600">KOA < Express / Egg < Nest</font>*

### 一、简述：
1. 基于Node.js平台的下一代web开发框架。
2. Express幕后原班人马打造，致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。
3. 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。
4. 常用方法/属性：
    + 默认：const Koa = require('koa'); const app = new Koa();
    + app.listen()
    + app.callback()
    + app.use(function)
    + app.keys = ...
    + app.context
        ```js
            app.context.db = db();
            app.use(async ctx => {
            console.log(ctx.db);
            });
        ```
    + 错误处理：
        ```js
            app.on('error', (err, ctx) => {   
              log.error('server error', err, ctx)  
            });
        ```
    + todo

5. 上下文(Context)：
    + Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。
    + API：
        + ctx.req:  Node 的 request 对象.
        + ctx.res:  Node 的 response 对象.
        + ctx.request:  koa 的 Request 对象.
        + ctx.response:  koa 的 Response 对象.
        + ctx.state:  推荐的命名空间，用于通过中间件传递信息和你的前端视图。
            ```js
                ctx.state.user = await User.find(id);
            ```
        + ctx.app:  应用程序实例引用
        + ctx.app.emit:  
        + ctx.cookies.get(name, [options]):  koa 使用 cookies 模块，其中只需传递参数。
        + ctx.cookies.set(name, value, [options]):  koa 使用传递简单参数的 cookies 模块。
        + ctx.throw([status], [msg], [properties]):  用来抛出一个包含 .status 属性错误的帮助方法，其默认值为 500。这样 Koa 就可以做出适当地响应。
            ```js
                ctx.throw(400);
                ctx.throw(400, 'name required');
                ctx.throw(400, 'name required', { user: user });
            ```
            + koa 使用 http-errors 来创建错误。status 只应作为第一个参数传递。
        + ctx.assert(value, [status], [msg], [properties]):  
            ```js
                ctx.assert(ctx.state.user, 401, 'User not found. Please login!');
            ```
            + koa 使用 http-assert 作为断言。
        + ctx.respond:  为了绕过 Koa 的内置 response 处理，你可以显式设置 ctx.respond = false;。 如果您想要写入原始的 res 对象而不是让 Koa 处理你的 response，请使用此参数。
    + ......
6. 请求(Request):  
7. 响应(Response):  
### 二、实战：
1. 【洋葱模型】：Koa中，外层中间件称为上游，内层中间件称为下游。
2. 【中文网】： https://koa.bootcss.com/
3. todo