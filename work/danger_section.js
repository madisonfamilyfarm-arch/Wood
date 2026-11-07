// ================================================================ 💥 DANGER MODE: rockets any time (even walking), blow up anyone (players, AI pilots, campers), falling trees squash people, everyone respawns
const DZ={on:LS.get('dzOn',true),ai:LS.get('dzAi',true),rk:[],trees:[],dead:0,kills:LS.get('dzKills',0),deaths:LS.get('dzDeaths',0),bn:null,bi:null};
function dzSet(on,net){DZ.on=!!on;LS.set('dzOn',DZ.on);if(!net)mpSend({t:'dz',op:'set',on:DZ.on});toast(DZ.on?'💥 Danger mode ON — rockets any time, falling trees squash you, everyone respawns':'🕊️ Danger mode off',2600);}
MPH.dz=function(m,pe){if(m.op==='set'){if(!!m.on!==DZ.on)dzSet(m.on,true);}
  else if(m.op==='kill'){if(m.txt)chatSys(m.txt);if(m.by===mp.id){DZ.kills++;LS.set('dzKills',DZ.kills);toast('💥 You got '+(m.who||'them')+'! ('+DZ.kills+' total)',2000);beep(1200,0.12,0.06);}}};
{const b0=MPH.boom;MPH.boom=function(m,pe){DZ.bn=m.bn||null;DZ.bi=m.bi||null;try{return b0.apply(this,arguments);}finally{DZ.bn=null;DZ.bi=null;}};}
// rockets are always in the weapon list (PHOTO button / G cycles to them)
{const w0=weaponTypes;weaponTypes=function(){const T=w0();if(DZ.on&&!T.includes('rocket')&&!(BATTLE.on&&BATTLE.mode==='paint'))T.push('rocket');return T;};}
// fire rockets while walking too
{const f0=fire;fire=function(){if(typeof WALK!=='undefined'&&WALK.on&&curWeapon()==='rocket'){if(DZ.dead)return;const now=performance.now();if(now-(fire.last||0)<650)return;fire.last=now;
    const o=cam.position.clone();o.y-=0.2;const dir=aimDir(o);o.addScaledVector(dir,0.9);const v=dir.clone().multiplyScalar(clamp(WPN.rspd,5,120)),sid=mp.id+'.'+(++shotN);
    spawnShot('rocket',o,v,0xffffff,true,sid,mp.id);mpSend({t:'shot',w:'rocket',p:o.toArray().map(r2),v:v.toArray().map(r2),col:0xffffff,sid});beep(300,0.25,0.07);beep(90,0.3,0.05);shake=Math.max(shake,0.12);return;}
  return f0.apply(this,arguments);};}
// red flash when you die
function dzFlash(){let el=$('dzFlash');if(!el){el=document.createElement('div');el.id='dzFlash';el.style.cssText='position:fixed;inset:0;z-index:60;pointer-events:none;background:radial-gradient(circle,rgba(255,0,0,0.15),rgba(160,0,0,0.75));opacity:0;transition:opacity 0.4s;display:flex;align-items:center;justify-content:center;font:900 44px system-ui;color:#fff;text-shadow:0 3px 12px #000';document.body.appendChild(el);}
  el.textContent='💀';el.style.opacity='1';setTimeout(()=>el.style.opacity='0',1600);}
function dzMe(){return WALK.on?WALK.pos.clone().add(new V3(0,0.9,0)):(DR?D.pos.clone():null);}
function dzDie(txt,byId,byName){if(DZ.dead||D.shield>performance.now())return;DZ.dead=performance.now()+15000;DZ.deaths++;LS.set('dzDeaths',DZ.deaths);dzFlash();beep(140,0.5,0.15);beep(90,0.7,0.12);shake=Math.max(shake,0.8);
  if(!WALK.on&&DR&&D.state!=='down'&&D.state!=='tumble'){try{breakApart(txt);}catch(e){}}
  toast('💀 '+txt+' Respawning in 15 s…',3200);const line='💀 '+CFG.name+': '+txt.replace(/!$/,'');chatSys(line);mpSend({t:'dz',op:'kill',who:CFG.name,by:byId||'',txt:line});}
