// ================================================================ v23: assist modes (aim / seeker / deadly / fly-for-me) + rapid fire, parachute, solid fallen trees, menu pause,
// auto fix window, 15 s respawn (AI 2 min), proximity fuse, AI difficulty + less chat, your own AI server (Ollama), MEGA drones, tiny-drone turbo, a train.
const V23={};
// ---------------------------------------------------------------- 🎯 ASSIST
const ASSIST={mode:LS.get('asMode',0),rapid:LS.get('asRapid',false),tgt:null,lock:null,lookT:0,lookId:null,warnT:0,apHold:0,lastFire:0};
const AS_NAMES=['off','🎯 Aim help','🧲 Seeker rockets','☠️ Deadly (auto-fire)','🤖 Fly for me'];
const AS_INFO=['No help — all you.','Shows a box on the nearest enemy in front of you, aims your shots where they WILL be, and warns you when someone is aiming at you.','Aim help + your rockets steer themselves into the target — even into the fog/white where you can\'t see them.','Seeker rockets + look at someone for 2 seconds to LOCK ON, then it fires by itself.','Deadly + it flies your drone for you: hunts the nearest enemy, keeps a safe distance and shoots. Move the sticks to take over for a moment.'];
function asSet(m){ASSIST.mode=((m%5)+5)%5;LS.set('asMode',ASSIST.mode);ASSIST.lock=null;ASSIST.lookT=0;toast((ASSIST.mode?AS_NAMES[ASSIST.mode]:'🎯 Assist off')+' — '+AS_INFO[ASSIST.mode],3200);asBtn();}
function asRapid(on){ASSIST.rapid=on==null?!ASSIST.rapid:!!on;LS.set('asRapid',ASSIST.rapid);toast(ASSIST.rapid?'⚡ RAPID FIRE ON — pew pew pew!':'Rapid fire off',1600);asBtn();}
function asTargets(){const L=[];for(const id in mp.peers){const pe=mp.peers[id];if(pe.hd||!pe.p)continue;const p=pe.wk?new V3(pe.wk[0],pe.wk[1]+0.9,pe.wk[2]):pe.p;L.push({id,name:pe.name,p,v:pe.v||new V3()});}
  if(typeof CAMPERS!=='undefined'&&ASSIST.mode>=1)for(const C of CAMPERS.L)if(!C.dead&&C.g.visible)L.push({id:'camp:'+C.name,name:'camper '+C.name,p:new V3(C.x,H(C.x,C.z)+0.9,C.z),v:new V3(),camper:1});return L;}
function asMe(){return WALK.on?WALK.pos.clone().add(new V3(0,1.5,0)):D.pos.clone();}
function asFwd(){return new V3(0,0,-1).applyQuaternion(cam.quaternion);}
function asFind(id){return asTargets().find(t=>t.id===id)||null;}
function asEM(){return ASSIST.revId&&mp.peers[ASSIST.revId]?Math.max(ASSIST.mode,3):ASSIST.mode;}
function asTick(dt){if(ASSIST.revId&&mp.peers[ASSIST.revId])ASSIST.lock=ASSIST.revId;else if(ASSIST.revId&&!mp.peers[ASSIST.revId])ASSIST.revId=null;const m=asEM();asMark(null);if(!m||!started)return;const me=asMe(),f=asFwd(),L=asTargets().filter(t=>!t.camper||m>=3);
  // keep a lock while it exists
  if(ASSIST.lock){const t=asFind(ASSIST.lock);if(!t||t.p.distanceTo(me)>400)ASSIST.lock=null;}
  let best=null,ba=1e9;for(const t of L){const d=t.p.clone().sub(me),dist=d.length();if(dist<2||dist>(m>=4?400:260))continue;const a=f.angleTo(d.normalize());const score=m>=4?dist*0.02+a:a;if((a<0.55||m>=4)&&score<ba){ba=score;best=t;}}
  const lockT=ASSIST.lock?asFind(ASSIST.lock):null;ASSIST.tgt=lockT||best;
  // look at it for 2 s → LOCK
  if(!lockT&&best&&f.angleTo(best.p.clone().sub(me).normalize())<0.25){if(ASSIST.lookId===best.id)ASSIST.lookT+=dt;else{ASSIST.lookId=best.id;ASSIST.lookT=0;}if(ASSIST.lookT>=(m>=4?0.6:2)){ASSIST.lock=best.id;ASSIST.lookT=0;beep(1400,0.08,0.06);setTimeout(()=>beep(1800,0.12,0.06),90);toast('🔒 LOCKED on '+best.name,1200);}}
  else if(!lockT){ASSIST.lookT=Math.max(0,ASSIST.lookT-dt);}
  const T=ASSIST.tgt;if(T)asMark(T,me);
  // ☠️ auto-fire at a lock
  if(m>=3&&lockT&&lockT.p.distanceTo(me)<180&&!DZ.dead){if(shotMode!=='gun'||curWeapon()!=='rocket'){shotMode='gun';const W=weaponTypes();const i=W.indexOf('rocket');if(i>=0)wCur=i;updBadge();}fire();}
  // 🤖 fly for me
  if(m>=4&&!WALK.on)asPilot(dt,lockT||best,me);}
const _apv=new V3();
function asPilot(dt,T,me){const k=vkind();if(k!=='drone'&&k!=='heli'){if(!asPilot.w){asPilot.w=1;toast('🤖 Fly-for-me works with drones + helicopters (the other assists still help)',3000);}return;}
  if(D.state==='landed'&&!DZ.dead){takeoff();return;}if(D.state!=='flying')return;if(ASSIST.apHold>0){ASSIST.apHold-=dt;return;}
  const gy=H(D.pos.x,D.pos.z);let goal;
  if(T){const away=me.clone().sub(T.p);away.y=0;if(away.lengthSq()<1)away.set(1,0,0);away.normalize();goal=T.p.clone().addScaledVector(away,28);goal.y=Math.max(T.p.y+7,H(goal.x,goal.z)+10);}
  else{const a=performance.now()/6000;goal=new V3(PAD.x+Math.cos(a)*40,0,PAD.z+Math.sin(a)*40);goal.y=H(goal.x,goal.z)+25;}
  goal.y=Math.max(goal.y,gy+6);_apv.subVectors(goal,D.pos);const top=Math.max(8,(ST.top||15)*0.85);if(_apv.length()>top)_apv.setLength(top);else _apv.multiplyScalar(0.9);
  D.vel.lerp(_apv,1-Math.exp(-dt*2.5));const look=(T?T.p:goal).clone().sub(D.pos);const want=Math.atan2(-look.x,-look.z);let d=want-D.yaw;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;D.yaw+=clamp(d,-2.5*dt,2.5*dt);}
// the target box on screen
function asMark(T,me){let el=$('asMark');if(!el){el=document.createElement('div');el.id='asMark';el.style.cssText='position:fixed;z-index:30;pointer-events:none;border:2px solid #ffd60a;border-radius:6px;display:none;transform:translate(-50%,-50%);font:700 11px system-ui;color:#fff;text-shadow:0 1px 3px #000';document.body.appendChild(el);}
  if(!T){el.style.display='none';return;}const v=T.p.clone().project(cam);if(v.z>1){el.style.display='none';return;}const dist=T.p.distanceTo(me),s=clamp(900/Math.max(dist,4),26,120),lk=ASSIST.lock===T.id;
  el.style.display='block';el.style.left=((v.x+1)/2*innerWidth)+'px';el.style.top=((1-v.y)/2*innerHeight)+'px';el.style.width=s+'px';el.style.height=s+'px';el.style.borderColor=lk?'#ff3b30':'#ffd60a';
  el.innerHTML='<div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);white-space:nowrap;margin-top:2px">'+(lk?'🔒 ':'')+esc(T.name)+' · '+Math.round(dist)+' m'+(!lk&&ASSIST.lookT>0.05&&ASSIST.lookId===T.id?' · '+Math.round(ASSIST.lookT/(ASSIST.mode>=4?0.6:2)*100)+'%':'')+'</div>';}
// aim where the target WILL be (rockets take time to get there)
{const a0=aimDir;aimDir=function(origin){const T=asEM()?ASSIST.tgt:null;if(T&&!(T.camper&&ASSIST.mode<3)){const w=curWeapon(),sp=w==='rocket'?Math.max(WPN.rspd,20)*1.35:(WTYPES[w]&&WTYPES[w].spd)||60;const dist=T.p.distanceTo(origin),t=dist/sp;
    const aim=T.p.clone().addScaledVector(T.v||new V3(),t);if(w!=='rocket')aim.y+=0.5*9.8*t*t*((WTYPES[w]&&WTYPES[w].g)?WTYPES[w].g/9.8:0);return aim.sub(origin).normalize();}
  return a0.apply(this,arguments);};}
