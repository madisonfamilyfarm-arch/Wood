// v82: 🏟 ARN DRONE ARENA (huge stadium + 14-gate neon 3D race course with timer, car jump ramps, floodlights, big screen)
//      + a much cooler tunnel: longer underground, rainbow neon rings, boost pads (cars go zoom), timed tunnel run, exit jump.
const ARN={n:'the mega arena',x:300,z:500,ax:140,bz:112};
{const _H2=H;let fh=null;const flat=()=>{if(fh==null){let s=0,n=0;for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){s+=_H2(ARN.x+i*30,ARN.z+j*25);n++;}fh=Math.max(0.5,s/n);}return fh;};ARN.flat=flat;
  // car jump ramps inside the arena (ground rises, then a sharp drop = air time)
  ARN.ramps=[{x:ARN.x-55,z:ARN.z,dir:1,L:16,h:3.2,w:9},{x:ARN.x+55,z:ARN.z,dir:-1,L:16,h:3.2,w:9},{x:ARN.x,z:ARN.z-45,dir:1,L:12,h:2.2,w:8,ax:'z'},{x:ARN.x,z:ARN.z+45,dir:-1,L:12,h:2.2,w:8,ax:'z'}];
  // tunnel exit kicker
  const KICK={x:TUN.x,z:TUN.z1+18,L:10,h:1.8,w:10};
  H=function(x,z){let h=_H2(x,z);const ex=(x-ARN.x)/ARN.ax,ez=(z-ARN.z)/ARN.bz,e=Math.sqrt(ex*ex+ez*ez);
    if(e<1.3){h=lerp(flat(),h,smooth(1.0,1.3,e));
      for(const r of ARN.ramps){const u=r.ax==='z'?(z-r.z)*r.dir:(x-r.x)*r.dir,v=r.ax==='z'?x-r.x:z-r.z;if(u>0&&u<r.L&&Math.abs(v)<r.w/2)h+=r.h*u/r.L*(1-smooth(r.w/2-1,r.w/2,Math.abs(v)));}}
    {const u=z-KICK.z,v=x-KICK.x;if(u>0&&u<KICK.L&&Math.abs(v)<KICK.w/2)h+=KICK.h*u/KICK.L*(1-smooth(KICK.w/2-1,KICK.w/2,Math.abs(v)));}
    return h;};
  const b0=blocked;blocked=function(x,z){const ex=(x-ARN.x)/(ARN.ax+30),ez=(z-ARN.z)/(ARN.bz+30);if(ex*ex+ez*ez<1)return true;return b0(x,z);};}
