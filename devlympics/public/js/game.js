'use strict';
/* ===== CONFIG (edit me) ===== */
const W=900,H=480,FY=420;
const CFG={speed:230,grav:1900,jump:-640,startTrust:70,pingMax:6,pingRecharge:4,pingLife:4,emoteCd:.9,idle:28,
 T:{plank:8,cross:4,sw:8,stone:2,fallE:-12,fallN:-10,insult:-6,nag:-2}};
const HUMAN={floors:[[0,400],[720,900]],stones:[[425,375],[535,340],[640,380]],stoneW:70,portal:[290,346],gate:{x:800,w:18,h:120},flagX:868,plankX:140,respawn:340};
const SOCK={floors:[[0,180],[450,900]],bridge:[170,460],sw:[650,720],respawn:60};
const STATUS=[[85,'Soulmates','💞'],[65,'Good friends','🤝'],[45,'Colleagues','📎'],[25,'Barely speaking','😬'],[-1,'Divorce papers filed','⚖️']];
/* ===== AMBASSADOR LINES (3+ variants each; add more freely) ===== */
const LINES={
startE:["Explorer: you are blind, mobile and optimistic. A dreadful combination.","Welcome, Explorer. Do listen to your partner. They can see. You can merely walk.","Explorer, kindly refrain from stepping on things you cannot see."],
startN:["Navigator: you see everything and touch nothing. Rather like management.","Navigator, guide the Explorer. Clicking the radar is polite; nagging is not.","Welcome, Navigator. Do try not to say 'I told you so' before it happens."],
pick:["The plank is acquired. A modest triumph.","Plank in hand. One feels the pressure mounting.","Splendid. Wood. The foundation of all diplomacy."],
sent:["The plank has crossed dimensions. Customs are furious.","A bridge, delivered by post. Most irregular.","Treaty infrastructure has arrived. Mind the splinters."],
cross:["Crossing achieved. Nobody screamed. Progress.","The Navigator walks upon the Explorer's wood. Symbolic, really.","Across the chasm. I shall mention it in my memoirs."],
sw:["The switch is pressed. Somewhere, a gate is embarrassed.","Click. The gate surrenders.","A switch, activated. Democracy in action."],
stone:["A hidden stone discovered. Luck, or telepathy?","Stone found. The Explorer remains blind, but less wrong.","Ah, the floor exists after all."],
fallE:["The Explorer has fallen. Gravity sends its regards.","Down they go. Do keep up, Explorer.","A plummet. Trust is, regrettably, a perishable good."],
fallN:["The Navigator has fallen. The all-seeing, all-tumbling.","The one who sees everything missed the ground.","Navigator down. The irony is thick enough to spread."],
insult:["A diplomatic incident! I shall need a lie-down.","Rude. Entirely understandable, but rude.","Insults at the border. Telegrams will be sent."],
nag:["Nagging detected. Marital counselling advised.","'Hurry up.' Ah, the language of love.","The Explorer has been hurried. Morale: unaffected, trust: dented."],
noping:["Out of pings. Do use your words. Or emojis.","The Navigator has exhausted their pointing budget.","No pings left. Patience is a free resource."],
idleE:["Explorer, try asking the Navigator what they can see.","The Navigator pings things for a reason. Look at the pink pins.","Might the portal, the plank and the porthole be related? Just a thought."],
idleN:["Navigator, the Explorer needs you to click the radar.","Numbered stones, Navigator. Point at them. In order.","Press E to nag, if you must. It will cost you."],
S0:["Divorce papers filed. I shall handle the custody of the socks.","Legal proceedings begin at dawn. Bring a lawyer and a drawer."],
S1:["Barely speaking. They shared a level and one breath.","A frosty alliance. Perfectly British."],
S2:["Colleagues. Cordial, distant, and slightly embarrassing.","Professional respect, no hugs."],
S3:["Good friends. I might even invite them to tea.","A solid friendship, forged in pits."],
S4:["Soulmates. I am, frankly, weeping into my monocle.","Utterly in sync. Nauseating."]};
const pick=a=>a[Math.random()*a.length|0];
Object.assign(LINES,{oyee:["Your partner has screamed for help. Such a delicate cry.","OYEE! The cry of the stuck. Do go and rescue them.","Somebody is stuck. Somebody is also very loud."],
oyeeSent:["You have shouted OYEE. The whole dimension heard.","A cry for help has been dispatched. Dignity: pending.","OYEE sent. Do wait patiently; they are not fast."],jump:["Boing. Marvellous.","Up she goes. Elegant as a wet sofa.","Jumping solves nothing, but it does look busy."],
pit:["Do mind the large hole ahead. It is quite large.","The pit looks hungry, Explorer.","Ahead lies the Void. Do not hug it."],
chasm:["Navigator, that chasm is wider than your excuses.","Jumping it? Bold. Wrong, but bold.","One plank short of civilisation, that gap."],
chat:["I have been standing here for some time. Nobody asked.","Fun fact: socks vanish in dryers because of me.","I am contractually obliged to find this exciting.","Remember: communication is key. Or at least a ping.","Trust is like a sock. Easy to lose, impossible to pair.","My monocle fogs when I am anxious. It is fogging."]});
function pop(t,x,y){(S.pops=S.pops||[]).push({t:1.1,txt:t,x:x??S.me.x,y:y??S.me.y})}
/* ===== STATE ===== */
const $=id=>document.getElementById(id),cv=$('c'),mc=cv.getContext('2d'),buf=document.createElement('canvas');buf.width=W*2;buf.height=H*2;let g=buf.getContext('2d');
let role,room,net,started=false,fb=false,S,keys={},muted=false,lastT=0;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function fresh(){return{stage:1,gates:0,order:[2,0,1],routes:[1,2,0],beam:-1,dial:-1,lit:0,phase:0,anchors:{},gateOpen:false,hold:0,checkpoint:60,t0:performance.now(),trust:CFG.startTrust,falls:{E:0,N:0},pings:0,emotes:0,plank:'floor',plankX:HUMAN.plankX,bridgeT:0,sw:false,gateT:0,done:{},found:{},glow:[0,0,0],
 me:{x:role=='E'?60:60,y:360,vx:0,vy:0,f:1,gr:false,fall:0,lastE:0},ot:{x:60,y:360,tx:60,ty:360,f:1},myPings:CFG.pingMax,pingAcc:0,pl:[],em:[],parts:[],shake:0,nag:0,emoCd:0,lastProg:performance.now(),idle:0,crossed:false,over:false,ended:0}}
/* ===== AUDIO ===== */
let ac;function beep(f,d=.12,type='sine',sl=0,v=.12,dl=0){if(muted)return;try{ac=ac||new AudioContext();const t=ac.currentTime+dl,o=ac.createOscillator(),gn=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+sl),t+d);gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gn).connect(ac.destination);o.start(t);o.stop(t+d)}catch(e){}}
const SFX={jump:()=>{beep(180,.25,'sine',500,.14);beep(360,.2,'triangle',300,.05)},land:()=>beep(900,.07,'square',-500,.05),
send:()=>{beep(200,.5,'sawtooth',900,.05);[523,659,784,1047].forEach((f,i)=>beep(f,.18,'triangle',0,.12,.1+i*.09))},
ping:()=>beep(700,.12,'sine',500),fall:()=>{beep(1400,.9,'sine',-1200,.12);beep(90,.25,'sine',-40,.25,.9)},
wah:()=>[300,280,260,200].forEach((f,i)=>beep(f,.28,'sawtooth',-60,.1,i*.28)),quack:()=>{beep(420,.12,'sawtooth',-120,.12);beep(380,.12,'sawtooth',-120,.12,.15)},
tick:()=>{beep(1318,.3,'triangle',0,.1);beep(1760,.3,'triangle',0,.07,.08)},boing:()=>{beep(150,.3,'sine',600,.14);beep(1000,.05,'square',0,.06,.3)},
thud:()=>beep(80,.15,'sine',-30,.2),pop:()=>beep(500,.08,'sine',400,.12),
win:()=>{[523,659,784,1047,1319,1047,1319,1568].forEach((f,i)=>beep(f,.25,'triangle',0,.12,i*.11));beep(160,.6,'sawtooth',200,.05,.9)}};
SFX.oyee=()=>{if(muted)return;try{ac=ac||new AudioContext();if(ac.state=='suspended')ac.resume();
 const t=ac.currentTime,o=ac.createOscillator(),lfo=ac.createOscillator(),lg=ac.createGain(),out=ac.createGain(),cp=ac.createDynamicsCompressor();
 o.type='sawtooth';o.frequency.setValueAtTime(240,t);o.frequency.linearRampToValueAtTime(275,t+.3);o.frequency.setValueAtTime(250,t+.34);o.frequency.exponentialRampToValueAtTime(660,t+.95);o.frequency.linearRampToValueAtTime(610,t+1.2);
 lfo.frequency.value=6.5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(20,t+1);lfo.connect(lg);lg.connect(o.frequency);
 [[500,300,1],[900,2400,.8],[2600,3200,.35]].forEach(([a0,a1,v],i)=>{const f=ac.createBiquadFilter(),gg=ac.createGain();f.type='bandpass';f.Q.value=i?9:6;f.frequency.setValueAtTime(a0,t);f.frequency.setValueAtTime(a0,t+.3);f.frequency.exponentialRampToValueAtTime(a1,t+.55);gg.gain.value=v;o.connect(f);f.connect(gg);gg.connect(out)});
 out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(3.2,t+.04);out.gain.setValueAtTime(3.2,t+.28);out.gain.linearRampToValueAtTime(1.2,t+.34);out.gain.linearRampToValueAtTime(3.6,t+.5);out.gain.setValueAtTime(3.6,t+1);out.gain.exponentialRampToValueAtTime(.001,t+1.3);
 out.connect(cp);cp.connect(ac.destination);o.start(t);lfo.start(t);o.stop(t+1.35);lfo.stop(t+1.35);
 beep(300,.35,'sine',700,.12,1.0);beep(900,.1,'square',-300,.05,1.2)}catch(e){}};