function dzRespawn(){DZ.dead=0;if(WALK.on){const a=Math.random()*6.28;WALK.pos.set(PAD.x+Math.cos(a)*5,0,PAD.z+Math.sin(a)*5);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);WALK.vy=0;if(typeof HURT!=='undefined')HURT.leg=false;}
  else{try{quickFix(true);}catch(e){}resetDrone();}
  D.shield=performance.now()+3000;toast('✨ You respawned! (3 s shield)',1800);beep(700,0.1,0.05);setTimeout(()=>beep(1000,0.15,0.05),120);}
function dzBotDie(B,txt){if(B.dead)return;B.dead=performance.now()+(B.outLong?600000:120000);B.outLong=0;mpDrop(B.id,false);chatSys(txt);mpSend({t:'dz',op:'kill',who:B.name,by:'',txt:''});}
function dzCampDie(C,txt){if(C.dead||!C.g.visible)return;C.dead=performance.now()+6000;C.g.visible=false;C.tgt=null;chatSys(txt);puff(new V3(C.x,H(C.x,C.z)+1,C.z),0x555555,0.4,2);}
// every explosion (yours, a friend's on the other computer, an AI's) can blow people up
{const e0=explode;explode=function(p,r,dr,own,byName,byId){if(DZ.bn){byName=DZ.bn;byId=DZ.bi||byId;}if(!DZ.on)return e0.apply(this,arguments);
  dr=Math.max(dr||0,2.5);const R=Math.max(0.5,r||4),wd=WPN.dmg;WPN.dmg=true;let res;try{res=e0.call(this,p,r,dr,own,byName,byId);}finally{WPN.dmg=wd;}
  const who=byId===mp.id?'your own rocket':(byName||'someone')+'\'s rocket',by=byName||'Someone';
  const me=dzMe();if(me&&me.distanceTo(p)<(WALK.on?R*0.8+0.8:R))dzDie('Blown up by '+who+'!',byId,byName);
  for(const B of AIB.L)if(!B.dead&&B.id!==byId&&B.p.distanceTo(p)<R*0.8+0.8)dzBotDie(B,'💥 '+by+' blew up '+B.name);
  for(const C of CAMPERS.L)if(!C.dead&&Math.hypot(C.x-p.x,C.z-p.z)<R*0.7+0.7&&p.y-H(C.x,C.z)<R+2)dzCampDie(C,'💥 '+by+' blew up camper '+C.name);
  return res;};}
// trees knocked down by blasts (and burnt trees that topple) squash whoever is under them
{const t0=fallingTree;fallingTree=function(t,c){const r=t0.apply(this,arguments);if(DZ.on){const a=new V3(t.x-c.x,0,t.z-c.z);if(a.lengthSq()<0.01)a.set(1,0,0);a.normalize();DZ.trees.push({x:t.x,z:t.z,dx:a.x,dz:a.z,h:Math.max(4,t.h||8),t:0,t0:performance.now(),done:false});if(DZ.trees.length>60)DZ.trees.shift();}return r;};}
function dzUnder(T,px,py,pz){const rx=px-T.x,rz=pz-T.z,s=rx*T.dx+rz*T.dz;if(s<0.6||s>T.h)return false;const ex=rx-T.dx*s,ez=rz-T.dz*s;return Math.hypot(ex,ez)<1.4&&py-H(px,pz)<3.5;}
{const b0=fireBurnTree;fireBurnTree=function(t){const was=t.burnt,r=b0.apply(this,arguments);
  if(!was&&DZ.on){const hsh=Math.abs(Math.sin(t.x*12.9898+t.z*78.233)*43758.5453)%1;if(hsh<0.5)setTimeout(()=>{if(!DZ.on)return;const a=hsh*40;addCrater({x:+(t.x-Math.cos(a)*0.4).toFixed(2),z:+(t.z-Math.sin(a)*0.4).toFixed(2),r:0.7},true);chatSys('🌲 A burnt tree came crashing down!');},8000+hsh*20000);}return r;};}
