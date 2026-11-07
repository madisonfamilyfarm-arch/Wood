// =====================================================================================
// ===== 🌍 REAL-WORLD SETTINGS on/off · 🌧 rain breaks things that aren't waterproof · 📦 put things anywhere =====
// =====================================================================================
function isReal(){return CFG.real!==false;}
function isWaterproof(){return SPEC.waterproof===true||(SPEC.waterproof==null&&(vkind()==='boat'||vkind()==='car'));}
function floats(){return isWaterproof()||!isReal();} // lands on water instead of sinking
function realChanged(fromNet){ST=stats(SPEC);if(!isReal()&&CFG.maxH<300){}if(isReal()&&CFG.maxH>300){CFG.maxH=300;saveCfg();}
  if(!fromNet)toast(isReal()?'🌍 Real-world settings ON — weight, wiring, rain and water all count':'🌍 Real-world settings OFF — anything goes: build anything, fly anywhere, put things in mid-air, go to space',4200);
  else toast(isReal()?'🌍 Real-world settings are ON now':'🌍 Real-world settings are OFF now — anything goes',2500);
  if(menu.open)renderMenu();}
// ---- 🌧 rain getting in
D.rain=0;
function tickRain(dt){
  if(!DR)return;const e=WX.eff(),wet=e.mode==='rain'||e.mode==='storm'||e.mode==='snow';
  const out=D.state==='flying'||D.state==='takeoff'||(D.state==='landed'&&D.armed);
  if(isReal()&&wet&&out&&!isWaterproof()){const rate=(e.mode==='storm'?1/22:e.mode==='rain'?1/40:1/110)*(0.4+0.6*e.amt);const was=D.rain;D.rain=Math.min(1,D.rain+rate*dt);
    if(was<0.3&&D.rain>=0.3)toast('💧 Rain is getting into the electronics! Land and get it dry — or make it 💧 waterproof in the builder',4000);
    if(was<0.65&&D.rain>=0.65){toast('⚡ It\'s sputtering — water in the motors!',2500);beep(180,0.2,0.06);}
    if(D.rain>=0.65&&(D.state==='flying'||D.state==='takeoff')){D.vel.y-=Math.random()*5*dt;D.roll+=(Math.random()-0.5)*0.08;D.pitch+=(Math.random()-0.5)*0.06;if(Math.random()<dt*0.8)beep(140,0.05,0.05);}
    if(D.rain>=1){D.rain=0;D.wet=true;breakApart('⚡ The rain shorted it out — it broke apart! (fix it, then give it 💧 waterproofing in the builder)');}}
  else D.rain=Math.max(0,D.rain-dt/(wet?600:50));
}
// ---- 🚀 altitude: thin air up high, space when real-world is OFF
const STARS=(function(){const N=900,g=new THREE.BufferGeometry(),p=new Float32Array(N*3);for(let i=0;i<N;i++){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,s=Math.sqrt(1-u*u);p[i*3]=s*Math.cos(a)*190;p[i*3+1]=Math.abs(u)*190;p[i*3+2]=s*Math.sin(a)*190;}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.4,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false}));m.frustumCulled=false;m.renderOrder=-9;scene.add(m);return m;})();
function airAt(y){return Math.exp(-Math.max(0,y)/7000);}
function spaceK(){const y=cam.position.y;return clamp((y-1500)/6000,0,1);}
function tickSpace(){const k=spaceK();STARS.visible=k>0.02;STARS.position.copy(cam.position);STARS.material.opacity=k;
  if(k>0){const c=new THREE.Color(0x000006);scene.background.lerp(c,k);scene.fog.color.lerp(c,k);if(window.skyM){skyM.uniforms.top.value.lerp(c,k);skyM.uniforms.hor.value.lerp(new THREE.Color(0x0a1430),k*0.9);}scene.fog.far=Math.max(scene.fog.far,lerp(scene.fog.far,4000,k));cam.far=lerp(260,9000,k);cam.updateProjectionMatrix();}
  else if(cam.far!==260){cam.far=260;cam.updateProjectionMatrix();}}