function toggleMute(){muted=!muted;$('mute').textContent=muted?'🔇':'🔊'}
/* ===== NETWORK ===== */
function status(s){$('status').textContent=s}
function connect(){
 const useBC=()=>{if(fb)return;fb=true;const c=new BroadcastChannel('otherside-'+room);net={send:o=>c.postMessage(o)};c.onmessage=e=>onMsg(e.data);hello(false);status('Local mode (two tabs). Waiting for partner…')};
 if(location.protocol==='file:'||!window.WebSocket)return useBC();
 let ok=false;const ws=new WebSocket((location.protocol=='https:'?'wss://':'ws://')+location.host+'/?room='+room);
 ws.onopen=()=>{ok=true;net={send:o=>ws.readyState==1&&ws.send(JSON.stringify(o))};hello(false);status('Connected. Waiting for partner…')};
 ws.onmessage=e=>onMsg(JSON.parse(e.data));
 ws.onclose=ws.onerror=ev=>{if(!ok)useBC();else if(ev&&ev.code==1013)status('Room full. Two socks is a crowd; three is a sitcom.')};
}
function hello(ack){net&&net.send({t:'hello',role,ack})}
function ev(e){e.t='ev';e.stage=S.stage;apply(e);net.send(e)}
function onMsg(m){
 if(m.t=='hello'){
  if(m.role==role){status('Both picked '+(role=='E'?'Explorer':'Navigator')+'. Two left socks make no pair. One of you, switch!');return}
  if(!m.ack)hello(true);
  startGame();
 }else if(m.t=='bye'){status('Partner left. Waiting…');started=false;$('game').style.display='none';$('result').style.display='none';$('menu').style.display='flex'}
 else if(!started||!S)return;
 else if(m.t=='pos'&&m.stage===S.stage){S.ot.tx=m.x;S.ot.ty=m.y;S.ot.f=m.f}
 else if(m.t=='ev')apply(m);
 else if(m.t=='restart')startGame(true);
}
function join(r){role=r;room=($('room').value||'ABCD').toUpperCase();$('room').value=room;status('Connecting…');net=null;fb=false;connect()}
function copyLink(){const u=location.origin==='null'||location.protocol==='file:'?location.href.split('?')[0]+'?room='+$('room').value:location.origin+location.pathname+'?room='+$('room').value;navigator.clipboard&&navigator.clipboard.writeText(u);status('Invite link copied: '+u)}
function playAgain(){net.send({t:'restart'});startGame(true)}
/* ===== GAME START ===== */
function startGame(){
 S=fresh();started=true;$('menu').style.display='none';$('result').style.display='none';$('game').style.display='block';
 S.me.x=role=='E'?60:60;
 $('help').textContent=role=='E'?'Explorer: A/D move · W/Space jump · E interact / pick up / send / tune rune · 1-4 emotes · O = OYEE! (stuck?) · M mute':'Navigator: A/D move · W/Space jump · click radar to ping · E use nearby prism / gravity console · 1-4 emotes · O = OYEE! (stuck?) · M mute';
 $('emotes').innerHTML=['👍','❗','🤔','😡'].map((e,i)=>`<button onclick="emote(${i})">${e}</button>`).join('');
 say(pick(LINES[role=='E'?'startE':'startN']));updateHud();
}
let sayTimer;function say(s){const b=$('bubble');b.textContent='';let i=0;clearInterval(sayTimer);sayTimer=setInterval(()=>{b.textContent=s.slice(0,++i);if(i%2)beep(260+Math.random()*220,.04,'square',0,.025);if(i>=s.length)clearInterval(sayTimer)},18)}
/* ===== EVENTS (applied identically on both clients) ===== */
function trust(d){S.trust=Math.max(0,Math.min(100,S.trust+d));S.lastProg=performance.now()}
function burst(x,y,c,n=24){for(let i=0;i<n;i++)S.parts.push({x,y,vx:(Math.random()-.5)*400,vy:(Math.random()-.8)*400,l:.8,c})}
function apply(e){
 if(!S||S.over||e.stage!==S.stage)return;
 switch(e.k){
 case 'chamber':
  if(e.next!==S.stage+1)return;
  S.gates=S.stage;S.stage=e.next;S.gateOpen=false;S.hold=0;S.pl=[];S.parts=[];S.pops=[];S.lastProg=performance.now();S.checkpoint=60;
  S.me={x:60,y:384,vx:0,vy:0,f:1,gr:false,fall:0,lastE:0};S.ot={x:60,y:384,tx:60,ty:384,f:1};keys={};
  if(e.order)S.order=e.order;if(e.routes)S.routes=e.routes;
  SFX.send();say(S.stage===2?'Gate 1 cleared! The beam has terrible aim. Discuss the runes, then fix it.':'Gate 2 cleared! Gravity has resigned. Navigator, you are the replacement.');break;
 case 'beam':if(S.stage!==2||S.gateOpen)return;S.dial=(S.dial+1)%3;S.beam=S.routes[S.dial];SFX.ping();pop('PEW!',450,310);break;
 case 'rune':
  if(S.stage!==2||S.gateOpen||e.i!==S.order[S.lit]||S.beam!==e.i)return;
  S.lit++;S.beam=-1;trust(3);SFX.tick();burst(260+e.i*190,380,'#45d1c9');
  if(S.lit===3){S.gateOpen=true;SFX.boing();say('The constellation is complete! Explorer, cross Gate 2.')}else say('Rune locked! The beam needs routing again. Next symbol, please.');break;
 case 'phase':if(S.stage!==3||S.gateOpen)return;S.phase=(S.phase+1)%3;SFX.send();pop(['LOW!','FLIP FLOP!','UPSY DAISY!'][S.phase],180,320);break;
 case 'anchor':if(S.stage!==3||S.anchors[e.i])return;S.anchors[e.i]=true;trust(4);SFX.tick();burst(e.i===0?377:628,e.i===0?215:185,'#f2c14e');say('Energy anchor charged! Progress saved. Gravity can only embarrass you a little now.');break;
 case 'hold':if(S.stage===3&&role==='N'){S.hold=Math.max(0,Math.min(1.6,e.value));updateHud()}break;
 case 'seal':if(S.stage!==3||!S.anchors[0]||!S.anchors[1])return;S.gateOpen=true;S.hold=1.6;SFX.boing();say('Both socks in sync! Final gate unlocked. Explorer, bring us home.');break;
 case 'pick':S.plank='carried';SFX.pop();say(pick(LINES.pick));break;
 case 'drop':S.plank='dropped';S.plankX=e.x;SFX.thud();break;
 case 'plank':S.plank='sent';S.bridgeT=.001;trust(CFG.T.plank);S.done.plank=1;SFX.send();burst(318,380,'#45d1c9');burst(318,380,'#ff4fa3');S.shake=reduce?0:.2;say(pick(LINES.sent));break;
 case 'cross':if(!S.crossed){S.crossed=true;trust(CFG.T.cross);S.done.cross=1;say(pick(LINES.cross))}break;
 case 'sw':if(!S.sw){S.sw=true;trust(CFG.T.sw);S.done.sw=1;SFX.boing();burst(685,410,'#f2c14e');say(pick(LINES.sw))}break;
 case 'stone':if(!S.found[e.i]){S.found[e.i]=1;trust(CFG.T.stone);S.glow[e.i]=.9;SFX.tick();say(pick(LINES.stone))}else S.glow[e.i]=.9;break;
 case 'fall':S.falls[e.w]++;trust(e.w=='E'?CFG.T.fallE:CFG.T.fallN);SFX.fall();S.shake=reduce?0:.4;say(pick(LINES[e.w=='E'?'fallE':'fallN']));break;
 case 'emo':S.emotes++;S.em.push({e:e.e,w:e.w,t:1.6});if(e.e=='😡'){trust(-6);SFX.wah();say(pick(LINES.insult))}break;
 case 'ping':S.pings++;S.pl.push({x:e.x,y:e.y,t:CFG.pingLife});SFX.ping();break;
 case 'nag':trust(CFG.T.nag);S.nag=1.2;SFX.quack();say(pick(LINES.nag));break;
 case 'oyee':if(e.w==role){say(pick(LINES.oyeeSent));SFX.pop()}else{S.oyee=1.6;S.shake=reduce?0:.5;SFX.oyee();say(pick(LINES.oyee));burst(W/2,H/2,'#ffcf3a',40)}break;
 case 'win':S.gates=3;S.done.win=1;S.over=true;S.ended=1;S.time=e.time;SFX.win();setTimeout(showResult,1400);break;
 }
 {const P={plank:['WHOOSH!',318,350],sw:['CLICK!',685,390],stone:['boop!',500,330],fall:[pick(['AAAAH!','NOOOO!','splat.','oof.'])],nag:['nag nag nag'],oyee:['OYEE!!'],pick:['got it!'],drop:['thunk'],cross:['tada!']}[e.k];if(P)pop(...P)}
 updateHud();
}
function updateHud(){
 $('trustf').style.width=S.trust+'%';$('tv').textContent=Math.round(S.trust);
 $('pg').textContent='GATE '+Math.min(3,S.stage)+' / 3'+(role==='N'&&S.stage===1?' · 📡 '+S.myPings:'');
 $('chips').innerHTML=[1,2,3].map(n=>`<span class="chip ${S.gates>=n?'on':''}">${S.gates>=n?'✓ ':''}Gate ${n}: ${['Bridge & secrets','Prism post office','Gravity duet'][n-1]}</span>`).join('');
 $('mission').textContent=mission();
}
function showResult(){
 const st=STATUS.find(s=>S.trust>=s[0]),i=STATUS.indexOf(st);
 $('rem').textContent=st[2];$('rst').textContent=st[1];$('rq').textContent=pick(LINES['S'+i]);
 const f=S.falls;$('rb').textContent=f.E>f.N?'BLAME: the Explorer. It was them.':f.N>f.E?'BLAME: the Navigator. Obviously.':f.E?'Mutual blame':'No one to blame. Suspiciously clean.';
 const t=Math.round(S.time/1000);
 $('rs').textContent=`Time ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')} · Trust ${Math.round(S.trust)} · Falls E${f.E}/N${f.N} · Pings ${S.pings} · Emotes ${S.emotes}`;
 $('result').style.display='flex';
}
function oyee(){if(!S||S.over||S.oyeeCd>0)return;S.oyeeCd=2.5;ev({k:'oyee',w:role})}
function emote(i){if(!S||S.over||S.emoCd>0)return;S.emoCd=CFG.emoteCd;ev({k:'emo',w:role,e:['👍','❗','🤔','😡'][i]})}
/* ===== INPUT ===== */
addEventListener('keydown',e=>{
 if(e.target.tagName=='INPUT')return;const k=e.key.toLowerCase();
 if(k=='m'){toggleMute();return}
 if(!S||!started)return;
 if(' wArrowUp'.includes(e.key)||k=='w'){e.preventDefault()}
 if(!keys[k]){keys[k]=1;
  if((k=='w'||k==' '||k=='arrowup')&&S.me.gr){S.me.vy=CFG.jump;S.me.gr=false;SFX.jump();dust(4);if(Math.random()<.2)pop('BOING!');if(Math.random()<.1)say(pick(LINES.jump))}
  if('1234'.includes(k)&&k.length==1)emote(+k-1);
  if(k=='e')interact();if(k=='o')oyee()}
});
addEventListener('keyup',e=>delete keys[e.key.toLowerCase()]);addEventListener('blur',()=>keys={});
cv.addEventListener('pointerdown',e=>{
 if(role!='N'||!S||S.over||S.stage!==1)return;const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*W/r.width,my=(e.clientY-r.top)*H/r.height,s=.48,ix=W-W*s-10,iy=10;
 if(mx<ix||my<iy||mx>ix+W*s||my>iy+H*s)return;
 if(S.myPings<1){say(pick(LINES.noping));return}
 S.myPings--;ev({k:'ping',x:(mx-ix)/s,y:(my-iy)/s});
});
function onFloor(x){return HUMAN.floors.some(f=>x>=f[0]&&x<=f[1])}
function interact(){
 const m=S.me;
 if(S.over)return;
 if(S.stage>1){chamberInteract();return}
 if(role=='N'){ev({k:'nag'});return}
 const cx=m.x+14;
 if(S.plank=='carried'){
  if(cx>HUMAN.portal[0]-30&&cx<HUMAN.portal[1]+30)ev({k:'plank'});
  else if(m.gr&&onFloor(cx)&&onFloor(m.x)&&onFloor(m.x+28))ev({k:'drop',x:cx});
 }else if((S.plank=='floor'||S.plank=='dropped')&&Math.abs(cx-(S.plank=='floor'?HUMAN.plankX+75:S.plankX))<90)ev({k:'pick'});
}
/* ===== PHYSICS (own avatar only) ===== */
function solids(){
 if(S.stage>1)return chamberSolids(role);
 const a=[];
 if(role=='E'){HUMAN.floors.forEach(f=>a.push([f[0],FY,f[1]-f[0],60]));HUMAN.stones.forEach(s=>a.push([s[0],s[1],HUMAN.stoneW,14]));
  if(S.gateT<1){const G=HUMAN.gate;a.push([G.x,FY-G.h,G.w,G.h])}}
 else{SOCK.floors.forEach(f=>a.push([f[0],FY,f[1]-f[0],60]));if(S.bridgeT>=1)a.push([SOCK.bridge[0],FY,SOCK.bridge[1]-SOCK.bridge[0],60])}
 return a;
}
function step(dt){
 const m=S.me,PW=28,PH=36,sl=solids();
 const dir=(keys['d']||keys['arrowright']?1:0)-(keys['a']||keys['arrowleft']?1:0);
 m.vx=dir*CFG.speed;if(dir)m.f=dir;m.vy+=CFG.grav*dt;
 m.x+=m.vx*dt;m.x=Math.max(0,Math.min(W-PW,m.x));
 for(const s of sl)if(m.x<s[0]+s[2]&&m.x+PW>s[0]&&m.y<s[1]+s[3]&&m.y+PH>s[1]){m.x=m.vx>0?s[0]-PW:s[0]+s[2]}
 const pv=m.vy,wg=m.gr;m.y+=m.vy*dt;m.gr=false;let landed=null;
 for(const s of sl)if(m.x<s[0]+s[2]&&m.x+PW>s[0]&&m.y<s[1]+s[3]&&m.y+PH>s[1]){if(m.vy>0){m.y=s[1]-PH;m.gr=true;landed=s}else m.y=s[1]+s[3];m.vy=0}
 if(m.gr&&!wg&&pv>500){SFX.land();dust(7);if(Math.random()<.25)pop(pick(['oof','thud','ow','squeak']))}
 m.fall-=dt;
 if(S.stage===1&&m.gr&&performance.now()>(S.pitCd||0)&&((role=='E'&&m.x>350&&m.x<398)||(role=='N'&&m.x>120&&m.x<176))){S.pitCd=performance.now()+25000;say(pick(LINES[role=='E'?'pit':'chasm']))}
 if(m.y>H+40&&m.fall<=0){m.fall=1;ev({k:'fall',w:role});m.x=S.stage===1?(role=='E'?HUMAN.respawn:SOCK.respawn):(role==='E'?S.checkpoint:60);m.y=S.stage===3&&role==='E'?(S.anchors[1]?172:S.anchors[0]?202:382):382;m.vy=0}
 if(S.stage>1){chamberStep(dt,landed);return}
 if(role=='E'&&landed&&!wg)HUMAN.stones.forEach((s,i)=>{if(landed[0]==s[0]&&landed[1]==s[1])ev({k:'stone',i})});
 if(role=='E'&&S.gateT>=1&&m.x>845&&!S.over)ev({k:'chamber',next:2,order:shuffle([0,1,2]),routes:shuffle([0,1,2])});
 if(role=='N'){
  if(m.gr&&m.x+14>SOCK.sw[0]&&m.x+14<SOCK.sw[1]&&m.y>FY-PH-4&&!S.sw)ev({k:'sw'});
  if(S.bridgeT>=1&&m.x>470&&!S.crossed)ev({k:'cross'});
 }
}

