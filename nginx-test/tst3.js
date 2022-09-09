const http = require('http');
const hostname = '0.0.0.0';
const port = 3003;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(`<h1>Hello World, 端口 -- ${port}</h1>\n`);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