// seeker rockets + rapid fire
{const s0=spawnShot;spawnShot=function(w,p,v,col,own,sid,by){const r=s0.apply(this,arguments);if(own&&w==='rocket'){const s=shots[shots.length-1];if(s){s.fuse=1;if(asEM()>=2&&ASSIST.tgt)s.tgtId=ASSIST.tgt.id;}}return r;};}
{const f0=fire;fire=function(){if(ASSIST.rapid&&curWeapon()==='rocket'){const now=performance.now();if(now-(ASSIST.lastFire||0)<130)return;ASSIST.lastFire=now;fire.last=0;}return f0.apply(this,arguments);};}
function asShotsTick(dt){const fuseR=clamp(WPN.blast*0.55,1.6,5);for(const s of shots){if(!s.own||s.w!=='rocket'||s.life<=0)continue;const P=s.m.position;
    if(s.tgtId){const T=asFind(s.tgtId);if(T){const want=T.p.clone().sub(P);const sp=s.v.length();want.setLength(sp);s.v.lerp(want,1-Math.exp(-dt*3.2));}}
    // 💥 proximity fuse: blows up as soon as something is inside the blast
    let hit=false;for(const id in mp.peers){const pe=mp.peers[id];if(pe.hd||!pe.p)continue;const q=pe.wk?new V3(pe.wk[0],pe.wk[1]+0.9,pe.wk[2]):pe.p;if(q.distanceTo(P)<fuseR){hit=true;break;}}
    if(!hit&&typeof CAMPERS!=='undefined')for(const C of CAMPERS.L)if(!C.dead&&C.g.visible&&Math.hypot(C.x-P.x,C.z-P.z)<Math.max(1.4,fuseR*0.6)&&Math.abs(P.y-(H(C.x,C.z)+0.9))<2){hit=true;break;}
    if(hit&&(s.age=(s.age||0))>=0){s.life=0;}}}
// someone is aiming at you!
function asThreats(dt){ASSIST.warnT-=dt;if(!ASSIST.mode||!DZ.on||ASSIST.warnT>0)return;const me=asMe();
  for(const s of DZ.rk){const toMe=me.clone().sub(s.m.position),d=toMe.length();if(d<70&&s.v.clone().normalize().dot(toMe.normalize())>0.9){ASSIST.warnT=2;asWarn('🚀 INCOMING from '+s.n+'!');beep(1500,0.07,0.05);return;}}
  for(const B of AIB.L){if(B.dead||B.aimMe<=0)continue;ASSIST.warnT=3;asWarn('⚠️ '+B.name.replace('🤖 ','')+' is aiming at you!');B.aimMe=0;return;}}
function asWarn(t){let el=$('asWarn');if(!el){el=document.createElement('div');el.id='asWarn';el.style.cssText='position:fixed;left:50%;top:22%;transform:translateX(-50%);z-index:31;pointer-events:none;background:rgba(200,0,0,0.75);border:2px solid #fff;border-radius:10px;padding:5px 12px;font:800 15px system-ui;color:#fff;opacity:0;transition:opacity 0.3s';document.body.appendChild(el);}
  el.textContent=t;el.style.opacity='1';clearTimeout(asWarn.t);asWarn.t=setTimeout(()=>el.style.opacity='0',1500);}
// HUD buttons (work on the phone too)
function asBtn(){let b=$('asBtn');if(!b){const box=document.createElement('div');box.id='asBox';box.style.cssText='position:fixed;right:10px;top:calc(96px + env(safe-area-inset-top));z-index:21;display:flex;flex-direction:column;gap:4px;align-items:flex-end';
    const mk=(id,fn)=>{const e=document.createElement('button');e.id=id;e.className='btn';e.style.cssText='padding:5px 9px;font:700 12px system-ui;border-radius:9px;background:rgba(0,0,0,0.55);color:#fff;border:1px solid rgba(255,255,255,0.3);cursor:pointer';e.onclick=fn;box.appendChild(e);return e;};
    b=mk('asBtn',()=>asSet(ASSIST.mode+1));mk('asRf',()=>asRapid());mk('safeBtn',()=>{acroToggle();asBtn();});mk('chuteBtn',()=>chuteToggle());document.body.appendChild(box);}
  b.textContent=ASSIST.mode?AS_NAMES[ASSIST.mode]:'🎯 Assist: off';b.style.borderColor=ASSIST.mode?'#ff3b30':'rgba(255,255,255,0.3)';
  $('asRf').textContent=ASSIST.rapid?'⚡ Rapid: ON':'⚡ Rapid: off';$('asRf').style.borderColor=ASSIST.rapid?'#ffd60a':'rgba(255,255,255,0.3)';
  const k=vkind(),sb=$('safeBtn');sb.style.display=(k==='drone'||k==='heli')&&!WALK.on?'':'none';sb.textContent=SPEC.assist?'🛡 SAFE':'🔓 ACRO';sb.style.borderColor=SPEC.assist?'#4ade80':'#ff9f0a';
  const cb=$('chuteBtn');cb.style.display=chuteCan()||CHUTE.on?'':'none';cb.textContent=CHUTE.on?'🪂 cut chute':'🪂 PARACHUTE';}
setInterval(()=>{try{if(started)asBtn();}catch(e){}},500);
// ---------------------------------------------------------------- 🪂 PARACHUTE (double-tap Space, or the 🪂 button)
const CHUTE={on:false,g:null,lastSp:0};
function chuteHeight(){const p=WALK.on?WALK.pos:D.pos;return p.y-H(p.x,p.z);}
function chuteCan(){if(!started)return false;if(WALK.on)return chuteHeight()>3&&WALK.vy<0;return chuteHeight()>4&&(D.state==='tumble'||D.state==='flying'||D.vel.y<-4);}
function chuteToggle(){if(CHUTE.on){chuteOff();toast('✂️ Chute cut',900);return;}if(!chuteCan()){toast('🪂 You need to be falling (up high) to open a parachute',1600);return;}
  CHUTE.on=true;if(!CHUTE.g){const g=new THREE.Group();const cols=[0xff3b30,0xffffff,0xff9f0a,0xffffff];for(let k=0;k<8;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(2.4,6,6,k/8*6.2832,6.2832/8,0,Math.PI/2.2),new THREE.MeshLambertMaterial({color:cols[k%4],side:THREE.DoubleSide}));g.add(s);}
    for(let k=0;k<4;k++){const l=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,3.2,4),MAT.dark);const a=k/4*6.2832;l.position.set(Math.cos(a)*1.1,-1.4,Math.sin(a)*1.1);l.rotation.z=Math.cos(a)*0.4;l.rotation.x=-Math.sin(a)*0.4;g.add(l);}CHUTE.g=g;}
  scene.add(CHUTE.g);CHUTE.g.scale.setScalar(0.1);beep(500,0.2,0.08);toast('🪂 Parachute open!',1200);}
function chuteOff(){CHUTE.on=false;if(CHUTE.g)scene.remove(CHUTE.g);}
function chuteTick(dt){if(!CHUTE.on)return;const h=chuteHeight();if(h<0.5||(!WALK.on&&D.state==='landed')){chuteOff();toast('🪂 Soft landing!',1000);return;}
  const big=WALK.on?1:clamp((ST.rad||0.5)*1.4,1,8),p=WALK.on?WALK.pos.clone().add(new V3(0,1.2,0)):D.pos;CHUTE.g.scale.setScalar(Math.min(big,CHUTE.g.scale.x+dt*3*big));CHUTE.g.position.set(p.x,p.y+2.6*CHUTE.g.scale.x,p.z);
  if(WALK.on){WALK.vy=Math.max(WALK.vy,-2.6);}else{D.vel.y=Math.max(D.vel.y,-3.2);D.vel.x*=Math.exp(-dt*0.7);D.vel.z*=Math.exp(-dt*0.7);if(D.spinV)D.spinV.multiplyScalar(Math.exp(-dt*3));}}
addEventListener('keydown',e=>{if(e.code!=='Space'||e.repeat)return;const now=performance.now();if(now-CHUTE.lastSp<350&&(chuteCan()||CHUTE.on)){CHUTE.lastSp=0;chuteToggle();e.preventDefault();e.stopImmediatePropagation();return;}CHUTE.lastSp=now;},true);
// ---------------------------------------------------------------- 🌲 fallen trees stay a while and are SOLID
const LOGS=[];
{const t0=fallingTree;fallingTree=function(t,c){const r=t0.apply(this,arguments);const f=FXB[FXB.length-1];if(f&&f.tree){f.stay=55;f.life=60;}
  const a=new V3(t.x-c.x,0,t.z-c.z);if(a.lengthSq()<0.01)a.set(1,0,0);a.normalize();const now=performance.now();LOGS.push({x:t.x,z:t.z,dx:a.x,dz:a.z,len:(t.h||8)*0.95,r:Math.max(0.35,(t.tr||0.25)*1.6),from:now+1300,until:now+55000});if(LOGS.length>80)LOGS.shift();return r;};}