/* ===== THREE GATES, ONE LEVEL ===== */
const RUNES=['SUN','MOON','STAR'],COLORS=['#ffce54','#85dfff','#f898ed'];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function mission(){
 if(S.stage===1)return 'Gate 1 / Bridge & secrets — Send the plank, guide the hidden jumps, open the gate. Walk past it to continue.';
 if(S.stage===2)return role==='E'?'Your clue: '+S.order.map(i=>RUNES[i]).join(' → ')+'. Tell the Navigator the NEXT rune. Stand on its receiver and press E when their beam arrives.':'Explorer alone sees the rune order. At the PRISM console, press E to cycle its destination. Tell them where the beam points. A correct receiver stores one charge.';
 return role==='E'?'Ride the shifting platforms. Land on both golden anchor ledges to save checkpoints. Then stand on the SYNC pad and ask your partner to stand on theirs.':'At the GRAVITY console, E cycles platform heights. Watch the Explorer in your porthole; change phase when requested. After both anchors charge, walk to your SYNC pad.';
}
function chamberObjective(){
 if(S.gateOpen)return 'Gate '+S.stage+' open! Explorer: walk through →';
 if(S.stage===2)return role==='E'?'Next: '+RUNES[S.order[S.lit]]+' · charge '+S.lit+'/3 · E at lit receiver':'Prism: '+(S.beam<0?'OFF':RUNES[S.beam])+' · E near console';
 return 'Anchors '+Object.keys(S.anchors).length+'/2 · Gravity '+['LOW','RISE','FOLD'][S.phase]+' · Sync '+Math.round(S.hold/1.6*100)+'%';
}
function movers(){return [[220,[360,300,240][S.phase],85,16],[465,[365,365,210][S.phase],85,16],[700,[300,240,350][S.phase],65,16]]}
function chamberSolids(w){
 let a;
 if(S.stage===2||w==='N')a=[[0,FY,W,60]];
 else a=[[0,FY,180,60],[345,240,65,18],[600,210,65,18],[760,FY,140,60],...movers()];
 if(w==='E'&&!S.gateOpen)a.push([822,80,22,340]);
 return a;
}
function carryPlatform(){
 if(S.stage!==3||role!=='E')return;
 const now=movers(),old=S.oldMovers,m=S.me;
 if(old&&m.gr)old.forEach((p,i)=>{if(Math.abs(m.y+36-p[1])<3&&m.x+28>p[0]&&m.x<p[0]+p[2])m.y+=now[i][1]-p[1]});
 S.oldMovers=now;
}
function chamberInteract(){
 const m=S.me,c=m.x+14;
 if(S.stage===2){
  if(role==='N'){
   if(Math.abs(c-440)<65&&m.gr){ev({k:'beam'});return}
   say('Get close to the PRISM console, then press E.');return;
  }
  const i=[260,450,640].findIndex(x=>Math.abs(c-x)<45);
  if(i<0||!m.gr){say('Stand on the receiver for the next rune, then press E.');return}
  if(i!==S.order[S.lit]){SFX.quack();say('Wrong rune! Read your order aloud. No charges lost.');return}
  if(S.beam!==i){SFX.quack();say('No beam here! Ask the Navigator to aim at '+RUNES[i]+'.');return}
  ev({k:'rune',i});
 }else if(role==='N'){
  if(Math.abs(c-140)<65&&m.gr)ev({k:'phase'});
  else say('Use E at the GRAVITY console on the left. The SYNC pad on the right works by standing on it.');
 }else say('Land on the two golden anchor ledges. Then stand on your SYNC pad. Your feet do the paperwork.');
}
function chamberStep(dt,landed){
 const m=S.me;
 if(S.stage===3&&role==='E'){
  [[345,240],[600,210]].forEach(([x,y],i)=>{
   if(landed&&landed[0]===x&&landed[1]===y&&!S.anchors[i]){ev({k:'anchor',i});}
  });
  S.checkpoint=S.anchors[1]?615:S.anchors[0]?360:60;
  const together=m.gr&&m.x+14>=774&&m.x+14<=815&&S.ot.tx+14>=660&&S.ot.tx+14<=730&&Math.abs(S.ot.ty-384)<5;
  if(S.anchors[0]&&S.anchors[1]&&!S.gateOpen){
   S.hold=together?Math.min(1.6,S.hold+dt):0;
   S.holdNet=(S.holdNet||0)+dt;
   if(S.holdNet>.1){S.holdNet=0;net.send({t:'ev',k:'hold',stage:3,value:S.hold})}
   if(S.hold>=1.6)ev({k:'seal'});
  }
 }
 if(role==='E'&&m.x>850&&S.gateOpen){
  if(S.stage===2)ev({k:'chamber',next:3});
  else ev({k:'win',time:performance.now()-S.t0});
 }
 if(S.stage===3){const v=Math.round(S.hold*10);if(v!==S.lastHold){S.lastHold=v;updateHud()}}
}
function label(txt,x,y,col='#fff',size=16){g.fillStyle=col;g.font='600 '+size+'px Fredoka,system-ui';g.textAlign='center';g.fillText(txt,x,y);g.textAlign='left'}
function panel(x,y,w,h){g.fillStyle='#110c30e8';g.strokeStyle='#8c70c1';g.lineWidth=2;rr(x,y,w,h,12);g.fill();g.stroke()}
function rune(i,x,y,r=17){g.save();g.translate(x,y);g.strokeStyle=COLORS[i];g.fillStyle=COLORS[i];g.lineWidth=3;
 if(i===0){g.beginPath();g.arc(0,0,r*.55,0,7);g.fill();for(let k=0;k<8;k++){const a=k*Math.PI/4;g.beginPath();g.moveTo(Math.cos(a)*r*.75,Math.sin(a)*r*.75);g.lineTo(Math.cos(a)*r,Math.sin(a)*r);g.stroke()}}
 if(i===1){g.beginPath();g.arc(0,0,r*.8,.7,5.6);g.quadraticCurveTo(-r*.3,0,r*.8*Math.cos(.7),r*.8*Math.sin(.7));g.fill()}
 if(i===2)star(0,0,r,Math.PI/4);g.restore()}
