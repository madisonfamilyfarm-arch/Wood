// ================================================================ 🔥 FIRES: turn wildfires on, they grow and spread through the woods — scoop water from the lake/pond
// (fly low over it) or fill up on the helipad, then fly over the fire and hold 💧 DROP (Z key / button) to put it out.
const FIRE={set:Object.assign({spread:2,catch:1.5,grow:1.5,max:40,tank:3},LS.get('fireSet',{})),hot:new Map(),shot:false,on:false,own:false,L:[],t:0,spawnT:20,max:28,g:null,tex:null,smk:null,drops:[],tank:LS.get('fireTank',1),held:false,btn:false,act:false,smoke:[],burnt:[]};
function fireTex(){if(FIRE.tex)return;const mk=(f)=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');f(x);return new THREE.CanvasTexture(c);};
  FIRE.tex=mk(x=>{const g=x.createRadialGradient(32,40,2,32,36,30);g.addColorStop(0,'rgba(255,255,210,1)');g.addColorStop(0.25,'rgba(255,210,60,0.95)');g.addColorStop(0.55,'rgba(255,100,10,0.75)');g.addColorStop(1,'rgba(200,30,0,0)');x.fillStyle=g;x.beginPath();x.ellipse(32,36,24,30,0,0,7);x.fill();});
  FIRE.smk=mk(x=>{const g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(90,90,90,0.8)');g.addColorStop(1,'rgba(60,60,60,0)');x.fillStyle=g;x.fillRect(0,0,64,64);});
  FIRE.g=new THREE.Group();scene.add(FIRE.g);}
function fireOK(x,z){if(typeof CES!=='undefined'&&CES.on)return true;if(inWater(x,z))return false;if(typeof lakeE==='function'&&lakeE(x,z)<1.15)return false;if(typeof fldBlocked==='function'&&fldBlocked(x,z))return false;return Math.hypot(x-PAD.x,z-PAD.z)>8;}
function fireAdd(f,fromNet){fireTex();if(FIRE.L.some(o=>o.id===f.id)||FIRE.L.length>=FIRE.max+6)return null;const gy=H(f.x,f.z),g=new THREE.Group();g.position.set(f.x,gy,f.z);
  const fl=[];for(let k=0;k<10;k++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:FIRE.tex,transparent:true,depthWrite:false,opacity:0.85,fog:true}));s.userData.ph=Math.random()*6.28;s.userData.ox=(Math.random()-0.5)*f.r*1.4;s.userData.oz=(Math.random()-0.5)*f.r*1.4;g.add(s);fl.push(s);}
  const glow=new THREE.Mesh(new THREE.CircleGeometry(f.r*1.6,20),new THREE.MeshBasicMaterial({color:0xff6a00,transparent:true,opacity:0.35,depthWrite:false}));glow.rotation.x=-Math.PI/2;glow.position.y=0.06;g.add(glow);
  FIRE.g.add(g);const F=Object.assign({int:0.25,grow:0},f,{g,fl,glow,gy,spT:(6+Math.random()*8)/FIRE.set.spread});if(f.tree){const T=fireTreeAt(f.x,f.z);if(T)fireBurnTree(T);}FIRE.L.push(F);if(!fromNet)mpSend({t:'fire',op:'add',f:{id:f.id,x:+f.x.toFixed(1),z:+f.z.toFixed(1),r:f.r,int:F.int,tree:f.tree||0}});fireHud();return F;}
function fireDel(F,why,fromNet){const i=FIRE.L.indexOf(F);if(i<0)return;FIRE.L.splice(i,1);FIRE.g.remove(F.g);
  // a burnt patch stays for a while
  const b=new THREE.Mesh(new THREE.CircleGeometry(F.r*1.5,18),new THREE.MeshBasicMaterial({color:0x1a1410,transparent:true,opacity:0.7,depthWrite:false}));b.rotation.x=-Math.PI/2;b.position.set(F.x,F.gy+0.05,F.z);FIRE.g.add(b);FIRE.burnt.push({m:b,t:0});
  for(let k=0;k<12;k++)fireSmoke(F.x,F.gy+1,F.z,1.4,true);
  if(why==='water'){award('🚒 Fire out!',10);beep(500,0.2,0.05);if(!FIRE.L.length){setTimeout(()=>award('🏆 ALL fires out — the woods are safe!',40),600);toast('🏆 You put out every fire!',3000);}}
  if(!fromNet)mpSend({t:'fire',op:'del',id:F.id});fireHud();}