const _lc=new V3();
function logHit(p,rad){const now=performance.now();for(const L of LOGS){if(now<L.from||now>L.until)continue;const rx=p.x-L.x,rz=p.z-L.z,s=clamp(rx*L.dx+rz*L.dz,0,L.len);const cx=L.x+L.dx*s,cz=L.z+L.dz*s,cy=H(cx,cz)+L.r;
    _lc.set(p.x-cx,p.y-cy,p.z-cz);const d=_lc.length(),lim=L.r+rad;if(d<lim)return{n:d>1e-4?_lc.clone().divideScalar(d):new V3(0,1,0),depth:lim-d};}return null;}
function logsTick(dt){if(!LOGS.length)return;const now=performance.now();while(LOGS.length&&now>LOGS[0].until)LOGS.shift();
  if(WALK.on){const h=logHit(WALK.pos.clone().add(new V3(0,0.5,0)),0.35);if(h){WALK.pos.x+=h.n.x*h.depth;WALK.pos.z+=h.n.z*h.depth;}}
  else if(DR&&D.state!=='landed'||vkind()==='car'){const rad=Math.min(ST.rad||0.4,2),h=logHit(D.pos,rad);if(h){if(MEGA())return;const vn=D.vel.dot(h.n);D.pos.addScaledVector(h.n,h.depth);if(vn<0){const sp=-vn;D.vel.addScaledVector(h.n,-vn*1.3);if(sp>7&&vkind()!=='car')impact(sp,'a fallen tree');else if(sp>3)beep(160,0.08,0.06);}}}}
// ---------------------------------------------------------------- ⏸ the menu pauses your drone (nothing can hit it) · 🛠 broken + landed → fix window opens
{const t0=tickDrone;tickDrone=function(dt,inp){
  if(started&&menu.open&&!WALK.on){D.shield=performance.now()+400;D.vel.multiplyScalar(0);return;}
  const before=D.state,r=t0.apply(this,arguments);
  try{const after=D.state;if(after!==before&&(after==='down'||after==='landed')&&!DZ.dead&&!WALK.on){const broken=after==='down'||DR.props.some(P=>P.state!=='ok'&&P.state!=='none')||dmgAny();
      if(broken)setTimeout(()=>{if(!repair.open&&!menu.open&&!WALK.on&&!DZ.dead&&(D.state==='down'||D.state==='landed'))try{openRepair();}catch(e){}},1400);}
    // ✈️ tiny-drone TURBO: throttle all the way up = huge burst (≈200 mph)
    if(inp&&ST.w<150&&vkind()==='drone'&&D.state==='flying'){if(inp.ly>0.96){const f=new V3(-Math.sin(D.yaw),0.05,-Math.cos(D.yaw));const hv=D.vel.clone();hv.y=0;if(hv.length()>3)f.add(hv.normalize()).normalize();D.vel.addScaledVector(f,140*dt);if(D.vel.length()>90)D.vel.setLength(90);if(!D.turbo){D.turbo=1;toast('🚀 TURBO!',800);beep(900,0.3,0.05);}}else D.turbo=0;}
    // 🤖 fly-for-me: moving the sticks takes over for 2 s
    if(ASSIST.mode>=4&&inp&&Math.max(Math.abs(inp.lx||0),Math.abs(inp.rx||0),Math.abs(inp.ry||0))>0.35)ASSIST.apHold=2;
    chuteTick(dt);logsTick(dt);megaTick(dt);}catch(e){console.warn('v23',e);}
  return r;};}
{const w0=tickWalk;tickWalk=function(dt){const r=w0.apply(this,arguments);try{if(WALK.on){chuteTick(dt);logsTick(dt);}}catch(e){}return r;};}
// ---------------------------------------------------------------- 💀 respawn waits: you 15 s, AI pilots 2 min + a countdown
function dzCount(){let el=$('dzCount');if(!el){el=document.createElement('div');el.id='dzCount';el.style.cssText='position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:61;pointer-events:none;font:900 34px system-ui;color:#fff;text-shadow:0 3px 12px #000;text-align:center;display:none';document.body.appendChild(el);}
  if(DZ.dead){const s=Math.ceil((DZ.dead-performance.now())/1000);el.style.display=s>0?'block':'none';el.innerHTML='💀 You got blown up!<br><span style="font-size:22px">Respawning in '+s+'…</span>';}else el.style.display='none';}
// ---------------------------------------------------------------- 🤖 AI: difficulty, less chat, react when you come at them, can't go through things
AIB.diff=LS.get('aiDiff','fun');
const AID={fun:{gap:[28,45],err:6,range:55,chase:0.15,camp:false},medium:{gap:[10,20],err:2.2,range:75,chase:0.35,camp:false},hard:{gap:[4,9],err:0.6,range:110,chase:0.6,camp:true}};
function aiD(){return AID[AIB.diff]||AID.fun;}
dzBotsShoot=function(dt){if(!DZ.on||!DZ.ai||!AIB.L.length)return;const now=performance.now(),S=aiD();
  for(const B of AIB.L){if(B.dead)continue;B.rkT=(B.rkT==null?S.gap[0]*0.5+Math.random()*S.gap[1]*0.5:B.rkT)-dt;if(B.rkT>0)continue;B.rkT=S.gap[0]+Math.random()*(S.gap[1]-S.gap[0]);
    const T=[];const me=dzMe();if(me&&!DZ.dead&&!(D.shield>now))T.push({p:me,v:WALK.on?new V3():D.vel,me:1});
    for(const id in mp.peers){const pe=mp.peers[id];if(id===B.id||pe.hd||!pe.p)continue;T.push({p:pe.wk?new V3(pe.wk[0],pe.wk[1]+0.9,pe.wk[2]):pe.p.clone(),v:pe.v||new V3()});}
    if(S.camp)for(const C of CAMPERS.L)if(!C.dead&&C.g.visible)T.push({p:new V3(C.x,H(C.x,C.z)+0.9,C.z),v:new V3()});
    const near=T.filter(t=>{const d=t.p.distanceTo(B.p);return d>4&&d<S.range;});if(!near.length)continue;const t=near[Math.floor(Math.random()*near.length)];
    const d=t.p.distanceTo(B.p),aim=t.p.clone().addScaledVector(t.v,AIB.diff==='hard'?d/28:0).add(new V3((Math.random()-0.5)*S.err*2,(Math.random()-0.5)*S.err,(Math.random()-0.5)*S.err*2));
    if(t.me)B.aimMe=1;setTimeout(()=>{if(!B.dead)dzBotFire(B,aim);},t.me&&ASSIST.mode?700:0);}};
// AI rockets: a small proximity fuse (yours is bigger)
{const r0=dzRockets;dzRockets=function(dt){for(const s of DZ.rk){const P=s.m.position;if(s.age<0.25)continue;for(const B of AIB.L)if(!B.dead&&B.id!==s.by&&B.p.distanceTo(P)<1.5){s.life=0;}const me=dzMe();if(me&&me.distanceTo(P)<1.7)s.life=0;}return r0.apply(this,arguments);};}
// fun mode: less chasing/circling you
{const p0=aiPickGoal;aiPickGoal=function(B){const r=p0.apply(this,arguments);if(B.goal&&B.goal.kind==='chase'&&Math.random()>aiD().chase/0.35){const a=Math.random()*6.28,d=40+Math.random()*120;B.goal={x:B.p.x+Math.cos(a)*d,z:B.p.z+Math.sin(a)*d,h:10+Math.random()*20,kind:'go'};}return r;};}
// when you fly straight at one, it notices
{const a0=aiTick;aiTick=function(dt){const r=a0.apply(this,arguments);try{const me=dzMe(),now=performance.now();if(!me)return r;const v=WALK.on?new V3():D.vel,sp=v.length();
    for(const B of AIB.L){if(B.dead)continue;
      // solid world: can't fly/drive through trees, jumps, objects or fallen logs
      const pp=B.p;if(hitTest(pp,0.35)||objHitTest(pp)||logHit(pp,0.5)){B.p.addScaledVector(B.v||new V3(),-dt*2.5);if(B.v)B.v.multiplyScalar(-0.4);if(B.kind!=='drone'&&B.kind!=='heli'){B.yaw=(B.yaw||0)+1.4;B.spd=1;B.wp=null;}else B.p.y+=dt*6;}
      if(sp<6||(B.kind!=='drone'&&B.kind!=='heli')||now-(B.reactT||0)<5000)continue;const to=B.p.clone().sub(me),d=to.length();if(d>80||d<3)continue;if(v.clone().normalize().dot(to.normalize())<0.92)continue;
      B.reactT=now;const side=new V3(-to.z,0,to.x).normalize().multiplyScalar((Math.random()<0.5?-1:1)*35);
      if(AIB.diff==='hard'){B.rkT=Math.min(B.rkT||9,0.3);B.goal={x:B.p.x+side.x,z:B.p.z+side.z,h:12,kind:'go'};}
      else if(AIB.diff==='medium'){B.goal={x:B.p.x+side.x,z:B.p.z+side.z,h:14,kind:'go'};if(Math.random()<0.5)B.rkT=Math.min(B.rkT||9,1);}
      else{const aw=to.normalize().multiplyScalar(70);B.goal={x:B.p.x+aw.x,z:B.p.z+aw.z,h:18,kind:'go'};}
      if(Math.random()<0.25)B.say=['Whoa, here comes '+(CFG.name||'someone')+'!','Yikes!','Not today!'][Math.floor(Math.random()*3)];}}catch(e){}return r;};}
