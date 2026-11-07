// ================================================================ v42: 💣 LOTS of TNT kinds (pick in 🔫 Weapons → 💣 TNT type) — each one works its own way
Object.assign(TNTK,{
  bouncy:{n:'🦘 Bouncy',d:'bounces 4 times, then BOOM'},
  homing:{n:'🎯 Homing',d:'steers itself to the nearest pilot or camper'},
  rocket:{n:'🚀 Rocket TNT',d:'shoots forward fast, then explodes'},
  mine:{n:'🪤 Land mine',d:'sits on the ground and blows up when someone comes close'},
  depth:{n:'🌊 Depth charge',d:'sinks in water and explodes underwater (normal on land)'},
  fire:{n:'🔥 Fire bomb',d:'small boom that starts fires all around'},
  freeze:{n:'🧊 Freeze bomb',d:'freezes everyone nearby for 6 seconds — no damage'},
  shock:{n:'🌀 Shockwave',d:'blasts everything away — no damage'},
  carpet:{n:'🧨 Carpet bombs',d:'drops 6 bombs in a row behind you'},
  smoke:{n:'💨 Smoke bomb',d:'huge smoke cloud to hide in — no damage'},
  party:{n:'🎉 Party popper',d:'harmless confetti fireworks'},
  nuke:{n:'☢️ NUKE',d:'10× size, flattens everything — fly far away!'}});
const TNT_CUST=/^(bouncy|homing|rocket|mine|depth|fire|freeze|shock|smoke|party)$/;
// setup when it's dropped
{const d0=tntDrop;tntDrop=function(){if(TNT.kind==='carpet'){let n=0;const go=()=>{if(n++>=6||!started)return;const k=TNT.kind;TNT.kind='classic';try{d0.apply(this,arguments);const T=TNTS[TNTS.length-1];if(T)T.r=Math.max(3,TNT.r*0.5);}finally{TNT.kind=k;}setTimeout(go,280);};go();return;}
  const n0=TNTS.length;const r=d0.apply(this,arguments);const T=TNTS[TNTS.length-1];if(TNTS.length>n0&&T&&T.own){T.kind=TNT.kind;
    if(TNT_CUST.test(T.kind)){T.cust=true;T.landed=true;T.air=false;T.noFuse=true;}
    if(T.kind==='rocket'){const y=WALK.on?(WALK.yaw||0):D.yaw;const sp=34+Math.hypot(D.vel.x,D.vel.z);T.v.set(-Math.sin(y)*sp,1.5,-Math.cos(y)*sp);T.g.rotation.x=Math.PI/2;}
    if(T.kind==='nuke'){T.r=TNT.r*10;T.dr=Math.max(TNT.dr,TNT.r*4);T.g.scale.setScalar(2.4);toast('☢️ NUKE dropped — GET AWAY!',2500);}
    if(T.kind==='mine')T.g.scale.set(1.3,0.5,1.3);if(T.kind==='freeze')T.g.children.forEach(c=>{if(c.material&&c.material.color&&!Array.isArray(c.material))c.material=c.material.clone(),c.material.color.setHex(0x8fd8ff);});}return r;};}