function fireStart(x,z,big){const n=big?5:1;for(let k=0;k<n;k++){const a=Math.random()*6.28,d=k?4+Math.random()*10:0,px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(!fireOK(px,pz))continue;fireAdd({id:mp.id+'f'+Date.now().toString(36)+k,x:px,z:pz,r:1.8+Math.random()*1.4});}}
function fireSmoke(x,y,z,s,puff){if(FIRE.smoke.length>160)return;const m=new THREE.Sprite(new THREE.SpriteMaterial({map:FIRE.smk,transparent:true,depthWrite:false,opacity:puff?0.7:0.55,fog:true}));m.position.set(x+(Math.random()-0.5)*s,y,z+(Math.random()-0.5)*s);m.scale.setScalar(s*(puff?1.6:1));FIRE.g.add(m);
  FIRE.smoke.push({m,t:0,life:puff?2.5:5+Math.random()*3,v:new V3((Math.random()-0.5)*0.4+wind.x*0.3,puff?3:1.6+Math.random()*1.2,(Math.random()-0.5)*0.4+wind.z*0.3),s});}
// water: scoop it up, carry it, drop it
function fireCanCarry(){const k=vkind();return k==='drone'||k==='heli'||k==='plane';}
function fireDrop(dt){if(FIRE.tank<=0){if(!fireDrop.e){fireDrop.e=1;toast('💧 Tank empty — fly low over the lake or pond to scoop more (or land on the helipad)',2600);setTimeout(()=>fireDrop.e=0,3000);}return;}
  FIRE.tank=Math.max(0,FIRE.tank-dt/FIRE.set.tank);const n=Math.ceil(dt*70);for(let k=0;k<n;k++){if(FIRE.drops.length>260)break;const m=new THREE.Mesh(FIRE.dg||(FIRE.dg=new THREE.SphereGeometry(0.07,5,4)),FIRE.dm||(FIRE.dm=new THREE.MeshBasicMaterial({color:0x9fdcff,transparent:true,opacity:0.75})));
    m.position.set(D.pos.x+(Math.random()-0.5)*0.5,D.pos.y-0.25,D.pos.z+(Math.random()-0.5)*0.5);scene.add(m);FIRE.drops.push({m,v:new V3(D.vel.x*0.9+(Math.random()-0.5)*1.4,Math.min(0,D.vel.y)-1-Math.random(),D.vel.z*0.9+(Math.random()-0.5)*1.4)});}}
function fireHud(){let c=$('cFire');const show=FIRE.on||FIRE.L.length>0;if(!c){c=document.createElement('span');c.className='chip';c.id='cFire';c.onclick=e=>{e.stopPropagation();if(!menu.open)menuToggle(true);menuPush('🔥 Fires',fireItems());};const b=$('cBat');if(b&&b.parentNode)b.parentNode.insertBefore(c,b.nextSibling);else document.body.appendChild(c);}
  c.style.display=show?'':'none';if(!show)return;let near=1e9;FIRE.L.forEach(F=>{near=Math.min(near,Math.hypot(F.x-D.pos.x,F.z-D.pos.z));});
  c.textContent='🔥'+FIRE.L.length+(FIRE.L.length?' · '+Math.round(near)+'m':'')+' · 💧'+Math.round(FIRE.tank*100)+'%';
  let b=$('dropB');if(!b){b=document.createElement('button');b.id='dropB';b.className='btn';b.textContent='💧 DROP';b.style.cssText='position:fixed;right:24px;bottom:300px;z-index:12;font:900 16px system-ui,sans-serif;padding:12px 14px;border-radius:14px;background:rgba(10,132,255,0.9);color:#fff;border:2px solid #9fdcff;touch-action:none;display:none';
    const up=()=>{FIRE.btn=false;};b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();FIRE.btn=true;};b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up;document.body.appendChild(b);}
  b.style.display=show&&fireCanCarry()&&started&&!menu.open&&!WS.open?'block':'none';}
