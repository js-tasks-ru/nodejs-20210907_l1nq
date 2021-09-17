const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (!pathname.includes('/')) {
        fs.access(filepath, (err) => {
          if (err) {
            let sumChunk = 0;
            req.on('data', (chunk) => {
              sumChunk += chunk.length;
              if (sumChunk > 10000) {
                res.statusCode = 413;
                res.end('File more 1MB');
              } else {
                const streamWrite = fs.createWriteStream(filepath);
                streamWrite.write(chunk);
                res.statusCode = 201;
                res.end('File created');
              }
            });
          } else {
            res.statusCode = 409;
            res.end('File already exists');
          }
        });
      } else {
        res.statusCode = 400;
        res.end('Не поддерживает вложенные вложенные файлы');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
