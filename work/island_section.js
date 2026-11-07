// ================================================================ 🏝 ISLAND: surface the sub at the beach and press K to climb out and walk around.
// Crabs on the sand, seagulls overhead, a campfire + hammock, and an X that marks buried treasure (⛏ DIG for it).
const ISL={crabs:[],gulls:[],x:0,z:0,dug:false,digT:0,xm:null};
function islLand(x,z){return seaH(x,z)>SEA.y+0.15;}
function islExtras(){const g=SEA.g;ISL.x=SEA.x+150;ISL.z=SEA.z-40;const r=uwRnd(99),ix=ISL.x,iz=ISL.z;
  // X marks the spot
  const xm=new THREE.Group(),red=new THREE.MeshBasicMaterial({color:0xd7263d});for(const a of[0.785,-0.785]){const b=new THREE.Mesh(GEO.box,red);b.scale.set(2.2,0.05,0.35);b.rotation.y=a;xm.add(b);}
  const tx=ix-14,tz=iz+12;xm.position.set(tx,seaH(tx,tz)+0.04,tz);g.add(xm);ISL.xm=xm;ISL.tx=tx;ISL.tz=tz;
  // campfire + logs + hammock between two posts
  const cx=ix+8,cz=iz+10,cy=seaH(cx,cz);const wood=new THREE.MeshLambertMaterial({color:0x6b4423});
  for(let k=0;k<5;k++){const l=new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,1,6),wood);l.rotation.z=Math.PI/2;l.rotation.y=k*1.26;l.position.set(cx,cy+0.1,cz);g.add(l);}
  const fl=new THREE.Mesh(new THREE.ConeGeometry(0.35,0.9,8),new THREE.MeshBasicMaterial({color:0xff8a1a,transparent:true,opacity:0.85}));fl.position.set(cx,cy+0.5,cz);g.add(fl);ISL.flame=fl;
  for(const [dx,dz] of[[2.2,0],[-2.2,0],[0,2.2]]){const s=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.35,0.4,8),wood);s.position.set(cx+dx,cy+0.2,cz+dz);g.add(s);}
  const hx=ix-4,hz=iz-12,hy=seaH(hx,hz);for(const sx of[-2,2]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,2.2,6),wood);p.position.set(hx+sx,hy+1.1,hz);g.add(p);}
  const ham=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,4,12,1,true,Math.PI,Math.PI),new THREE.MeshLambertMaterial({color:0xff5d8f,side:THREE.DoubleSide}));ham.rotation.z=Math.PI/2;ham.position.set(hx,hy+1.2,hz);g.add(ham);
  // a little dock to park the sub at
  const dock=new THREE.Mesh(GEO.box,wood);const dx=ix-34,dz=iz;dock.scale.set(10,0.2,2.4);dock.position.set(dx,SEA.y+0.5,dz);g.add(dock);
  for(let k=-4;k<=4;k+=2)for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,3,6),wood);p.position.set(dx+k,SEA.y-0.9,dz+s*1.1);g.add(p);}
  SURF.push({x0:dx-5,x1:dx+5,z0:dz-1.2,z1:dz+1.2,y:SEA.y+0.6});const lb=label('⚓ Dock — surface the sub here and press K to get out',dx,SEA.y+3,dz,6,'rgba(20,80,120,0.85)');scene.remove(lb);g.add(lb);
  // crabs
  const cg=new THREE.Group();g.add(cg);for(let i=0;i<8;i++){const c=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:0xe5532d});const b=new THREE.Mesh(new THREE.SphereGeometry(0.18,8,6),m);b.scale.y=0.5;c.add(b);
    for(const s of[-1,1]){const cl=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,4),m);cl.position.set(s*0.2,0,-0.15);c.add(cl);for(let k=0;k<3;k++){const lg=new THREE.Mesh(GEO.box,m);lg.scale.set(0.16,0.02,0.02);lg.position.set(s*0.2,-0.04,-0.05+k*0.08);c.add(lg);}}
    const a=r()*6.28;cg.add(c);ISL.crabs.push({g:c,a,d:24+r()*6,sp:(r()<0.5?-1:1)*(0.02+r()*0.03),t:r()*10});}
  // seagulls
  for(let i=0;i<6;i++){const s=new THREE.Group(),wm=new THREE.MeshLambertMaterial({color:0xf2f2f2,side:THREE.DoubleSide});const body=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),wm);body.scale.z=2.2;s.add(body);
    const w1=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.22),wm);w1.position.x=0.45;const W1=new THREE.Group();W1.add(w1);s.add(W1);const w2=w1.clone();w2.position.x=-0.45;const W2=new THREE.Group();W2.add(w2);s.add(W2);
    g.add(s);ISL.gulls.push({g:s,W1,W2,a:r()*6.28,R:15+r()*25,h:12+r()*14,sp:0.15+r()*0.15});}}
{const s0=seaBuild;seaBuild=function(){const was=SEA.built;const r=s0.apply(this,arguments);if(!was)try{islExtras();}catch(e){console.warn('island',e);}return r;};}
// K at the beach: climb out of the sub onto the island (and back in)
{const w0=walkToggle;walkToggle=function(on){const want=on===undefined?!WALK.on:!!on;
  if(want&&D.sea){let best=null,bd=1e9;for(let a=0;a<6.28;a+=0.3)for(const d of[1.5,3,4.5,6]){const x=D.pos.x+Math.cos(a)*d,z=D.pos.z+Math.sin(a)*d;if(islLand(x,z)||surfY(x,z,SEA.y+1)>SEA.y){if(d<bd){bd=d;best=[x,z];}}}
    if(!best||(D.depth||0)>0.4){toast('🏝 Drive the sub right up to the island beach (or the dock) and surface, then press K to get out',3200);return;}
    const r=w0.call(this,true);WALK.pos.set(best[0],Math.max(H(best[0],best[1]),surfY(best[0],best[1],SEA.y+1)),best[1]);WALK.yaw=Math.atan2(-(ISL.x-WALK.pos.x),-(ISL.z-WALK.pos.z));WALK.sub=D.pos.clone();toast('🏝 You climbed out onto the island! Find the ❌ — then ⛏ DIG. K = back in the sub',4500);return r;}
  if(!want&&D.sea&&WALK.sub&&WALK.pos.distanceTo(WALK.sub)>8){toast('🚤 Walk back to your sub first (it\'s parked at the beach), then press K',2500);return;}
  return w0.apply(this,arguments);};}