const _fv=new V3();
function fireTick(dt){if(!FIRE.g&&!FIRE.on)return;fireTex();const t=performance.now()/1000;FIRE.t+=dt;
  // wildfires start by themselves (only the player who turned them on makes new ones — everyone sees them)
  if(FIRE.on&&FIRE.own){FIRE.spawnT-=dt;if(FIRE.spawnT<=0){FIRE.spawnT=(50+Math.random()*60)/FIRE.set.spread;if(FIRE.L.length<FIRE.set.max){const a=Math.random()*6.28,d=70+Math.random()*200;const x=D.pos.x+Math.cos(a)*d,z=D.pos.z+Math.sin(a)*d;if(fireOK(x,z)){fireStart(x,z,false);toast('🔥 A new wildfire started '+Math.round(d)+' m away! Look for the smoke',3000);}}}}
  for(const F of [...FIRE.L]){F.int=Math.min(1,F.int+dt*0.025*FIRE.set.grow);
    if(FIRE.own&&F.int>0.5){F.spT-=dt;if(F.spT<=0){F.spT=(9+Math.random()*10)/FIRE.set.spread;if(FIRE.L.length<FIRE.set.max){const a=Math.random()*6.28,d=5+Math.random()*7,x=F.x+Math.cos(a)*d,z=F.z+Math.sin(a)*d;if(fireOK(x,z)&&!FIRE.L.some(o=>Math.hypot(o.x-x,o.z-z)<3))fireAdd({id:mp.id+'f'+Date.now().toString(36),x,z,r:1.2+Math.random()*1.3});}}}
    const h=F.tree?2+F.int*F.tree*0.8:1.5+F.int*4.2,base=F.tree?F.tree*0.3:0;F.fl.forEach((s,k)=>{const fl=0.75+0.25*Math.sin(t*9+s.userData.ph)+0.1*Math.sin(t*23+k);s.position.set(s.userData.ox,base+h*0.45*fl,s.userData.oz);s.scale.set(F.r*1.5*(0.6+F.int*0.6),h*fl,1);});
    F.glow.material.opacity=0.2+0.2*F.int+0.05*Math.sin(t*7);if(Math.random()<dt*(2+F.int*5))fireSmoke(F.x,F.gy+base+h,F.z,1+F.int*1.5);if(FIRE.own)fireHeatTrees(F,dt);
    // hot! flying through flames hurts
    if((D.state==='flying'||WALK.on)&&D.pos.y-F.gy<base+h*0.8&&Math.hypot(D.pos.x-F.x,D.pos.z-F.z)<F.r*0.8&&!WALK.on){shake=Math.max(shake,0.3);D.vel.y+=dt*6;if(Math.random()<dt*0.8){impact(8,'the flames');}}}
  for(let i=FIRE.smoke.length-1;i>=0;i--){const S=FIRE.smoke[i];S.t+=dt;S.m.position.addScaledVector(S.v,dt);S.m.scale.setScalar(S.s*(1+S.t*0.9));S.m.material.opacity=Math.max(0,(S.t<0.5?S.t*1.2:0.6)*(1-S.t/S.life));if(S.t>S.life){FIRE.g.remove(S.m);S.m.material.dispose();FIRE.smoke.splice(i,1);}}
  for(let i=FIRE.burnt.length-1;i>=0;i--){const B=FIRE.burnt[i];B.t+=dt;if(B.t>90){B.m.material.opacity-=dt*0.1;if(B.m.material.opacity<=0){FIRE.g.remove(B.m);FIRE.burnt.splice(i,1);}}}
  // scoop water: low over the lake / a pond, or sitting on the helipad
  const fly=D.state==='flying'&&fireCanCarry();
  if(fly&&inWater(D.pos.x,D.pos.z)&&D.pos.y<WATER_Y+1.6&&FIRE.tank<1){FIRE.tank=Math.min(1,FIRE.tank+dt*0.4*3/FIRE.set.tank);if(Math.random()<dt*20)fireSplash(D.pos.x,WATER_Y,D.pos.z);if(!fireTick.sc){fireTick.sc=1;toast('💧 Scooping water…',1200);setTimeout(()=>fireTick.sc=0,2500);}}
  if(D.state==='landed'&&Math.hypot(D.pos.x-PAD.x,D.pos.z-PAD.z)<3&&FIRE.tank<1)FIRE.tank=Math.min(1,FIRE.tank+dt*0.5*3/FIRE.set.tank);
  FIRE.held=FIRE.btn||FIRE.act||FIRE.shot||!!keys.KeyZ;fireHotTick(dt);if(FIRE.held&&fly)fireDrop(dt);
  // falling water
  for(let i=FIRE.drops.length-1;i>=0;i--){const W=FIRE.drops[i],p=W.m.position;W.v.y-=9.8*dt;p.addScaledVector(W.v,dt);const gy=H(p.x,p.z);
    if(p.y<=gy+0.05){for(const F of [...FIRE.L]){if(Math.hypot(p.x-F.x,p.z-F.z)<F.r+1.6){F.int-=0.03;if(F.int<=0)fireDel(F,'water');else mpSendFireHit(F);break;}}fireSplash(p.x,gy,p.z);scene.remove(W.m);FIRE.drops.splice(i,1);}}
  FIRE.hudT=(FIRE.hudT||0)-dt;if(FIRE.hudT<=0){FIRE.hudT=0.25;fireHud();LS.set('fireSet',FIRE.set);LS.set('fireTank',+FIRE.tank.toFixed(2));}}