function consoleDraw(x,text,t){glow(x,358,55,'69,209,201',.4);g.fillStyle='#352657';rr(x-25,352,50,68,8);g.fill();g.strokeStyle='#45d1c9';g.lineWidth=3;g.stroke();g.fillStyle='#45d1c9';rr(x-19,361,38,23,4);g.fill();label('E',x,379,'#130b27',18);label(text,x,339,'#f6ead2',16);dash(x,397,11,11,'#f2c14e',t)}
function chamberGate(t){
 const x=822,y=S.gateOpen?-330:80;
 glow(x+10,260,80,S.gateOpen?'69,209,201':'255,79,163',.2);
 for(let i=0;i<11;i++){g.fillStyle=S.gateOpen?'#45d1c9':'#725799';rr(x,y+i*31,22,29,3);g.fill();g.strokeStyle='#c8b5ee';g.lineWidth=1;g.stroke()}
 label(S.gateOpen?'OPEN':'GATE '+S.stage,810,65,S.gateOpen?'#45d1c9':'#ffb4d7',14);
 dash(875,365,17,32,S.gateOpen?'#45d1c9':'#9870c3',t);
}
function drawChamber(t,who,privateView){
 const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,S.stage===2?'#160b35':'#061a31');q.addColorStop(1,who==='E'?'#57335f':'#183859');g.fillStyle=q;g.fillRect(0,0,W,H);
 for(let i=0;i<50;i++){g.globalAlpha=.25+.25*Math.sin(t+i);g.fillStyle=COLORS[i%3];g.fillRect(hs(i+60)*W,hs(i+6)*390,2,2)}g.globalAlpha=1;
 glow(300,200,240,S.stage===2?'169,85,233':'45,150,220',.15);
 label(S.stage===2?'02 / THE PRISM POST OFFICE':'03 / THE GRAVITY DUET',225,65,'#ead7ff',22);
 label(who==='E'?'EXPLORER DIMENSION':'NAVIGATOR DIMENSION',220,91,'#a9c9e3',13);
 if(S.stage===2){
  earth(0,FY,W,60,'#7962ac','#2d2147',true,t);
  if(who==='E'){
   panel(70,125,315,83);
   if(privateView){label('YOUR PRIVATE DELIVERY ORDER',227,145,'#f6ead2',12);S.order.forEach((v,i)=>{rune(v,140+i*85,170);label(S.lit>i?'LOCKED':RUNES[v],140+i*85,199,S.lit>i?'#45d1c9':COLORS[v],12)})}
   else{label('SEALED CLUE • ASK EXPLORER',227,170,'#ab97c3',14)}
   [260,450,640].forEach((x,i)=>{const done=S.order.slice(0,S.lit).includes(i),on=S.beam===i;
    if(on){g.save();g.shadowBlur=20;g.shadowColor=COLORS[i];g.strokeStyle=COLORS[i];g.lineWidth=8;g.beginPath();g.moveTo(x,230);g.lineTo(x,411);g.stroke();g.restore();glow(x,390,65,'255,235,170',.5)}
    g.fillStyle=done?'#45d1c9':on?COLORS[i]:'#493d6b';rr(x-38,410,76,10,3);g.fill();rune(i,x,375);label(RUNES[i],x,342,COLORS[i],14);if(done)label('✓ STORED',x,315,'#45d1c9',14);
   });
   chamberGate(t);
  }else{
   consoleDraw(440,'ROTATE PRISM',t);
   panel(65,130,320,105);label('ROUTING GLASS',225,152,'#fff',14);
   [0,1,2].forEach(i=>{rune(i,125+i*100,183);label(RUNES[i],125+i*100,215,COLORS[i],12)});
   g.save();g.translate(440,300);g.rotate((S.dial<0?0:S.dial)*Math.PI/3+Math.PI/4);g.fillStyle='#d3fffd';g.shadowColor='#45d1c9';g.shadowBlur=20;g.fillRect(-9,-40,18,80);g.restore();
   if(S.beam>=0){g.strokeStyle=COLORS[S.beam];g.lineWidth=6;g.beginPath();g.moveTo(440,300);g.lineTo(125+S.beam*100,245);g.stroke();label('BEAM → '+RUNES[S.beam],440,260,COLORS[S.beam],18)}else label('BEAM OFF • E TO ROUTE',440,260,'#c3accf',15);
   label('Explorer stores the light. You choose its address.',250,460,'#e4cfff',15);
  }
 }else{
  if(who==='N'){
   earth(0,FY,W,60,'#45d1c9','#1c3554',true,t);consoleDraw(140,'GRAVITY: E',t);
   panel(65,130,340,142);label('PHASE '+(S.phase+1)+' / '+['LOW','RISE','FOLD'][S.phase],235,159,'#45d1c9',20);
   movers().forEach((p,i)=>{label('LIFT '+(i+1),125+i*108,192,'#e2dafa',12);g.fillStyle='#ffffff22';g.fillRect(112+i*108,204,27,48);g.fillStyle=COLORS[i];g.fillRect(112+i*108,204+(p[1]-210)/150*35,27,10)});
   label('Both anchors first. Then come here →',400,370,'#ffdf7e',15);
   g.fillStyle='#f2c14e';g.fillRect(660,410,70,10);dash(695,375,20,20,'#f2c14e',t);label('SYNC',695,340,'#ffdf7e',18);
  }else{
   g.fillStyle='#030a1d';g.fillRect(180,FY,580,60);
   [[0,FY,180,60],[345,240,65,18],[600,210,65,18],[760,FY,140,60]].forEach(p=>earth(...p,'#6096a9','#133454',true,t));
   movers().forEach((p,i)=>{g.strokeStyle='#ffffff22';g.setLineDash([4,5]);g.beginPath();g.moveTo(p[0]+p[2]/2,200);g.lineTo(p[0]+p[2]/2,400);g.stroke();g.setLineDash([]);earth(...p,COLORS[i],'#2d345c',true,t);label('LIFT '+(i+1),p[0]+p[2]/2,p[1]+32,COLORS[i],12)});
   [[377,215],[628,185]].forEach(([x,y],i)=>{glow(x,y,40,S.anchors[i]?'69,209,201':'242,193,78',.5);dash(x,y,15,18,S.anchors[i]?'#45d1c9':'#f2c14e',t);label(S.anchors[i]?'SAVED':'ANCHOR '+(i+1),x,y-30,S.anchors[i]?'#45d1c9':'#ffdf7e',13)});
   g.fillStyle='#f2c14e';g.fillRect(774,410,41,10);label('SYNC',789,392,'#f2c14e',12);chamberGate(t);
  }
  panel(270,100,180,38);label('SYNC '+Math.round(S.hold/1.6*100)+'%',360,125,'#ffdf7e',16);
 }
 const m=who===role?S.me:S.ot;sock(m.x,m.y,m.f,who==='E'?'#e8453c':'#45d1c9',who==='E'?'#f6ead2':'#6a2fb8',who==='N',Math.abs(m.vx||0)>1?2:0,t,m.vy);
}

