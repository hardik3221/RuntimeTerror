'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../public/index.html'),'utf8');
function harness(){
 let now=100000;const timers=[],nodes=new Map();const $=id=>{if(!nodes.has(id))nodes.set(id,{hidden:true,textContent:'',dataset:{},style:{},setAttribute(){},matches(){return false}});return nodes.get(id)};
 const scope={$,addEventListener(){},leggyFallAudio:{pause(){},currentTime:0},performance:{now:()=>now},started:true,S:{stage:1,over:false},reduce:false,document:{querySelectorAll:()=>[]},AbortController,setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length},clearTimeout(){},muted:false};
 vm.createContext(scope);
 const source=html.slice(html.indexOf('const leggy={'),html.indexOf('let leggyIntroFocus;'));
 vm.runInContext(source+';globalThis.state=leggy;leggyPlace=()=>{};',scope);
 return {scope,$,timers,tick(ms){now+=ms},run:code=>vm.runInContext(code,scope)};
}
test('remarks have no expiry; replacement works after pacing interval',()=>{
 const h=harness();h.run("leggySpeak('First remark.');");assert.equal(h.$('leggySpeech').hidden,false);assert.equal(h.timers.length,0);
 h.tick(120000);assert.equal(h.$('leggySpeech').hidden,false);assert.equal(h.$('leggySpeechText').textContent,'First remark.');
 h.run("leggySpeak('Next remark.');");assert.equal(h.$('leggySpeechText').textContent,'Next remark.');
});
test('old in-flight joke is discarded after newer gameplay event',async()=>{
 const h=harness();let resolve;h.scope.deferred=new Promise(r=>resolve=r);
 h.run("leggyRequest=()=>deferred;leggyQueue('fall',3)");h.run("leggyQueue('gate',4)");
 resolve({source:'groq',comment:'Stale fall joke.',mood:'smirk'});await new Promise(r=>setImmediate(r));
 assert.equal(h.$('leggySpeechText').textContent,'');assert.equal(h.scope.state.pending.event,'gate');
});
test('progress cancels queued fall roast; minor events do not request commentary',()=>{
 const h=harness();h.scope.state.pending={event:'fall',weight:3};h.run("leggyEvent({k:'plank'})");assert.equal(h.scope.state.pending,null);assert.equal(h.scope.state.retries,0);
});
test('falls track the actor and laugh on either side; text waits for laugh',async()=>{
 const h=harness();h.run("globalThis.laughs=0;leggyLaugh=()=>{laughs++;leggy.laughUntil=performance.now()+650};leggyRequest=async()=>({source:'groq',comment:'Fresh fall joke.',mood:'smirk'});leggyEvent({k:'fall',w:'N'});");
 await new Promise(r=>setImmediate(r));assert.equal(h.scope.laughs,1);assert.equal(h.scope.state.failedRole,'N');assert.equal(h.$('leggySpeechText').textContent,'');
 const timer=h.timers.find(t=>t.delay===650);assert.ok(timer);h.tick(650);timer.fn();assert.equal(h.$('leggySpeechText').textContent,'Fresh fall joke.');
});
test('hint open prevents background speech from overwriting instructions',()=>{
 const h=harness();h.$('hintCard').hidden=false;h.run("leggySpeak('Interrupting remark.')");assert.equal(h.$('leggySpeechText').textContent,'');
});
test('uploaded audio is mute-aware and rapid falls do not overlap',()=>{
 const h=harness(),start=html.indexOf('let leggyLaughTextTimer=0;'),end=html.indexOf('function toggleMute()',start);
 let plays=0;h.scope.leggyFallAudio={currentTime:0,play(){plays++;return Promise.resolve()}};
 const label=h.$('leggyLaughText');label.classList={active:false,remove(){this.active=false},add(){this.active=true}};
 vm.runInContext(html.slice(start,end),h.scope);h.run('muted=true;leggyLaugh()');assert.equal(plays,0);assert.equal(label.classList.active,true);
 h.run('muted=false;leggyLaugh();leggyLaugh()');assert.equal(plays,1);h.tick(1401);h.run('leggyLaugh()');assert.equal(plays,2);assert.equal(label.classList.active,true);
});
test('8-second refresh consumes fresh buffered lines without another API call',async()=>{
 const h=harness();let calls=0;h.scope.makeRequest=async()=>{calls++;return {source:'groq',lines:['First generated aside.','Second generated aside.','Third generated aside.']}};
 h.run("leggyRequest=makeRequest;leggyActivity();leggy.nextAside=performance.now()+8000");h.tick(7999);h.run('leggyTick()');assert.equal(calls,0);
 h.tick(1);h.run('leggyActivity();leggyTick()');await new Promise(r=>setImmediate(r));assert.equal(calls,1);assert.equal(h.$('leggySpeechText').textContent,'First generated aside.');
 h.tick(8000);h.run('leggyActivity();leggyTick()');await new Promise(r=>setImmediate(r));assert.equal(calls,1);assert.equal(h.$('leggySpeechText').textContent,'Second generated aside.');
});
test('AFK gets one remark at ten seconds; activity starts a new AFK episode',()=>{
 const h=harness();h.run("globalThis.queued=[];leggyQueue=event=>queued.push(event);leggy.nextAside=Infinity;leggyActivity()");
 h.tick(9999);h.run('leggyTick()');assert.equal(h.scope.queued.length,0);
 h.tick(1);h.run('leggyTick();leggyTick()');assert.deepEqual(Array.from(h.scope.queued),['afk']);
 h.tick(10000);h.run('leggyTick()');assert.equal(h.scope.queued.length,1);
 h.run('leggyActivity()');h.tick(10001);h.run('leggyTick()');assert.equal(h.scope.queued.length,2);
});
test('temporary busy response preserves visible joke and respects retry delay',async()=>{
 const h=harness();h.run("leggySpeak('Keep this line.');leggy.visibleUntil=0;leggyRequest=async()=>({source:'unavailable',reason:'rate_limit',retryAfter:7});leggyQueue('fall',3)");
 await new Promise(r=>setImmediate(r));assert.equal(h.$('leggySpeechText').textContent,'Keep this line.');assert.equal(h.scope.state.retryAt,107000);
});


