// ================================================================ 🚒 FIRE TRUCK you can climb into while walking (K / button), drive, and spray with the hose
// (PHOTO in 💧 water mode, the 💧 DROP button, or Z). The tank lasts 3 minutes at full blast; refill at the red hydrant or by backing into the lake.
// 🧑‍🚒 AI CAMPERS run to fires and spray them with extinguishers too.
const TRUCK={x:MEADOW.x0+12,z:MEADOW.z0+5,yaw:-Math.PI/2,v:0,tank:180,cap:180,g:null,in:false,nozzle:null,lights:[],hyd:{x:MEADOW.x0+6,z:MEADOW.z0+2}};
(function(){const g=new THREE.Group(),red=new THREE.MeshLambertMaterial({color:0xc8102e}),dark=new THREE.MeshLambertMaterial({color:0x151515}),chrome=new THREE.MeshLambertMaterial({color:0xd8d8d8}),glass=new THREE.MeshLambertMaterial({color:0x223344});
  const box=(sx,sy,sz,x,y,z,m)=>{const b=new THREE.Mesh(GEO.box,m||red);b.scale.set(sx,sy,sz);b.position.set(x,y,z);b.castShadow=true;g.add(b);return b;};
  box(2.4,1.6,4.6,0,1.5,0.9);box(2.4,1.9,2.2,0,1.65,-2.5);box(2.3,0.8,0.05,0,2.0,-3.62,glass);box(2.5,0.12,7.2,0,0.7,0,chrome);
  for(const sx of[-1,1])box(0.05,0.7,1.6,sx*1.21,2.0,-2.5,glass);
  box(0.12,0.12,5.2,-0.7,2.55,0.8,chrome);box(0.12,0.12,5.2,0.7,2.55,0.8,chrome);for(let k=-1.6;k<=3.2;k+=0.5)box(1.4,0.06,0.08,0,2.55,k,chrome);
  const reel=new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.45,0.5,16),new THREE.MeshLambertMaterial({color:0xffd60a}));reel.rotation.z=Math.PI/2;reel.position.set(1.32,1.4,1.6);g.add(reel);
  const noz=new THREE.Group();noz.position.set(0,2.75,-1.3);const barrel=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.1,0.9,8),chrome);barrel.rotation.x=-Math.PI/2+0.35;barrel.position.z=-0.35;noz.add(barrel);g.add(noz);TRUCK.nozzle=noz;
  for(const [x,z] of[[-1.1,-2.4],[1.1,-2.4],[-1.1,1.6],[1.1,1.6],[-1.1,2.8],[1.1,2.8]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.4,14),dark);w.rotation.z=Math.PI/2;w.position.set(x,0.55,z);g.add(w);}
  for(const [x,c] of[[-0.6,0xff1010],[0.6,0x1060ff]]){const l=new THREE.Mesh(GEO.box,new THREE.MeshBasicMaterial({color:c}));l.scale.set(0.5,0.2,0.3);l.position.set(x,2.7,-2.5);g.add(l);TRUCK.lights.push(l);}
  g.position.set(TRUCK.x,H(TRUCK.x,TRUCK.z),TRUCK.z);g.rotation.y=TRUCK.yaw;scene.add(g);TRUCK.g=g;
  const hy=new THREE.Group();const hp=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,0.8,10),red);hp.position.y=0.4;hy.add(hp);const hc=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,8),red);hc.position.y=0.85;hy.add(hc);
  hy.position.set(TRUCK.hyd.x,H(TRUCK.hyd.x,TRUCK.hyd.z),TRUCK.hyd.z);scene.add(hy);addVCyl(TRUCK.hyd.x,TRUCK.hyd.z,0.22,hy.position.y,hy.position.y+1);
  label('🚒 Fire truck — walk up and get in',TRUCK.x,H(TRUCK.x,TRUCK.z)+4.2,TRUCK.z,4.5);})();
function truckBtn(){let b=$('truckB');if(!b){b=document.createElement('button');b.id='truckB';b.className='btn';b.style.cssText='position:fixed;left:50%;bottom:170px;transform:translateX(-50%);z-index:14;font:900 18px system-ui,sans-serif;padding:12px 18px;border-radius:14px;background:rgba(200,16,46,0.92);color:#fff;display:none';
  b.onclick=e=>{e.stopPropagation();truckToggle();};document.body.appendChild(b);}return b;}