// ---- 📦 things you can put down (shared in multiplayer, remembered)
const OBJS=[],objMesh=new Map();
const OTYPES={hoop:{ic:'⭕',n:'Hoop'},gate:{ic:'🚩',n:'Race gate'},ramp:{ic:'📐',n:'Jump ramp'},wall:{ic:'🧱',n:'Wall'},crates:{ic:'📦',n:'Crate stack'},target:{ic:'🎯',n:'Target'},pad:{ic:'🟡',n:'Landing pad'},tower:{ic:'🗼',n:'Tall tower'},balloon:{ic:'🎈',n:'Balloon'},house:{ic:'🏠',n:'Little house'},cone:{ic:'🔶',n:'Traffic cone'}};
let objSize=LS.get('objSize',1);
function objAdd(o,fromNet){if(!o||!OTYPES[o.type]||OBJS.some(x=>x.id===o.id))return;OBJS.push(o);
  const g=new THREE.Group(),cols=[],s=o.s||1,gy=H(o.x,o.z),y=o.y!=null?o.y:gy;COLLECT=cols;const yaw=o.yaw||0,fx=-Math.sin(yaw),fz=-Math.cos(yaw),sx=-fz,sz=fx;
  const M=c=>new THREE.MeshLambertMaterial({color:c}),add=(geo,m,x,yy,z)=>{const k=new THREE.Mesh(geo,m);k.position.set(x,yy,z);g.add(k);return k;};
  if(o.type==='hoop'){const R=1.5*s,c=new V3(o.x,Math.max(y,gy+R+0.3*(isReal()?1:0)),o.z),n=new V3(fx,0,fz);const ring=add(new THREE.TorusGeometry(R,0.1*Math.max(1,s*0.6),8,32),M(o.col||0xff9f0a),c.x,c.y,c.z);ring.lookAt(c.clone().add(n));addTorus(c,n,R,0.1*Math.max(1,s*0.6));
    if(o.post!==false&&c.y-R-gy>0.2){add(new THREE.CylinderGeometry(0.06,0.06,c.y-R-gy,6),MAT.wood,c.x,(c.y-R+gy)/2,c.z);}}
  else if(o.type==='gate'){const w=5*s,h=3.5*s,b=y;[-1,1].forEach(k=>{const px=o.x+sx*w/2*k,pz=o.z+sz*w/2*k;add(new THREE.CylinderGeometry(0.1,0.13,h,8),M(0xffffff),px,b+h/2,pz);addVCyl(px,pz,0.13,b,b+h);});
    const a=new V3(o.x-sx*w/2,b+h,o.z-sz*w/2),bb=new V3(o.x+sx*w/2,b+h,o.z+sz*w/2),beam=add(GEO.box,M(o.col||0xff3b30),o.x,b+h,o.z);beam.scale.set(w,0.3,0.3);beam.rotation.y=yaw;addHCyl(a,bb,0.18);}
  else if(o.type==='ramp'){const L=4*s,W=3*s,h=1.3*s,ang=Math.atan2(h,L);const r=add(GEO.box,M(o.col||0x8b6a45),o.x,gy+h/2,o.z);r.scale.set(W,0.15,Math.hypot(L,h));r.rotation.order='YXZ';r.rotation.set(ang,yaw,0);
    RAMPS.push({x:o.x,z:o.z,fx:-fx,fz:-fz,len:L,w:W,h,obj:o.id});}
  else if(o.type==='wall'){const L=6*s,h=3*s;const m=add(GEO.box,M(o.col||0xb5523b),o.x,y+h/2,o.z);m.scale.set(L,h,0.4);m.rotation.y=yaw;for(let hh=0.3;hh<h;hh+=0.5)addHCyl(new V3(o.x-sx*L/2,y+hh,o.z-sz*L/2),new V3(o.x+sx*L/2,y+hh,o.z+sz*L/2),0.3);}
  else if(o.type==='crates'){for(let k=0;k<3;k++){const c=1.2*s,cx=o.x+(k===2?0:(k?0.65:-0.65)*c),cy=y+(k===2?c*1.5:c/2);const m=add(GEO.box,M(0xa0743a),cx,cy,o.z);m.scale.setScalar(c*0.98);addBox(cx-c/2,cy-c/2,o.z-c/2,cx+c/2,cy+c/2,o.z+c/2);}}
  else if(o.type==='target'){const R=1*s,cy=y+1.6*s;add(new THREE.CylinderGeometry(0.05,0.05,cy-y,6),MAT.wood,o.x,y+(cy-y)/2,o.z);
    [[R,0xffffff],[R*0.75,0xff3030],[R*0.5,0xffffff],[R*0.25,0xff3030]].forEach(([rr,c],k)=>{const d=add(new THREE.CircleGeometry(rr,24),new THREE.MeshLambertMaterial({color:c,side:THREE.DoubleSide}),o.x+fx*0.01*k,cy,o.z+fz*0.01*k);d.rotation.y=yaw;});addSph(o.x,cy,o.z,R);}
  else if(o.type==='pad'){const R=1.6*s;const d=add(new THREE.CylinderGeometry(R,R,0.06,24),M(0xffd60a),o.x,y+0.03,o.z);const h=add(new THREE.CircleGeometry(R*0.6,24),M(0x222222),o.x,y+0.065,o.z);h.rotation.x=-Math.PI/2;}
  else if(o.type==='tower'){const h=12*s;add(new THREE.CylinderGeometry(0.15*s,0.3*s,h,8),MAT.metal,o.x,y+h/2,o.z);const lt=add(new THREE.SphereGeometry(0.3*s,8,6),new THREE.MeshBasicMaterial({color:0xff2020}),o.x,y+h+0.2,o.z);blinkers.push(lt);g.userData.blink=lt;addVCyl(o.x,o.z,0.3*s,y,y+h+0.3);}
  else if(o.type==='balloon'){const b=add(new THREE.SphereGeometry(0.5*s,12,10),M(o.col||0xff2d55),o.x,y,o.z);b.scale.y=1.2;add(new THREE.CylinderGeometry(0.01,0.01,1.6*s,3),MAT.dark,o.x,y-1.4*s,o.z);}
  else if(o.type==='house'){const w=4*s,h=2.6*s;const b=add(GEO.box,M(0xe8dcc0),o.x,y+h/2,o.z);b.scale.set(w,h,w*0.8);b.rotation.y=yaw;const rf=add(new THREE.ConeGeometry(w*0.8,h*0.6,4),MAT.roof,o.x,y+h+h*0.3,o.z);rf.rotation.y=Math.PI/4+yaw;addBox(o.x-w/2,y,o.z-w/2,o.x+w/2,y+h*1.6,o.z+w/2);}
  else if(o.type==='cone'){const c=add(new THREE.ConeGeometry(0.25*s,0.7*s,12),M(0xff7a00),o.x,y+0.35*s,o.z);add(new THREE.BoxGeometry(0.5*s,0.04,0.5*s),M(0x222222),o.x,y+0.02,o.z);addCone(o.x,o.z,0.25*s,y,y+0.7*s);}
  COLLECT=null;scene.add(g);objMesh.set(o.id,{g,cols});LS.set('objs',OBJS);if(!fromNet)mpSend({t:'obj',op:'add',o});}