// ---------- the stadium ----------
const ARNG=new THREE.Group();scene.add(ARNG);
(function(){const fy=ARN.flat(),o=new THREE.Object3D();
  // track floor ring (dark rubber) + center logo circle
  const fl=new THREE.Mesh(new THREE.RingGeometry(0.62,1.0,96),new THREE.MeshLambertMaterial({color:0x26282e,side:THREE.DoubleSide}));fl.rotation.x=-Math.PI/2;fl.scale.set(ARN.ax-4,ARN.bz-4,1);fl.position.set(ARN.x,fy+0.06,ARN.z);ARNG.add(fl);
  const ctr=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshLambertMaterial({color:0x3a7d2c}));ctr.rotation.x=-Math.PI/2;ctr.scale.set((ARN.ax-4)*0.62,(ARN.bz-4)*0.62,1);ctr.position.set(ARN.x,fy+0.05,ARN.z);ARNG.add(ctr);
  // neon edge lines
  for(const k of [0.62,1.0]){const pts=[];for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;pts.push(new THREE.Vector3(ARN.x+Math.cos(a)*(ARN.ax-4)*k,fy+0.12,ARN.z+Math.sin(a)*(ARN.bz-4)*k));}ARNG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:k<1?0x00e5ff:0xff2bd6})));}
  // stands: 6 tiers of seats, rising outward, team colours
  const N=96,T=6,seat=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0xffffff}),N*T);let k=0;const cols=[0xff3b30,0x0a84ff,0xffd60a,0x30d158].map(c=>new THREE.Color(c)),grey=new THREE.Color(0x9a9ca3);
  for(let t=0;t<T;t++)for(let i=0;i<N;i++){const a=i/N*Math.PI*2,rx=ARN.ax+4+t*4,rz=ARN.bz+4+t*4;const x=ARN.x+Math.cos(a)*rx,z=ARN.z+Math.sin(a)*rz;const seg=2*Math.PI*Math.max(rx,rz)/N*1.08;
    o.position.set(x,fy+1+t*2.2,z);o.rotation.set(0,-a,0);o.scale.set(4.2,2+t*2.2*2,seg);o.position.y=fy+(2+t*2.2*2)/2;o.updateMatrix();seat.setMatrixAt(k,o.matrix);seat.setColorAt(k,t%2?grey:cols[Math.floor(i/(N/4))%4]);k++;}
  seat.instanceColor.needsUpdate=true;seat.frustumCulled=false;ARNG.add(seat);
  // crowd dots on the stands
  const cr=new THREE.InstancedMesh(new THREE.SphereGeometry(0.45,6,4),new THREE.MeshLambertMaterial({color:0xffffff}),900);const cc=[0xffcc99,0xc68642,0x8d5524,0xff6b6b,0x4dabf7,0xffe066].map(c=>new THREE.Color(c));
  for(let i=0;i<900;i++){const a=Math.random()*Math.PI*2,t=Math.floor(Math.random()*T),rx=ARN.ax+4+t*4,rz=ARN.bz+4+t*4;o.position.set(ARN.x+Math.cos(a)*rx,fy+2+t*4.4+0.5,ARN.z+Math.sin(a)*rz);o.rotation.set(0,0,0);o.scale.set(1,1.4,1);o.updateMatrix();cr.setMatrixAt(i,o.matrix);cr.setColorAt(i,cc[i%cc.length]);}
  cr.instanceColor.needsUpdate=true;cr.frustumCulled=false;ARNG.add(cr);ARN.crowd=cr;
  // floodlight towers
  const pole=new THREE.MeshLambertMaterial({color:0xb0b3ba}),glow=new THREE.MeshBasicMaterial({color:0xfff6c8});
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2+0.2,x=ARN.x+Math.cos(a)*(ARN.ax+34),z=ARN.z+Math.sin(a)*(ARN.bz+34);const p=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.9,46,8),pole);p.position.set(x,fy+23,z);ARNG.add(p);
    const hd=new THREE.Mesh(new THREE.BoxGeometry(9,5,1.2),glow);hd.position.set(x,fy+47,z);hd.lookAt(ARN.x,fy,ARN.z);ARNG.add(hd);}
  // big screen
  const cv=document.createElement('canvas');cv.width=512;cv.height=192;ARN.cv=cv;const tex=new THREE.CanvasTexture(cv);ARN.tex=tex;
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(40,15),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));scr.position.set(ARN.x,fy+32,ARN.z-ARN.bz-36);ARNG.add(scr);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(42,17,1),new THREE.MeshLambertMaterial({color:0x111111}));fr.position.set(ARN.x,fy+32,ARN.z-ARN.bz-36.7);ARNG.add(fr);
  const lg=new THREE.Mesh(new THREE.BoxGeometry(2,24,2),pole);lg.position.set(ARN.x,fy+12,ARN.z-ARN.bz-37);ARNG.add(lg);
  // jump ramp stripes (yellow/black edges so you can see them)
  const yb=new THREE.MeshLambertMaterial({color:0xffd60a});ARN.ramps.forEach(r=>{for(const s of [-1,1]){const m=new THREE.Mesh(new THREE.BoxGeometry(r.ax==='z'?0.6:r.L,0.5,r.ax==='z'?r.L:0.6),yb);const cx=r.ax==='z'?r.x+s*r.w/2:r.x+r.dir*r.L/2,cz=r.ax==='z'?r.z+r.dir*r.L/2:r.z+s*r.w/2;m.position.set(cx,fy+r.h*0.5+0.2,cz);m.rotation[r.ax==='z'?'x':'z']=-Math.atan2(r.h,r.L)*r.dir*(r.ax==='z'?-1:1);ARNG.add(m);}});
  try{label('🏟 ARN DRONE ARENA',ARN.x,fy+52,ARN.z-ARN.bz-36,22);}catch(e){}})();