/* ===== RENDER ===== */
const OUT='#2a1238',K=2;
const hs=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const rr=(x,y,w,h,r)=>{g.beginPath();g.roundRect(x,y,w,h,r)};
const vig=(()=>{const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),q=x.createRadialGradient(W/2,H/2,H*.42,W/2,H/2,W*.62);q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(12,0,34,.5)');x.fillStyle=q;x.fillRect(0,0,W,H);return c})();
function dust(n){const m=S.me;for(let i=0;i<n;i++)S.parts.push({x:m.x+14+(Math.random()-.5)*22,y:m.y+36,vx:(Math.random()-.5)*160,vy:-Math.random()*90,l:.5,c:'rgba(255,255,255,.75)'})}
function glow(x,y,r,c,a=1){const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,`rgba(${c},${a})`);q.addColorStop(1,`rgba(${c},0)`);g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)}
function ridge(base,amp,fq,ph,c1,c2,off){const q=g.createLinearGradient(0,base-amp,0,H);q.addColorStop(0,c1);q.addColorStop(1,c2);g.fillStyle=q;g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=10)g.lineTo(x,base-amp*(.5+.5*Math.sin((x+off)*fq+ph))-amp*.35*Math.sin((x+off)*fq*2.3+ph*2));g.lineTo(W,H);g.fill()}
function star(x,y,r,rot){g.save();g.translate(x,y);g.rotate(rot||0);g.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,d=i%2?r*.35:r;g.lineTo(Math.cos(a)*d,Math.sin(a)*d)}g.closePath();g.fill();g.restore()}
function earth(x,y,w,h,top,edge,sk,t){
 const q=g.createLinearGradient(0,y,0,y+h);if(sk){q.addColorStop(0,'#4d2b92');q.addColorStop(1,'#120a33')}else{q.addColorStop(0,'#7a4a9a');q.addColorStop(1,'#2a1448')}
 g.fillStyle=q;g.fillRect(x,y,w,h);
 for(let i=x+8;i<x+w-8;i+=20){const r=hs(i);g.fillStyle=sk?'rgba(120,230,255,.14)':'rgba(255,200,230,.14)';g.beginPath();g.ellipse(i+r*8,y+22+r*26,4+r*5,3+r*3,0,0,7);g.fill()}
 for(let i=x;i<x+w;i+=16){g.fillStyle=typeof top=='function'?top(i):top;g.fillRect(i,y,Math.min(16,x+w-i),8)}
 g.fillStyle=edge;g.fillRect(x,y+8,w,3);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x,y,w,2);
 if(!sk){for(let i=x+3;i<x+w-3;i+=6){const r=hs(i*1.3),hh=5+r*9,sw=Math.sin(t*2+i*.1)*2;g.strokeStyle=r>.5?'#9be85a':'#62bd2c';g.lineWidth=2;g.beginPath();g.moveTo(i,y+2);g.quadraticCurveTo(i+sw,y-hh/2,i+sw*1.6,y-hh);g.stroke()}
  for(let i=x+14;i<x+w-14;i+=47){const r=hs(i*3.1);if(r<.62)continue;g.fillStyle='#4a9a2a';g.fillRect(i,y-12,2,12);g.fillStyle=r>.8?'#ffd23f':'#ff6fb0';for(let k=0;k<5;k++){g.beginPath();g.arc(i+1+Math.cos(k*1.256)*3.4,y-14+Math.sin(k*1.256)*3.4,2.4,0,7);g.fill()}g.fillStyle='#fff6c8';g.beginPath();g.arc(i+1,y-14,1.8,0,7);g.fill()}}
 else{g.save();g.shadowColor='#45d1c9';g.shadowBlur=14;g.fillStyle='#aef';g.fillRect(x,y,w,2);g.restore()}
}
function crate(x,y,w){const q=g.createLinearGradient(0,y,0,y+14);q.addColorStop(0,'#f6c36a');q.addColorStop(1,'#b9792e');g.fillStyle=q;rr(x,y,w,14,3);g.fill();g.fillStyle='rgba(107,67,24,.45)';for(let i=x+10;i<x+w-4;i+=14)g.fillRect(i,y+2,2,10);g.strokeStyle='#6b4318';g.lineWidth=2;rr(x,y,w,14,3);g.stroke();g.fillStyle='#fff3b0';g.fillRect(x+4,y+5,2,2);g.fillRect(x+w-6,y+5,2,2)}
function plank(x,y,w,h){const q=g.createLinearGradient(0,y,0,y+h);q.addColorStop(0,'#f1b95f');q.addColorStop(1,'#b9792e');g.fillStyle=q;rr(x,y,w,h,3);g.fill();g.fillStyle='rgba(107,67,24,.4)';for(let i=x+10;i<x+w-10;i+=22)g.fillRect(i,y+h*.35,12,1.5);g.strokeStyle='#6b4318';g.lineWidth=2;rr(x,y,w,h,3);g.stroke();g.fillStyle='#5a3a14';g.fillRect(x+5,y+h/2-1,2,2);g.fillRect(x+w-7,y+h/2-1,2,2)}
function cloud(x,y){g.save();g.globalAlpha=.92;g.fillStyle='#fff';[[0,0,18],[22,-8,22],[48,0,18],[24,4,22]].forEach(c=>{g.beginPath();g.arc(x+c[0],y+c[1],c[2],0,7);g.fill()});g.fillStyle='#f3d4e8';rr(x-12,y+14,76,8,4);g.fill();g.restore()}
function dash(x,y,rx,ry,col,t){g.save();g.translate(x,y);g.rotate(t*2.5);g.shadowColor=col;g.shadowBlur=10;g.setLineDash([6,5]);g.strokeStyle=col;g.lineWidth=4;g.beginPath();g.ellipse(0,0,rx,ry,0,0,7);g.stroke();g.setLineDash([]);g.fillStyle='#fff';g.fillRect(-3,-3,6,6);g.restore()}
function sock(x,y,f,c1,c2,glw,bob,t,vy){
 vy=vy||0;const sq=Math.min(.2,Math.abs(vy)/3600);
 if(Math.abs(vy)<80){g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(x+14,y+38,15,4,0,0,7);g.fill()}
 g.save();g.translate(x+14,y+36+Math.sin(t*14)*bob);g.scale(f*(1-sq),1+sq);g.translate(0,-18);
 g.lineWidth=2.5;g.strokeStyle=OUT;g.lineJoin='round';g.fillStyle=c1;
 const body=()=>{g.beginPath();g.roundRect(-12,-18,24,36,8);g.roundRect(-8,10,22,9,5)};
 if(glw){g.shadowColor=c1;g.shadowBlur=18}body();g.fill();g.shadowBlur=0;
 g.save();body();g.clip();const sh=g.createLinearGradient(-12,0,13,0);sh.addColorStop(0,'rgba(255,255,255,.38)');sh.addColorStop(.45,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=sh;g.fillRect(-14,-20,30,42);
 g.fillStyle=c2;g.fillRect(-14,-6,30,5);g.fillRect(-14,4,30,5);g.beginPath();g.arc(13,14.5,5.5,0,7);g.fill();g.fillRect(-14,12,7,8);g.restore();body();g.stroke();
 g.fillStyle='#fff8ea';rr(-13,-22,26,10,3);g.fill();g.stroke();g.strokeStyle='rgba(176,138,90,.6)';g.lineWidth=1;for(let i=-9;i<=9;i+=4){g.beginPath();g.moveTo(i,-21);g.lineTo(i,-13);g.stroke()}
 g.strokeStyle=OUT;g.lineWidth=2;const bl=((t*1000+x*7)|0)%3600<130;
 [[5,6.5,7],[-4,5.5,6.5]].forEach(([ex,rx,ry])=>{g.fillStyle='#fff';g.beginPath();g.ellipse(ex,-2,rx,bl?1:ry,0,0,7);g.fill();g.stroke()});
 if(!bl){g.fillStyle='#111';g.beginPath();g.ellipse(7.2,-1,2.8,3.6,0,0,7);g.ellipse(-2.2,-1,2.4,3.2,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(8,-3,1.6,1.6);g.fillRect(-1.5,-2.8,1.4,1.4);
  g.strokeStyle=OUT;g.lineWidth=1.8;g.beginPath();g.arc(3,6.5,3,.2,Math.PI-.2);g.stroke()}
 g.fillStyle='rgba(255,100,140,.65)';g.beginPath();g.ellipse(11,4,3,2,0,0,7);g.fill();
 if(glw){g.fillStyle='#fff';for(let i=0;i<3;i++)star(Math.cos(t*2+i*2.1)*22,Math.sin(t*2+i*2.1)*16-6,3.2,t)}
 g.restore()}
function drawHuman(t,full){
 const ex=role=='E'?S.me:S.ot,par=(ex.x-450)*.02;
 let q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#ff8fb8');q.addColorStop(.5,'#ffc9bd');q.addColorStop(.85,'#ffeccf');q.addColorStop(1,'#ffd4e6');g.fillStyle=q;g.fillRect(0,0,W,H);
 glow(460,170,270,'255,240,200',.8);
 g.save();g.translate(460,170);g.rotate(t*.05);g.fillStyle='rgba(255,255,255,.13)';for(let i=0;i<12;i++){g.rotate(Math.PI/6);g.beginPath();g.moveTo(0,0);g.lineTo(420,-26);g.lineTo(420,26);g.fill()}g.restore();
 g.fillStyle='#fff6d8';g.beginPath();g.arc(460,170,64,0,7);g.fill();g.fillStyle='#ffe9a8';g.beginPath();g.arc(460,170,50,0,7);g.fill();
 cloud(130+Math.sin(t*.4)*12,90);cloud(700-Math.sin(t*.3)*12,60);cloud(520+Math.sin(t*.25)*16,250);
 ridge(330,70,.006,0,'#e49bc8','#b268a8',par*.5);ridge(372,55,.009,2,'#b570bc','#7d4a9e',par);ridge(408,34,.013,4,'#85529f','#4c2a78',par*1.6);
 for(let i=0;i<14;i++){const px=(hs(i)*W+t*(14+hs(i+9)*18))%W,py=(hs(i+3)*380+Math.sin(t*.8+i)*14+t*6*hs(i+5))%400;g.save();g.translate(px,py);g.rotate(t+i);g.fillStyle=i%3?'rgba(255,255,255,.8)':'rgba(255,110,170,.85)';g.beginPath();g.ellipse(0,0,5,2.5,0,0,7);g.fill();g.restore()}
 q=g.createLinearGradient(0,FY,0,H);q.addColorStop(0,'#1a0b30');q.addColorStop(1,'#4a1a6a');g.fillStyle=q;g.fillRect(400,FY,320,60);
 for(let i=0;i<6;i++)glow(420+i*55+Math.sin(t+i)*14,H-((t*20+i*13)%60),32,'190,110,255',.35);
 if((t%5)>.18)[[535,455],[577,455]].forEach(([a,b])=>{glow(a,b,16,'255,226,90',.5);g.fillStyle='#ffe35a';g.beginPath();g.ellipse(a,b,6,8,0,0,7);g.fill();g.fillStyle='#111';g.fillRect(a-1,b-6,2,12)});
 HUMAN.floors.forEach(f=>earth(f[0],FY,f[1]-f[0],60,'#7bd23a','#3f8f1f',false,t));
 for(const [i,s] of HUMAN.stones.entries()){
  if(full){g.globalAlpha=.6+.25*Math.sin(t*4);crate(s[0],s[1],HUMAN.stoneW);g.globalAlpha=1;g.fillStyle='#ff4fa3';g.beginPath();g.arc(s[0]+35,s[1]-16,13,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();g.fillStyle='#fff';g.font='bold 18px Fredoka';g.textAlign='center';g.fillText(i+1,s[0]+35,s[1]-10);g.textAlign='left'}
  else if(S.glow[i]>0){glow(s[0]+35,s[1]+7,60,'255,230,120',Math.min(1,S.glow[i]));g.globalAlpha=Math.min(1,S.glow[i]*2);crate(s[0],s[1],HUMAN.stoneW);g.globalAlpha=1}}
 const p=HUMAN.portal,px=(p[0]+p[1])/2,py=FY-40;glow(px,py,75,'120,60,220',.55);
 const pg=g.createRadialGradient(px,py,2,px,py,40);pg.addColorStop(0,'#fff');pg.addColorStop(.35,'#a77bff');pg.addColorStop(1,'#3a1d8a');g.fillStyle=pg;g.beginPath();g.ellipse(px,py,28,40,0,0,7);g.fill();
 dash(px,py,24,36,'#45d1c9',t);dash(px,py,16,27,'#ff4fa3',-t*1.4);
 for(let i=0;i<6;i++){const a=t*2+i*1.05,r=1-((t*.6+i/6)%1);g.fillStyle='#fff';g.globalAlpha=r;g.fillRect(px+Math.cos(a)*30*r-1,py+Math.sin(a)*42*r-1,3,3)}g.globalAlpha=1;
 if(S.plank=='floor'||S.plank=='dropped'){const x0=S.plank=='floor'?HUMAN.plankX:S.plankX-75;plank(x0,FY-14,150,14)}
 const fx=HUMAN.flagX;glow(fx,FY-48,60,'255,79,163',.35);dash(fx,FY-48,28,28,'#ff2f92',t);
 g.fillStyle='#e8e0f2';g.fillRect(fx-1,FY-86,3,86);g.fillStyle='#ff4fa3';g.beginPath();g.moveTo(fx+2,FY-84);for(let i=0;i<=30;i+=5)g.lineTo(fx+2+i,FY-84+Math.sin(t*5+i*.3)*3);for(let i=30;i>=0;i-=5)g.lineTo(fx+2+i,FY-62+Math.sin(t*5+i*.3)*3);g.fill();g.fillStyle='#fff';g.font='bold 14px Fredoka';g.fillText('♥',fx+9,FY-68+Math.sin(t*5+.9)*2);
 const G=HUMAN.gate,gy=S.gateT*G.h;
 for(let i=0;i<4;i++){const by=FY-G.h-gy+i*30,m=g.createLinearGradient(G.x,0,G.x+G.w,0);m.addColorStop(0,'#d4daf8');m.addColorStop(1,'#7b82bf');g.fillStyle=m;rr(G.x,by,G.w,30,3);g.fill();g.strokeStyle='#4a4d84';g.lineWidth=2;rr(G.x,by,G.w,30,3);g.stroke();g.fillStyle='#3a3d6a';g.fillRect(G.x+7,by+9,4,10);g.fillStyle='#fff';g.fillRect(G.x+3,by+4,2,2)}
 {const on=S.sw,c=on?'96,255,140':'255,70,70';g.fillStyle='#4a4d84';rr(G.x-4,FY-12,26,12,3);g.fill();glow(G.x+9,FY-18,22,c,.7);g.fillStyle=on?'#6dff94':'#ff4646';g.beginPath();g.arc(G.x+9,FY-18,5,0,7);g.fill()}
 sock(ex.x,ex.y,ex.f,'#e8453c','#f6ead2',0,Math.abs(ex.vx||0)>1?2:0,t,ex.vy);
 if(S.plank=='carried')plank(ex.x-60,ex.y-18,150,12);
 S.pl.forEach(o=>{const a=Math.min(1,o.t);g.strokeStyle='#ff4fa3';g.lineWidth=3;for(let k=0;k<2;k++){const r=((t*1.2+k*.5)%1)*34;g.globalAlpha=a*(1-r/34);g.beginPath();g.arc(o.x,o.y,r+6,0,7);g.stroke()}g.globalAlpha=a;glow(o.x,o.y,24,'255,79,163',.8);g.font='20px serif';g.fillText('📍',o.x-10,o.y-8);g.globalAlpha=1;g.font='16px Fredoka'});
}
function drawSock(t){
 const nv=role=='N'?S.me:S.ot,par=(nv.x-450)*.02;
 let q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#07031a');q.addColorStop(.55,'#241056');q.addColorStop(1,'#5a2a9a');g.fillStyle=q;g.fillRect(0,0,W,H);
 glow(200+par,120,250,'255,79,163',.22);glow(720-par,200,270,'69,209,201',.2);glow(460,140,210,'140,90,255',.28);
 [['69,209,201',90],['255,79,163',160]].forEach(([c,y0],k)=>{const a=g.createLinearGradient(0,y0-40,0,y0+80);a.addColorStop(0,`rgba(${c},0)`);a.addColorStop(.5,`rgba(${c},.24)`);a.addColorStop(1,`rgba(${c},0)`);g.fillStyle=a;g.beginPath();g.moveTo(0,y0+80);for(let x=0;x<=W;x+=20)g.lineTo(x,y0+Math.sin(x*.01+t*.6+k*2)*28+Math.sin(x*.023-t*.4)*12);g.lineTo(W,y0+80);g.fill()});
 g.fillStyle='#fff';for(let i=0;i<70;i++){g.globalAlpha=.35+.5*Math.sin(t*(1+hs(i)*2)+i);const sx=hs(i+1)*W,sy=hs(i+7)*330;if(i%9==0)star(sx,sy,4,0);else g.fillRect(sx,sy,i%3?2:3,i%3?2:3)}g.globalAlpha=1;
 const ss=(t%9)/1.1;if(ss<1){g.strokeStyle=`rgba(255,255,255,${1-ss})`;g.lineWidth=2;g.beginPath();g.moveTo(100+ss*560,20+ss*170);g.lineTo(40+ss*560,ss*170-4);g.stroke()}
 const mg=g.createRadialGradient(445,125,4,460,140,64);mg.addColorStop(0,'#fffbe6');mg.addColorStop(1,'#cfc6ef');g.fillStyle=mg;g.beginPath();g.arc(460,140,56,0,7);g.fill();g.fillStyle='rgba(120,100,170,.28)';[[440,125,12],[478,160,9],[470,118,6],[445,162,7]].forEach(c=>{g.beginPath();g.arc(c[0],c[1],c[2],0,7);g.fill()});g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=3;g.beginPath();g.arc(460,140,64,0,7);g.stroke();
 for(let i=0;i<9;i++){const bx=i*115-20+par*2,h=50+hs(i+2)*70;g.fillStyle='#1c0e46';g.beginPath();g.moveTo(bx,FY);g.lineTo(bx+22,FY-h);g.lineTo(bx+44,FY);g.fill();g.strokeStyle='rgba(69,209,201,.35)';g.lineWidth=2;g.stroke()}
 for(let i=0;i<5;i++){const cx=80+i*190+Math.sin(t*.7+i)*14,cy=250+Math.sin(t*1.1+i*2)*16-(i%2)*70;glow(cx,cy,28,i%2?'69,209,201':'255,79,163',.35);g.save();g.translate(cx,cy);g.rotate(Math.sin(t+i)*.2);g.fillStyle=i%2?'#7ff':'#f9c';g.globalAlpha=.85;g.beginPath();g.moveTo(0,-14);g.lineTo(8,0);g.lineTo(0,14);g.lineTo(-8,0);g.fill();g.restore()}
 q=g.createLinearGradient(0,FY,0,H);q.addColorStop(0,'rgba(130,70,230,.6)');q.addColorStop(1,'rgba(20,6,50,.96)');g.fillStyle=q;g.fillRect(180,FY,270,60);
 for(let i=0;i<9;i++){g.fillStyle='rgba(210,180,255,.85)';g.fillRect(190+hs(i)*250,H-((t*18+i*9)%60),2,2)}
 const top=x=>((x/16)|0)%2?'#ff4fa3':'#45d1c9';
 SOCK.floors.forEach(f=>earth(f[0],FY,f[1]-f[0],60,top,'#2a1550',true,t));
 if(S.bridgeT>0){const e=1-Math.pow(1-Math.min(1,S.bridgeT),3);g.globalAlpha=e;g.save();g.translate(0,(1-e)*-200);earth(SOCK.bridge[0],FY,290,22,top,'#2a1550',true,t);g.restore();g.globalAlpha=1}
 else{const sh=S.nag>0?Math.sin(t*60)*6:0,bb=Math.sin(t*4)*5;g.save();g.shadowColor='#f2c14e';g.shadowBlur=12;g.setLineDash([8,6]);g.strokeStyle='#f2c14e';g.lineWidth=3;g.strokeRect(190+sh,FY-60+bb,240,24);g.restore();g.fillStyle='#f2c14e';g.font='bold 18px Fredoka';g.fillText('PLANK?',275+sh,FY-42+bb)}
 const sw=SOCK.sw,pr=S.sw?4:0,on=S.sw;glow(sw[0]+35,FY-6,on?64:44,on?'242,193,78':'232,69,60',.55);
 g.fillStyle='#1b0d40';rr(sw[0]-4,FY-6,78,8,3);g.fill();const sq=g.createLinearGradient(0,FY-14+pr,0,FY-2);sq.addColorStop(0,on?'#ffe28a':'#ff8a7e');sq.addColorStop(1,on?'#d9a020':'#b0281f');g.fillStyle=sq;rr(sw[0],FY-12+pr,70,10-pr,4);g.fill();g.strokeStyle=OUT;g.lineWidth=2;g.stroke();
 sock(nv.x,nv.y,nv.f,'#45d1c9','#6a2fb8',1,Math.abs(nv.vx||0)>1?2:0,t,nv.vy);
}
function inset(draw,s,full,t){
 const ix=W-W*s-10,iy=10,col=role=='N'?'#45d1c9':'#f2c14e',R=22*s;
 g.save();g.shadowColor='#000a';g.shadowBlur=18;g.fillStyle='#000';rr(ix,iy,W*s,H*s,R);g.fill();g.restore();
 g.save();g.beginPath();g.roundRect(ix,iy,W*s,H*s,R);g.clip();g.translate(ix,iy);g.scale(s,s);g.font='16px Fredoka';draw(t,full);g.restore();
 g.save();g.strokeStyle=col;g.shadowColor=col;g.shadowBlur=10;g.lineWidth=3;rr(ix,iy,W*s,H*s,R);g.stroke();g.restore();
 const lb=role=='N'?'📡 RADAR':'🔭 PORTHOLE';g.font='bold 12px Fredoka';const tw=g.measureText(lb).width;g.fillStyle='rgba(10,5,30,.78)';rr(ix+6,iy+H*s-24,tw+14,18,9);g.fill();g.fillStyle=col;g.fillText(lb,ix+13,iy+H*s-11);
}
function obj(){
 if(S.stage>1)return chamberObjective();
 if(!S.done.plank)return role=='E'?(S.plank=='carried'?'Take the plank to the portal, then press E':'Find the plank (E). Check the porthole!'):'The Explorer needs to send you a plank';
 if(!S.done.cross)return role=='E'?'Plank sent! Now wait for the switch…':'Cross the bridge';
 if(!S.sw)return role=='N'?'Stand on the switch':'Gate closed. Navigator is on it, supposedly.';
 return role=='E'?'Gate open! Hop the unseen stones using pings → flag':'Ping the stones: guide the Explorer, 1 → 2 → 3';
}
function frame(ts){
 requestAnimationFrame(frame);if(!started||!S)return;
 const t=ts/1000,dt=Math.min(.05,(ts-lastT)/1000||0);lastT=ts;
 if(!S.over){carryPlatform();step(dt)}
 // timers + animations
 S.nag-=dt;S.emoCd-=dt;S.shake-=dt;S.oyee=Math.max(0,(S.oyee||0)-dt);S.oyeeCd=Math.max(0,(S.oyeeCd||0)-dt);{const b=$('oyee'),lb=S.oyeeCd>0?'⏳ '+S.oyeeCd.toFixed(1):'🆘 OYEE!';if(b.textContent!=lb){b.textContent=lb;b.disabled=S.oyeeCd>0}}S.glow=S.glow.map(v=>Math.max(0,v-dt));
 if(S.bridgeT>0&&S.bridgeT<1)S.bridgeT=Math.min(1,S.bridgeT+dt/.8);if(S.sw&&S.gateT<1)S.gateT=Math.min(1,S.gateT+dt/1.2);
 S.pops=S.pops||[];S.pops.forEach(q=>{q.t-=dt;q.y-=30*dt});S.pops=S.pops.filter(q=>q.t>0);S.chat=(S.chat??14)-dt;if(S.chat<=0&&!S.over){S.chat=14+Math.random()*10;say(S.stage===1?pick(LINES.chat):pick(['Two dimensions. One shared brain cell. Use it wisely.','If in doubt, talk it out. Or shout OYEE.','Your partner sees a different clue. Ask them!']))}
 S.pl.forEach(q=>q.t-=dt);S.pl=S.pl.filter(q=>q.t>0);S.em.forEach(q=>q.t-=dt);S.em=S.em.filter(q=>q.t>0);
 S.parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=600*dt;p.l-=dt});S.parts=S.parts.filter(p=>p.l>0);
 if(role=='N'&&S.myPings<CFG.pingMax){S.pingAcc+=dt;if(S.pingAcc>=CFG.pingRecharge){S.pingAcc=0;S.myPings++;updateHud()}}
 if((performance.now()-S.lastProg)/1000>CFG.idle&&!S.over){S.lastProg=performance.now();say(S.stage===1?pick(LINES[role=='E'?'idleE':'idleN']):mission())}
 const o=S.ot;o.x+=(o.tx-o.x)*Math.min(1,dt*15);o.y+=(o.ty-o.y)*Math.min(1,dt*15);o.vx=(o.tx-o.x)*10;o.vy=(o.ty-o.y)*10;
 S.posT=(S.posT||0)+dt;if(S.posT>.05){S.posT=0;net.send({t:'pos',stage:S.stage,x:S.me.x,y:S.me.y,f:S.me.f})}
 // draw
 g.setTransform(K,0,0,K,0,0);g.save();if(S.shake>0)g.translate((Math.random()-.5)*10,(Math.random()-.5)*10);
 g.font='16px Fredoka';
 if(S.stage>1){drawChamber(t,role,true);inset((tt)=>drawChamber(tt,role==='E'?'N':'E',false),.28,false,t)}else if(role=='E'){drawHuman(t,false);inset(drawSock,.34,false,t)}else{drawSock(t);inset(drawHuman,.48,true,t)}
 S.parts.forEach(p=>{g.globalAlpha=Math.max(0,Math.min(1,p.l/.5));g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,1.5+3*p.l,0,7);g.fill()});g.globalAlpha=1;g.drawImage(vig,0,0);
 // own emoji above avatar, partner's big
 S.em.forEach(q=>{g.font=q.w==role?'28px serif':'64px serif';const a=Math.min(1,q.t);g.globalAlpha=a;if(q.w==role)g.fillText(q.e,S.me.x-2,S.me.y-12-(1.6-q.t)*20);else g.fillText(q.e,W/2-30,200-(1.6-q.t)*40);g.globalAlpha=1});
 S.pops.forEach(q=>{g.globalAlpha=Math.min(1,q.t*2);g.font='bold 30px Fredoka';g.lineWidth=5;g.strokeStyle=OUT;g.strokeText(q.txt,q.x-10,q.y-14);g.fillStyle='#ffe35a';g.fillText(q.txt,q.x-10,q.y-14);g.globalAlpha=1});
 g.restore();
 mc.setTransform(K,0,0,K,0,0);mc.imageSmoothingEnabled=true;mc.drawImage(buf,0,0,W,H);
 {const o=obj();mc.font='600 16px Fredoka';const tw=mc.measureText(o).width;mc.fillStyle='rgba(15,8,40,.75)';mc.beginPath();mc.roundRect(8,8,tw+40,30,15);mc.fill();mc.strokeStyle='rgba(255,255,255,.25)';mc.lineWidth=1.5;mc.stroke();mc.fillStyle=role=='E'?'#ff6a5e':'#45d1c9';mc.beginPath();mc.arc(24,23,5,0,7);mc.fill();mc.fillStyle='#f6ead2';mc.fillText(o,36,29)}
 if(S.oyee>0){const k=S.oyee/1.6,e=1-k;mc.save();mc.strokeStyle=`rgba(255,207,58,${k})`;mc.lineWidth=16;mc.strokeRect(0,0,W,H);for(let i=0;i<3;i++){mc.strokeStyle=`rgba(255,122,26,${k*(1-((e*2+i/3)%1))})`;mc.lineWidth=6;mc.beginPath();mc.arc(W/2,H/2,40+((e*2+i/3)%1)*420,0,7);mc.stroke()}
  mc.translate(W/2,H/2-10);mc.rotate(-.08+Math.sin(t*40)*.03*k);const sc=1+Math.sin(Math.min(1,e*5)*Math.PI)*.35;mc.scale(sc,sc);mc.globalAlpha=Math.min(1,k*3);mc.textAlign='center';mc.font='bold 130px Fredoka';mc.lineJoin='round';mc.lineWidth=18;mc.strokeStyle=OUT;mc.strokeText('OYEE!',0,30);const q=mc.createLinearGradient(0,-70,0,40);q.addColorStop(0,'#fff3a0');q.addColorStop(1,'#ff9a1a');mc.fillStyle=q;mc.fillText('OYEE!',0,30);mc.font='22px Special Elite,monospace';mc.lineWidth=6;mc.strokeText('🆘 your partner is STUCK',0,72);mc.fillStyle='#fff';mc.fillText('🆘 your partner is STUCK',0,72);mc.restore()}
 if(S.nag>0){mc.fillStyle='#e8453c';mc.strokeStyle='#fff';mc.lineWidth=4;mc.font='bold 56px Fredoka';mc.strokeText('HURRY UP',W/2-150,110);mc.fillText('HURRY UP',W/2-150,110)}
}
requestAnimationFrame(frame);
/* ===== BOOT ===== */
$('room').value=(new URLSearchParams(location.search).get('room')||Math.random().toString(36).slice(2,6)).toUpperCase().slice(0,4);


// Public, read-only context accessor used by the separate AI hint UI.
window.getAiGameContext = function () {
  if (!S || !started) return null;
  return {
    gate: S.stage,
    role: role === 'E' ? 'Explorer' : 'Navigator',
    gatesCompleted: S.gates || 0,
    gateOpen: Boolean(S.gateOpen),
    trust: Math.round(S.trust || 0),
    falls: S.falls ? { explorer: S.falls.E || 0, navigator: S.falls.N || 0 } : {},
    puzzleState: {
      litRunes: S.lit || 0,
      beamSet: S.beam >= 0,
      anchorsActivated: S.anchors ? Object.keys(S.anchors).length : 0,
      gravityPhase: S.phase || 0,
      syncPercent: Math.round(((S.hold || 0) / 1.6) * 100)
    }
  };
};
