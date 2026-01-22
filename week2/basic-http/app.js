import http from "node:http";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  console.log(reqUrl.pathname);
  if (/^\/about\/?$/.test(reqUrl.pathname)) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Hello About Page!!! - ${reqUrl.href}`);
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World!!!");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