function megaScreen(l1,l2){const c=ARN.cv.getContext('2d');const g=c.createLinearGradient(0,0,512,192);g.addColorStop(0,'#14002e');g.addColorStop(1,'#002a3a');c.fillStyle=g;c.fillRect(0,0,512,192);
  c.fillStyle='#ff2bd6';c.font='900 40px system-ui,sans-serif';c.textAlign='center';c.fillText('ARN DRONE ARENA',256,58);c.fillStyle='#00e5ff';c.font='800 34px system-ui,sans-serif';c.fillText(l1,256,112);c.fillStyle='#fff';c.font='700 26px system-ui,sans-serif';c.fillText(l2,256,158);ARN.tex.needsUpdate=true;}
// ---------- the 14-gate 3D race course ----------
const MG={gates:[],next:0,t0:0,on:false,best:LS.get('megaBest',0)};
(function(){const fy=ARN.flat(),hs=[3,6,11,18,9,3,14,24,12,4,7,16,9,3];const N=hs.length;
  for(let i=0;i<N;i++){const a=i/N*Math.PI*2,rx=(ARN.ax-4)*0.81,rz=(ARN.bz-4)*0.81;const x=ARN.x+Math.cos(a)*rx*(i%2?1.06:0.94),z=ARN.z+Math.sin(a)*rz*(i%2?1.06:0.94),y=fy+hs[i]+4;
    const tx=-Math.sin(a)*rx,tz=Math.cos(a)*rz;const yaw=Math.atan2(tx,tz);const R=i===0?6:4.6;
    const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=yaw;ARNG.add(g);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(R,0.45,10,40),new THREE.MeshBasicMaterial({color:0xff2bd6}));g.add(ring);
    if(i===0){const ck=new THREE.Mesh(new THREE.TorusGeometry(R+0.9,0.25,8,40),new THREE.MeshBasicMaterial({color:0xffffff}));g.add(ck);}
    // a support pole down to the ground
    const ph=y-R-fy;if(ph>0.5){const p=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,ph,6),new THREE.MeshLambertMaterial({color:0x444a55}));p.position.set(0,-R-ph/2,0);g.add(p);}
    // gate 5 + gate 11 are TUBES you fly through
    if(i===5||i===11){const tb=new THREE.Mesh(new THREE.CylinderGeometry(R,R,22,24,1,true),new THREE.MeshBasicMaterial({color:0x00e5ff,wireframe:true,transparent:true,opacity:0.55}));tb.rotation.x=Math.PI/2;g.add(tb);}
    MG.gates.push({g,ring,x,y,z,R,yaw,n:i+1});}
  // slalom poles & floating cubes between gates for flavour
  const pm=new THREE.MeshBasicMaterial({color:0xffd60a});for(let i=0;i<10;i++){const a=(i+0.5)/10*Math.PI*2,x=ARN.x+Math.cos(a)*(ARN.ax-4)*0.45,z=ARN.z+Math.sin(a)*(ARN.bz-4)*0.45;const p=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,14,8),pm);p.position.set(x,fy+7,z);ARNG.add(p);}
  megaScreen('Fly through the white ring to start!','Best: '+(MG.best?MG.best.toFixed(2)+'s':'— none yet —'));})();
