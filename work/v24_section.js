// ================================================================ 🏗 BUILD MODE: walk (or fly) around, PHOTO = place, 🔁 swap = change what you place, tap the big map to add train track
const BM={on:false,i:0,marks:[]};
function bmTypes(){return['track',...Object.keys(OTYPES),'remove'];}
function bmName(t){return t==='track'?'🛤 Train track point':t==='remove'?'🗑 Remove nearest thing':OTYPES[t].ic+' '+OTYPES[t].n;}
function bmCur(){const T=bmTypes();return T[((BM.i%T.length)+T.length)%T.length];}
function bmSet(on){BM.on=on==null?!BM.on:!!on;bmBanner();bmMarks();if(BM.on)toast('🏗 BUILD MODE — PHOTO = place '+bmName(bmCur())+' · 🔁 swap = change it · open the map to tap track points · Menu to stop',4500);else toast('🏗 Build mode off',1200);}
function bmPlace(){const t=bmCur();
  if(t==='track'){trainAddPt();bmMarks();return;}
  if(t==='remove'){if(TRAIN.mine.length&&(()=>{const h=trainHere();const p=TRAIN.mine[TRAIN.mine.length-1];return Math.hypot(p[0]-h[0],p[1]-h[1])<6;})()){trainUndo();bmMarks();return;}const o=objNearest();if(o){objDel(o.id);toast('🗑 Removed '+OTYPES[o.type].n,1000);}else toast('Nothing to remove nearby',1000);return;}
  placeObj(t);beep(800,0.06,0.04);}
function bmSwap(d){BM.i+=d||1;bmBanner();toast('🏗 Now placing: '+bmName(bmCur()),1300);}
function bmBanner(){let el=$('bmBan');if(!el){el=document.createElement('div');el.id='bmBan';el.style.cssText='position:fixed;left:50%;top:calc(52px + env(safe-area-inset-top));transform:translateX(-50%);z-index:22;background:rgba(255,159,10,0.85);color:#111;border-radius:10px;padding:4px 12px;font:800 13px system-ui;white-space:nowrap;display:none;pointer-events:auto;cursor:pointer';el.onclick=()=>bmSet(false);document.body.appendChild(el);}
  el.style.display=BM.on?'block':'none';el.textContent='🏗 BUILD: '+bmName(bmCur())+' — PHOTO = place · 🔁 = swap · tap here to stop';const b=$('bShot');if(b&&BM.on)b.textContent='🏗 PLACE';}
// little posts where your track points are
function bmMarks(){BM.marks.forEach(m=>scene.remove(m));BM.marks=[];if(!BM.on)return;TRAIN.mine.forEach((p,i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,2.4,8),new THREE.MeshBasicMaterial({color:i===TRAIN.mine.length-1?0xff3b30:0xffd60a}));m.position.set(p[0],H(p[0],p[1])+1.2,p[1]);scene.add(m);BM.marks.push(m);});}
// PHOTO places, 🔁 swaps (keyboard, buttons and the DJI remote all go through these)
{const s0=shutter;shutter=function(down){if(BM.on){if(down)bmPlace();return;}return s0.apply(this,arguments);};}
{const c0=cycleShot;cycleShot=function(){if(BM.on){bmSwap(1);return;}return c0.apply(this,arguments);};}
setTimeout(()=>{const b=$('bShot');if(b)b.addEventListener('click',e=>{if(BM.on){e.stopImmediatePropagation();e.preventDefault();bmPlace();}},true);},600);
{const u0=updBadge;updBadge=function(){const r=u0.apply(this,arguments);if(BM.on)bmBanner();return r;};}
// tap the BIG map to put a track point there
setTimeout(()=>{const c=$('mini');if(!c)return;let dn=null;c.addEventListener('pointerdown',e=>{dn={x:e.clientX,y:e.clientY,big:MAP.mode!=='corner'};},true);
  c.addEventListener('pointerup',e=>{if(!BM.on||!dn||!dn.big||bmCur()!=='track'||(typeof MED!=='undefined'&&MED.on))return;if(Math.hypot(e.clientX-dn.x,e.clientY-dn.y)>6)return;const w=mapToWorld(e.clientX,e.clientY);
    TRAIN.mine.push([+w.x.toFixed(1),+w.z.toFixed(1)]);LS.set('trainPts',TRAIN.mine);if(TRAIN.mine.length>=3)trainBuild();bmMarks();toast('🛤 Track point '+TRAIN.mine.length+(TRAIN.mine.length<3?' — add '+(3-TRAIN.mine.length)+' more':''),1200);e.stopImmediatePropagation();},true);},600);