function fireSplash(x,y,z){if(FIRE.smoke.length>160||Math.random()<0.6)return;const m=new THREE.Sprite(new THREE.SpriteMaterial({color:0xd8f2ff,transparent:true,opacity:0.6,depthWrite:false}));m.position.set(x,y+0.15,z);m.scale.setScalar(0.25);FIRE.g&&FIRE.g.add(m);FIRE.smoke.push({m,t:0,life:0.5,v:new V3((Math.random()-0.5),1.2,(Math.random()-0.5)),s:0.25});}
function mpSendFireHit(F){F.hitAcc=(F.hitAcc||0)+0.02;const now=performance.now();if(now-(F.hitT||0)>300){F.hitT=now;mpSend({t:'fire',op:'hit',id:F.id,amt:+F.hitAcc.toFixed(3)});F.hitAcc=0;}}
{const r0=mpRecv;mpRecv=function(m){const r=r0.apply(this,arguments);if(m&&m.t==='fire'&&m.id!==mp.id){try{
    if(m.op==='add'&&m.f)fireAdd(m.f,true);
    if(m.op==='del'){const F=FIRE.L.find(o=>o.id===m.fid);if(F)fireDel(F,'net',true);}
    if(m.op==='hit'){const F=FIRE.L.find(o=>o.id===m.fid);if(F){F.int-=m.amt||0.02;if(F.int<=0)fireDel(F,'net',true);}}
    if(m.op==='on'){FIRE.on=!!m.on;fireHud();}}catch(e){}}return r;};}
// mp messages carry their own id (who sent it), so the fire id travels as fid
{const s0=mpSend;mpSend=function(m){if(m&&m.t==='fire'&&m.id&&!m.fid){m.fid=m.id;delete m.id;}return s0.apply(this,arguments);};}
function fireItems(){return[mInfo('🔥 Turn wildfires on, find the smoke, scoop water by flying low over the lake or a pond (or land on the helipad), then fly over the fire and hold 💧 DROP (or Z).'),
  mItem(()=>'🔥 Wildfires: '+(FIRE.on?'ON (they start and spread by themselves)':'off'),()=>{FIRE.on=!FIRE.on;FIRE.own=FIRE.on;FIRE.spawnT=FIRE.on?3:FIRE.spawnT;mpSend({t:'fire',op:'on',on:FIRE.on});fireHud();toast(FIRE.on?'🔥 Wildfires ON — watch for smoke!':'🔥 Wildfires off (fires already burning stay until you put them out)',2500);}),
  mItem('🔥 Start a fire in front of me',()=>{const s=WALK.on?WALK.pos:D.pos,y=WALK.on?WALK.yaw:D.yaw;fireStart(s.x-Math.sin(y)*14,s.z-Math.cos(y)*14,false);menuToggle(false);}),
  mItem('🌲🔥 Start a big forest fire',()=>{const a=Math.random()*6.28;fireStart(D.pos.x+Math.cos(a)*60,D.pos.z+Math.sin(a)*60,true);toast('🌲🔥 A forest fire started 60 m away — follow the smoke!',3000);menuToggle(false);}),
  mItem('🚿 Put every fire out (magic hose)',()=>{[...FIRE.L].forEach(F=>fireDel(F,'magic'));}),
  ...fireSetItems(),
  mItem(()=>'💧 Water tank: '+Math.round(FIRE.tank*100)+'% — fill it up now',()=>{FIRE.tank=1;fireHud();toast('💧 Tank full',1000);}),
  mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Put things down/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem(()=>'🔥 Fires + water drops'+(FIRE.L.length?' ('+FIRE.L.length+' burning)':'')+' ▸',()=>menuPush('🔥 Fires',fireItems())));return L;};}
