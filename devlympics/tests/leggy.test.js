'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createLeggyService,contextOf,groundedHint}=require('../leggy-service');
const answer=value=>({ok:true,json:async()=>({choices:[{message:{content:JSON.stringify(value)}}]})});
test('missing key reports unavailable, never canned jokes or hints',async()=>{
 let calls=0;const service=createLeggyService({apiKey:'',fetchImpl:()=>{calls++;throw Error()}});
 for(const type of ['intro','commentary','hint','completion']){const r=await service.respond({type});assert.equal(r.source,'unavailable');assert.equal(r.reason,'missing_key');assert.equal(r.comment+r.roast+r.hint,'')}
 assert.equal(calls,0);
});
test('identical requests generate afresh with history, fresh nonce and private-data filtering',async()=>{
 const requests=[];const service=createLeggyService({apiKey:'test',fetchImpl:async(url,options)=>{assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');requests.push(JSON.parse(options.body));return answer({comment:'New joke '+requests.length,mood:'smirk'})}});
 const input={type:'commentary',event:'fall',context:{role:'N',stage:2,nextRune:'STAR',name:'SECRET',room:'CODE'},recent:['Earlier joke','Try STAR next'],events:['fall','injected event']};
 const a=await service.respond(input),b=await service.respond(input);assert.notEqual(a.comment,b.comment);assert.equal(requests.length,2);
 const data=JSON.parse(requests[0].messages[1].content);assert.deepEqual(data.recent,['Earlier joke']);assert.deepEqual(data.events,['fall']);assert.equal(data.context.nextRune,undefined);assert.doesNotMatch(requests[0].messages[1].content,/SECRET|CODE/);assert.notEqual(data.nonce,JSON.parse(requests[1].messages[1].content).nonce);
});
test('model-written hints are not replaced with reference text',async()=>{
 const fresh='Pick up that wooden plank with E, then take it to the glowing portal and use E again to send it.';
 const service=createLeggyService({apiKey:'test',fetchImpl:async()=>answer({roast:'Your logistics department is currently a sock.',hint:fresh,mood:'smirk'})});
 const r=await service.respond({type:'hint',context:{role:'E',stage:1}});assert.equal(r.source,'groq');assert.equal(r.hint,fresh);assert.notEqual(r.hint,groundedHint(contextOf({role:'E',stage:1})));
});
test('duplicates regenerate; unsupported controls and Navigator rune leaks are rejected',async()=>{
 let calls=0;const service=createLeggyService({apiKey:'test',fetchImpl:async()=>answer({comment:++calls===1?'Already said':'A different observation',mood:'smirk'})});
 const r=await service.respond({type:'commentary',recent:['Already said']});assert.equal(r.comment,'A different observation');assert.equal(calls,2);
 for(const hint of ['Press X to fly over this entire level.','Use the SUN receiver, then MOON and STAR.']){
  const bad=createLeggyService({apiKey:'test',fetchImpl:async()=>answer({roast:'A roast.',hint})});const out=await bad.respond({type:'hint',context:{role:'N',stage:2}});assert.equal(out.source,'unavailable');assert.equal(out.hint,'');
 }
});
test('API errors, malformed responses and timeout never become canned dialogue',async()=>{
 for(const fetchImpl of [async()=>{throw Error('offline')},async()=>({ok:false,status:401}),async()=>({ok:false,status:429}),async()=>({ok:true,json:async()=>({choices:[{message:{content:'invalid'}}]})}),async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Object.assign(Error('timeout'),{name:'AbortError'}))))]){
  const r=await createLeggyService({apiKey:'test',fetchImpl,timeout:10}).respond({type:'hint',context:{stage:2,role:'N'}});assert.equal(r.source,'unavailable');assert.equal(r.hint+r.roast+r.comment,'');
 }
});
test('three gates retain role-specific authoritative puzzle grounding',()=>{
 for(const stage of [1,2,3])for(const role of ['E','N'])assert.ok(groundedHint(contextOf({stage,role})).length>30);
 assert.match(groundedHint(contextOf({stage:1,role:'E',plank:'carried'})),/portal/);assert.match(groundedHint(contextOf({stage:3,anchors:2})),/1.6 seconds/);assert.equal(contextOf(null).stage,1);
});

test('Whispering Woods and Tangle Tower have grounded role-specific hints',()=>{
 const woodsE=groundedHint(contextOf({adventureLevel:2,role:'E'}));
 const woodsN=groundedHint(contextOf({adventureLevel:2,role:'N'}));
 assert.match(woodsE,/fireflies/i);assert.match(woodsE,/moon gate/i);assert.match(woodsN,/golden bells/i);assert.match(woodsN,/press E/i);
 const active=groundedHint(contextOf({adventureLevel:2,role:'E',firefliesCaught:3,resonance:1.4}));assert.match(active,/1.4 more seconds/);
 const towerE=groundedHint(contextOf({adventureLevel:3,role:'E',towerWind:1}));
 const towerN=groundedHint(contextOf({adventureLevel:3,role:'N',towerWind:-1}));
 assert.match(towerE,/Current wind: RIGHT/i);assert.match(towerE,/cannot steer in mid-air/i);assert.match(towerN,/Current wind: LEFT/i);assert.match(towerN,/wind vane/i);
});