// AI cars/boats can't drive through jumps + objects
{const v0=aiVehTick;aiVehTick=function(B,dt){const ox=B.p.x,oz=B.p.z;const r=v0.apply(this,arguments);if(B.kind==='car'){const q=new V3(B.p.x,H(B.p.x,B.p.z)+0.5,B.p.z);if(objHitTest(q)||logHit(q,0.6)||(typeof rampAt==='function'&&rampAt(B.p.x,B.p.z))){B.p.x=ox;B.p.z=oz;B.yaw=(B.yaw||0)+1.3;B.spd=1;B.wp=null;}}return r;};}
// AI chat a LOT less
{const c0=chatAdd;chatAdd=function(who,txt){if(String(who||'').startsWith('🤖')){const now=performance.now();if(!/[Cc]onnected/.test(String(txt))){if(now-(chatAdd.lastBot==null?-1e9:chatAdd.lastBot)<25000)return;chatAdd.lastBot=now;}}return c0.apply(this,arguments);};}
{const c0=chatSys;chatSys=function(t){if(/respawned|is back at camp|Heading to|joined/.test(String(t))&&/🤖|🧑‍🚒/.test(String(t)))return;return c0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🖥️ YOUR OWN AI (Dad's computer: Ollama / LM Studio)
AIB.src=LS.get('aiSrc','local')==='builtin'?'builtin':'local';AIB.url=LS.get('aiUrl','');AIB.model=LS.get('aiModel','');AIB.models=[];AIB.kindApi='';
function aiUrlFix(u){u=String(u||'').trim();if(!u)return'';if(!/^https?:\/\//.test(u))u='http://'+u;u=u.replace(/\/+$/,'');if(!/:\d+$/.test(u.replace(/^https?:\/\//,'').split('/')[0]))u+=':11434';return u;}
async function aiFetchJ(url,opt,ms){const ac=new AbortController(),t=setTimeout(()=>ac.abort(),ms||8000);try{const r=await fetch(url,Object.assign({signal:ac.signal},opt||{}));if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(t);}}
async function aiListModels(){if(!AIB.url)throw new Error('no address');
  try{const j=await aiFetchJ(AIB.url+'/api/tags');AIB.kindApi='ollama';AIB.models=(j.models||[]).map(m=>({n:m.name,size:m.size||0,fam:(m.details&&m.details.family)||'',par:(m.details&&m.details.parameter_size)||''}));}
  catch(e){const j=await aiFetchJ(AIB.url+'/v1/models');AIB.kindApi='openai';AIB.models=(j.data||[]).map(m=>({n:m.id,size:0,fam:'',par:''}));}
  if(!AIB.models.length)throw new Error('it has no AI models installed');
  if(!AIB.model||!AIB.models.some(m=>m.n===AIB.model)){const pref=['llama3','qwen','mistral','gemma','phi'];const s=AIB.models.slice().sort((a,b)=>{const pa=pref.findIndex(p=>a.n.includes(p)),pb=pref.findIndex(p=>b.n.includes(p));return (pa<0?99:pa)-(pb<0?99:pb)||b.size-a.size;});AIB.model=s[0].n;LS.set('aiModel',AIB.model);}
  return AIB.models;}
function aiModelName(){const m=AIB.models.find(x=>x.n===AIB.model);return AIB.model?(AIB.model+(m&&m.par?' ('+m.par+')':'')):'?';}
function aiPrompt(){const P=aiPlaces();const fires=FIRE.L.slice(0,6).map(F=>[Math.round(F.x),Math.round(F.z)]);
  const bots=AIB.L.filter(B=>!B.dead).map(B=>({name:B.name.replace('🤖 ',''),vehicle:B.kind||'drone',x:Math.round(B.p.x),z:Math.round(B.p.z),height:Math.round(B.p.y-H(B.p.x,B.p.z))}));
  return 'You control the AI pilots in "Woods RC Sim", a kids\' RC game. The pilots play just for FUN like a kid would: switch vehicles (drone, plane, heli, boat, sub, car), zoom around, explore all over the map, race, do tricks, visit places, help fight fires. Mostly don\'t hunt the player (difficulty: '+AIB.diff+'). Keep chat lines rare and short.\n'+
    'Player "'+(CFG.name||'Madison')+'" is '+(WALK.on?'walking':vkind())+' at x='+Math.round(D.pos.x)+' z='+Math.round(D.pos.z)+'.\nPlaces: '+JSON.stringify(P.map(q=>({name:q.n,x:Math.round(q.x),z:Math.round(q.z)})))+'\nFires: '+JSON.stringify(fires)+'\nTracks: '+Object.keys(courses).filter(k=>!courses[k].custom).slice(0,8).join(',')+'\nPilots: '+JSON.stringify(bots)+
    '\nBoats and subs only work on the lake. Reply ONLY with JSON like {"pilots":[ ... ]} (no other text), with one object per pilot you want to change: {"name":..., "vehicle":"drone"|"plane"|"heli"|"boat"|"sub"|"car", "do":"go"|"place"|"fire"|"chase"|"flip"|"land"|"race", "place":"place name", "x":number, "z":number, "h":number, "track":string, "say":"short chat line or empty"}.';}
function aiParse(txt){txt=String(txt||'');let a=null;try{a=JSON.parse(txt.slice(txt.indexOf('['),txt.lastIndexOf(']')+1));}catch(e){}if(!Array.isArray(a)){try{const o=JSON.parse(txt.slice(txt.indexOf('{'),txt.lastIndexOf('}')+1));a=Array.isArray(o)?o:Object.values(o).find(v=>Array.isArray(v))||[o];}catch(e){a=[];}}return a;}
async function aiAskLocal(){AIB.busy=true;try{if(!AIB.models.length)await aiListModels();const p=aiPrompt();let txt;
    if(AIB.kindApi==='openai'){const j=await aiFetchJ(AIB.url+'/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model:AIB.model,messages:[{role:'user',content:p}],temperature:0.8})},60000);txt=j.choices&&j.choices[0]&&j.choices[0].message.content;}
    else{const j=await aiFetchJ(AIB.url+'/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model:AIB.model,messages:[{role:'system',content:'You are the game master for AI pilots in a kids\' RC flying game. Answer with JSON only.'},{role:'user',content:p}],stream:false,format:'json',keep_alive:'10m',options:{temperature:0.7,num_ctx:4096}})},60000);txt=j.message&&j.message.content;}
    const arr=aiParse(txt);if(AIB.ok!==true){AIB.ok=true;toast('✅ Connected to AI — '+aiModelName()+' is now deciding what the AI pilots do',3500);chatSys('🧠 Connected to AI: '+aiModelName());}aiApply(arr);}
  catch(e){AIB.err=String(e.name==='AbortError'?'it took too long to answer':e.message||e);if(AIB.ok!==false){toast('❌ Couldn\'t connect to AI ('+AIB.err+') — the built-in brain is flying the pilots',5000);}AIB.ok=false;AIB.t=performance.now()+20000;}
  AIB.busy=false;}

function aiBrainSet(src){AIB.src=src;LS.set('aiSrc',src);AIB.claude=src!=='builtin';LS.set('aiClaude',AIB.claude);AIB.ok=null;AIB.t=0;AIB.models=src==='local'?AIB.models:[];if(src!=='builtin')toast('🧠 Connecting to AI…',1500);}
aiBrainSet(AIB.src);AIB.ok=null;
function aiModelItems(){return[mInfo('Pick which AI model on the computer flies the pilots:'),...AIB.models.map(m=>mItem(()=>(m.n===AIB.model?'✅ ':'')+m.n+(m.par?' · '+m.par:'')+(m.fam?' · '+m.fam:''),()=>{AIB.model=m.n;LS.set('aiModel',m.n);AIB.ok=null;AIB.t=0;toast('🧠 Using '+m.n,1500);})),mItem('◀ Back',()=>menuBack())];}

// ---------------------------------------------------------------- 💪 MEGA drones (house-sized) + big drones fly smooth
function MEGA(){return !WALK.on&&vkind()==='drone'&&(ST.rad||0)>6;}
{const s0=stats;stats=function(sp){const st=s0.apply(this,arguments);try{if(st&&sp&&sp.parts&&st.fc&&(st.w||0)>15000){st.fc=Object.assign({},st.fc,{alpha:0,mismatch:0,topHeavy:0,head:Math.max(st.fc.head||0,0.5)});st.tau=Math.max(st.tau,0.42);if(st.rad>6){st.tough=10;st.mega=true;}}}catch(e){}return st;};}
{const i0=impact;impact=function(v,what){if(MEGA()){if(v>30&&Math.random()<0.15){const L=DR.props.filter(P=>P.state==='ok');if(L.length){setPropState(L[0],'chip');toast('💪 MEGA: just nicked a prop tip',1400);}}bump();shake=Math.max(shake,0.3);return;}return i0.apply(this,arguments);};}
{const d0=dzDie;dzDie=function(txt){if(MEGA()&&!/train/i.test(String(txt))){if(Math.random()<0.3){const L=DR.props.filter(P=>P.state==='ok');if(L.length)setPropState(L[0],'chip');}D.shield=performance.now()+800;toast('💪 MEGA armor — barely a scratch!',1200);return;}return d0.apply(this,arguments);};}
function megaTick(dt){if(!MEGA()||D.state!=='flying')return;V23.mt=(V23.mt||0)-dt;if(V23.mt>0)return;V23.mt=0.25;const R=ST.rad*0.75,p=D.pos,gy=H(p.x,p.z);
  if(D.vel.length()>2&&p.y-gy<20)addCrater({x:+p.x.toFixed(1),z:+p.z.toFixed(1),r:+Math.min(R,10).toFixed(1)},true);
  for(const B of AIB.L)if(!B.dead&&B.p.distanceTo(p)<R+1)dzBotDie(B,'💪 '+CFG.name+'\'s MEGA drone smashed '+B.name);
  for(const C of CAMPERS.L)if(!C.dead&&C.g.visible&&Math.hypot(C.x-p.x,C.z-p.z)<R&&p.y-H(C.x,C.z)<R+2)dzCampDie(C,'💪 MEGA drone squashed camper '+C.name);
  for(const id in mp.peers){const pe=mp.peers[id];if(id.startsWith('bot')||!pe.p)continue;const q=pe.wk?new V3(pe.wk[0],pe.wk[1],pe.wk[2]):pe.p;if(q.distanceTo(p)<R+1&&!(pe.smT>performance.now())){pe.smT=performance.now()+3000;mpSend({t:'dz',op:'smash',to:id,by:CFG.name});}}}
{const z0=MPH.dz;MPH.dz=function(m,pe){if(m.op==='smash'){if(m.to===mp.id)dzDie('Smashed by '+(m.by||'someone')+'\'s MEGA drone!',pe.id,pe.name);return;}return z0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🚂 TRAIN: runs a big loop through the woods; walk up and press K to ride + drive it (W/S)
const TRAIN={u:0,v:12,dir:1,ride:false,cars:[],cv:null,len:0,closed:true,mine:LS.get('trainPts',[]),loop:LS.get('trainLoop',true),run:LS.get('trainRun',true),spd:LS.get('trainSpd',12),meshes:[]};
let TRAIN_PTS=[];
// the default track: runs beside the trails (off to the side) with extra wiggles
function trainDefaultPts(){const P=trail.getSpacedPoints(160);P.pop();const out=[];for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],tx=q.x-p.x,tz=q.z-p.z,l=Math.hypot(tx,tz)||1,nx=tz/l,nz=-tx/l,w=9+Math.sin(i*0.55)*4;out.push([p.x+nx*w,p.z+nz*w]);}
  const S=[];for(let i=0;i<out.length;i+=4)S.push(out[i]);return S;}
function trainDist(x,z){let b=1e9;for(let i=0;i<TRAIN_PTS.length;i+=2){const p=TRAIN_PTS[i],d=(p.x-x)**2+(p.z-z)**2;if(d<b)b=d;}return Math.sqrt(b);}
function trainBuild(){const mine=TRAIN.mine.length>=3,P=mine?TRAIN.mine:trainDefaultPts();TRAIN.closed=mine?TRAIN.loop:true;
  TRAIN.cv=new THREE.CatmullRomCurve3(P.map(p=>new V3(p[0],0,p[1])),TRAIN.closed,'centripetal');TRAIN.len=TRAIN.cv.getLength();TRAIN_PTS=TRAIN.cv.getSpacedPoints(Math.max(60,Math.round(TRAIN.len/1.6)));if(TRAIN.closed)TRAIN_PTS.pop();
  TRAIN.meshes.forEach(m=>scene.remove(m));TRAIN.meshes=[];
  const N=TRAIN_PTS.length,tie=new THREE.InstancedMesh(new THREE.BoxGeometry(2.6,0.14,0.45),new THREE.MeshLambertMaterial({color:0x5a3d22}),N),rail=new THREE.InstancedMesh(new THREE.BoxGeometry(0.12,0.16,1),new THREE.MeshLambertMaterial({color:0x8e8e93}),N*2),o=new THREE.Object3D();
  for(let i=0;i<N;i++){const p=TRAIN_PTS[i],q=TRAIN_PTS[TRAIN.closed?(i+1)%N:Math.min(i+1,N-1)],a=Math.atan2(q.x-p.x,q.z-p.z)||0,seg=Math.hypot(q.x-p.x,q.z-p.z),y=H(p.x,p.z);
    o.position.set(p.x,y+0.07,p.z);o.rotation.set(0,a,0);o.scale.set(1,1,1);o.updateMatrix();tie.setMatrixAt(i,o.matrix);
    for(const s of [-0.75,0.75]){o.position.set(p.x+Math.cos(a)*s,(y+H(q.x,q.z))/2+0.2,p.z-Math.sin(a)*s);o.rotation.set(0,a,0);o.scale.set(1,1,Math.max(0.01,seg+0.05));o.updateMatrix();rail.setMatrixAt(i*2+(s>0?1:0),o.matrix);}}
  tie.frustumCulled=false;rail.frustumCulled=false;scene.add(tie);scene.add(rail);TRAIN.meshes=[tie,rail];
  // clear trees off the new track
  if(typeof chunks!=='undefined')for(const [k,ch] of [...chunks]){if(ch.trees.some(t=>trainDist(t.x,t.z)<4.2)){unloadChunk(ch);chunks.set(k,buildChunk(ch.i,ch.j));}}}
{const b0=blocked;blocked=function(x,z){if(b0(x,z))return true;return TRAIN_PTS.length?trainDist(x,z)<4.2:false;};}
(function(){const mk=(col,len,loco)=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,loco?2.6:2.2,len),new THREE.MeshLambertMaterial({color:col}));b.position.y=1.7;g.add(b);
    if(loco){const ch=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.35,1.2,10),MAT.dark);ch.position.set(0,3.4,-len*0.3);g.add(ch);const cab=new THREE.Mesh(new THREE.BoxGeometry(2.5,1,2.2),new THREE.MeshLambertMaterial({color:0x1c1c1e}));cab.position.set(0,3.3,len*0.28);g.add(cab);const lt=new THREE.Mesh(GEO.ball,new THREE.MeshBasicMaterial({color:0xfff6c0}));lt.scale.setScalar(0.25);lt.position.set(0,2.4,-len/2-0.05);g.add(lt);}
    for(const z of [-len*0.32,len*0.32])for(const x of [-1.1,1.1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.2,12),MAT.dark);w.rotation.z=Math.PI/2;w.position.set(x,0.45,z);g.add(w);}scene.add(g);return g;};
  TRAIN.cars=[mk(0xd7263d,7,true),mk(0x0a84ff,6),mk(0xffd60a,6),mk(0x34c759,6)];})();