ACTS.water={n:'💧 Drop water on fires (hold)',t:'mom'};ACT_ORDER.splice(1,0,'water');
{const d0=doAct;doAct=function(a,down){if(a==='water'){FIRE.act=down!==false;return;}return d0.apply(this,arguments);};}

// ---------------- 🌲 trees near a fire heat up, SMOKE, then catch fire (burn up the trunk into the leaves) and stay burnt black
function fireTreesNear(x,z,R){const out=[];const i0=Math.floor((x-R)/CH),i1=Math.floor((x+R)/CH),j0=Math.floor((z-R)/CH),j1=Math.floor((z+R)/CH);
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const ch=chunks.get(i+','+j)||chunks.get('sat:'+i+','+j);if(!ch||!ch.trees)continue;for(const t of ch.trees){const d=Math.hypot(t.x-x,t.z-z);if(d<R)out.push([t,d]);}}return out;}
function fireTreeAt(x,z){let b=null,bd=1.2;fireTreesNear(x,z,2).forEach(([t,d])=>{if(d<bd){bd=d;b=t;}});return b;}
function fireBurnTree(t){if(t.burnt)return;t.burnt=true;try{const c=new THREE.Color(0x24201a);if(t.im&&t.k!=null&&t.im.setColorAt){t.im.setColorAt(t.k,c);t.im.instanceColor.needsUpdate=true;}t.col=c;}catch(e){}}
function fireHeatTrees(F,dt){F.ht=(F.ht||0)-dt;if(F.ht>0)return;F.ht=0.5;if(FIRE.L.length>=FIRE.set.max)return;
  fireTreesNear(F.x,F.z,F.r+7).forEach(([t,d])=>{if(t.burnt||t.onFire)return;const k=0.5*FIRE.set.catch*F.int*(1-d/(F.r+7))*0.35;FIRE.hot.set(t,(FIRE.hot.get(t)||0)+k);
    if(FIRE.hot.get(t)>=1){FIRE.hot.delete(t);t.onFire=true;fireAdd({id:mp.id+'t'+Date.now().toString(36)+Math.floor(Math.random()*999),x:t.x,z:t.z,r:Math.max(1.6,(t.cr||2)*0.9),tree:+t.h.toFixed(1)});}});}