function objDel(id,fromNet){const i=OBJS.findIndex(o=>o.id===id);if(i<0)return;const o=OBJS[i];OBJS.splice(i,1);const m=objMesh.get(id);if(m){scene.remove(m.g);m.cols.forEach(gridRemove);if(m.g.userData.blink){const bi=blinkers.indexOf(m.g.userData.blink);if(bi>=0)blinkers.splice(bi,1);}objMesh.delete(id);}
  for(let k=RAMPS.length-1;k>=0;k--)if(RAMPS[k].obj===id)RAMPS.splice(k,1);LS.set('objs',OBJS);if(!fromNet)mpSend({t:'obj',op:'del',oid:id});}
function objClear(fromNet){[...OBJS].forEach(o=>objDel(o.id,true));if(!fromNet)mpSend({t:'obj',op:'clear'});}
function objHitTest(P){for(const o of OBJS)if(o.type==='balloon'&&Math.hypot(P.x-o.x,P.y-o.y,P.z-o.z)<0.65*(o.s||1)){objDel(o.id);beep(1500,0.08,0.09);beep(300,0.12,0.06);return true;}return false;}
function tickObjs(){if(D.state==='flying'||D.state==='takeoff')for(const o of OBJS)if(o.type==='balloon'&&Math.hypot(D.pos.x-o.x,D.pos.y-o.y,D.pos.z-o.z)<ST.rad+0.55*(o.s||1)){objDel(o.id);beep(1500,0.08,0.09);toast('🎈 Pop!',600);break;}}
function placeObj(type){const W=typeof WALK!=='undefined'&&WALK.on,src=W?WALK.pos:D.pos,yaw=W?WALK.yaw:D.yaw,d=W?4:6+ST.rad*2;
  const x=src.x-Math.sin(yaw)*d,z=src.z-Math.cos(yaw)*d,gy=H(x,z);let y=gy;
  if(type==='hoop')y=isReal()?Math.max(gy+1.5*objSize+0.3,W?gy+2.5:src.y):(W?src.y+1.5:src.y);else if(type==='balloon')y=isReal()?Math.max(gy+2,W?gy+2.5:src.y):(W?src.y+1.5:src.y);else if(!isReal()&&!W&&src.y-groundY(src.x,src.z)>1)y=src.y-1;
  const o={id:mp.id+Date.now().toString(36)+Math.floor(Math.random()*999),type,x:+x.toFixed(2),y:+y.toFixed(2),z:+z.toFixed(2),yaw:+yaw.toFixed(3),s:objSize,by:CFG.name,post:isReal()};
  objAdd(o);toast(OTYPES[type].ic+' '+OTYPES[type].n+' placed'+(!isReal()&&y>gy+1?' — floating in the air':''),1400);}