// the train track is drawn on the map (+ your track points while building)
{const d0=drawMini;drawMini=function(){const r=d0.apply(this,arguments);try{if(!MAP.T||!TRAIN_PTS.length)return r;const c=$('mini'),x=c.getContext('2d'),W=c.width,Hh=c.height,big=MAP.mode!=='corner';
  x.save();x.setTransform(1,0,0,1,0,0);x.beginPath();if(big)x.rect(0,0,W,Hh);else x.arc(W/2,Hh/2,Math.min(W,Hh)/2-2,0,7);x.clip();x.setTransform(MAP.T);
  x.strokeStyle='#8e5a2b';x.lineWidth=2.2/MAP.s*MAP.dpr;x.setLineDash([3/MAP.s*MAP.dpr,2/MAP.s*MAP.dpr]);x.beginPath();TRAIN_PTS.forEach((p,i)=>{if(i%2)return;if(!i)x.moveTo(p.x,p.z);else x.lineTo(p.x,p.z);});if(TRAIN.closed)x.closePath();x.stroke();x.setLineDash([]);
  const g=TRAIN.cars[0].position;x.fillStyle='#d7263d';x.beginPath();x.arc(g.x,g.z,4/MAP.s*MAP.dpr,0,7);x.fill();
  if(BM.on){x.fillStyle='#ffd60a';TRAIN.mine.forEach(p=>{x.beginPath();x.arc(p[0],p[1],3.5/MAP.s*MAP.dpr,0,7);x.fill();});}x.restore();}catch(e){}return r;};}
// menu: build mode everywhere it makes sense
{const m0=mainItems;mainItems=function(){const L=m0();L.splice(1,0,mItem(()=>BM.on?'🏗 Build mode is ON — tap to stop':'🏗 Build mode (walk around + PHOTO places things)',()=>{bmSet();menuToggle(false);}));return L;};}
{const t0=trainItems;trainItems=function(){const L=t0();L.splice(1,0,mItem(()=>BM.on&&bmCur()==='track'?'🏗 Building track: ON — tap to stop':'🏗 Build track: walk around + press PHOTO for each point (or tap the big map)',()=>{if(BM.on&&bmCur()==='track')bmSet(false);else{BM.i=0;if(!BM.on)bmSet(true);else bmBanner();}menuToggle(false);}));return L;};}
{const p0=placeItems;placeItems=function(){const L=p0();L.splice(1,0,mItem(()=>BM.on?'🏗 Build mode ON — tap to stop':'🏗 Build mode: PHOTO places, 🔁 swaps what you place',()=>{bmSet();menuToggle(false);}));return L;};}
// ---------------------------------------------------------------- 💥 proximity fuse that never misses: checks the rocket's whole path each frame (not just where it is)
function fuseTargets(){const L=[];for(const id in mp.peers){const pe=mp.peers[id];if(pe.hd||!pe.p)continue;L.push(pe.wk?new V3(pe.wk[0],pe.wk[1]+0.9,pe.wk[2]):pe.p);}
  if(typeof CAMPERS!=='undefined')for(const C of CAMPERS.L)if(!C.dead&&C.g.visible)L.push(new V3(C.x,H(C.x,C.z)+0.9,C.z));return L;}
const _fa=new V3(),_fb=new V3(),_fc=new V3();
{const t0=tickShots;tickShots=function(dt){try{if(!SIM.pause){const R=clamp(WPN.blast*0.75,3,6),T=fuseTargets();if(T.length)for(const s of shots){if(!s.own||s.w!=='rocket'||s.life<=0)continue;
      const P=s.m.position;_fb.copy(P).addScaledVector(s.v,dt*1.15);_fa.subVectors(_fb,P);const L2=_fa.lengthSq()||1e-9;let best=null,bd=1e9;
      for(const q of T){const t=clamp(_fc.subVectors(q,P).dot(_fa)/L2,0,1);const cx=P.x+_fa.x*t,cy=P.y+_fa.y*t,cz=P.z+_fa.z*t,d=Math.hypot(q.x-cx,q.y-cy,q.z-cz);if(d<R+(q.fr||0)&&d<bd){bd=d;best=[cx,cy,cz];}}
      if(best){P.set(best[0],best[1],best[2]);s.v.setLength(0.001);s.life=0;s.prev&&s.prev.copy(P);}}}}catch(e){}return t0.apply(this,arguments);};}