// 🤖 AI pilots shoot rockets too
const DZG=(function(){const g=new THREE.CylinderGeometry(0.06,0.06,0.55,8);g.rotateX(Math.PI/2);return g;})(),DZM=new THREE.MeshLambertMaterial({color:0x333333}),DZN=new THREE.MeshBasicMaterial({color:0xffa030});
function dzBotFire(B,tg){if(B.kind==='sub')return;const o=B.p.clone();o.y+=1;const dir=tg.clone().sub(o).normalize();o.addScaledVector(dir,1.3);const m=new THREE.Group();m.add(new THREE.Mesh(DZG,DZM));const f=new THREE.Mesh(GEO.ball,DZN);f.scale.setScalar(0.09);f.position.z=0.35;m.add(f);
  m.position.copy(o);m.lookAt(o.clone().add(dir));scene.add(m);DZ.rk.push({m,v:dir.multiplyScalar(28),life:4,age:0,by:B.id,n:B.name,prev:o.clone(),puff:0});beep(260,0.2,0.04);
  if(Math.random()<0.35)chatAdd(B.name,['🚀 Incoming!','Boom time!','Gotcha!','Rocket away!'][Math.floor(Math.random()*4)],AI_COLS[B.i]);}
function dzBotsShoot(dt){if(!DZ.on||!DZ.ai||!AIB.L.length)return;const now=performance.now();
  for(const B of AIB.L){if(B.dead)continue;B.rkT=(B.rkT==null?6+Math.random()*10:B.rkT)-dt;if(B.rkT>0)continue;B.rkT=8+Math.random()*12;
    const T=[];const me=dzMe();if(me&&!DZ.dead&&!(D.shield>now))T.push(me);
    for(const id in mp.peers){const pe=mp.peers[id];if(id===B.id||pe.hd||!pe.p)continue;T.push(pe.wk?new V3(pe.wk[0],pe.wk[1]+0.9,pe.wk[2]):pe.p.clone());}
    for(const C of CAMPERS.L)if(!C.dead&&C.g.visible)T.push(new V3(C.x,H(C.x,C.z)+0.9,C.z));
    const near=T.filter(p=>{const d=p.distanceTo(B.p);return d>4&&d<70;});if(near.length)dzBotFire(B,near[Math.floor(Math.random()*near.length)]);}}
function dzRockets(dt){for(let i=DZ.rk.length-1;i>=0;i--){const s=DZ.rk[i];s.prev.copy(s.m.position);s.v.y-=1.5*dt;s.m.position.addScaledVector(s.v,dt);s.m.lookAt(_p.copy(s.m.position).add(s.v));s.life-=dt;s.age=(s.age||0)+dt;
    s.puff-=dt;if(s.puff<=0){s.puff=0.05;puff(s.m.position,0xcfcfcf,0.12,1.4);}
    const P=s.m.position;let boom=false;const me=dzMe();
    if(me&&segSphere(s.prev,P,me,WALK.on?1:1.2))boom=true;
    if(!boom)for(const id in mp.peers){const pe=mp.peers[id];if(id===s.by||pe.hd||!pe.p)continue;const q=pe.wk?new V3(pe.wk[0],pe.wk[1]+0.9,pe.wk[2]):pe.p;if(segSphere(s.prev,P,q,(pe.rad||0.5)+0.6)){boom=true;break;}}
    if(!boom)for(const C of CAMPERS.L)if(!C.dead&&C.g.visible&&segSphere(s.prev,P,new V3(C.x,H(C.x,C.z)+0.9,C.z),1)){boom=true;break;}
    if(!boom&&s.age>0.25&&(P.y<H(P.x,P.z)||hitTest(P,0.05)||objHitTest(P)||s.life<=0||inWater(P.x,P.z)&&P.y<WATER_Y))boom=true;
    if(boom){scene.remove(s.m);DZ.rk.splice(i,1);const p=P.clone();explode(p,4,2.5,false,s.n,s.by);mpSend({t:'boom',p:p.toArray().map(r2),r:4,dr:2.5,sid:'',bn:s.n,bi:s.by});}}}