function truckToggle(){if(TRUCK.in){TRUCK.in=false;const s=Math.sin(TRUCK.yaw),c=Math.cos(TRUCK.yaw);WALK.pos.set(TRUCK.x+c*2.2,0,TRUCK.z-s*2.2);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);toast('🚶 Out of the fire truck',1500);return;}
  if(!WALK.on)return;TRUCK.in=true;TRUCK.v=0;if(shotMode!=='water'){shotMode='water';updBadge();}toast('🚒 Driving the fire truck! W/S or left stick = drive · A/D or ←→ = steer · hold PHOTO (💧) / Z = SPRAY · K = get out',5000);beep(700,0.2,0.05);}
{const k0=walkToggle;walkToggle=function(on){if(TRUCK.in&&(on===undefined||on===false)){truckToggle();return;}
  if((on===undefined||on===true)&&WALK.on&&Math.hypot(WALK.pos.x-TRUCK.x,WALK.pos.z-TRUCK.z)<5){truckToggle();return;}return k0.apply(this,arguments);};}
// drive it (uses the walking controls)
const _tv=new V3();
{const t0=tickWalk;tickWalk=function(dt){if(WALK.on&&TRUCK.in&&!menu.open&&!WS.open){const k=keys,inp=WALK.inp||Z0;
    const thr=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)||inp.ly||0,st=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0)||inp.rx||inp.lx||0;
    TRUCK.v+=(thr*14-TRUCK.v)*Math.min(1,dt*(Math.abs(thr)>0.05?0.9:1.6));TRUCK.yaw-=st*clamp(Math.abs(TRUCK.v)/4,0,1)*0.9*dt*(TRUCK.v<0?-1:1);
    const nx=TRUCK.x-Math.sin(TRUCK.yaw)*TRUCK.v*dt,nz=TRUCK.z-Math.cos(TRUCK.yaw)*TRUCK.v*dt;_tv.set(nx,H(nx,nz)+1.2,nz);
    if(hitTest(_tv,1.4)&&Math.abs(TRUCK.v)>0.5){TRUCK.v*=-0.3;bump();}else if(!(inWater(nx,nz)&&H(nx,nz)<WATER_Y-1)){TRUCK.x=nx;TRUCK.z=nz;}
    WALK.pos.set(TRUCK.x,H(TRUCK.x,TRUCK.z),TRUCK.z);WALK.yaw=TRUCK.yaw;truckPlace();return;}
  const r=t0.apply(this,arguments);const b=truckBtn();const near=WALK.on&&!TRUCK.in&&Math.hypot(WALK.pos.x-TRUCK.x,WALK.pos.z-TRUCK.z)<5;b.style.display=near||(WALK.on&&TRUCK.in)?'block':'none';b.textContent=TRUCK.in?'🚒 Get out':'🚒 Get in the fire truck';return r;};}
function truckPlace(){const g=TRUCK.g,e=1.6,gx=(H(TRUCK.x+e,TRUCK.z)-H(TRUCK.x-e,TRUCK.z))/(2*e),gz=(H(TRUCK.x,TRUCK.z+e)-H(TRUCK.x,TRUCK.z-e))/(2*e);g.position.set(TRUCK.x,H(TRUCK.x,TRUCK.z),TRUCK.z);g.rotation.order='YXZ';
  const fx=-Math.sin(TRUCK.yaw),fz=-Math.cos(TRUCK.yaw);g.rotation.set(Math.atan(gx*fx+gz*fz),TRUCK.yaw,-Math.atan(gx*-fz+gz*fx)*0+0);}
// camera behind the truck while driving
{const w0=walkCam;walkCam=function(){if(!TRUCK.in)return w0.apply(this,arguments);const fx=-Math.sin(TRUCK.yaw),fz=-Math.cos(TRUCK.yaw),gy=H(TRUCK.x,TRUCK.z);
  cam.position.set(TRUCK.x-fx*11,gy+5.5+WALK.pitch*-6,TRUCK.z-fz*11);cam.lookAt(TRUCK.x+fx*6,gy+1.5,TRUCK.z+fz*6);};}