trainBuild();
// 🛤 lay your own track
function trainHere(){const p=WALK.on?WALK.pos:D.pos;return[+p.x.toFixed(1),+p.z.toFixed(1)];}
function trainAddPt(){TRAIN.mine.push(trainHere());LS.set('trainPts',TRAIN.mine);if(TRAIN.mine.length>=3){trainBuild();toast('🛤 Track point '+TRAIN.mine.length+' added — the track is rebuilt',1800);}else toast('🛤 Track point '+TRAIN.mine.length+' — add '+(3-TRAIN.mine.length)+' more to make a track',2200);}
function trainUndo(){TRAIN.mine.pop();LS.set('trainPts',TRAIN.mine);trainBuild();toast('↩ Removed the last track point',1400);}
function trainReset(){TRAIN.mine=[];LS.set('trainPts',[]);trainBuild();toast('🛤 Back to the trail-side track',1600);}
function trainItems(){return[mInfo('🛤 Lay your own track: go somewhere (walk or fly) and tap "Add a track point here". After 3 points the track appears; keep adding to make it longer and squigglier.'),
  mItem(()=>'➕ Add a track point here ('+TRAIN.mine.length+' so far)',()=>{trainAddPt();menuToggle(false);}),mItem('↩ Undo last point',()=>trainUndo()),mItem('🗑 Clear my track (use the trail-side track)',()=>trainReset()),
  mItem(()=>'🔁 My track: '+(TRAIN.loop?'loops round':'goes back and forth (end to end)'),()=>{TRAIN.loop=!TRAIN.loop;LS.set('trainLoop',TRAIN.loop);trainBuild();}),
  mItem(()=>'🚂 Train: '+(TRAIN.run?'running by itself':'stopped (until you drive it)'),()=>{TRAIN.run=!TRAIN.run;LS.set('trainRun',TRAIN.run);}),
  mItem(()=>'⚡ Train speed: '+TRAIN.spd+' m/s  ◀ ▶',()=>{TRAIN.spd=TRAIN.spd>=30?6:TRAIN.spd+6;LS.set('trainSpd',TRAIN.spd);},d=>{TRAIN.spd=clamp(TRAIN.spd+d*3,3,40);LS.set('trainSpd',TRAIN.spd);}),
  mItem('🚂 Take me to the train',()=>trainGoto()),mItem('◀ Back',()=>menuBack())];}