test('invalid request is rejected',async()=>{await assert.rejects(createLeggyService().respond({type:'arbitrary'}),{status:400})});
test('tone references guide fresh generation; quoted examples regenerate',async()=>{
 const requests=[];
 const service=createLeggyService({apiKey:'test',fetchImpl:async(url,options)=>{requests.push(JSON.parse(options.body));return answer({comment:requests.length===1?'Two brains. One corridor. Zero coordination.':'That plan could have used a second opinion.',mood:'smirk'})}});
 const result=await service.respond({type:'commentary',event:'fall',context:{role:'N',failedRole:'E'}});
 assert.equal(requests.length,2);assert.equal(result.comment,'That plan could have used a second opinion.');
 assert.match(requests[0].messages[0].content,/STYLE REFERENCES ONLY/);
 assert.equal(JSON.parse(requests[0].messages[1].content).context.failedRole,'E');
 assert.equal(requests[0].temperature,.85);
});
test('long jokes and near repeats regenerate without cutting off punchlines',async()=>{
 for(const first of ['x'.repeat(141),'Your plan could have used a second opinion.']){
  let calls=0;const service=createLeggyService({apiKey:'test',fetchImpl:async()=>answer({comment:++calls===1?first:'The landing needs a little more land.',mood:'smirk'})});
  const result=await service.respond({type:'commentary',event:'fall',recent:['That plan could have used a second opinion.']});
  assert.equal(result.comment,'The landing needs a little more land.');assert.equal(calls,2);
 }
});
test('fresh banter batch filters repeats and can supply multiple display slots',async()=>{
 const service=createLeggyService({apiKey:'test',fetchImpl:async()=>answer({lines:['Two brains. One corridor. Zero coordination.','We have divided the work. Blame is still shared.','A joint decision takes twice as long to deny.','The silent treatment seems an ambitious control scheme.'],mood:'smirk'})});
 const r=await service.respond({type:'banter',event:'aside'});assert.equal(r.source,'groq');assert.equal(r.lines.length,3);assert.equal(new Set(r.lines).size,3);
});
test('provider Retry-After is respected instead of hard-coded twenty seconds',async()=>{
 let calls=0;const service=createLeggyService({apiKey:'test',fetchImpl:async()=>{calls++;return {ok:false,status:429,headers:{get:name=>name==='retry-after'?'7':null}}}});
 const first=await service.respond({type:'hint'}),second=await service.respond({type:'commentary'});
 assert.equal(first.reason,'rate_limit');assert.equal(first.retryAfter,7);assert.equal(second.reason,'rate_limit');assert.ok(second.retryAfter<=7);assert.equal(calls,1);
});
test('four-key pool rotates across distinct credentials and ignores empty or duplicate slots',async()=>{
 const used=[];const service=createLeggyService({apiKeys:[' k1 ','','k2','k1','k3','k4'],fetchImpl:async(url,options)=>{used.push(options.headers.Authorization);return answer({comment:'Fresh reply '+used.length})}});
 for(let i=0;i<5;i++)assert.equal((await service.respond({type:'commentary'})).source,'groq');
 assert.equal(service.keyCount,4);assert.deepEqual(used,['Bearer k1','Bearer k2','Bearer k3','Bearer k4','Bearer k1']);
});
test('rejected keys are skipped; a fourth valid key can answer the same request',async()=>{
 const used=[];const service=createLeggyService({apiKeys:['bad1','bad2','bad3','good'],fetchImpl:async(url,options)=>{const key=options.headers.Authorization;used.push(key);return key==='Bearer good'?answer({comment:'A fresh observation.'}):{ok:false,status:401}}});
 assert.equal((await service.respond({type:'commentary'})).source,'groq');assert.equal(used.length,4);
 assert.equal((await service.respond({type:'commentary'})).source,'groq');assert.equal(used.at(-1),'Bearer good');assert.equal(used.length,5);
});
test('all rejected keys report invalid_key without leaking secrets or looping',async()=>{
 let calls=0;const service=createLeggyService({apiKeys:['secret1','secret2','secret3','secret4'],fetchImpl:async()=>{calls++;return {ok:false,status:403}}});
 const result=await service.respond({type:'hint'});assert.equal(result.reason,'invalid_key');assert.equal(calls,4);assert.doesNotMatch(JSON.stringify(result),/secret/);
 assert.equal((await service.respond({type:'hint'})).reason,'invalid_key');assert.equal(calls,4);
});
test('a provider 429 cools down the whole pool rather than hopping to another key',async()=>{
 const used=[];const service=createLeggyService({apiKeys:['one','two','three','four'],fetchImpl:async(url,options)=>{used.push(options.headers.Authorization);return {ok:false,status:429,headers:{get:()=> '9'}}}});
 assert.equal((await service.respond({type:'hint'})).retryAfter,9);assert.equal((await service.respond({type:'commentary'})).reason,'rate_limit');assert.deepEqual(used,['Bearer one']);
});
test('numbered environment slots take precedence and legacy key still works',async()=>{
 const names=['GROQ_API_KEY',...Array.from({length:4},(_,i)=>'GROQ_API_KEY_'+(i+1))],saved=Object.fromEntries(names.map(n=>[n,process.env[n]]));
 try{
  names.forEach(n=>delete process.env[n]);process.env.GROQ_API_KEY='legacy';process.env.GROQ_API_KEY_2='numbered';
  const used=[];const fetchImpl=async(url,o)=>{used.push(o.headers.Authorization);return answer({comment:'A new observation.'})};
  const numbered=createLeggyService({fetchImpl});assert.equal(numbered.keyCount,1);await numbered.respond({type:'commentary'});assert.equal(used.pop(),'Bearer numbered');
  delete process.env.GROQ_API_KEY_2;await createLeggyService({fetchImpl}).respond({type:'commentary'});assert.equal(used.pop(),'Bearer legacy');
  assert.equal(createLeggyService({apiKeys:[]}).configured,false);
 }finally{for(const n of names)if(saved[n]===undefined)delete process.env[n];else process.env[n]=saved[n]}
});