// the hose: spray, refill, lights
function truckTick(dt){if(!TRUCK.g)return;const t=performance.now()/1000;TRUCK.lights.forEach((l,i)=>{l.visible=!TRUCK.in&&!FIRE.L.length?true:((t*3+i*0.5)%1)<0.5;});
  if(TRUCK.in){const spraying=FIRE.btn||FIRE.act||FIRE.shot||!!keys.KeyZ;TRUCK.nozzle.rotation.y=Math.sin(t*0.6)*0.05;
    if(spraying&&TRUCK.tank>0){TRUCK.tank=Math.max(0,TRUCK.tank-dt);const fx=-Math.sin(TRUCK.yaw),fz=-Math.cos(TRUCK.yaw),gy=H(TRUCK.x,TRUCK.z),n=Math.ceil(dt*90),lift=6+clamp(-WALK.pitch,-0.5,1)*8;
      for(let k=0;k<n;k++){if(FIRE.drops.length>320)break;fireTex();const m=new THREE.Mesh(FIRE.dg||(FIRE.dg=new THREE.SphereGeometry(0.07,5,4)),FIRE.dm||(FIRE.dm=new THREE.MeshBasicMaterial({color:0x9fdcff,transparent:true,opacity:0.75})));
        m.position.set(TRUCK.x+fx*1.6,gy+2.9,TRUCK.z+fz*1.6);scene.add(m);const sp=16+Math.random()*3,j=(Math.random()-0.5)*0.12;FIRE.drops.push({m,v:new V3((fx*Math.cos(j)-fz*Math.sin(j))*sp,lift+Math.random()*1.5,(fz*Math.cos(j)+fx*Math.sin(j))*sp)});}}
    else if(spraying&&!truckTick.e){truckTick.e=1;toast('🚒 Truck tank empty — drive to the red hydrant (or into the lake) to refill',2600);setTimeout(()=>truckTick.e=0,3500);}
    const nearH=Math.hypot(TRUCK.x-TRUCK.hyd.x,TRUCK.z-TRUCK.hyd.z)<5,lake=inWater(TRUCK.x,TRUCK.z);if((nearH||lake)&&TRUCK.tank<TRUCK.cap){TRUCK.tank=Math.min(TRUCK.cap,TRUCK.tank+dt*30);if(!truckTick.f){truckTick.f=1;toast('🚰 Filling the truck tank…',1500);setTimeout(()=>truckTick.f=0,3000);}}
    const c=$('cFire');if(c){c.style.display='';c.textContent='🔥'+FIRE.L.length+' · 🚒 water '+Math.floor(TRUCK.tank/60)+':'+String(Math.floor(TRUCK.tank%60)).padStart(2,'0');}}}
// ---------------- 🧑‍🚒 AI campers
const CAMPERS={on:LS.get('campersOn',true),L:[]};
(function(){const cols=[0xffd60a,0x34c759,0xff9f0a,0xbf5af2],base={x:16,z:-14};cols.forEach((c,i)=>{const g=makePilot(c);const a=i/4*6.28,x=base.x+Math.cos(a)*4,z=base.z+Math.sin(a)*4;g.position.set(x,H(x,z),z);scene.add(g);
    const ex=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.45,8),new THREE.MeshLambertMaterial({color:0xd7263d}));ex.position.set(0.25,0.9,-0.1);g.add(ex);
    CAMPERS.L.push({g,x,z,hx:x,hz:z,yaw:0,tgt:null,state:'idle',t:Math.random()*5,name:['Sam','Jo','Max','Lu'][i],sprayT:0});});})();
