// 2.1 conf/db.js
const env = process.env.NODE_ENV
let MYSQL_CONF
if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    port: '3306',
    database: 'yuanbo_web'
  }
}
if (env === 'production') {
  MYSQL_CONF = {
   // ...
  }
}
module.exports = {
  MYSQL_CONF
}