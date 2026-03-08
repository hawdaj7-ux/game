const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const ROOT = __dirname;

const server = http.createServer((req, res) => {
    // Strip query string from URL
    const parsedUrl = url.parse(req.url);
    const pathname = decodeURIComponent(parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname);
    const fp = path.join(ROOT, pathname);
    const ext = path.extname(fp).toLowerCase();

    fs.readFile(fp, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found: ' + pathname);
            return;
        }
        res.writeHead(200, {
            'Content-Type': mime[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
});

server.listen(8080, () => console.log('Server running on http://localhost:8080'));