// HUD
(function(){const d=document.createElement('div');d.id='megaHud';d.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:calc(92px + env(safe-area-inset-top));z-index:13;display:none;padding:6px 14px;border-radius:14px;background:linear-gradient(90deg,#ff2bd6cc,#00b8d9cc);color:#fff;font:800 15px system-ui,sans-serif;text-shadow:0 1px 2px #000;pointer-events:none;white-space:nowrap';document.body.appendChild(d);
  const st=document.createElement('style');st.textContent='body.pt #megaHud{top:calc(215px + env(safe-area-inset-top))}';document.head.appendChild(st);})();
function megaReset(msg){MG.on=false;MG.next=0;MG.gates.forEach((G,i)=>G.ring.material.color.setHex(i===0?0xffffff:0xff2bd6));if(msg)toast(msg,3000);}
{let last=performance.now(),prev=null;const tk=()=>{const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;try{if(started&&D&&D.pos){const p=D.pos;
  const near=Math.hypot((p.x-ARN.x)/ARN.ax,(p.z-ARN.z)/ARN.bz)<1.6;const hud=$('megaHud');
  // pulsing next gate
  const t=now/1000;MG.gates.forEach((G,i)=>{if(i===MG.next){const s=1+Math.sin(t*6)*0.08;G.ring.scale.set(s,s,s);G.ring.material.color.setHex(MG.on?0x30d158:0xffffff);}else G.ring.scale.set(1,1,1);});
  // crowd bounces
  if(ARN.crowd&&near&&Math.floor(t*10)%2===0){}
  if(prev&&near&&!(WS&&WS.open)){const G=MG.gates[MG.next];const loc=new THREE.Vector3(p.x,p.y,p.z);G.g.worldToLocal(loc);const pl=new THREE.Vector3(prev.x,prev.y,prev.z);G.g.worldToLocal(pl);
    if(Math.sign(loc.z)!==Math.sign(pl.z)&&Math.hypot(loc.x,loc.y)<G.R+0.6){beep(MG.next===0?1046:880,0.12,0.12);
      if(MG.next===0&&!MG.on){MG.on=true;MG.t0=now;MG.next=1;toast('🏁 GO! Fly through the green rings in order',2200);}
      else if(MG.on){G.ring.material.color.setHex(0x3a3a3a);MG.next++;if(MG.next>=MG.gates.length){const tt=(now-MG.t0)/1000;const nb=!MG.best||tt<MG.best;if(nb){MG.best=tt;LS.set('megaBest',tt);}
          megaScreen('LAP '+tt.toFixed(2)+'s'+(nb?'  🏆 NEW BEST!':''),'Best: '+MG.best.toFixed(2)+'s');beep(1320,0.4,0.12);megaReset((nb?'🏆 NEW ARENA RECORD ':'🏁 Lap ')+tt.toFixed(2)+'s!'+(nb?'':' (best '+MG.best.toFixed(2)+'s)'));MG.next=0;}}}
    if(MG.on&&(now-MG.t0)>240000)megaReset('⏱ Race timed out');}
  if(near){hud.style.display='block';hud.textContent=MG.on?'🏁 Gate '+MG.next+'/'+MG.gates.length+' · '+((now-MG.t0)/1000).toFixed(1)+'s'+(MG.best?' · best '+MG.best.toFixed(1)+'s':''):'🏟 Fly through the ⚪ white ring to start the race'+(MG.best?' · best '+MG.best.toFixed(1)+'s':'');}else{hud.style.display='none';if(MG.on)megaReset('🏟 Left the arena — race cancelled');}
  // point the finder arrow at the next gate while racing
  try{if(near&&window.FINDT!==undefined){const G=MG.gates[MG.next];window.FINDT={ic:MG.on?'🟢':'⚪',n:MG.on?'Gate '+(MG.next+1):'Start ring',get:()=>({x:G.x,z:G.z}),mega:1};}else if(window.FINDT&&window.FINDT.mega)window.FINDT=null;}catch(e){}
  prev={x:p.x,y:p.y,z:p.z};}}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
// ---------- the tunnel gets cool: rainbow neon rings, boost pads, timed run ----------
const TR={rings:[],pads:[],t0:0,on:false,best:LS.get('tunBest',0)};
(function(){const N=14;for(let i=0;i<N;i++){const z=TUN.z0+TUN.cov0+8+i*((TUN.cov1-TUN.cov0-16)/(N-1)),fy=tunSurf(z)-tunDepth(z);const c=new THREE.Color().setHSL(i/N,1,0.55);
    const r=new THREE.Mesh(new THREE.TorusGeometry(TUN.w/2-0.6,0.22,8,32,Math.PI),new THREE.MeshBasicMaterial({color:c}));r.position.set(TUN.x,fy+0.2,z);scene.add(r);TR.rings.push({m:r,h:i/N});}
  // glowing floor strips along the walls
  const st=new THREE.MeshBasicMaterial({color:0x00e5ff});for(const sd of [-1,1]){const L=TUN.cov1-TUN.cov0;const zc=TUN.z0+(TUN.cov0+TUN.cov1)/2,fy=tunSurf(zc)-tunDepth(zc);const s=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.12,L),st);s.position.set(TUN.x+sd*(TUN.w/2-0.4),fy+0.25,zc);scene.add(s);}
  // boost pads (arrows on the floor)
  const pm=new THREE.MeshBasicMaterial({color:0xff9f0a});for(const zz of [TUN.z0+TUN.cov0+20,TUN.z0+TUN.cov0+65,TUN.z0+TUN.cov1-20]){const fy=tunSurf(zz)-tunDepth(zz);const g=new THREE.Group();for(let k=0;k<3;k++){const a=new THREE.Mesh(new THREE.ConeGeometry(1.6,2.4,3),pm);a.rotation.x=Math.PI/2;a.position.set(0,0,k*2.6-2.6);a.scale.y=0.2;g.add(a);}g.position.set(TUN.x,fy+0.25,zz);scene.add(g);TR.pads.push({z:zz,g});}
  try{label('⚡ BOOST',TUN.x,tunSurf(TUN.z0+TUN.cov0)+3,TUN.z0+TUN.cov0+20,8);}catch(e){}})();
{let last=performance.now();const tk=()=>{const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;try{const t=now/1000;TR.rings.forEach((r,i)=>r.m.material.color.setHSL((r.h+t*0.25)%1,1,0.55));TR.pads.forEach(p=>p.g.children.forEach((a,k)=>a.material.opacity=1));
  if(started&&D&&D.pos){const p=D.pos,inT=Math.abs(p.x-TUN.x)<TUN.w/2&&p.z>TUN.z0+TUN.cov0&&p.z<TUN.z0+TUN.cov1&&p.y<tunSurf(p.z)-0.5;
    if(inT&&!TR.on){TR.on=true;TR.t0=now;TR.dir=Math.sign(D.vel.z)||1;}
    if(TR.on&&!inT){TR.on=false;const tt=(now-TR.t0)/1000;const ok=(TR.dir>0?p.z>=TUN.z0+TUN.cov1:p.z<=TUN.z0+TUN.cov0);if(ok&&tt>1){const nb=!TR.best||tt<TR.best;if(nb){TR.best=tt;LS.set('tunBest',tt);}toast((nb?'🏆 Tunnel record! ':'⛏ Tunnel run ')+tt.toFixed(2)+'s'+(nb?'':' (best '+TR.best.toFixed(2)+'s)'),3000);}}
    // boost pads: zoom!
    for(const pd of TR.pads){if(Math.abs(p.z-pd.z)<3&&Math.abs(p.x-TUN.x)<4&&p.y<tunSurf(p.z)-0.5&&(!pd.cool||now>pd.cool)){pd.cool=now+800;const sp=Math.hypot(D.vel.x,D.vel.z),dir=Math.sign(D.vel.z)||1;const ns=Math.min(Math.max(sp*1.6,sp+12),45);D.vel.z=dir*ns;D.vel.x*=0.5;beep(1500,0.15,0.1);toast('⚡ BOOST!',900);}}}}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
// AI knows the arena
{const a0=aiPlaces;aiPlaces=function(){const L=a0.apply(this,arguments).slice();L.push({n:ARN.n,x:ARN.x,z:ARN.z-ARN.bz+20});L.push({n:'the race arena',x:ARN.x,z:ARN.z-ARN.bz+20});L.push({n:'the drone arena',x:ARN.x,z:ARN.z-ARN.bz+20});return L;};}
