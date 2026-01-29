const http = require('http');
const url = require('url');
const { parse } = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  
  let searchParamsArray = [];
  for (const param of reqUrl.searchParams.entries()) {
    searchParamsArray.push(param);
  }

  const myData = {
    href: reqUrl.href,
    pathname: reqUrl.pathname,
    host: reqUrl.host,
    hostname: reqUrl.hostname,
    port: reqUrl.port,
    protocol: reqUrl.protocol,
    origin: reqUrl.origin,
    hash: reqUrl.hash,
    search: reqUrl.search,
    searchParams: searchParamsArray,
    method: req.method,
    body: '',
    bodyParsed: ''
  };

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Max-Age', 2592000);
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.statusCode = 204;
    res.end();
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      myData.body = body.toString();

      if (req.headers['content-type'] === 'application/json') {
        myData.bodyParsed = JSON.parse(body);
      } else {
        myData.bodyParsed = parse(body);
      }

      if (req.headers['accept'] === 'application/json') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(myData));
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
          <html>
          <head><head>
          <body>
            <pre>${JSON.stringify(myData, null, 2)}</pre>
          </body>
          </html>
        `);
      }
    });
  } else {
    if (req.headers['accept'] === 'application/json') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(myData));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(`
        <html>
        <head><head>
        <body>
          <pre>${JSON.stringify(myData, null, 2)}</pre>
        </body>
        </html>
      `);
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});