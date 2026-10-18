// I Need YOU: static game, two-player relay and server-only Groq connection.
'use strict';
const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
// Tiny .env loader: deployment environment variables always take precedence.
try{for(const line of fs.readFileSync(path.join(__dirname,'.env'),'utf8').split(/\r?\n/)){const m=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^(['"])(.*)\1$/,'$2')}}catch{}
const {createLeggyService}=require('./leggy-service');const leggy=createLeggyService();
const PUB=path.join(__dirname,'public'),MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const budgets=new Map();
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))}
const srv=http.createServer(async(req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{return res.writeHead(400).end()}
 if(pathname.includes('\0'))return res.writeHead(400).end();
 if(pathname==='/api/leggy/status')return json(res,200,{mode:leggy.configured?'groq':'unconfigured',configuredKeys:leggy.keyCount});
 if(pathname==='/api/leggy'){
  if(req.method!=='POST')return json(res,405,{error:'Use POST'});
  if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'Origin not allowed'})}catch{return json(res,403,{error:'Origin not allowed'})}}
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return json(res,415,{error:'JSON required'});
  const ip=req.socket.remoteAddress||'local',now=Date.now(),old=budgets.get(ip);const budget=old&&old.until>now?old:{until:now+60000,count:0};
  if(budgets.size>2000)for(const [key,value] of budgets)if(value.until<now)budgets.delete(key);
  if(++budget.count>30)return json(res,429,{error:'Leggy request limit reached. Please retry shortly.',retryAfter:Math.ceil((budget.until-now)/1000)});budgets.set(ip,budget);
  try{let body='',size=0;for await(const chunk of req){size+=chunk.length;if(size>12000){json(res,413,{error:'Request too large'});return}body+=chunk.toString()}
   let input;try{input=JSON.parse(body)}catch{return json(res,400,{error:'Invalid JSON'})}
   return json(res,200,await leggy.respond(input));
  }catch(error){if(!res.writableEnded)return json(res,error.status||500,{error:'Leggy could not reach the AI service. Please retry.'})}
  return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return res.writeHead(405).end();
 const f=path.resolve(PUB,'.'+(pathname==='/'?'/index.html':pathname));if(!f.startsWith(PUB+path.sep))return res.writeHead(403).end();
 fs.readFile(f,(error,data)=>error?res.writeHead(404).end('Not found'):res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','X-Content-Type-Options':'nosniff'}).end(req.method==='HEAD'?undefined:data));
});
const wss=new WebSocketServer({server:srv,maxPayload:16384}),rooms=new Map();
wss.on('connection',(ws,req)=>{
 const room=(new URL(req.url,'http://x').searchParams.get('room')||'AAAA').toUpperCase().slice(0,8);const set=rooms.get(room)||new Set();rooms.set(room,set);
 if(set.size>=2)return ws.close(1013,'full');set.add(ws);
 ws.on('message',m=>{for(const c of set)if(c!==ws&&c.readyState===1)c.send(m.toString())});
 ws.on('close',()=>{set.delete(ws);for(const c of set)if(c.readyState===1)c.send(JSON.stringify({t:'bye'}));if(!set.size)rooms.delete(room)});
});
srv.listen(process.env.PORT||3000,()=>console.log('I Need YOU on :'+(process.env.PORT||3000)+' / Leggy: '+(leggy.configured?'Groq enabled':'API key required')));
