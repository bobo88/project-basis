


const Koa = require('koa')

const app = new Koa()

const uuid = require('uuid');
let myuuid = uuid.v4();

console.log('Your UUID is: ' + myuuid);

app.use(async (ctx, next)=> {
  
});

app.listen(8081)