test('manual hint requests trigger Leggy laughter but automatic AI retries do not',()=>{
 assert.match(html,/if\(newlyOpened\)leggyHint\(false,true\)/);
 assert.match(html,/onclick=\"leggyHint\(false,true\)\">RETRY AI HINT/);
 assert.match(html,/function leggyHint\(automatic=false,manualRequest=false\)[\s\S]*?if\(manualRequest\)leggyLaugh\(true\)/);
});
test('Leggy is slightly larger and anchored immediately below trust HUD without overlapping task bar',()=>{
 const start=html.indexOf('function leggyPlace(){'),end=html.indexOf('function leggyLater(',start);
 const hud={getBoundingClientRect:()=>({left:14,right:274,top:10,bottom:88})};
 const partner={getBoundingClientRect:()=>({left:850,right:1250,top:10,bottom:540})};
 const task={getBoundingClientRect:()=>({top:620,bottom:700})};
 const nodes={hud,leggyDock:{style:{setProperty(k,v){this[k]=v}}},leggySpeech:{style:{}},hintCard:{style:{}}};
 const scope={started:true,innerWidth:1280,innerHeight:720,$:id=>nodes[id],document:{querySelector:sel=>sel==='.partner-panel'?partner:task},Math};
 vm.createContext(scope);vm.runInContext(html.slice(start,end),scope);scope.leggyPlace();
 assert.equal(nodes.leggyDock.style.position,'fixed');assert.equal(nodes.leggyDock.style.left,'14px');assert.equal(nodes.leggyDock.style.top,'108px');
 assert.equal(nodes.leggyDock.style['--leggy-size'],'96px');assert.equal(nodes.leggyDock.style.height,'132px');
 assert.equal(nodes.leggyDock.style.visibility,'visible');
 for(const panel of [nodes.leggySpeech,nodes.hintCard]){
  assert.equal(panel.style.position,'absolute');assert.equal(panel.style.left,'106px');assert.equal(panel.style.top,'0px');
  assert.ok(parseInt(panel.style.maxHeight,10)<=498,'panel remains above the task bar');
  assert.equal(panel.style.boxSizing,'border-box');
 }
 assert.match(html,/addEventListener\('scroll',leggyPlace/);
 assert.match(html,/#leggyLaughText\.is-visible\{animation:leggy-laugh-pop/);
});

test('five-level map makes all five adventures selectable',()=>{
 assert.match(html,/function drawWhisperingWoods\(/);
 assert.match(html,/function drawTangleTower\(/);
 assert.match(html,/const TOWER_PLATFORMS=/);
 assert.match(html,/firefliesCaught>=5/);
 assert.match(html,/function releaseTowerJump\(/);
 assert.match(html,/Hold Space, W, or ↑ to charge/);
 assert.match(html,/READY TO PLAY/);
 assert.match(html,/id="level4"/);assert.match(html,/id="level5"/);assert.match(html,/level>=1&&level<=5/);assert.match(html,/The Midnight Diner/);assert.match(html,/The Bubble Ballet/);
 assert.match(html,/&level='\+selectedAdventureLevel/);
});
