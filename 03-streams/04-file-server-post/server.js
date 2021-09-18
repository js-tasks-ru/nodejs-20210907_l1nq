const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Не поддерживает вложенные вложенные файлы');
        return;
      }
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitStream = new LimitSizeStream({limit: 10000});
      req.pipe(limitStream).pipe(writeStream);
      limitStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          fs.unlink(filepath, ()=>{});
          res.end('File more 1MB');
        }
      });
      writeStream.on('error', (err)=> {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File already exist');
        }
      });
      req.on('aborted', ()=> {
        writeStream.destroy();
        limitStream.destroy();
        fs.unlink(filepath, ()=>{});
      });
      writeStream.on('finish', ()=>{
        res.statusCode = 201;
        res.end('File created');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