function fireHotTick(dt){for(const [t,h] of FIRE.hot){if(t.burnt||t.onFire){FIRE.hot.delete(t);continue;}FIRE.hot.set(t,Math.max(0,h-dt*0.02));if(h>0.2&&Math.random()<dt*(1+h*4))fireSmoke(t.x,t.y+t.h*(0.55+Math.random()*0.3),t.z,0.8+h,false);}}
function fireSetItems(){const S=FIRE.set,sv=()=>LS.set('fireSet',S);return[
  mRange('🔥 How fast fire spreads',()=>S.spread,v=>{S.spread=v;sv();},0.25,6,0.25,v=>(v<1?'slow ':v<3?'fast ':'CRAZY ')+v+'×'),
  mRange('🌲 How fast trees catch fire',()=>S.catch,v=>{S.catch=v;sv();},0.25,6,0.25,v=>(v<1?'slow ':v<3?'fast ':'instant-ish ')+v+'×'),
  mRange('📈 How fast fires grow',()=>S.grow,v=>{S.grow=v;sv();},0.25,5,0.25,v=>v+'×'),
  mRange('🔢 Most fires at once',()=>S.max,v=>{S.max=v;FIRE.max=v;sv();},5,80,5,v=>v+''),
  mRange('💧 Water tank size',()=>S.tank,v=>{S.tank=v;sv();},1,20,1,v=>v+' s of water')];}
{const f0=flightItems;flightItems=function(){const L=f0();L.splice(1,0,mRange('💧 Water tank size (for fires)',()=>FIRE.set.tank,v=>{FIRE.set.tank=v;LS.set('fireSet',FIRE.set);},1,20,1,v=>v+' s of water'));return L;};}
// ---------------- 📸 the PHOTO button does everything: photo → video → weapons (paintball…) → 💧 water drop → ⛏ dig
cycleShot=function(){const T=weaponTypes(),seq=[['photo'],['video'],...T.map((w,i)=>['gun',i]),['water'],['dig']];let j=seq.findIndex(s=>s[0]===shotMode&&(s[0]!=='gun'||s[1]===wCur));j=(j+1)%seq.length;shotMode=seq[j][0];if(shotMode==='gun')wCur=seq[j][1];
  FIRE.shot=false;updBadge();const w=WTYPES[curWeapon()];
  toast(shotMode==='photo'?'📷 Photo mode':shotMode==='video'?'🎥 Video mode — PHOTO starts/stops'+(rec?' (still recording)':''):shotMode==='water'?'💧 Water mode — hold PHOTO to drop water (scoop it from the lake / pond first)':shotMode==='dig'?'⛏ Dig mode — walk (K) somewhere and press PHOTO to dig (try the ❌ on the island!)':w.ic+' '+w.n+' — PHOTO fires (hold = keep firing)',2000);};
{const u0=updBadge;updBadge=function(){const r=u0.apply(this,arguments);if(shotMode==='water'||shotMode==='dig'){const b=$('badge');b.textContent=(rec?'🔴 REC · ':'')+(shotMode==='water'?'💧 WATER '+Math.round(FIRE.tank*100)+'%':'⛏ DIG');b.style.borderColor=shotMode==='water'?'#0a84ff':'#c8a040';$('bShot').textContent=shotMode==='water'?'💧 DROP':'⛏ DIG';$('bFire').style.display='none';}return r;};}
{const s0=shutter;shutter=function(down){if(shotMode==='water'){FIRE.shot=!!down;if(down&&!fireCanCarry())toast('💧 Only things that fly can carry water',1500);return;}
  if(shotMode==='dig'){if(down)digHere();return;}return s0.apply(this,arguments);};}
// ⛏ dig anywhere while walking: the island ❌ has the big treasure, elsewhere you might find old coins
function digHere(){if(!WALK.on){toast('⛏ Walk first (K), then dig',1500);return;}if(digHere.busy)return;
  if(D.sea&&typeof ISL!=='undefined'&&!ISL.dug&&Math.hypot(WALK.pos.x-ISL.tx,WALK.pos.z-ISL.tz)<1.8){ISL.digT=3;beep(300,0.1,0.05);return;}
  digHere.busy=true;beep(260,0.08,0.05);toast('⛏ Digging…',1200);setTimeout(()=>{digHere.busy=false;const x=WALK.pos.x-Math.sin(WALK.yaw)*0.8,z=WALK.pos.z-Math.cos(WALK.yaw)*0.8,y=H(x,z);
    const hole=new THREE.Mesh(window.HOLEG||(window.HOLEG=new THREE.CircleGeometry(0.45,12)),window.HOLEM||(window.HOLEM=new THREE.MeshBasicMaterial({color:0x3a2a18})));hole.rotation.x=-Math.PI/2;hole.position.set(x,y+0.03,z);scene.add(hole);setTimeout(()=>scene.remove(hole),120000);
    const r=Math.random();if(r<0.25){const n=1+Math.floor(Math.random()*4);award('🪙 Found '+n+' old coin'+(n>1?'s':'')+'!',n);}else if(r<0.32)award('💎 A shiny gem!',8);else toast(['🪱 Just a worm','🪨 Only rocks down here','🦴 An old bone… not treasure','🌰 A buried acorn'][Math.floor(Math.random()*4)],1500);},1200);}
{const p0=updBadge;setInterval(()=>{if(shotMode==='water')try{updBadge();}catch(e){}},500);}
