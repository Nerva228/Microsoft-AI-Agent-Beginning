import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
const relDir = dirIdx >= 0 && args[dirIdx + 1] ? args[dirIdx + 1] : 'dist';
const portIdx = args.indexOf('--port');
const port = portIdx >= 0 && args[portIdx + 1] ? Number(args[portIdx + 1]) : 4173;
const serveRoot = path.resolve(webRoot, relDir);
const publicFallback = path.resolve(webRoot, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safeRel = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const requested = safeRel === '/' ? '/index.html' : safeRel;

  let filePath = path.join(serveRoot, requested);
  if (!fs.existsSync(filePath) && relDir === '.') {
    filePath = path.join(publicFallback, requested);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✓ Agent Quest server running at http://localhost:${port} (serving ${serveRoot})`);
});