function campersTick(dt){const now=performance.now()/1000;CAMPERS.L.forEach((C,i)=>{C.t-=dt;let gx=C.hx,gz=C.hz,run=false;
    if(CAMPERS.on&&FIRE.L.length){let best=null,bd=1e9;FIRE.L.forEach(F=>{const d=Math.hypot(F.x-C.hx,F.z-C.hz);if(d<180){const taken=CAMPERS.L.filter(o=>o!==C&&o.tgt===F).length;const s=d+taken*40;if(s<bd){bd=s;best=F;}}});C.tgt=best;}else C.tgt=null;
    const F=C.tgt;if(F&&FIRE.L.includes(F)){const dx=C.x-F.x,dz=C.z-F.z,d=Math.hypot(dx,dz)||1,stand=F.r+3;gx=F.x+dx/d*stand;gz=F.z+dz/d*stand;run=true;
      if(d<stand+1.2){C.state='spray';C.yaw=Math.atan2(dx,dz);F.int-=dt*0.035;if(Math.random()<dt*25)campSpray(C,F);if(F.int<=0){fireDel(F,'camper');chatSys('🧑‍🚒 '+C.name+' put out a fire!');}else if(Math.random()<dt*2)mpSendFireHit(F);}
      else C.state='run';if(C.state==='run'&&!C.said){C.said=1;chatSys('🧑‍🚒 '+C.name+': "Fire! I\'m on it!"');}}
    else{C.said=0;if(C.t<=0){C.t=3+Math.random()*6;C.hx2=16+(Math.random()-0.5)*14;C.hz2=-14+(Math.random()-0.5)*14;}gx=C.hx2||C.hx;gz=C.hz2||C.hz;C.state='walk';}
    if(C.state!=='spray'){const dx=gx-C.x,dz=gz-C.z,d=Math.hypot(dx,dz);if(d>0.3){const sp=(run?4.5:1.2)*dt;C.x+=dx/d*Math.min(sp,d);C.z+=dz/d*Math.min(sp,d);C.yaw=Math.atan2(-dx,-dz)+Math.PI;}}
    C.g.position.set(C.x,H(C.x,C.z)+(C.state==='run'?Math.abs(Math.sin(now*10+i))*0.08:0),C.z);C.g.rotation.y=C.yaw;});}
function campSpray(C,F){fireTex();const m=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffffff,transparent:true,opacity:0.7,depthWrite:false}));const y=H(C.x,C.z)+1;m.position.set(C.x,y,C.z);m.scale.setScalar(0.3);FIRE.g.add(m);
  const dx=F.x-C.x,dz=F.z-C.z,d=Math.hypot(dx,dz)||1;FIRE.smoke.push({m,t:0,life:0.6,v:new V3(dx/d*6,0.5,dz/d*6),s:0.35});}
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{truckTick(dt);campersTick(dt);}catch(e){console.warn('camp',e);}return r;};}
{const f0=fireItems;fireItems=function(){const L=f0();L.splice(L.length-1,0,mItem(()=>'🧑‍🚒 AI campers fight fires: '+(CAMPERS.on?'ON':'off'),()=>{CAMPERS.on=!CAMPERS.on;LS.set('campersOn',CAMPERS.on);}),
  mItem(()=>'🚒 Fire truck water: '+Math.round(TRUCK.tank/TRUCK.cap*100)+'% (3 min full blast) — refill now',()=>{TRUCK.tank=TRUCK.cap;}),
  mInfo('🚒 The fire truck is parked at the edge of the meadow, next to a red hydrant. Walk (K) up to it and get in.'));return L;};}
// 📍 take me to the fire truck (puts you next to it, walking) + it's on the menu
function truckGoto(){if(typeof CES!=='undefined'&&CES.on){toast('🚒 The fire truck lives on the 🌳 woods maps (not the real-world map)',3000);return;}
  if(D.sea)seaExit();if(menu.open)menuToggle(false);if(!WALK.on){if(D.state!=='landed'&&D.state!=='down')resetDrone();walkToggle(true);}
  const s=Math.sin(TRUCK.yaw),c=Math.cos(TRUCK.yaw);WALK.pos.set(TRUCK.x+c*3.2,0,TRUCK.z-s*3.2);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);WALK.yaw=Math.atan2(-(TRUCK.x-WALK.pos.x),-(TRUCK.z-WALK.pos.z));WALK.pitch=-0.1;
  toast('🚒 Here\'s the fire truck! Tap "🚒 Get in the fire truck" (or press K)',3500);}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Fires \+ water/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem('🚒 Take me to the fire truck',()=>truckGoto()));return L;};}
{const f0=fireItems;fireItems=function(){const L=f0();L.splice(1,0,mItem('🚒 Take me to the fire truck',()=>truckGoto()));return L;};}