// ---------------------------------------------------------------- 😠 REVENGE button (on screen + main menu): shoots back at whoever shoots at you — even if they miss
function revSet(on){ASSIST.revenge=on==null?!ASSIST.revenge:!!on;LS.set('asRev',ASSIST.revenge);if(!ASSIST.revenge)ASSIST.revId=null;toast(ASSIST.revenge?'😠 REVENGE ON — anyone who shoots at you gets shot back automatically':'Revenge off',2500);asBtn();}
function revTarget(id,name){if(!ASSIST.revenge||!id||id===mp.id||!mp.peers[id]||DZ.dead)return;if(ASSIST.revId!==id){ASSIST.revId=id;toast('😠 REVENGE on '+(name||mp.peers[id].name)+'!',1500);beep(300,0.2,0.07);}ASSIST.revT=performance.now()+60000;}
// a blast near you (missed or not) → revenge on whoever fired it
{const e0=explode;explode=function(p,r,dr,own,byName,byId){try{const by=DZ.bi||byId,me=dzMe();if(me&&by&&by!==mp.id&&me.distanceTo(p)<Math.max(8,(r||4)*2))revTarget(by,DZ.bn||byName);}catch(e){}return e0.apply(this,arguments);};}
// an AI rocket fired at you → revenge right away
{const f0=dzBotFire;dzBotFire=function(B,tg){const r=f0.apply(this,arguments);try{const me=dzMe();if(me&&tg&&tg.distanceTo(me)<8)revTarget(B.id,B.name);}catch(e){}return r;};}
// on-screen button
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);let v=$('revBtn');if(!v){v=document.createElement('button');v.id='revBtn';v.className='btn';v.style.cssText=$('asBtn').style.cssText;v.onclick=()=>revSet();$('asBox').insertBefore(v,$('asRf'));}
  const tg=ASSIST.revId&&mp.peers[ASSIST.revId];v.textContent=ASSIST.revenge?(tg?'😠 Revenge → '+tg.name.replace('🤖 ',''):'😠 Revenge: ON'):'😠 Revenge: off';v.style.borderColor=ASSIST.revenge?'#ff3b30':'rgba(255,255,255,0.3)';};}
{const m0=mainItems;mainItems=function(){const L=m0();L.splice(2,0,mItem(()=>'😠 Revenge mode (shoot back at whoever shoots you): '+(ASSIST.revenge?'ON':'off'),()=>revSet()));return L;};}
// ---------------------------------------------------------------- 🧠 if the browser blocks the AI computer, go through the Play-Multiplayer helper (it passes the messages on)
AIB.via='';
{const f0=aiFetchJ;aiFetchJ=async function(url,opt,ms){let err;
  if(AIB.via!=='helper'){try{const r=await f0(url,opt,ms);AIB.via='direct';return r;}catch(e){err=e;}}
  if(AIB.url&&url.startsWith(AIB.url)){const path=url.slice(AIB.url.length),host=AIB.url.replace(/^https?:\/\//,'');
    const bases=[];if(/^https?:/.test(location.protocol)&&window._relayInfo)bases.push(location.origin);bases.push('http://localhost:8765','http://127.0.0.1:8765');
    for(const b of [...new Set(bases)]){try{const o=Object.assign({},opt||{});o.headers=Object.assign({},o.headers||{},{'X-AI-Host':host});const r=await f0(b+'/aiproxy'+path,o,ms);if(AIB.via!=='helper')chatSys('🧠 Reaching the AI computer through the Play-Multiplayer helper');AIB.via='helper';return r;}catch(e){err=err||e;}}}
  AIB.via='';throw new Error(location.protocol==='https:'?'the phone website can\'t reach it — start the game with Play Multiplayer on a computer':'the browser blocked it — start the game with "Play Multiplayer" (it connects for you), or Dad can set OLLAMA_ORIGINS=*');};}
// ---------------------------------------------------------------- 💥 rockets blow up EVERYTHING: placed things (hoops, walls, houses, towers, jumps…), trees, rocks, bushes · 🔧 put it all back from the menu
const BOOMED=LS.get('boomedObjs',[]);
{const e0=explode;explode=function(p,r,dr,own,byName,byId){const res=e0.apply(this,arguments);try{const R=Math.max(dr||0,(r||4)*0.6,2.5);let n=0;
    for(const o of [...OBJS]){const s=o.s||1,oy=o.y!=null?o.y:H(o.x,o.z);const d=Math.hypot(o.x-p.x,(oy+s)-p.y,o.z-p.z);if(d<R+s*1.6){BOOMED.push(o);objDel(o.id,true);n++;}}
    if(n){if(BOOMED.length>300)BOOMED.splice(0,BOOMED.length-300);LS.set('boomedObjs',BOOMED);}}catch(e){}return res;};}
// blast holes clear rocks + bushes too (not just trees)
{const b0=blocked;blocked=function(x,z){if(CRATERS.length&&inCrater(x,z))return true;return b0(x,z);};}
function putBack(){let n=0;BOOMED.forEach(o=>{if(!OBJS.some(x=>x.id===o.id)){objAdd(o);try{mpSend({t:'obj',op:'add',o});}catch(e){}n++;}});BOOMED.length=0;LS.set('boomedObjs',[]);
  const t=CRATERS.length;CRATERS.length=0;LS.set('craters',[]);if(t)reloadWorld();toast('🔧 Put back '+n+' thing'+(n===1?'':'s')+(t?' + the trees and rocks grew back':''),2500);}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Danger mode/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem(()=>'🔧 Put back everything that got blown up'+(BOOMED.length||CRATERS.length?' ('+BOOMED.length+' things, '+CRATERS.length+' blast holes)':''),()=>putBack()));return L;};}
{const d0=dangerItems;dangerItems=function(){const L=d0();L.splice(L.length-2,0,mItem('🔧 Put back everything that got blown up',()=>putBack()),mItem('🏗 Build mode — place new things (PHOTO places, 🔁 swaps)',()=>{bmSet(true);menuToggle(false);}));return L;};}
// ---------------------------------------------------------------- 🖥️ the AI brain is Dad's Ollama computer (mistral:7b)
if(!LS.get('aiUrl',''))AIB.url='http://192.168.128.50:11434';
if(!LS.get('aiModel','')||LS.get('aiModel','')==='mistral:7b')AIB.model='mistral:latest';
if(AIB.src==='claude'||!LS.get('aiSrc',''))aiBrainSet('local');
{const q0=aiAskClaude;aiAskClaude=function(){if(AIB.src==='local')return aiAskLocal();AIB.busy=false;};}
{const l0=aiListModels;aiListModels=async function(){const keep=AIB.model;const r=await l0.apply(this,arguments);if(keep&&AIB.models.some(m=>m.n===keep))AIB.model=keep;else{const m=AIB.models.find(m=>m.n==='mistral:latest')||AIB.models.find(m=>/^mistral/.test(m.n));if(m)AIB.model=m.n;}LS.set('aiModel',AIB.model);return r;};}
aiItems=function(){return[mInfo('🤖 AI pilots play just for fun: they switch between drones, planes, helicopters, boats, subs and cars, explore everywhere, race, do tricks and help fight fires.'),
  mItem(()=>'🤖 AI pilots: '+(AIB.n||'off')+'  ◀ ▶',()=>aiSet(AIB.n>=10?0:AIB.n+1),d=>aiSet(AIB.n+d)),
  mInfo(()=>AIB.L.length?AIB.L.map(B=>B.name+' '+(B.dead?'💀':(AI_VIC[B.kind||'drone']||'🚁'))).join(' · '):'(no AI pilots yet)'),
  mItem(()=>'🎚 How hard they play: '+({fun:'😊 Just for fun',medium:'😐 Medium',hard:'😈 Hard'}[AIB.diff]),()=>{const L=['fun','medium','hard'];AIB.diff=L[(L.indexOf(AIB.diff)+1)%3];LS.set('aiDiff',AIB.diff);}),
  mItem('🔀 Everyone switch vehicles now',()=>AIB.L.forEach(B=>{if(!B.dead)aiSwitch(B);})),
  mItem(()=>'🧠 Brain: '+(AIB.src==='local'?'🖥️ Dad\'s AI computer (Ollama · '+(AIB.model||'?')+')'+(AIB.ok===true?' ✅':AIB.ok===false?' ❌ not connected':' … connecting'):'built-in (no computer needed)')+'  (tap to change)',()=>aiBrainSet(AIB.src==='local'?'builtin':'local')),
  mItem(()=>'🖥️ AI computer address: '+(AIB.url?AIB.url.replace(/^http:\/\//,''):'none — tap to type it'),()=>{const k=prompt('AI computer address (IP), like 192.168.128.50 — port 11434 is added for you.',AIB.url?AIB.url.replace(/^http:\/\//,''):'');if(k==null)return;AIB.url=aiUrlFix(k);LS.set('aiUrl',AIB.url);AIB.models=[];AIB.ok=null;toast('🧠 Connecting to AI…',1500);
    aiListModels().then(L=>{toast('✅ Found '+L.length+' AI model'+(L.length>1?'s':'')+' — using '+aiModelName(),3500);if(AIB.src!=='local')aiBrainSet('local');}).catch(e=>toast('❌ Couldn\'t connect to AI ('+e.message+')',6000));}),
  mItem(()=>'🧩 AI model: '+(AIB.model||'(find models first)')+' ▸',()=>{aiListModels().then(()=>menuPush('🧩 AI models',aiModelItems())).catch(e=>toast('❌ Couldn\'t connect to AI ('+e.message+')',4000));}),
  mInfo('Start the game with "Play Multiplayer" — the helper window passes messages to the AI computer so the browser doesn\'t block them.'),
  mItem('◀ Back',()=>menuBack())];};
// ---------------------------------------------------------------- 💥 blow up the TRAIN, BIRDS, HOT-AIR BALLOONS and the UFO too (🔧 Put back brings them back)
const GONE={train:false,ufo:false,birds:[],balloons:[]};
function blowables(){const L=[];if(!GONE.train&&TRAIN.cars.length)TRAIN.cars.forEach(g=>L.push({k:'train',p:g.position.clone().add(new V3(0,1.7,0)),r:3.8}));
  if(typeof XTRA!=='undefined'){XTRA.birds.forEach(f=>{if(!f.dead)L.push({k:'bird',o:f,p:f.g.position,r:3});});XTRA.balloons.forEach(b=>{if(!b.dead)L.push({k:'balloon',o:b,p:b.g.position.clone().add(new V3(0,4,0)),r:6.5});});
    if(XTRA.ufo&&XTRA.ufo.visible&&!GONE.ufo)L.push({k:'ufo',p:XTRA.ufo.position,r:7});}return L;}
function blowUp(t,by){const p=t.p.clone();
  if(t.k==='train'){GONE.train=true;TRAIN.cars.forEach(g=>{scene.remove(g);for(let k=0;k<4;k++)puff(g.position.clone().add(new V3((Math.random()-0.5)*4,1+Math.random()*3,(Math.random()-0.5)*6)),0x333333,1.2,2.2);});if(TRAIN.ride)trainToggle();chatSys('💥 '+(by||'Someone')+' blew up the train! 🚂');}
  else if(t.k==='bird'){t.o.dead=true;scene.remove(t.o.g);for(let k=0;k<10;k++)puff(p.clone().add(new V3((Math.random()-0.5)*3,(Math.random()-0.5)*2,(Math.random()-0.5)*3)),0xffffff,0.15,1.5);GONE.birds.push(t.o);}
  else if(t.k==='balloon'){t.o.dead=true;scene.remove(t.o.g);GONE.balloons.push(t.o);chatSys('💥 '+(by||'Someone')+' popped a hot-air balloon! 🎈');}
  else if(t.k==='ufo'){GONE.ufo=true;scene.remove(XTRA.ufo);chatSys('💥 '+(by||'Someone')+' shot down the UFO! 🛸');try{award&&award(50,'🛸 UFO down!');}catch(e){}}}
// rockets go off when they get near any of these…
{const f0=fuseTargets;fuseTargets=function(){const L=f0();blowables().forEach(t=>{const q=t.p.clone();q.fr=t.r*0.6;L.push(q);});return L;};}
// …and the blast destroys whatever is inside it
{const e0=explode;explode=function(p,r,dr,own,byName,byId){const res=e0.apply(this,arguments);try{const R=Math.max(r||4,3);for(const t of blowables())if(t.p.distanceTo(p)<R+t.r)blowUp(t,DZ.bn||byName);}catch(e){}return res;};}
// a blown-up train stops running
{const t0=trainTick;trainTick=function(dt){if(GONE.train)return;return t0.apply(this,arguments);};}
{const n0=trainNear;trainNear=function(){if(GONE.train)return false;return n0.apply(this,arguments);};}
// 🔧 Put back also brings these back
{const p0=putBack;putBack=function(){const n=(GONE.train?1:0)+(GONE.ufo?1:0)+GONE.birds.length+GONE.balloons.length;
  if(GONE.train){GONE.train=false;TRAIN.cars.forEach(g=>scene.add(g));}if(GONE.ufo&&XTRA.ufo){GONE.ufo=false;scene.add(XTRA.ufo);}
  GONE.birds.forEach(f=>{f.dead=false;scene.add(f.g);});GONE.birds=[];GONE.balloons.forEach(b=>{b.dead=false;scene.add(b.g);});GONE.balloons=[];
  p0.apply(this,arguments);if(n)setTimeout(()=>toast('🔧 The train, birds, balloons and UFO are back too',2000),2600);};}