// how each kind moves + goes off
function tntGround(p){return inWater(p.x,p.z)?WATER_Y:H(p.x,p.z);}
function tntHitAt(T,R){const L=tntTargets();return L.find(q=>q.distanceTo(T.p)<R);}
function tntSpecial(T){const p=T.p.clone(),r=TNT.r;tntDel(T);mpSend({t:'tntx',tid:T.id});mpSend({t:'tntfx',k:T.kind,p:p.toArray().map(r2),r});tntFxK(T.kind,p,r,true);}
function tntFxK(k,p,r,mine){
  if(k==='freeze'){const ring=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),new THREE.MeshBasicMaterial({color:0x9fe8ff,transparent:true,opacity:0.45,depthWrite:false,side:THREE.DoubleSide}));ring.position.copy(p);scene.add(ring);const t0=performance.now();(function g(){const u=(performance.now()-t0)/900;if(u>1){scene.remove(ring);return;}ring.scale.setScalar(r*u);ring.material.opacity=0.45*(1-u);requestAnimationFrame(g);})();
    for(const B of AIB.L)if(!B.dead&&B.p.distanceTo(p)<r){B.frozenT=performance.now()+6000;B.say='🥶 Brrr!';}for(const C of CAMPERS.L)if(Math.hypot(C.x-p.x,C.z-p.z)<r)C.frozenT=performance.now()+6000;
    const me=dzMe();if(me&&me.distanceTo(p)<r&&!mine){D.frozenT=performance.now()+4000;toast('🥶 You got frozen!',1500);}beep(1500,0.2,0.05);}
  else if(k==='shock'){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,0.2,8,40),new THREE.MeshBasicMaterial({color:0xd0e8ff,transparent:true,opacity:0.7}));ring.rotation.x=-Math.PI/2;ring.position.copy(p);scene.add(ring);const t0=performance.now();(function g(){const u=(performance.now()-t0)/700;if(u>1){scene.remove(ring);return;}ring.scale.setScalar(0.5+u*r*1.4);ring.material.opacity=0.7*(1-u);requestAnimationFrame(g);})();
    for(const B of AIB.L){if(B.dead)continue;const d=B.p.clone().sub(p);const L=d.length();if(L<r*1.3&&L>0.1){d.normalize();B.p.addScaledVector(d,(r*1.3-L)*0.6);B.p.y+=(r-L)*0.3;}}
    const me=dzMe();if(me&&!WALK.on&&DR){const d=me.clone().sub(p),L=d.length();if(L<r*1.3&&L>0.1){d.normalize();D.vel.addScaledVector(d,(r*1.3-L)*1.5);D.vel.y+=6;}}shake=Math.max(shake,0.7);try{boomSound(10,false);}catch(e){}}
  else if(k==='smoke'){for(let i=0;i<Math.min(30,8+r);i++){const m=new THREE.Mesh(GEO.ball,BIGMAT(i%2?0xbcbcbc:0x9a9a9a));m.position.set(p.x+(Math.random()-0.5)*r*1.2,H(p.x,p.z)+Math.random()*r*0.4,p.z+(Math.random()-0.5)*r*1.2);bigAdd(m,{kind:'smoke',t:-i*0.05,life:16+Math.random()*6,r:r*0.25+Math.random()*2,vy:0.4,dx:(Math.random()-0.5)*0.4,dz:(Math.random()-0.5)*0.4});}beep(300,0.3,0.04);}
  else if(k==='party'){const cols=[0xff3b30,0xffd60a,0x34c759,0x0a84ff,0xbf5af2,0xff9f0a];for(let i=0;i<40;i++){const m=new THREE.Mesh(GEO.box,new THREE.MeshBasicMaterial({color:cols[i%6]}));m.scale.setScalar(0.25);m.position.copy(p).add(new V3(0,1,0));const a=Math.random()*6.28,sp=4+Math.random()*8;bigAdd(m,{kind:'deb',life:3.5,v:new V3(Math.cos(a)*sp*0.5,6+Math.random()*9,Math.sin(a)*sp*0.5),sz:0.25});}
    [880,1100,1320,1760].forEach((f,i)=>setTimeout(()=>beep(f,0.08,0.05),i*90));if(mine)chatSys('🎉 Party time!');}}