// walking on the island: stay on the sand (you can wade in a little), dig for treasure
{const t0=tickWalk;tickWalk=function(dt){const px=WALK.pos.x,pz=WALK.pos.z;const r=t0.apply(this,arguments);
  if(WALK.on&&D.sea){const g=seaH(WALK.pos.x,WALK.pos.z),onDock=surfY(WALK.pos.x,WALK.pos.z,SEA.y+1)>SEA.y;if(g<SEA.y-0.5&&!onDock){WALK.pos.x=px;WALK.pos.z=pz;if(!tickWalk.ww){tickWalk.ww=1;toast('🌊 Too deep to wade — the sub is your ride',1500);setTimeout(()=>tickWalk.ww=0,3000);}}
    const b=islDigBtn(),near=!ISL.dug&&Math.hypot(WALK.pos.x-ISL.tx,WALK.pos.z-ISL.tz)<1.8;b.style.display=near?'block':'none';
    if(ISL.digT>0){ISL.digT-=dt;b.textContent='⛏ Digging… '+Math.max(0,Math.ceil(ISL.digT));if(ISL.digT<=0){ISL.dug=true;b.style.display='none';ISL.xm.visible=false;uwChest(SEA.g,ISL.tx,seaH(ISL.tx,ISL.tz),ISL.tz,0);const C=UW.chests[UW.chests.length-1];C.open=true;award('🏴‍☠️ BURIED TREASURE!',75);toast('🏴‍☠️ You dug up the pirate treasure! +75 coins',3500);}}}
  else{const b=$('digB');if(b)b.style.display='none';}return r;};}
function islDigBtn(){let b=$('digB');if(!b){b=document.createElement('button');b.id='digB';b.className='btn';b.textContent='⛏ DIG';b.style.cssText='position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:14;font:900 20px system-ui,sans-serif;padding:12px 20px;border-radius:14px;background:rgba(215,38,61,0.92);color:#fff;display:none';
  b.onclick=e=>{e.stopPropagation();if(ISL.digT<=0&&!ISL.dug){ISL.digT=3;beep(300,0.1,0.05);}};document.body.appendChild(b);}return b;}
// crabs scuttle, seagulls circle, the campfire flickers
function islTick(dt){if(!D.sea||!ISL.crabs.length)return;const t=performance.now()/1000;
  ISL.crabs.forEach(c=>{c.t+=dt;if(Math.sin(c.t*0.7)>0.3)c.a+=c.sp*dt*6;let x=ISL.x+Math.cos(c.a)*c.d,z=ISL.z+Math.sin(c.a)*c.d;
    if(WALK.on&&Math.hypot(WALK.pos.x-x,WALK.pos.z-z)<2.5){c.a+=c.sp*dt*30;c.sp=Math.abs(c.sp)*Math.sign(Math.sin(c.a-Math.atan2(WALK.pos.z-ISL.z,WALK.pos.x-ISL.x)))||c.sp;}
    let k=0;while(!islLand(x,z)&&k<20){c.d-=0.5;x=ISL.x+Math.cos(c.a)*c.d;z=ISL.z+Math.sin(c.a)*c.d;k++;}
    c.g.position.set(x,seaH(x,z)+0.06,z);c.g.rotation.y=-c.a;});
  ISL.gulls.forEach(s=>{s.a+=s.sp*dt;const x=ISL.x+Math.cos(s.a)*s.R,z=ISL.z+Math.sin(s.a)*s.R;s.g.position.set(x,SEA.y+s.h+Math.sin(t+s.a)*1.5,z);s.g.rotation.y=-s.a;const f=Math.sin(t*6+s.R)*0.5;s.W1.rotation.z=f;s.W2.rotation.z=-f;});
  if(ISL.flame){const s=0.85+Math.sin(t*11)*0.12+Math.sin(t*17)*0.06;ISL.flame.scale.set(s,s*1.1,s);}}
{const u0=uwTick;uwTick=function(dt){const r=u0.apply(this,arguments);try{islTick(dt);}catch(e){}return r;};}
