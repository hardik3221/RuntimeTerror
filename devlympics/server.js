// OTHER SIDE: static frontend, multiplayer WebSocket relay and AI hint endpoint.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const { generateHint } = require('./ai/hint-service');

const PUB = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

const srv = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/api/hint') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST /api/hint.' });
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 8192) {
        sendJson(res, 413, { error: 'Request too large.' });
        req.destroy();
      }
    });
    req.on('end', async () => {
      if (res.writableEnded) return;
      let input;
      try { input = JSON.parse(body || '{}'); }
      catch { return sendJson(res, 400, { error: 'Request body must be valid JSON.' }); }
      try {
        const result = await generateHint(input);
        sendJson(res, 200, result);
      } catch (err) {
        sendJson(res, err.statusCode || 500, { error: err.statusCode ? err.message : 'Unable to generate a hint.' });
      }
    });
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') return res.writeHead(405).end('Method not allowed');
  let pathnameForFile = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const file = path.resolve(PUB, '.' + pathnameForFile);
  if (file !== PUB && !file.startsWith(PUB + path.sep)) return res.writeHead(403).end('Forbidden');
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});

const wss = new WebSocketServer({ server: srv });
const rooms = new Map();
wss.on('connection', (ws, req) => {
  const room = (new URL(req.url, 'http://x').searchParams.get('room') || 'AAAA').toUpperCase().slice(0, 8);
  const set = rooms.get(room) || new Set();
  rooms.set(room, set);
  if (set.size >= 2) return ws.close(1013, 'full');
  set.add(ws);
  ws.on('message', message => {
    for (const client of set) if (client !== ws && client.readyState === 1) client.send(message.toString());
  });
  ws.on('close', () => {
    set.delete(ws);
    for (const client of set) if (client.readyState === 1) client.send(JSON.stringify({ t: 'bye' }));
    if (!set.size) rooms.delete(room);
  });
});

const port = Number(process.env.PORT) || 3000;
srv.listen(port, () => console.log(`OTHER SIDE on :${port}`));