MPH.tntfx=function(m){try{tntFxK(m.k,new V3().fromArray(m.p),m.r||20,false);}catch(e){}};
{const t0=tntTick;tntTick=function(dt){try{const now=performance.now();for(const T of TNTS.slice()){if(!T.cust||!T.own)continue;T.t+=0;const k=T.kind;const gy=tntGround(T.p);
      if(k==='rocket'){T.p.addScaledVector(T.v,dt);T.v.y-=dt*1.5;if(Math.random()<dt*30)try{puff(T.p.clone(),0x888888,0.25,0.6);}catch(e){}T.g.lookAt(T.p.clone().add(T.v));
        if(T.p.y<=gy+0.2||hitTest(T.p,0.3)||objHitTest(T.p)||tntHitAt(T,2.2)||T.t>3){T.cust=false;tntBoom(T);}continue;}
      if(k==='homing'){const tg=tntTargets().filter(q=>q.distanceTo(T.p)<70).sort((a,b)=>a.distanceTo(T.p)-b.distanceTo(T.p))[0];if(tg&&T.t>0.3){const d=tg.clone().sub(T.p).normalize();T.v.addScaledVector(d,dt*30);if(T.v.length()>22)T.v.setLength(22);}else T.v.y-=9.8*dt;
        T.p.addScaledVector(T.v,dt);if(T.p.y<=gy+0.15||tntHitAt(T,1.8)||T.t>8){T.p.y=Math.max(T.p.y,gy+0.15);T.cust=false;tntBoom(T);}continue;}
      if(k==='bouncy'){T.v.y-=9.8*dt;T.p.addScaledVector(T.v,dt);if(T.p.y<=gy+0.15&&T.v.y<0){T.p.y=gy+0.15;T.v.y=Math.max(5,-T.v.y*0.75);T.v.x*=0.8;T.v.z*=0.8;T.b=(T.b||0)+1;beep(500+T.b*150,0.05,0.04);if(T.b>=4){T.cust=false;tntBoom(T);}}continue;}
      if(k==='depth'){if(inWater(T.p.x,T.p.z)&&T.p.y<WATER_Y+0.2){T.v.multiplyScalar(0.9);T.v.y=-1.5;T.p.addScaledVector(T.v,dt);T.sub=(T.sub||0)+dt;if(Math.random()<dt*8)try{puff(new V3(T.p.x,WATER_Y,T.p.z),0xcfefff,0.3,0.8);}catch(e){}
          if(T.sub>2.2||T.p.y<H(T.p.x,T.p.z)+0.3){T.cust=false;T.r=TNT.r*1.4;tntBoom(T);}continue;}
        T.v.y-=9.8*dt;T.p.addScaledVector(T.v,dt);if(!inWater(T.p.x,T.p.z)&&T.p.y<=H(T.p.x,T.p.z)+0.15){T.p.y=H(T.p.x,T.p.z)+0.15;T.cust=false;tntBoom(T);}continue;}
      // the rest fall, then do their thing
      if(!T.rest){T.v.y-=9.8*dt;T.p.addScaledVector(T.v,dt);if(T.p.y<=gy+0.15||hitTest(T.p,0.25)){T.p.y=Math.max(T.p.y,gy+0.15);T.v.set(0,0,0);T.rest=true;T.restT=T.t;}else continue;}
      if(k==='mine'){if(T.t-T.restT>1.5){T.g.children.forEach(c=>{if(c===T.g.userData.spark)c.visible=Math.floor(T.t*2)%2===0;});if(tntHitAt(T,3.2)){T.cust=false;beep(1600,0.05,0.05);tntBoom(T);}}if(T.t>120)tntDel(T);continue;}
      if(k==='fire'){T.cust=false;T.r=Math.max(3,TNT.r*0.4);const p=T.p.clone();tntBoom(T);for(let i=0;i<Math.min(10,4+TNT.r/5);i++){const a=Math.random()*6.28,d=2+Math.random()*TNT.r*0.7;try{fireStart(p.x+Math.cos(a)*d,p.z+Math.sin(a)*d,i<2);}catch(e){}}continue;}
      if(/^(freeze|shock|smoke|party)$/.test(k)){tntSpecial(T);continue;}}}catch(e){console.warn('tnt2',e);}
  const keep=TNTS.filter(T=>T.cust&&T.own);keep.forEach(T=>T.own=false);try{return t0.apply(this,arguments);}finally{keep.forEach(T=>T.own=true);}};}
// frozen things stop moving
{const a0=aiTick;aiTick=function(dt){const now=performance.now(),F=AIB.L.filter(B=>B.frozenT>now&&!B.dead).map(B=>[B,B.p.clone()]);const r=a0.apply(this,arguments);F.forEach(([B,p])=>{B.p.copy(p);});return r;};}
{const t0=tickDrone;tickDrone=function(dt,inp){if(D.frozenT>performance.now()&&!WALK.on){D.vel.multiplyScalar(0.6);return t0.call(this,dt,Object.assign({},inp,{lx:0,ly:0,rx:0,ry:0}));}return t0.apply(this,arguments);};}
// 🔫 Weapons → 💣 TNT type (pick from the whole list)
function tntTypeItems(){return[mInfo('💣 Pick your TNT — then tap the 💣 button (or press 0) to drop it. Hold the button to switch quickly.'),
  ...Object.keys(TNTK).map(k=>mItem(()=>(TNT.kind===k?'✅ ':'')+TNTK[k].n+' — '+TNTK[k].d,()=>{TNT.kind=k;saveTnt();tntBtnLabel();toast(TNTK[k].n+' TNT ready',1400);renderMenu();})),
  mItem('💥 Explosion settings (size, fuse…) ▸',()=>menuPush('💥 Explosion settings',exItems())),mItem('◀ Back',()=>menuBack())];}
{const w0=weaponItems;weaponItems=function(){const L=w0();L.splice(1,0,mItem(()=>'💣 TNT type: '+TNTK[TNT.kind].n+' ▸',()=>menuPush('💣 TNT type',tntTypeItems())));return L;};}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(x=>/Explosion settings/.test(String(x.label())));L.splice(i>=0?i:2,0,mItem(()=>'💣 TNT type: '+TNTK[TNT.kind].n+' ▸',()=>menuPush('💣 TNT type',tntTypeItems())));return L;};}
// the TNT button label knows the new kinds too
tntBtnLabel=function(){const K=TNTK[TNT.kind]||TNTK.classic,ic=K.n.split(' ')[0],nm=K.n.replace(/^\S+\s/,'');const b=$('tntBtn');if(b)b.textContent=ic+' '+(TNT.kind==='classic'?'TNT':nm.length>9?nm.split(' ')[0]:nm);const v=$('tntTool');if(v)v.textContent=K.n+' (0)';};
