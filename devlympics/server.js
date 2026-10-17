// OTHER SIDE relay server: serves /public and relays JSON between max 2 clients per room.
const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const PUB=path.join(__dirname,'public'),MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'};
const srv=http.createServer((req,res)=>{
  let p=req.url.split('?')[0];if(p==='/')p='/index.html';
  const f=path.join(PUB,path.normalize(p));
  if(!f.startsWith(PUB))return res.writeHead(403).end();
  fs.readFile(f,(e,d)=>e?res.writeHead(404).end('nope'):res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'text/plain'}).end(d));
});
const wss=new WebSocketServer({server:srv}),rooms=new Map();
wss.on('connection',(ws,req)=>{
  const room=(new URL(req.url,'http://x').searchParams.get('room')||'AAAA').toUpperCase().slice(0,8);
  const set=rooms.get(room)||new Set();rooms.set(room,set);
  if(set.size>=2)return ws.close(1013,'full');
  set.add(ws);
  ws.on('message',m=>{for(const c of set)if(c!==ws&&c.readyState===1)c.send(m.toString())});
  ws.on('close',()=>{set.delete(ws);for(const c of set)c.send(JSON.stringify({t:'bye'}));if(!set.size)rooms.delete(room)});
});
srv.listen(process.env.PORT||3000,()=>console.log('OTHER SIDE on :'+(process.env.PORT||3000)));