function trainGoto(){if(menu.open)menuToggle(false);if(!WALK.on){if(D.state!=='landed'&&D.state!=='down')resetDrone();walkToggle(true);}const g=TRAIN.cars[3].position;WALK.pos.set(g.x+4,0,g.z+4);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);toast('🚂 Press K next to the train to hop on!',3000);}
// ⏩ / ⏪ buttons while riding (phone too)
function trainBtns(){let b=$('trBtns');if(!b){b=document.createElement('div');b.id='trBtns';b.style.cssText='position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:22;display:none;gap:10px';
    const mk=(t,fn)=>{const e=document.createElement('button');e.textContent=t;e.style.cssText='font:800 18px system-ui;padding:12px 18px;border-radius:14px;border:2px solid #fff;background:rgba(0,0,0,0.6);color:#fff;touch-action:none';e.onpointerdown=ev=>{ev.preventDefault();fn(true);};e.onpointerup=e.onpointerleave=()=>fn(false);b.appendChild(e);};
    mk('⏪ Back',on=>TRAIN.hold=on?-1:0);mk('⏹ Stop',on=>{if(on){TRAIN.v=0;TRAIN.hold=0;}});mk('⏩ Forward',on=>TRAIN.hold=on?1:0);mk('🚪 Off',on=>{if(on)trainToggle();});document.body.appendChild(b);}
  b.style.display=TRAIN.ride?'flex':'none';}
function trainTick(dt){if(!started||(typeof CES!=='undefined'&&CES.on))return;trainBtns();
  if(TRAIN.ride||!TRAIN.run||!TRAIN.closed){const k=keys,inp=WALK.inp||{};const thr=TRAIN.ride?((k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)+(TRAIN.hold||0)+(Math.abs(inp.ly||0)>0.3?Math.sign(inp.ly):0)):(TRAIN.run?TRAIN.dir:0);
    if(thr)TRAIN.v=clamp(TRAIN.v+clamp(thr,-1,1)*8*dt,-TRAIN.spd*1.5,TRAIN.spd*1.5);else if(!TRAIN.ride)TRAIN.v*=Math.exp(-dt*0.8);
    if(!TRAIN.ride&&TRAIN.run)TRAIN.v=clamp(TRAIN.v,-TRAIN.spd,TRAIN.spd);
    let u=TRAIN.u+TRAIN.v*dt/TRAIN.len;if(TRAIN.closed)u=(u%1+1)%1;else if(u>0.985||u<0.015){u=clamp(u,0.015,0.985);TRAIN.dir=u>0.5?-1:1;if(TRAIN.ride)TRAIN.v=0;else TRAIN.v*=-0.2;}TRAIN.u=u;}
  else{TRAIN.v=TRAIN.spd;TRAIN.u=((Date.now()/1000)*TRAIN.spd/TRAIN.len)%1;}// same place on every computer
  const gaps=[0,7.5,14,20.5];TRAIN.cars.forEach((g,i)=>{let u=TRAIN.u-gaps[i]/TRAIN.len;u=TRAIN.closed?(u+1)%1:clamp(u,0,1);const p=TRAIN.cv.getPointAt(u),t=TRAIN.cv.getTangentAt(u);g.position.set(p.x,H(p.x,p.z),p.z);g.rotation.y=Math.atan2(-t.x,-t.z)+Math.PI;});
  const L=TRAIN.cars[0];if(TRAIN.ride){WALK.pos.set(L.position.x,L.position.y+2.4,L.position.z);WALK.vy=0;WALK.yaw=L.rotation.y+Math.PI;}
  // run-over check (the train always wins)
  if(Math.abs(TRAIN.v)>2){for(const g of TRAIN.cars){const gp=g.position;const me=dzMe();if(me&&!TRAIN.ride&&Math.hypot(me.x-gp.x,me.z-gp.z)<3.4&&me.y-gp.y<3.5){if(DZ.on)dzDie('Run over by the train! 🚂','','');else if(!WALK.on&&D.state==='flying')impact(14,'the train');}
      for(const B of AIB.L)if(!B.dead&&Math.hypot(B.p.x-gp.x,B.p.z-gp.z)<3.4&&B.p.y-gp.y<3.5)dzBotDie(B,'🚂 The train flattened '+B.name);
      for(const C of CAMPERS.L)if(!C.dead&&C.g.visible&&Math.hypot(C.x-gp.x,C.z-gp.z)<3)dzCampDie(C,'🚂 The train got camper '+C.name);}}}
function trainNear(){if(!WALK.on)return false;for(const g of TRAIN.cars)if(Math.hypot(g.position.x-WALK.pos.x,g.position.z-WALK.pos.z)<5)return true;return false;}
function trainToggle(){if(TRAIN.ride){TRAIN.ride=false;const L=TRAIN.cars[0],a=L.rotation.y;WALK.pos.set(L.position.x+Math.cos(a)*3.5,0,L.position.z-Math.sin(a)*3.5);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);toast('🚂 Hopped off',1200);return true;}
  if(trainNear()){TRAIN.ride=true;toast('🚂 All aboard! ⏩ Forward / ⏪ Back (or W / S) · K = hop off',3500);beep(400,0.4,0.08);beep(300,0.5,0.08);return true;}return false;}
