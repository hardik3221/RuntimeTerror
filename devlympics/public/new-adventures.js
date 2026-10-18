/* Two deliberately different co-op adventures. No changes to levels 1–3. */
'use strict';
const DINER_INGREDIENTS=['MOON CHEESE','CLOUD CREAM','STAR JAM'];
const DINER_SAUCES=['CRUNCH','FIZZ','FLOAT'];
const DINER_ORDERS=[{name:'CAPTAIN CRUMB',items:[0,2],sauce:1},{name:'LADY WOBBLE',items:[2,1,0],sauce:2},{name:'THE TINY BLACK HOLE',items:[1,0,2],sauce:0}];
const BUBBLE_WALLS=[[200,100,34,155],[425,255,34,175],[650,100,34,155]];
const BUBBLE_STARS=[[300,165],[540,330],[790,165]];
const BubblePhysics={
 axis(role,stars){return (stars%2===0)===(role==='E')?'x':'y'},
 advance(b,ix,iy,dt){
  const drag=Math.exp(-4*dt);b.vx=Math.max(-125,Math.min(125,(b.vx+ix*620*dt)*drag));b.vy=Math.max(-125,Math.min(125,(b.vy+iy*620*dt)*drag));
  b.x=Math.max(30,Math.min(870,b.x+b.vx*dt));b.y=Math.max(118,Math.min(390,b.y+b.vy*dt));
  if(b.x===30||b.x===870)b.vx=0;if(b.y===118||b.y===390)b.vy=0;
  return BUBBLE_WALLS.some(([x,y,w,h])=>Math.hypot(b.x-Math.max(x,Math.min(x+w,b.x)),b.y-Math.max(y,Math.min(y+h,b.y)))<22);
 },
 docked(b,stars){return stars===3&&Math.hypot(b.x-840,b.y-330)<30&&Math.hypot(b.vx,b.vy)<35}
};
if(typeof module!=='undefined')module.exports={dinerVerdict,DINER_ORDERS,DINER_INGREDIENTS,DINER_SAUCES,BUBBLE_WALLS,BUBBLE_STARS,BubblePhysics};
function newAdventureState(){return {diner:{served:0,tray:[],sauce:0,ready:false,servePending:false,receipt:0,lastReceipt:'',notice:''},bubble:{x:85,y:330,vx:0,vy:0,stars:0,dock:0,checkpoint:[85,330],remote:0,remoteBrake:false,remoteAt:0,inputTimer:0,snapshotTimer:0,seq:0,received:-1,cooldown:0}}}
function newAdventureHelp(level,who){if(level===4)return who==='E'?'A/D move · E at ingredient jars to stack · E at SEND to plate · E at BIN to clear · Navigator has the order!':'A/D move · E at a sauce pump to choose · E at SERVE to check the plate · Only you see the customer order.';return 'Shared bubble! '+(who==='E'?'Start with A/D for sideways.':'Start with W/S or ↑/↓ for lift.')+' Controls SWAP at every star. Space brakes your axis. Collect 3 stars, then settle in the airlock.'}
function newAdventureMission(){if(S.adventureLevel===4)return role==='E'?'Ask Navigator for the ingredients IN ORDER. E at each jar, then E at SEND. BIN clears mistakes. Navigator adds the requested sauce and serves. Three happy aliens unlock both exit pads.':'Read your private order aloud. Explorer stacks ingredients and sends a plate; select the matching sauce, then E at SERVE. A rejected dish can be cleared with BIN. Serve three aliens, then both stand on EXIT.';return 'You share one bubble. Your current axis: '+BubblePhysics.axis(role,S.bubble.stars).toUpperCase()+'. A/D steers sideways; W/S or ↑/↓ controls lift. Space brakes your own axis. Follow the numbered stars; controls swap at each one. Touching a coral needle returns you to the last star. Finish by slowing inside the glowing airlock.'}
function newAdventureObjective(){if(S.adventureLevel===4)return S.diner.served===3?'Dinner saved! BOTH socks: walk to the EXIT pads →':S.diner.notice||(role==='N'?'Read the order • choose sauce • E at SERVE':S.diner.ready?'Plate sent! Navigator: sauce, then SERVE':'Ask for the recipe • stack in order • E at SEND');return S.bubble.stars===3?'Both pilots: slow down inside the airlock →':'STAR '+(S.bubble.stars+1)+'/3 • YOU CONTROL '+BubblePhysics.axis(role,S.bubble.stars).toUpperCase()+' • Space brakes'}
function newAdventureClue(){if(S.adventureLevel===5)return 'YOU: '+(BubblePhysics.axis(role,S.bubble.stars)==='x'?'A/D or ←/→ (SIDEWAYS)':'W/S or ↑/↓ (LIFT/DIVE)')+' · STARS '+S.bubble.stars+'/3 · DOCK '+Math.round(S.bubble.dock/1.2*100)+'%';const d=S.diner,o=DINER_ORDERS[d.served];if(!o)return '3 HAPPY ALIENS · BOTH SOCKS TO EXIT';return role==='N'?'ORDER: '+o.items.map(i=>DINER_INGREDIENTS[i]).join(' → ')+' + '+DINER_SAUCES[o.sauce]+' · SELECTED SAUCE: '+DINER_SAUCES[d.sauce]:'TRAY (bottom → top): '+(d.tray.length?d.tray.map(i=>DINER_INGREDIENTS[i]).join(' → '):'EMPTY')+(d.ready?' · PLATED':'')+' · SAUCE: '+DINER_SAUCES[d.sauce]}
function newAdventureInteract(){if(S.adventureLevel===5){say(newAdventureMission());return}const d=S.diner,c=S.me.x+14;if(!S.me.gr){say('Land beside a station first, then press E.');return}if(d.served===3){say('Dinner is saved! Both socks, stand on your EXIT pads at the far right.');return}
 if(role==='E'){
  const i=[170,340,510].findIndex(x=>Math.abs(c-x)<55);
  if(i>=0){if(d.ready){say('Plate already sent. Wait for service, or clear it at BIN.');return}if(d.tray.length>=3){say('The tray is full! Send it, or clear it at BIN.');return}ev({k:'dinerAdd',w:role,i,order:d.served});return}
  if(Math.abs(c-670)<55){ev({k:'dinerPlate',w:role,order:d.served});return}
  if(Math.abs(c-70)<45){ev({k:'dinerClear',w:role,order:d.served});return}
 }else{
  const i=[170,340,510].findIndex(x=>Math.abs(c-x)<55);if(i>=0){ev({k:'dinerSauce',w:role,i,order:d.served});return}
  if(Math.abs(c-670)<55){ev({k:'dinerServe',w:role,order:d.served});return}
 }say(role==='E'?'E beside a jar to stack it; SEND plates the dish, BIN clears it.':'E beside a pump selects sauce; E at SERVE delivers the plate.');
}
function applyNewAdventureEvent(e){
 if(S.adventureLevel===5&&e.k==='bubbleInput'){if(e.w!=='N'||![-1,0,1].includes(e.value)||e.stars!==S.bubble.stars)return true;S.bubble.remote=e.value;S.bubble.remoteBrake=e.brake===true;S.bubble.remoteAt=performance.now();bubblePulse();return true}
 if(S.adventureLevel===5&&e.k==='bubbleStar'){const b=S.bubble;if(e.i!==b.stars||e.i>=3)return true;b.stars++;b.checkpoint=BUBBLE_STARS[e.i].slice();b.vx=b.vy=b.remote=0;b.cooldown=.75;b.inputTimer=0;trust(4);SFX.send();burst(b.checkpoint[0],b.checkpoint[1],'#ffe486',24);say('Star '+b.stars+'/3! CONTROLS SWAPPED. You now control '+BubblePhysics.axis(role,b.stars).toUpperCase()+'. Space is your brake.');return true}
 if(S.adventureLevel===5&&e.k==='bubbleBump'){const b=S.bubble;b.x=b.checkpoint[0];b.y=b.checkpoint[1];b.vx=b.vy=b.remote=0;b.dock=0;b.cooldown=.8;keys={};trust(-3);SFX.quack();say('POP? Almost. Back to the last star! Your collected stars are safe.');return true}
 if(S.adventureLevel!==4||!e.k.startsWith('diner'))return false;
 const d=S.diner;if(e.order!==d.served||d.served>=3)return true;
 if(e.k==='dinerAdd'&&e.w==='E'&&Number.isInteger(e.i)&&e.i>=0&&e.i<3&&!d.ready&&d.tray.length<3){d.tray.push(e.i);d.notice='';SFX.tick()}
 if(e.k==='dinerClear'&&e.w==='E'){d.tray=[];d.ready=false;d.servePending=false;d.notice='Tray cleared. Ask Navigator for the ingredient order.';say(d.notice);SFX.pop()}
 if(e.k==='dinerPlate'&&e.w==='E'&&d.tray.length){d.ready=true;SFX.send();d.notice='Plate sent. Navigator: select sauce, then SERVE.';say(d.notice)}
 if(e.k==='dinerSauce'&&e.w==='N'&&Number.isInteger(e.i)&&e.i>=0&&e.i<3){d.sauce=e.i;d.notice='Sauce selected: '+DINER_SAUCES[e.i]+'. Press E at SERVE.';SFX.tick()}
 if(e.k==='dinerServe'&&e.w==='N'){d.servePending=true;if(!d.ready){d.notice='Waiting for Explorer to SEND the plate. Service is queued.';say(d.notice)}}
 if(e.k==='dinerResult'&&e.w==='N'&&typeof e.receipt==='string'&&e.receipt!==d.lastReceipt&&Array.isArray(e.items)&&e.items.length<=3&&e.items.every(i=>Number.isInteger(i)&&i>=0&&i<3)&&Number.isInteger(e.sauce)&&e.sauce>=0&&e.sauce<3&&e.verdict===dinerVerdict(e.items,e.sauce,d.served)){
  d.lastReceipt=e.receipt;d.servePending=false;d.sauce=e.sauce;
  if(e.verdict==='accepted'){d.served++;d.tray=[];d.ready=false;trust(6);SFX.send();burst(670,320,'#ffcc7e');d.notice=d.served===3?'Three happy aliens! BOTH socks: meet on the EXIT pads.':'Dish accepted! Navigator, read the next order.'}
  else if(e.verdict==='sauce'){SFX.wah();d.notice='Ingredients are CORRECT. Sauce is '+DINER_SAUCES[e.sauce]+'. Navigator: check the ticket and change sauce, then SERVE again. No remake needed.'}
  else if(e.verdict==='count'){SFX.wah();d.notice='Wrong number of ingredients. Navigator: read the quantity. Explorer: BIN clears the tray; then rebuild and SEND.'}
  else{SFX.wah();d.notice='Ingredient sequence does not match. Build left to right from the ticket, bottom to top on the plate. Explorer: BIN, rebuild, SEND.'}
  say(d.notice);return true;
 }
 // Only Navigator adjudicates a plated dish, using one immutable receipt.
 // If SERVE crosses SEND in transit, wait for the plate instead of rejecting it.
 if(role==='N'&&d.servePending&&d.ready&&['dinerServe','dinerPlate'].includes(e.k))resolveDinerService();
 return true;
}
function dinerVerdict(items,sauce,order){const o=DINER_ORDERS[order];if(!o)return 'invalid';if(items.length!==o.items.length)return 'count';if(items.some((i,n)=>i!==o.items[n]))return 'ingredients';return sauce===o.sauce?'accepted':'sauce'}
function resolveDinerService(){const d=S.diner;if(role!=='N'||!d.ready||!d.servePending)return;d.servePending=false;const items=d.tray.slice(),sauce=d.sauce;ev({k:'dinerResult',w:'N',order:d.served,items,sauce,verdict:dinerVerdict(items,sauce,d.served),receipt:d.served+':'+(++d.receipt)})}
function dinerStep(){if(S.diner.served===3&&role==='E'&&S.me.x>810&&S.me.gr&&S.ot.tx>810&&S.ot.ty>370)ev({k:'win',time:performance.now()-S.t0})}
function bubblePulse(forceInput=false){
 if(!started||!S||S.over||S.adventureLevel!==5)return;
 const b=S.bubble;if(b.pumping)return;const now=performance.now();
 const elapsed=b.clock===undefined?0:Math.max(0,Math.min(.12,(now-b.clock)/1000));b.clock=now;b.pumping=true;
 try{if(forceInput)b.inputTimer=0;if(elapsed===0)bubbleStep(0);else{let left=elapsed;while(left>0&&!S.over){const dt=Math.min(1/60,left);bubbleStep(dt);left-=dt}}}finally{b.pumping=false}
}
function installBubbleClock(){
 // Animation frames stop in background tabs. Incoming Navigator packets also
 // pulse this clock, so shared motion continues even if the timer is throttled.
 setInterval(()=>bubblePulse(),50);
}
function bubbleStep(dt){const b=S.bubble,axis=BubblePhysics.axis(role,b.stars);let input=keys[' ']?0:axis==='x'?((keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)):((keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0));
 b.inputTimer-=dt;if(role==='N'&&(b.lastInput!==input||b.lastBrake!==!!keys[' ']||b.inputTimer<=0)){b.lastInput=input;b.lastBrake=!!keys[' '];b.inputTimer=.1;ev({k:'bubbleInput',w:role,value:input,brake:!!keys[' '],stars:b.stars})}
 if(role==='E'){
  b.cooldown=Math.max(0,b.cooldown-dt);let remote=performance.now()-b.remoteAt<600?b.remote:0;if(b.cooldown>0)input=remote=0;
  const localBrake=!!keys[' '],remoteBrake=performance.now()-b.remoteAt<600&&b.remoteBrake;
  if(axis==='x'?localBrake:remoteBrake)b.vx*=Math.exp(-18*dt);if(axis==='y'?localBrake:remoteBrake)b.vy*=Math.exp(-18*dt);
  const hit=BubblePhysics.advance(b,axis==='x'?input:remote,axis==='y'?input:remote,dt);
  if(hit&&b.cooldown<=0)ev({k:'bubbleBump'});
  if(b.cooldown<=0&&b.stars<3&&Math.hypot(b.x-BUBBLE_STARS[b.stars][0],b.y-BUBBLE_STARS[b.stars][1])<30)ev({k:'bubbleStar',i:b.stars});
  b.dock=BubblePhysics.docked(b,b.stars)?Math.min(1.2,b.dock+dt):0;
  if(b.dock>=1.2)ev({k:'win',time:performance.now()-S.t0});
  b.snapshotTimer-=dt;if(b.snapshotTimer<=0){b.snapshotTimer=.05;net&&net.send({t:'bubble',stage:S.stage,seq:++b.seq,x:b.x,y:b.y,vx:b.vx,vy:b.vy,dock:b.dock,stars:b.stars})}
 }
 S.me.x=b.x+(role==='E'?-25:4);S.me.y=b.y-12;S.me.vx=b.vx;S.me.vy=0;S.me.gr=false;
}
function receiveBubble(m){const b=S.bubble;if(role!=='N'||S.adventureLevel!==5||m.stage!==S.stage||!Number.isInteger(m.seq)||m.seq<=b.received||m.stars!==b.stars||![m.x,m.y,m.vx,m.vy,m.dock].every(Number.isFinite))return;b.received=m.seq;b.x=m.x;b.y=m.y;b.vx=m.vx;b.vy=m.vy;b.dock=m.dock}
function adventureBackdrop(t,top,bottom){const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,top);q.addColorStop(1,bottom);g.fillStyle=q;g.fillRect(0,0,W,H);for(let i=0;i<45;i++){const x=(i*139+37)%900,y=(i*83+18)%400;g.fillStyle=i%3?'#fff1ce66':'#f4b8d3';g.beginPath();g.arc(x,y,i%3?1:2,0,7);g.fill()}}
function dinerIngredient(i,x,y,size=1){g.save();g.translate(x,y);g.scale(size,size);g.strokeStyle='#57435e';g.lineWidth=2;g.fillStyle=['#ffda7a','#b9f3e3','#ef9ecb'][i];g.beginPath();if(i===0){g.moveTo(-20,15);g.lineTo(20,15);g.lineTo(12,-15);g.closePath()}else if(i===1){g.arc(-11,3,12,0,7);g.arc(1,-5,15,0,7);g.arc(14,5,11,0,7)}else{for(let j=0;j<10;j++){const a=j*Math.PI/5-Math.PI/2,r=j%2?11:24;j?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath()}g.fill();g.stroke();if(i===0){g.fillStyle='#d9a84c';g.beginPath();g.arc(-5,5,4,0,7);g.arc(11,9,3,0,7);g.fill()}g.restore()}
function drawCosmicDiner(t,who,privateView){
 adventureBackdrop(t,'#271e46','#73517d');const d=S.diner,o=DINER_ORDERS[d.served];
 // Panoramic saucer window, striped awning, and a very questionable restaurant.
 g.fillStyle='#141c38';rr(30,90,840,225,95);g.fill();g.strokeStyle='#b584a4';g.lineWidth=6;g.stroke();g.fillStyle='#edc8ac';g.beginPath();g.ellipse(700,190,75,42,-.2,0,7);g.fill();g.strokeStyle='#c9948f';g.lineWidth=10;g.beginPath();g.ellipse(700,190,115,15,-.2,0,7);g.stroke();
 for(let i=0;i<15;i++){g.fillStyle=i%2?'#f3ca9c':'#c76e92';g.fillRect(i*60,76,60,17)}
 earth(0,FY,W,60,'#e9c39d','#705469',true,t);for(let i=0;i<18;i++){g.fillStyle=i%2?'#b18e8e':'#d4b2a0';g.fillRect(i*50,438,50,22)}
 label('THE MIDNIGHT DINER',450,115,'#ffe5ad',23);label('OPEN UNTIL THE UNIVERSE CLOSES',450,133,'#d9b7d9',10);
 // The recipe exists only on Navigator's own canvas; partner preview redacts it.
 panel(285,148,335,134);if(who==='N'&&privateView&&o){label(o.name,452,169,'#ffe5ad',15);label('STACK IN THIS ORDER',452,188,'#c5dcd7',10);o.items.forEach((i,j)=>{const x=365+j*83;dinerIngredient(i,x,217,.65);label(''+(j+1),x,246,'#fff4d1',11)});label('+ '+DINER_SAUCES[o.sauce]+' SAUCE',452,267,'#ffc9e6',15)}else{label(d.served===3?'EVERYONE FED!':'PRIVATE ORDER',452,180,'#ffe5ad',19);label(d.served===3?'THE SHIP CAN LEAVE NOW':'NAVIGATOR: READ IT ALOUD',452,205,'#c5dcd7',12);label('HAPPY ALIENS  '+d.served+' / 3',452,258,'#bce5d4',17)}
 // Alien customers wave from their stools.
 for(let i=0;i<3;i++){const x=[110,700,805][i];g.fillStyle=['#9dd5bc','#e4abcf','#b6b5e9'][i];g.beginPath();g.ellipse(x,245,32,25+Math.sin(t+i)*2,0,0,7);g.fill();g.strokeStyle='#513c63';g.lineWidth=3;g.stroke();for(const dx of [-10,10]){g.fillStyle='#fff8df';g.beginPath();g.arc(x+dx,240,8,0,7);g.fill();g.fillStyle='#3b3154';g.beginPath();g.arc(x+dx,241,3,0,7);g.fill()}label(i<d.served?'♥ THANK YOU':'hungry...',x,287,i<d.served?'#a4f0c1':'#e8d0d9',11)}
 [170,340,510].forEach((x,i)=>{g.fillStyle='#b67d91';rr(x-48,361,96,59,8);g.fill();g.strokeStyle='#543d60';g.lineWidth=3;g.stroke();if(who==='E'){g.fillStyle='#f4e0c4';rr(x-24,309,48,48,10);g.fill();dinerIngredient(i,x,334,.72);label(DINER_INGREDIENTS[i],x,302,'#fff0c6',11)}else{g.fillStyle=['#edd784','#bbdcf4','#e9a9df'][i];rr(x-19,313,38,42,7);g.fill();g.fillRect(x-3,301,32,8);label(DINER_SAUCES[i],x,295,'#fff0c6',13);if(d.sauce===i)label('✓ SELECTED',x,352,'#b4ffd7',10)}label('E',x,401,'#fff1cd',15)});
 g.fillStyle='#eec998';rr(625,330,90,90,12);g.fill();label(who==='E'?'SEND':'SERVE',670,318,'#ffe5ad',15);g.fillStyle='#fff2ce';g.beginPath();g.ellipse(670,355,36,8,0,0,7);g.fill();d.tray.forEach((i,j)=>{dinerIngredient(i,670,345-j*20,.5);label(''+(j+1),637,349-j*20,'#62465f',10)});label(d.ready?'PLATED':'E',670,400,'#62465f',13);
 if(who==='E'){g.fillStyle='#4b355d';rr(46,366,48,54,7);g.fill();label('BIN · E',70,352,'#efd2de',11)}
 if(d.served===3)glow(846,395,60,'177,255,211',.5);g.fillStyle=d.served===3?'#a1dfb9':'#886786';rr(813,409,64,11,4);g.fill();label('EXIT',845,396,'#f4efc8',13);
 const m=who===role?S.me:S.ot;sock(m.x,m.y,m.f,who==='E'?'#e8453c':'#45d1c9',who==='E'?'#f6ead2':'#6a2fb8',1,Math.abs(m.vx||0)>1?2:0,t,m.vy);
}
function drawBubbleBallet(t,who,privateView){
 adventureBackdrop(t,'#12273f','#425e70');const b=S.bubble;g.fillStyle='#254856';g.beginPath();g.moveTo(0,430);for(let x=0;x<=900;x+=20)g.lineTo(x,430+Math.sin(x*.04+t)*7);g.lineTo(900,480);g.lineTo(0,480);g.fill();
 for(let i=0;i<18;i++){g.strokeStyle='#91d7db33';g.lineWidth=2;g.beginPath();g.arc((i*157+t*8)%900,425-(i*73+t*12)%300,3+i%4,0,7);g.stroke()}
 label('THE BUBBLE BALLET',450,106,'#d9fff4',22);
 BUBBLE_WALLS.forEach(([x,y,w,h],i)=>{g.fillStyle='#bb7f9a';rr(x,y,w,h,12);g.fill();g.strokeStyle='#f4bbc8';g.lineWidth=3;g.stroke();for(let yy=y+15;yy<y+h-5;yy+=23){g.fillStyle='#e8a3b4';g.beginPath();g.moveTo(x,yy);g.lineTo(x-10,yy+8);g.lineTo(x,yy+15);g.moveTo(x+w,yy);g.lineTo(x+w+10,yy+8);g.lineTo(x+w,yy+15);g.fill()}label('SOFTLY!',x+17,y===100?285:236,'#ebc4ce',9)});
 BUBBLE_STARS.forEach(([x,y],i)=>{if(i<b.stars){label('✓',x,y,'#a4eac7',25);return}glow(x,y,i===b.stars?42:23,'255,224,141',i===b.stars?.48:.13);dinerIngredient(2,x,y,.8);label(''+(i+1),x,y-29,'#fff1bf',14);if(i===b.stars)label('SWAP!',x,y+40,'#b7ede5',10)});
 const open=b.stars===3;glow(840,330,open?64:30,'174,255,210',open?.5:.1);g.strokeStyle=open?'#b7f5ce':'#7997a4';g.lineWidth=5;g.beginPath();g.ellipse(840,330,36,48,0,0,7);g.stroke();label(open?'SETTLE HERE':'AIRLOCK',835,395,'#d1f5dd',12);if(open){g.fillStyle='#aef5c6';g.fillRect(805,414,70*Math.min(1,b.dock/1.2),6)}
 // Both characters share a single physical vehicle; only E simulates it.
 g.save();g.translate(b.x,b.y);g.fillStyle='#b5f7f030';g.strokeStyle='#aff5f1';g.lineWidth=3;g.beginPath();g.arc(0,0,34,0,7);g.fill();g.stroke();g.strokeStyle='#ffffffb3';g.lineWidth=4;g.beginPath();g.arc(-3,-2,26,3.6,4.4);g.stroke();sock(-25,-12,1,'#e8453c','#f6ead2',.72,0,t,0);sock(4,-12,-1,'#45d1c9','#6a2fb8',.72,0,t,0);g.restore();
 panel(280,19,340,52);label('STARS '+b.stars+'/3 · '+(who==='E'?'EXPLORER':'NAVIGATOR')+' = '+BubblePhysics.axis(who,b.stars).toUpperCase(),450,41,'#cefff0',16);label(BubblePhysics.axis(who,b.stars)==='x'?'A / D: SIDEWAYS · SPACE: BRAKE':'W / S: LIFT & DIVE · SPACE: BRAKE',450,59,'#abd9dc',11);
 if(b.cooldown>0)label('BREATHE. CHECK YOUR NEW AXIS!',450,305,'#fff0ba',17);
}