function objNearest(){let b=null,bd=1e9;const src=typeof WALK!=='undefined'&&WALK.on?WALK.pos:D.pos;OBJS.forEach(o=>{const d=Math.hypot(o.x-src.x,o.z-src.z);if(d<bd){bd=d;b=o;}});return b;}
function placeItems(){return[mInfo(()=>isReal()?'Things go down in front of you, on the ground. (Turn 🌍 real-world OFF to put them in mid-air.)':'🌍 Real-world is OFF: things go right where you are — even floating in the sky.'),
  ...Object.keys(OTYPES).map(k=>mItem(OTYPES[k].ic+' '+OTYPES[k].n,()=>{placeObj(k);})),
  mRange('📏 Size',()=>objSize,v=>{objSize=v;LS.set('objSize',v);},0.25,isReal()?3:20,0.25,v=>v+'×'),
  mItem('🗑 Remove the nearest thing',()=>{const o=objNearest();if(o){objDel(o.id);toast('🗑 Removed '+OTYPES[o.type].n,1000);}else toast('Nothing placed yet');}),
  mItem(()=>'🧹 Remove everything ('+OBJS.length+')',()=>{if(!OBJS.length)return;if(confirm('Remove all '+OBJS.length+' placed things (for everyone)?'))objClear();}),
  mInfo('Everyone in multiplayer sees what you put down. They stay when you come back.'),mItem('◀ Back',()=>menuBack())];}