// per frame: deaths/respawns, falling-tree squashes, AI rockets
function dzTick(dt){
  const NOW=performance.now();if(DZ.dead&&NOW>DZ.dead)dzRespawn();
  for(const T of DZ.trees){T.t=(NOW-T.t0)/1000;if(T.done||T.t<0.85)continue;T.done=true;
    const me=dzMe();if(me&&dzUnder(T,me.x,me.y,me.z))dzDie('Squashed by a falling tree!','','');
    for(const B of AIB.L)if(!B.dead&&dzUnder(T,B.p.x,B.p.y,B.p.z))dzBotDie(B,'🌲 A tree fell on '+B.name+'!');
    for(const C of CAMPERS.L)if(!C.dead&&C.g.visible&&dzUnder(T,C.x,H(C.x,C.z)+0.5,C.z))dzCampDie(C,'🌲 A tree fell on camper '+C.name+'!');}
  DZ.trees=DZ.trees.filter(T=>T.t<3);
  for(const C of CAMPERS.L)if(C.dead){if(NOW>C.dead){C.dead=0;C.x=C.hx;C.z=C.hz;C.g.visible=true;chatSys('🧑‍🚒 '+C.name+' is back at camp');}}
  dzBotsShoot(dt);dzRockets(dt);}
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{dzTick(dt);}catch(e){console.warn('dz',e);}return r;};}
// dead AI pilots sit out, then come back
{const a0=aiTick;aiTick=function(dt){const all=AIB.L;if(!all.some(B=>B.dead))return a0.apply(this,arguments);
  const NOW=performance.now();all.forEach(B=>{if(!B.dead)return;if(NOW>B.dead){B.dead=0;if(!B.kind||B.kind==='drone'||B.kind==='heli'){const a=Math.random()*6.28;B.p.set(PAD.x+Math.cos(a)*14,0,PAD.z+Math.sin(a)*14);B.p.y=H(B.p.x,B.p.z)+0.2;B.mode='takeoff';}
      B.v.set(0,0,0);B.goal=null;B.rkT=8;mpRecv({id:B.id,n:B.name,t:'sp',spec:aiSpec(B.i),rad:0.5,col:AI_COLS[B.i]});chatSys(B.name+' respawned');}});
  AIB.L=all.filter(B=>!B.dead);try{return a0.apply(this,arguments);}finally{AIB.L=all;}};}
// dead campers don't walk around
{const c0=campersTick;campersTick=function(dt){const all=CAMPERS.L;if(!all.some(C=>C.dead))return c0.apply(this,arguments);CAMPERS.L=all.filter(C=>!C.dead);try{return c0.apply(this,arguments);}finally{CAMPERS.L=all;}};}
// frozen while dead
{const w0=tickWalk;tickWalk=function(dt){if(DZ.dead&&WALK.on)return;return w0.apply(this,arguments);};}
// menu
function dangerItems(){return[mInfo('Rockets work any time — flying, driving or walking. Switch to 🚀 with the PHOTO-mode button (or G), then FIRE. Blow up friends on the other computer, AI pilots and campers. Knocked-down trees squash whoever is under them. Everyone (you too) respawns after 3 s.'),
  mItem(()=>'💥 Danger mode: '+(DZ.on?'ON':'off')+' (everyone in multiplayer)',()=>dzSet(!DZ.on)),
  mItem(()=>'🤖 AI pilots shoot rockets too: '+(DZ.ai?'ON':'off'),()=>{DZ.ai=!DZ.ai;LS.set('dzAi',DZ.ai);}),
  mItem('🚀 Get rockets now',()=>{if(!DZ.on)dzSet(true);shotMode='gun';const T=weaponTypes();wCur=Math.max(0,T.indexOf('rocket'));updBadge();menuToggle(false);toast('🚀 Rockets ready — hit FIRE',1800);}),
  mInfo(()=>'Your score: 💥 '+DZ.kills+' blown up · 💀 '+DZ.deaths+' deaths'),
  mItem('🔄 Reset score',()=>{DZ.kills=0;DZ.deaths=0;LS.set('dzKills',0);LS.set('dzDeaths',0);})];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Races & games/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem(()=>'💥 Danger mode — rockets, blow anyone up: '+(DZ.on?'ON':'off')+' ▸',()=>menuPush('💥 Danger mode',dangerItems())));return L;};}
{const b0=battleItems;battleItems=function(){const L=b0();L.splice(1,0,mItem(()=>'💥 Danger mode (any time, no timer): '+(DZ.on?'ON':'off')+' ▸',()=>menuPush('💥 Danger mode',dangerItems())));return L;};}
