const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
var bodyParser = require('body-parser');
 
const app = express();
//设置跨域访问
app.all("*", function (req, res, next) {
    // req.header("Accept", "application/json, text/plain, */*");
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

  console.log(588, req.headers['content-type'] === 'application/json;charset=UTF-8')
  if (req.method.toLowerCase() == "options") res.send(200);
  //让options尝试请求快速结束
  else next();
});

app.use(bodyParser.json());
app.post('/postJSON',(req,res)=>{
    // 后端收到post传参
    console.log(req.body);
    res.send('/postJSON')
})
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/yunpos",
  createProxyMiddleware({
    target: "http://14.18.190.140:9091",
    changeOrigin: true,
    pathRewrite: {
      "^/yunpos": "", // rewrite path
    },
  })
);
//这个链接是目标链接是我随便从网上找的一个
app.listen(8081); //这个端口号就是proxy运行的端口号

















//   const contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
//   res.header('Content-Type', contentType);
    // const contentType = req.getHeader('Content-Type'); 
    // const writeBody = (bodyData) => {
    //     req.setHeader('Content-Length', Buffer.byteLength(bodyData));
    //     req.write(bodyData);
    //   };
    // if (contentType === 'application/json') {
    //     writeBody(JSON.stringify(req.body));
    // }
    // if (contentType === 'application/x-www-form-urlencoded') {
    //     writeBody(querystring.stringify(req.body));
    // }