addEventListener('keydown',e=>{if(e.code==='KeyK'&&!e.repeat&&WALK.on&&(TRAIN.ride||trainNear())&&!menu.open){if(trainToggle()){e.preventDefault();e.stopImmediatePropagation();}}},true);
{const w0=tickWalk;tickWalk=function(dt){if(TRAIN.ride&&WALK.on)return;return w0.apply(this,arguments);};}
// ---------------------------------------------------------------- per frame + keys + menus
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{asTick(dt);asShotsTick(dt);asThreats(dt);dzCount();trainTick(dt);}catch(e){console.warn('v23',e);}return r;};}
addEventListener('keydown',e=>{if(menu.open||e.repeat||/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName||''))return;if(e.code==='KeyJ'){if(e.shiftKey)asRapid();else asSet(ASSIST.mode+1);}});
function assistItems(){return[mInfo('Assist modes help you fight. Press J (or the 🎯 button) to switch. Shift+J = rapid fire.'),...AS_NAMES.map((n,i)=>mItem(()=>(ASSIST.mode===i?'✅ ':'')+(i?n:'Off')+' — '+AS_INFO[i],()=>asSet(i))),
  mItem(()=>'⚡ Rapid fire: '+(ASSIST.rapid?'ON':'off'),()=>asRapid()),mItem(()=>'🛡 Safe mode (self-levelling): '+(SPEC.assist?'ON':'off — ACRO'),()=>acroToggle()),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Danger mode/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem(()=>'🎯 Assist: '+(ASSIST.mode?AS_NAMES[ASSIST.mode]:'off')+(ASSIST.rapid?' · ⚡ rapid':'')+' ▸',()=>menuPush('🎯 Assist modes',assistItems())));
  if(WALK.on&&(trainNear()||TRAIN.ride))L.splice(1,0,mItem(TRAIN.ride?'🚂 Hop off the train':'🚂 Ride the train',()=>{trainToggle();menuToggle(false);}));
  L.splice(i+2,0,mItem('🚂 Train ▸ (ride it, lay your own track)',()=>menuPush('🚂 Train',trainItems())));return L;};}
{const d0=dangerItems;dangerItems=function(){const L=d0();L.splice(L.length-2,0,mItem('🎯 Assist modes + rapid fire ▸',()=>menuPush('🎯 Assist modes',assistItems())));return L;};}
// ---------------------------------------------------------------- 😠 REVENGE mode: whoever blew you up gets locked + hunted when you come back (AI pilots you get back are out for 10 min)
ASSIST.revenge=LS.get('asRev',true);ASSIST.revId=null;
{const d0=dzDie;dzDie=function(txt,byId,byName){const was=DZ.dead;const r=d0.apply(this,arguments);if(!was&&DZ.dead&&ASSIST.revenge&&byId&&byId!==mp.id&&mp.peers[byId]){DZ.killer={id:byId,name:byName||mp.peers[byId].name};}return r;};}
{const r0=dzRespawn;dzRespawn=function(){const r=r0.apply(this,arguments);if(ASSIST.revenge&&DZ.killer&&mp.peers[DZ.killer.id]){ASSIST.revId=DZ.killer.id;ASSIST.revT=performance.now()+90000;toast('😠 REVENGE! Locked on '+DZ.killer.name+' — rockets will find them',3000);beep(300,0.3,0.08);}DZ.killer=null;return r;};}
{const b0=dzBotDie;dzBotDie=function(B,txt){if(!B.dead&&ASSIST.revId===B.id&&String(txt).includes(CFG.name)){B.outLong=1;ASSIST.revId=null;setTimeout(()=>toast('😎 REVENGE! '+B.name.replace('🤖 ','')+' is out for 10 minutes',3000),50);}return b0.apply(this,arguments);};}
setInterval(()=>{if(ASSIST.revId&&performance.now()>(ASSIST.revT||0))ASSIST.revId=null;},2000);
// ---------------------------------------------------------------- 🛡 your OWN rockets never hurt you
DZ.selfSafe=LS.get('dzSelfSafe',true);
{const e0=explode;explode=function(p,r,dr,own,byName,byId){if(DZ.selfSafe&&(byId===mp.id||own&&!byId)){const old=D.shield;D.shield=performance.now()+120;try{return e0.apply(this,arguments);}finally{D.shield=old;}}return e0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🔋 double-tap PHOTO when the battery is low = fresh battery
function battRenew(){D.batt=100;D.lowWarn=false;D.autoLand=false;beep(900,0.1,0.05);setTimeout(()=>beep(1300,0.12,0.05),110);toast('🔋 Fresh battery!',1500);}
function photoTap(){const now=performance.now();if(now-(photoTap.t||0)<450&&D.batt<25){photoTap.t=0;battRenew();return true;}photoTap.t=now;return false;}
{const s0=shutter;shutter=function(down){if(down&&photoTap())return;return s0.apply(this,arguments);};}
setTimeout(()=>{const b=$('bShot');if(b)b.addEventListener('pointerdown',()=>{if(shotMode==='gun')photoTap();},true);},500);
// ---------------------------------------------------------------- ⏸ Z pauses EVERYTHING (AI, rockets, fires, campers, train)
{const f0=fireTick;fireTick=function(dt){if(SIM.pause)return;return f0.apply(this,arguments);};}
{const t0=tickShots;tickShots=function(dt){if(SIM.pause)return;return t0.apply(this,arguments);};}
{const p0=pauseToggle;pauseToggle=function(){SIM.pause=!SIM.pause;simBanner();toast(SIM.pause?'⏸ PAUSED — everything is frozen (Z to go)':'▶ Go!',1500);};}
// ---------------------------------------------------------------- 🎤 VOICE CHAT: say "chat", your message, then "end chat"
const VOICE={on:false,rec:null,buf:null};
function voiceToggle(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('🎤 This browser can\'t do voice — try Chrome or Edge',3000);return;}
  VOICE.on=!VOICE.on;if(!VOICE.on){try{VOICE.rec&&VOICE.rec.stop();}catch(e){}toast('🎤 Voice chat off',1200);asBtn();return;}
  const r=new SR();r.continuous=true;r.interimResults=false;r.lang='en-US';VOICE.rec=r;
  r.onresult=ev=>{for(let i=ev.resultIndex;i<ev.results.length;i++){if(!ev.results[i].isFinal)continue;voiceHeard(ev.results[i][0].transcript);}};
  r.onerror=e=>{if(e.error==='not-allowed'){VOICE.on=false;toast('🎤 The microphone is blocked — allow it in the browser',3500);}};
  r.onend=()=>{if(VOICE.on)try{r.start();}catch(e){}};try{r.start();}catch(e){}toast('🎤 Voice chat ON — say "chat", your message, then "end chat"',3500);asBtn();}
function voiceHeard(t){t=' '+String(t).trim()+' ';const low=t.toLowerCase();
  if(VOICE.buf==null){const i=low.search(/\bchat\b/);if(i<0)return;if(/\bend chat\b/.test(low.slice(0,i+4))&&low.indexOf('end chat')<i)return;VOICE.buf='';t=t.slice(i+5);}
  const j=t.toLowerCase().search(/\b(end chat|and chat|in chat)\b/);if(j>=0){VOICE.buf+=' '+t.slice(0,j);const msg=VOICE.buf.replace(/\s+/g,' ').trim();VOICE.buf=null;if(msg){chatSend(msg);beep(1000,0.06,0.04);}}
  else{VOICE.buf+=' '+t;toast('🎤 '+VOICE.buf.trim().slice(-60)+'… (say "end chat")',2500);}}
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);let v=$('vcBtn');if(!v){v=document.createElement('button');v.id='vcBtn';v.className='btn';v.style.cssText=$('asBtn').style.cssText;v.onclick=voiceToggle;$('asBox').appendChild(v);}
  v.textContent=VOICE.on?(VOICE.buf!=null?'🔴 recording…':'🎤 Voice: ON'):'🎤 Voice chat';v.style.borderColor=VOICE.on?'#ff3b30':'rgba(255,255,255,0.3)';};}
// chat works offline too (the AI pilots + campers can hear you)
{const c0=chatSend;chatSend=function(txt){if(!mpOpen()&&txt&&String(txt).trim()){chatAdd(CFG.name+' (you)',String(txt).trim().slice(0,140),'#ffd60a');try{if(typeof aiHear==='function')aiHear(String(txt));}catch(e){}return;}return c0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🦖 GIGA drone (as long as the runway) + a SECRET runway far away
const SECRET={x:820,z:-640,len:240,w:34};
{const b0=blocked;blocked=function(x,z){if(Math.abs(x-SECRET.x)<SECRET.w/2+110&&Math.abs(z-SECRET.z)<SECRET.len/2+110)return true;return b0(x,z);};}
(function(){const N=60,seg=SECRET.len/N,m=new THREE.InstancedMesh(new THREE.BoxGeometry(SECRET.w,0.2,seg+0.1),new THREE.MeshLambertMaterial({color:0x2c2c2e}),N),lines=new THREE.InstancedMesh(new THREE.BoxGeometry(0.8,0.22,seg*0.5),new THREE.MeshBasicMaterial({color:0xffffff}),N),o=new THREE.Object3D();
  for(let i=0;i<N;i++){const z=SECRET.z-SECRET.len/2+seg*(i+0.5);o.position.set(SECRET.x,H(SECRET.x,z)+0.1,z);o.updateMatrix();m.setMatrixAt(i,o.matrix);o.position.y+=0.02;o.updateMatrix();lines.setMatrixAt(i,o.matrix);}m.frustumCulled=false;lines.frustumCulled=false;scene.add(m);scene.add(lines);
  const hg=new THREE.Mesh(new THREE.BoxGeometry(60,26,50),new THREE.MeshLambertMaterial({color:0x48484a}));hg.position.set(SECRET.x+70,H(SECRET.x+70,SECRET.z)+13,SECRET.z);scene.add(hg);
  const sg=new THREE.Mesh(new THREE.BoxGeometry(30,6,1),new THREE.MeshBasicMaterial({color:0xff3b30}));sg.position.set(SECRET.x+70,H(SECRET.x+70,SECRET.z)+29,SECRET.z-25.6);scene.add(sg);})();
const GIGA_F=6;
{const s0=stats;stats=function(sp){const st=s0.apply(this,arguments);try{if(sp&&sp.giga&&st){st.rad*=GIGA_F;st.L=Math.max(st.L,(st.rad*1.5-3.5)/6);st.legs*=GIGA_F;st.top*=2.6;st.vz=(st.vz||3)*3;st.tough=10;st.mega=true;st.giga=true;}}catch(e){}return st;};}
{const b0=buildDrone;buildDrone=function(sp,opt){const m=b0.apply(this,arguments);try{if(sp&&sp.giga&&m&&m.g&&!m.g.userData.giga){m.g.userData.giga=1;m.g.scale.multiplyScalar(GIGA_F);}}catch(e){}return m;};}
function gigaGo(){if(menu.open)menuToggle(false);if(WALK.on)walkToggle(false);const sp=sanitize(JSON.parse(JSON.stringify(MEGA_SPEC)));sp.giga=true;sp.name='🦖 GIGA Smasher';useSpec(sp);
  resetDrone({x:SECRET.x,z:SECRET.z+SECRET.len/2-60,yaw:0});toast('🦖 GIGA SMASHER at the secret runway! It\'s as long as the runway. Smash everything!',4500);}
// GIGA smashes a big path through the trees
{const m0=megaTick;megaTick=function(dt){if(ST.giga&&D.state==='flying'){V23.gt=(V23.gt||0)-dt;if(V23.gt<=0){V23.gt=0.4;const p=D.pos;if(p.y-H(p.x,p.z)<ST.rad*0.6+18)addCrater({x:+p.x.toFixed(1),z:+p.z.toFixed(1),r:Math.min(ST.rad*0.8,45)},true);}}return m0.apply(this,arguments);};}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Train ▸/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem('🦖 GIGA drone at the secret runway',()=>gigaGo()));return L;};}
{const d0=dangerItems;dangerItems=function(){const L=d0();L.splice(L.length-2,0,mItem(()=>'😠 Revenge (hunt whoever blew you up): '+(ASSIST.revenge?'ON':'off'),()=>{ASSIST.revenge=!ASSIST.revenge;LS.set('asRev',ASSIST.revenge);}),mItem(()=>'🛡 My own rockets can\'t hurt me: '+(DZ.selfSafe?'ON':'off'),()=>{DZ.selfSafe=!DZ.selfSafe;LS.set('dzSelfSafe',DZ.selfSafe);}));return L;};}
const MEGA_SPEC={"name":"MEGA Smasher","size":0.12,"motor":4,"rotors":4,"mah":8000,"bat":"LiPo","guards":false,"assist":true,"cam":"front","fpvUp":15,"colors":{"body":"#1c1c1e","arms":"#555555","props":"#ff2d55","leds":"#ff3030"},"flyAs":"auto","waterproof":false,"wires":[["pmvsb7dqlf47i","pmvsb62ubb5zj"],["pmvsb7dqlf47i","pmvsb731mc1ai"],["pmvsb7dqlf47i","pmvsb731nd1dz"],["pmvsb7dqlf47i","pmvsb731ne39e"],["pmvsb7dqlf47i","pmvsb3e3x036c"],["pmvsb7dqlf47i","pmvsb3r1547gg"],["pmvsb7dqlf47i","pmvsb4hi454qy"],["pmvsb7dqlf47i","pmvsb4hi4639a"],["pmvsb7dqlf47i","pmvsb5rer75ii"],["pmvsb7dqlf47i","pmvsb7j17g63i"],["pmvsb7dqlf47i","pmvsb7x8mh53a"],["pmvsb7dqlf47i","pmvsb86a5i3sh"],["pmvsb7dqlf47i","pmvsba4tsj2sh"],["pmvsb7dqlf47i","pmvsb62ubb5zjlo"],["pmvsb7dqlf47i","pmvsb731mc1ailo"],["pmvsb7dqlf47i","pmvsb731nd1dzlo"],["pmvsb7dqlf47i","pmvsb731ne39elo"]],"parts":[{"t":"body","x":0,"y":0,"h":0,"a":0,"rx":0,"rz":0,"len":147.64,"w":84.37,"d":4,"r":6,"pow":5,"col":"#1c1c1e","bt":"LiPo","blades":2,"mode":"solid","style":"box","mat":"solid","sc":1,"sq":6,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb3e3x036c"},{"t":"arm","x":4.9,"y":-4.9,"h":0,"a":45,"rx":0,"rz":0,"len":386.2,"w":21.547,"d":4,"r":6,"pow":5,"col":"#3a3a3c","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"metal","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb3r1547gg"},{"t":"arm","x":1.62,"y":6.51,"h":0,"a":135,"rx":0,"rz":0,"len":386.2,"w":21.547,"d":4,"r":6,"pow":5,"col":"#3a3a3c","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"metal","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb4hi454qy"},{"t":"arm","x":-6.51,"y":-1.62,"h":0,"a":315,"rx":0,"rz":0,"len":386.2,"w":21.547,"d":4,"r":6,"pow":5,"col":"#3a3a3c","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"metal","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb4hi4639a"},{"t":"arm","x":3.29,"y":8.18,"h":0,"a":225,"rx":0,"rz":0,"len":386.2,"w":21.547,"d":4,"r":6,"pow":5,"col":"#3a3a3c","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"metal","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb5rer75ii"},{"t":"motor","x":-258.87,"y":277.09,"h":6.49,"a":0,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb62ubb5zj"},{"t":"motor","x":-277.09,"y":-258.87,"h":6.49,"a":90,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731mc1ai"},{"t":"motor","x":258.87,"y":-277.09,"h":6.49,"a":180,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731nd1dz"},{"t":"motor","x":277.09,"y":258.87,"h":6.49,"a":270,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731ne39e"},{"t":"board","x":1.68,"y":1.68,"h":27.03,"a":0,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":6,"pow":5,"col":"#8a2be2","bt":"LiPo","blades":2,"mode":"solid","style":"any","mat":"solid","sc":1,"sq":2.253,"sx":2.253,"sz":2.253,"mid":"","nm":"","id":"pmvsb7dqlf47i"},{"t":"gps","x":3.41,"y":-1.68,"h":25.34,"a":0,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":6,"pow":5,"col":"#9aa0a6","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":2.253,"sx":2.253,"sz":2.253,"mid":"","nm":"","id":"pmvsb7j17g63i"},{"t":"antenna","x":6.74,"y":1.68,"h":26.3,"a":0,"rx":0,"rz":0,"len":10,"w":4,"d":4,"r":6,"pow":5,"col":"#222222","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb7x8mh53a"},{"t":"rx","x":-6.74,"y":0.0,"h":27.03,"a":0,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":6,"pow":5,"col":"#9aa0a6","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":2.253,"sx":2.253,"sz":2.253,"mid":"","nm":"","id":"pmvsb86a5i3sh"},{"t":"battery","x":0.5,"y":0.5,"h":4.5,"a":0,"rx":0,"rz":0,"len":160.0,"w":96.0,"d":4,"r":6,"pow":5,"col":"#9aa0a6","bt":"LiPo","blades":2,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsba4tsj2sh"},{"t":"motor","x":-258.87,"y":277.09,"h":-10,"a":0,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb62ubb5zjlo"},{"t":"motor","x":-277.09,"y":-258.87,"h":-10,"a":90,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731mc1ailo"},{"t":"motor","x":258.87,"y":-277.09,"h":-10,"a":180,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731nd1dzlo"},{"t":"motor","x":277.09,"y":258.87,"h":-10,"a":270,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":195.0,"pow":50.0,"col":"#ff2d55","bt":"LiPo","blades":5,"mode":"solid","style":"gimbal","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731ne39elo"},{"t":"guard","x":-258.87,"y":277.09,"h":6.49,"a":0,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":200,"pow":5,"col":"#ffd60a","bt":"LiPo","blades":2,"mode":"solid","style":"ring","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb62ubb5zjg"},{"t":"guard","x":-277.09,"y":-258.87,"h":6.49,"a":90,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":200,"pow":5,"col":"#ffd60a","bt":"LiPo","blades":2,"mode":"solid","style":"ring","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731mc1aig"},{"t":"guard","x":258.87,"y":-277.09,"h":6.49,"a":180,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":200,"pow":5,"col":"#ffd60a","bt":"LiPo","blades":2,"mode":"solid","style":"ring","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731nd1dzg"},{"t":"guard","x":277.09,"y":258.87,"h":6.49,"a":270,"rx":0,"rz":0,"len":6,"w":2,"d":4,"r":200,"pow":5,"col":"#ffd60a","bt":"LiPo","blades":2,"mode":"solid","style":"ring","mat":"solid","sc":1,"sq":1,"sx":1,"sz":1,"mid":"","nm":"","id":"pmvsb731ne39eg"}]};

{const u0=updateCam;updateCam=function(){const r=u0.apply(this,arguments);try{if(ST.giga&&!WALK.on&&camName()==='CHASE'){const p=D.pos;cam.position.y=Math.max(cam.position.y,p.y+ST.rad*0.45);cam.lookAt(p);}}catch(e){}return r;};}
