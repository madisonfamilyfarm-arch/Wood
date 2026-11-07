// ---------------------------------------------------------------- 🔫 weapons: paintball, machine gun, rockets — bolt them onto anything you fly (Menu → 🔫 Weapons)
const WPN=Object.assign({blast:6,destroy:4,rspd:40,mgRate:12,dmg:true},LS.get('wpn',{}));
function saveWpn(){LS.set('wpn',WPN);}
const WTYPES={paint:{ic:'🎨',n:'Paintball',badge:'🎨 PAINTBALL',spd:48,g:9.8,life:2.5},mg:{ic:'🔫',n:'Machine gun',badge:'🔫 MACHINE GUN',spd:150,g:2,life:1.6},rocket:{ic:'🚀',n:'Rockets',badge:'🚀 ROCKETS',spd:40,g:1.2,life:5}};
const WSLOTS=['nose','left','right','belly','top'],WSLOTN={nose:'👃 Nose',left:'⬅ Left side',right:'➡ Right side',belly:'⬇ Belly',top:'⬆ Top'};
let wCur=0,shotN=0;
function weaponTypes(){const set=[];((DR&&DR.guns)||[]).forEach(g=>{if(!set.includes(g.w))set.push(g.w);});if(!set.length)set.push('paint');return set;}
function curWeapon(){const T=weaponTypes();return T[wCur%T.length];}
function cycleShot(){const T=weaponTypes();
  if(shotMode==='photo')shotMode='video';else if(shotMode==='video'){shotMode='gun';wCur=0;}else if(shotMode==='gun'&&wCur<T.length-1)wCur++;else{shotMode='photo';wCur=0;}
  updBadge();const w=WTYPES[curWeapon()];
  toast(shotMode==='photo'?'📷 Photo mode':shotMode==='video'?'🎥 Video mode — PHOTO starts/stops'+(rec?' (still recording)':''):w.ic+' '+w.n+' — PHOTO fires (hold = keep firing)'+(T.length>1?' · switch again for the next weapon':'')+(rec?' · still recording':''),1600);}
function nextWeapon(){const T=weaponTypes();if(shotMode!=='gun'){shotMode='gun';wCur=0;}else wCur=(wCur+1)%T.length;updBadge();const w=WTYPES[curWeapon()];toast(w.ic+' '+w.n,900);}
function updBadge(){const b=$('badge'),w=WTYPES[curWeapon()]||WTYPES.paint;b.textContent=(rec?'🔴 REC '+fmt((performance.now()-rec.t0)/1000)+' · ':'')+(shotMode==='photo'?'📷 PHOTO':shotMode==='video'?'🎥 VIDEO':w.badge);b.style.borderColor=rec?'#ff3b30':shotMode==='photo'?'#4ade80':shotMode==='video'?'#ffb020':'#ff6b6b';
  $('bShot').textContent=shotMode==='photo'?'📷 PHOTO':shotMode==='video'?(rec?'⏹ STOP':'⏺ REC'):w.ic+' FIRE';$('bFire').style.display=shotMode==='gun'&&!vr.on?'block':'none';$('bFire').innerHTML=w.ic+'<br>FIRE';}
const shots=[],splats=[],pbGeo=new THREE.SphereGeometry(0.07,6,4),PBC=[0xff3b30,0xffcc00,0x34c759,0x0a84ff,0xff2d55,0xbf5af2];
const tracerGeo=new THREE.BoxGeometry(0.035,0.035,1.1),rocketGeo=(function(){const g=new THREE.CylinderGeometry(0.05,0.05,0.5,8);g.rotateX(Math.PI/2);return g;})(),noseGeo=(function(){const g=new THREE.ConeGeometry(0.05,0.14,8);g.rotateX(-Math.PI/2);g.translate(0,0,-0.31);return g;})();
const MATW={tracer:new THREE.MeshBasicMaterial({color:0xffe066}),rocket:new THREE.MeshLambertMaterial({color:0xe8e8e8}),nose:new THREE.MeshLambertMaterial({color:0xff3030}),flame:new THREE.MeshBasicMaterial({color:0xffa030,transparent:true,opacity:0.9,depthWrite:false})};
function aimDir(origin){const c=camName(),v=new V3();
  if(c==='GIMBAL'||c==='FPV'||(typeof WALK!=='undefined'&&WALK.on)){v.set(0,0,-1).applyQuaternion(cam.quaternion);const aim=cam.position.clone().addScaledVector(v,90);return aim.sub(origin).normalize();}
  const k=vkind();if(k==='plane'||k==='car'||k==='boat'||SPEC.parts&&SPEC.flyAs&&SPEC.flyAs!=='drone')return v.set(0,0,-1).applyQuaternion(DR.g.quaternion).normalize();
  return v.set(0,0,-1).applyEuler(_e.set(D.gimbal*0.5,D.yaw,0,'YXZ'));}
function fire(){
  if(D.state!=='flying'&&D.state!=='takeoff'&&!(vkind()==='car'||vkind()==='boat')){if(!fire.warned){fire.warned=1;toast('Take off first');setTimeout(()=>fire.warned=0,1500);}firing=false;return;}
  const w=curWeapon(),now=performance.now(),rate=w==='mg'?1000/clamp(WPN.mgRate,1,60):w==='rocket'?650:130;if(now-(fire.last||0)<rate)return;fire.last=now;
  const guns=((DR&&DR.guns)||[]).filter(g=>g.w===w),o=new V3();if(guns.length){fire.k=(fire.k||0)+1;guns[fire.k%guns.length].obj.getWorldPosition(o);}else mountPos(o);
  const T=WTYPES[w],dir=aimDir(o),spd=w==='rocket'?clamp(WPN.rspd,5,CFG.real!==false?120:600):T.spd;
  const v=dir.multiplyScalar(spd).add(D.vel),col=PBC[Math.floor(Math.random()*PBC.length)],sid=mp.id+'.'+(++shotN);
  spawnShot(w,o,v,col,true,sid,mp.id);mpSend({t:'shot',w,p:o.toArray().map(r2),v:v.toArray().map(r2),col,sid});
  if(w==='paint')beep(1200,0.03,0.03);else if(w==='mg')beep(180+Math.random()*60,0.04,0.05);else{beep(300,0.25,0.07);beep(90,0.3,0.05);shake=Math.max(shake,0.12);}
}
function spawnShot(w,p,v,col,own,sid,by){
  let m;if(w==='mg'){m=new THREE.Mesh(tracerGeo,MATW.tracer);}
  else if(w==='rocket'){m=new THREE.Group();m.add(new THREE.Mesh(rocketGeo,MATW.rocket));m.add(new THREE.Mesh(noseGeo,MATW.nose));const f=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.35,8),MATW.flame);f.rotation.x=-Math.PI/2;f.position.z=0.42;m.add(f);m.userData.flame=f;}
  else m=new THREE.Mesh(pbGeo,new THREE.MeshBasicMaterial({color:col}));
  m.position.copy(p);if(w!=='paint')m.lookAt(p.clone().add(v));scene.add(m);
  shots.push({w,m,v:v.clone(),life:WTYPES[w].life,col,own,sid,by,prev:p.clone(),puff:0});}
function killShot(s){scene.remove(s.m);if(s.w==='paint')s.m.material.dispose();const i=shots.indexOf(s);if(i>=0)shots.splice(i,1);}
function splat(p,col){const s=new THREE.Mesh(new THREE.CircleGeometry(0.22,8),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.9,depthWrite:false}));s.position.copy(p);s.lookAt(cam.position);scene.add(s);splats.push(s);if(splats.length>60){const o=splats.shift();scene.remove(o);o.geometry.dispose();}}
// paint that sticks to an aircraft (yours or a friend's) — lp is a point in the model's own space, so it lands in the same spot on every screen
function paintOn(mesh,lp,col){if(!mesh||!mesh.g)return;const s=mesh.g.scale.x||1,r=0.06/s;
  const b=new THREE.Mesh(new THREE.SphereGeometry(r,8,6),new THREE.MeshLambertMaterial({color:col}));b.position.copy(lp);const n=lp.clone();if(n.lengthSq()<1e-8)n.set(0,1,0);n.normalize();b.quaternion.setFromUnitVectors(UP,n);b.scale.set(1.4,0.35,1.4);
  mesh.g.add(b);(mesh.splats=mesh.splats||[]).push(b);if(mesh.splats.length>50)mesh.g.remove(mesh.splats.shift());}
function clearPaint(mesh){if(mesh&&mesh.splats){mesh.splats.forEach(b=>mesh.g.remove(b));mesh.splats=[];}}
const _sv=new V3(),_sw=new V3();
function segSphere(a,b,c,r){_sv.subVectors(b,a);const L=_sv.lengthSq()||1e-9,t=clamp(_sw.subVectors(c,a).dot(_sv)/L,0,1);_sw.copy(a).addScaledVector(_sv,t);return _sw.distanceTo(c)<r?_sw.clone():null;}
function tickShots(dt){
  if(firing&&shotMode==='gun')fire();
  for(let i=shots.length-1;i>=0;i--){const s=shots[i],T=WTYPES[s.w];s.prev.copy(s.m.position);
    if(s.w==='rocket'){const sp=s.v.length(),top=Math.max(WPN.rspd,20)*1.9;if(sp<top)s.v.multiplyScalar(1+dt*0.9);s.puff-=dt;if(s.puff<=0){s.puff=0.035;puff(s.m.position,0xcfcfcf,0.12,1.4);}if(s.m.userData.flame)s.m.userData.flame.scale.set(1,0.7+Math.random()*0.6,1);}
    s.v.y-=T.g*dt;s.m.position.addScaledVector(s.v,dt);if(s.w!=='paint')s.m.lookAt(_p.copy(s.m.position).add(s.v));s.life-=dt;
    const P=s.m.position;let gone=false,boomAt=null;
    for(const b of balloons)if(b.alive&&segSphere(s.prev,P,b.g.position,0.7)){popBalloon(b,!s.own);if(s.w==='paint'||s.w==='mg')gone=true;else boomAt=P.clone();break;}
    if(!gone&&!boomAt&&s.own){for(const id in mp.peers){const pe=mp.peers[id];if(!pe.mesh||pe.hd)continue;const hp=segSphere(s.prev,P,pe.p,pe.rad+0.12);if(!hp)continue;
        if(s.w==='paint'){const lp=pe.mesh.g.worldToLocal(hp.clone());paintOn(pe.mesh,lp,s.col);mpSend({t:'hit',to:id,w:'paint',lp:lp.toArray().map(r4),col:s.col});beep(700,0.05,0.04);gone=true;}
        else if(s.w==='mg'){sparks(hp,0xffdd66);mpSend({t:'hit',to:id,w:'mg'});gone=true;}else boomAt=hp;break;}}
    if(!gone&&!boomAt&&!s.own&&DR&&segSphere(s.prev,P,D.pos,ST.rad+0.12)){gone=true;} // the shooter tells us if it hit
    if(!gone&&!boomAt){const gy=H(P.x,P.z),wet=inWater(P.x,P.z)&&P.y<WATER_Y;
      if(hitTest(P,0.05)||P.y<gy||wet||objHitTest(P)){if(s.w==='paint'){if(!wet)splat(P,s.col);gone=true;}else if(s.w==='mg'){puff(P,wet?0xbfe3ff:0x8a7a60,0.1,0.8);gone=true;}else boomAt=P.clone();}}
    if(!gone&&!boomAt)for(const d of deer)if(Math.hypot(d.x-P.x,d.z-P.z)<0.8&&P.y-H(d.x,d.z)<1.8){d.state='flee';d.t=4;d.dir=Math.atan2(d.x-D.pos.x,d.z-D.pos.z);if(s.w==='paint')splat(P,s.col);if(s.w==='rocket')boomAt=P.clone();gone=true;break;}
    if(!gone&&!boomAt&&s.life<=0){if(s.w==='rocket')boomAt=P.clone();else gone=true;}
    if(boomAt){if(s.own){const r=clamp(WPN.blast,0.5,CFG.real!==false?20:300),dr=clamp(WPN.destroy,0,CFG.real!==false?12:200);explode(boomAt,r,dr,true,CFG.name,mp.id);mpSend({t:'boom',p:boomAt.toArray().map(r2),r,dr,sid:s.sid});}gone=true;}
    if(gone)killShot(s);}
  tickFxBits(dt);
}
// ---- smoke puffs, sparks, fireballs, falling trees
const FXB=[];
function puff(p,col,r,grow){if(FXB.length>260)return;const m=new THREE.Mesh(GEO.ball,new THREE.MeshLambertMaterial({color:col,transparent:true,opacity:0.7,depthWrite:false}));m.position.copy(p);m.scale.setScalar(r);scene.add(m);FXB.push({m,t:0,life:1.1,grow:grow||1,r,vy:0.6});}
function sparks(p,col){for(let k=0;k<6;k++){if(FXB.length>260)return;const m=new THREE.Mesh(GEO.box,new THREE.MeshBasicMaterial({color:col}));m.position.copy(p);m.scale.setScalar(0.04);scene.add(m);FXB.push({m,t:0,life:0.35,v:new V3((Math.random()-0.5)*6,Math.random()*4,(Math.random()-0.5)*6),r:0.04});}}
function tickFxBits(dt){for(let i=FXB.length-1;i>=0;i--){const f=FXB[i];f.t+=dt;const u=f.t/f.life;
  if(f.v){f.v.y-=9.8*dt;f.m.position.addScaledVector(f.v,dt);if(f.spin){f.m.rotation.x+=f.spin*dt;f.m.rotation.z+=f.spin*0.7*dt;}const gy=H(f.m.position.x,f.m.position.z);if(f.m.position.y<gy){f.m.position.y=gy;f.v.multiplyScalar(0.3);f.v.y=Math.abs(f.v.y)*0.3;}}
  else if(f.fire){const s=f.r*(0.25+0.95*Math.min(1,u*3.2));f.m.scale.setScalar(s);f.m.material.opacity=Math.max(0,1-u);if(f.light){f.light.intensity=Math.max(0,3*(1-u*2.5));}}
  else if(f.tree){const k=Math.min(1,f.t/1.3);f.m.rotation.set(0,0,0);f.m.quaternion.setFromAxisAngle(f.ax,k*k*1.5);if(f.t>4)f.m.position.y-=dt*0.6;}
  else{f.m.position.y+=f.vy*dt;f.m.scale.setScalar(f.r*(1+u*f.grow*3));f.m.material.opacity=0.7*(1-u);}
  if(f.t>=f.life){scene.remove(f.m);if(f.light)scene.remove(f.light);if(f.m.material&&f.m.material.dispose&&!f.keepMat)f.m.material.dispose();FXB.splice(i,1);}}}
function boomSound(dist,big){try{const A=beep.a||(beep.a=new (window.AudioContext||window.webkitAudioContext)());const len=A.sampleRate*(big?1.8:1.1),b=A.createBuffer(1,len,A.sampleRate),d=b.getChannelData(0);let x=0;for(let i=0;i<len;i++){x=x*0.9+(Math.random()*2-1)*0.1;d[i]=x*5*Math.pow(1-i/len,2);}
  const s=A.createBufferSource(),f=A.createBiquadFilter(),g=A.createGain();f.type='lowpass';f.frequency.value=big?500:900;g.gain.value=clamp(1.6/(1+dist*0.04),0.05,1.6)*CFG.vol/100;s.buffer=b;s.connect(f);f.connect(g);g.connect(A.destination);s.start(A.currentTime+Math.min(1.5,dist/340));}catch(e){}}
function explode(p,r,dr,own,byName,byId){
  r=Math.max(0.5,r||4);const dist=cam.position.distanceTo(p);boomSound(dist,r>8);
  const fb=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),new THREE.MeshBasicMaterial({color:0xffa030,transparent:true,opacity:1,depthWrite:false}));fb.position.copy(p);scene.add(fb);
  const lt=new THREE.PointLight(0xffaa55,3,r*6);lt.position.copy(p);scene.add(lt);FXB.push({m:fb,t:0,life:0.7,fire:true,r,light:lt});
  const core=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:1,depthWrite:false}));core.position.copy(p);scene.add(core);FXB.push({m:core,t:0,life:0.35,fire:true,r:r*0.55});
  for(let k=0;k<Math.min(14,4+r);k++)puff(p.clone().add(new V3((Math.random()-0.5)*r,(Math.random()-0.2)*r*0.6,(Math.random()-0.5)*r)),k%3?0x444444:0x777777,r*0.18,1.6);
  for(let k=0;k<8;k++){const m=new THREE.Mesh(GEO.box,MAT.dark);m.position.copy(p);m.scale.setScalar(0.08+Math.random()*0.12);scene.add(m);FXB.push({m,t:0,life:3,v:new V3((Math.random()-0.5)*r*3,2+Math.random()*r*1.5,(Math.random()-0.5)*r*3),spin:8,r:0.1,keepMat:true});}
  if(dist<r*4)shake=Math.max(shake,clamp(1.2-dist/(r*4),0.15,1.2));
  // trees in the destroy radius get knocked flat (everyone sees the same trees go)
  const gy=H(p.x,p.z);if(dr>0.3&&p.y-gy<dr+16)addCrater({x:+p.x.toFixed(2),z:+p.z.toFixed(2),r:+dr.toFixed(2)},true);
  if(p.y-gy<r+0.5){const sc=new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.6,Math.min(r,dr||r)*0.7),20),new THREE.MeshBasicMaterial({color:0x1a1410,transparent:true,opacity:0.75,depthWrite:false}));sc.rotation.x=-Math.PI/2;sc.position.set(p.x,gy+0.04,p.z);scene.add(sc);splats.push(sc);if(splats.length>60){const o=splats.shift();scene.remove(o);}}
  for(const b of balloons)if(b.alive&&b.g.position.distanceTo(p)<r+0.5)popBalloon(b,!own);
  for(const d of deer)if(Math.hypot(d.x-p.x,d.z-p.z)<r*3){d.state='flee';d.t=5;d.dir=Math.atan2(d.x-p.x,d.z-p.z);}
  // you
  if(DR&&WPN.dmg&&D.state!=='down'){const d=D.pos.distanceTo(p);if(d<r){const k=1-d/r,away=D.pos.clone().sub(p);away.y=Math.abs(away.y)+0.5;away.normalize();
      D.vel.addScaledVector(away,4+k*14);if(D.state==='landed'||D.state==='flying'||D.state==='takeoff'){const who=byId===mp.id?'your own rocket':byName+'\'s rocket';if(k>0.5)breakApart('💥 Blown to bits by '+who+'!');else{DR.props.forEach(P=>{if(Math.random()<0.6+k)setPropState(P,'broken');});if(D.state==='landed')D.state='flying';fall(who);}}}}
}
// a falling tree (just for looks — the real one is already gone)
function fallingTree(t,c){const g=new THREE.Group(),h=t.pine?t.h*0.45:t.h*0.6;const tr=new THREE.Mesh(GEO.trunk,MAT.trunk);tr.scale.set(t.tr,h,t.tr);g.add(tr);
  const top=new THREE.Mesh(t.pine?GEO.cone:GEO.ball,new THREE.MeshLambertMaterial({color:t.pine?0x2f5a26:0x4a6b2a}));if(t.pine){top.scale.set(t.cr,t.h*0.6,t.cr);top.position.y=t.h*0.22;}else{top.scale.set(t.cr,t.cr*0.85,t.cr);top.position.y=t.h*0.72;}g.add(top);
  g.position.set(t.x,t.y,t.z);scene.add(g);const away=new V3(t.x-c.x,0,t.z-c.z);if(away.lengthSq()<0.01)away.set(1,0,0);away.normalize();const ax=new V3(away.z,0,-away.x);FXB.push({m:g,t:0,life:7,tree:true,ax,keepMat:true});}
const CRATERS=LS.get('craters',[]);
function inCrater(x,z){for(let i=0;i<CRATERS.length;i++){const c=CRATERS[i],dx=x-c.x,dz=z-c.z;if(dx*dx+dz*dz<c.r*c.r)return true;}return false;}
function addCrater(c,anim){CRATERS.push(c);if(CRATERS.length>400)CRATERS.shift();LS.set('craters',CRATERS);
  for(const [k,ch] of [...chunks]){const x0=ch.i*CH,z0=ch.j*CH;if(c.x<x0-c.r||c.x>x0+CH+c.r||c.z<z0-c.r||c.z>z0+CH+c.r)continue;
    const hit=ch.trees.filter(t=>(t.x-c.x)**2+(t.z-c.z)**2<c.r*c.r);if(!hit.length)continue;if(anim)hit.slice(0,30).forEach(t=>fallingTree(t,c));unloadChunk(ch);chunks.set(k,buildChunk(ch.i,ch.j));}}
// shot at by someone else (they tell us)
function gotHit(m,pe){const now=performance.now();
  if(m.w==='paint'){if(m.lp)paintOn(DR,new V3().fromArray(m.lp),m.col);if(now-(gotHit.t||0)>1500){gotHit.t=now;toast('🎨 '+pe.name+' got you with paint!',1200);}beep(600,0.06,0.05);return;}
  if(m.w==='mg'){if(!WPN.dmg)return;sparks(D.pos,0xffdd66);beep(260,0.05,0.06);D.hits=(D.hits||0)+1;if(D.state!=='flying'&&D.state!=='takeoff')return;
    const L=DR.props.filter(P=>P.state!=='broken'&&P.state!=='none');
    if(L.length){const P=L[Math.floor(Math.random()*L.length)];if(Math.random()<0.45){if(P.state==='ok'){setPropState(P,'chip');if(now-(gotHit.t||0)>1200){gotHit.t=now;toast('🔫 '+pe.name+' is shooting you — a prop got chipped!',1500);}}else{setPropState(P,'broken');fall(pe.name+'\'s machine gun');}}}
    else if(D.hits%8===0)breakApart('🔫 '+pe.name+' shot it to pieces!');}}
// blown up / shorted out: bits fly off, props snap, it drops
function breakApart(msg){if(!DR)return;DR.g.updateMatrixWorld(true);let n=0;const meshes=[];DR.g.traverse(o=>{if(o.isMesh&&o.visible&&o.geometry&&o!==DR.g)meshes.push(o);});
  meshes.sort(()=>Math.random()-0.5).slice(0,10).forEach(o=>{const c=new THREE.Mesh(o.geometry,o.material);o.matrixWorld.decompose(c.position,c.quaternion,c.scale);scene.add(c);n++;
    FXB.push({m:c,t:0,life:6,v:new V3((Math.random()-0.5)*6,2+Math.random()*4,(Math.random()-0.5)*6).add(D.vel),spin:9,r:0.1,keepMat:true});});
  DR.props.forEach(P=>setPropState(P,Math.random()<0.5?'none':'broken'));if(DR.arms.length)DR.arms.forEach(A=>{if(Math.random()<0.5){A.state='bent';A.g.rotation.x=-0.45;}});
  puff(D.pos,0x555555,0.3,2);sparks(D.pos,0xffcc44);if(D.state==='landed')D.state='flying';fall();toast(msg,3200);}
// ---- what's bolted on: guns on the model (from the 🔫 menu slots, and workshop gun parts)
const GUNM={paint:new THREE.MeshLambertMaterial({color:0x2f6bff}),mg:new THREE.MeshLambertMaterial({color:0x2b2b2b}),rocket:new THREE.MeshLambertMaterial({color:0x5b6b3a}),barrel:new THREE.MeshLambertMaterial({color:0x111111}),tip:new THREE.MeshLambertMaterial({color:0xff3030})};
function gunMesh(w,L){const g=new THREE.Group(),r=L*0.12;
  if(w==='paint'){const hop=new THREE.Mesh(new THREE.SphereGeometry(r*1.6,10,8),GUNM.paint);hop.position.set(0,r*1.6,L*0.15);g.add(hop);const b=new THREE.Mesh(new THREE.CylinderGeometry(r*0.55,r*0.55,L,8),GUNM.barrel);b.rotation.x=Math.PI/2;g.add(b);}
  else if(w==='mg'){const bx=new THREE.Mesh(GEO.box,GUNM.mg);bx.scale.set(r*2.2,r*2.4,L*0.45);bx.position.z=L*0.2;g.add(bx);const b=new THREE.Mesh(new THREE.CylinderGeometry(r*0.4,r*0.4,L*1.1,8),GUNM.barrel);b.rotation.x=Math.PI/2;b.position.z=-L*0.3;g.add(b);
    const box=new THREE.Mesh(GEO.box,new THREE.MeshLambertMaterial({color:0x4a5a2a}));box.scale.set(r*1.6,r*1.6,r*2);box.position.set(r*2,-r*0.6,L*0.25);g.add(box);}
  else{const pod=new THREE.Mesh(GEO.box,GUNM.rocket);pod.scale.set(r*4,r*4,L);g.add(pod);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(r*0.75,r*0.75,L*1.02,8),GUNM.barrel);t.rotation.x=Math.PI/2;t.position.set(a*r,b*r,0);g.add(t);const tip=new THREE.Mesh(new THREE.SphereGeometry(r*0.6,6,4),GUNM.tip);tip.position.set(a*r,b*r,-L*0.5);g.add(tip);});}
  return g;}
function attachWeapons(m,sp){m.guns=[];m.g.traverse(o=>{if(o.userData&&o.userData.gunW)m.guns.push({w:o.userData.gunW,obj:o.userData.muzzle||o});});
  const W=(sp.weapons||[]).filter(x=>x&&WTYPES[x.w]&&WSLOTS.includes(x.slot));if(!W.length)return;
  const q0=m.g.quaternion.clone(),p0=m.g.position.clone();m.g.quaternion.identity();m.g.position.set(0,0,0);m.g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.g);m.g.quaternion.copy(q0);m.g.position.copy(p0);
  const sz=bb.getSize(new V3()),ctr=bb.getCenter(new V3()),L=clamp(Math.max(sz.x,sz.z)*0.28,0.12,0.9),s=m.g.scale.x||1;
  W.forEach(x=>{const gm=gunMesh(x.w,L),pos={nose:[ctr.x,ctr.y-sz.y*0.1,bb.min.z-L*0.3],left:[bb.min.x-L*0.12,ctr.y,ctr.z-sz.z*0.1],right:[bb.max.x+L*0.12,ctr.y,ctr.z-sz.z*0.1],belly:[ctr.x,bb.min.y-L*0.15,ctr.z-sz.z*0.05],top:[ctr.x,bb.max.y+L*0.15,ctr.z]}[x.slot];
    gm.position.set(pos[0]/s,pos[1]/s,pos[2]/s);gm.scale.setScalar(1/s);m.g.add(gm);const mz=new THREE.Object3D();mz.position.set(0,0,-L*0.65);gm.add(mz);m.guns.push({w:x.w,obj:mz,slot:x.slot});});}
function weaponItems(){const S=()=>SPEC,lim=CFG.real!==false;
  const slotItem=sl=>mItem(()=>WSLOTN[sl]+': '+((S().weapons||[]).find(x=>x.slot===sl)?WTYPES[(S().weapons||[]).find(x=>x.slot===sl).w].ic+' '+WTYPES[(S().weapons||[]).find(x=>x.slot===sl).w].n:'— nothing')+'  ◀ ▶',()=>wSlot(sl,1),d=>wSlot(sl,d));
  return[mInfo('Bolt guns onto what you\'re flying. They show on the model (friends see them too). PHOTO fires in 🎯 weapon mode (the PHOTO/VIDEO switch, G key, or 🔁).'),
    mItem(()=>'🎯 Weapon mode: '+(shotMode==='gun'?'ON — '+WTYPES[curWeapon()].ic+' '+WTYPES[curWeapon()].n:'off')+'  ◀ ▶',()=>nextWeapon(),()=>nextWeapon()),
    ...WSLOTS.map(slotItem),
    mRange('💥 Rocket blast radius'+(lim?'':' (no limit)'),()=>WPN.blast,v=>{WPN.blast=v;saveWpn();},0.5,lim?20:300,lim?0.5:5,v=>v+' m'),
    mRange('🌲 Knocks down trees within',()=>WPN.destroy,v=>{WPN.destroy=v;saveWpn();},0,lim?12:200,lim?1:5,v=>v?v+' m':'none'),
    mRange('🚀 Rocket speed',()=>WPN.rspd,v=>{WPN.rspd=v;saveWpn();},5,lim?120:600,5,v=>v+' m/s'),
    mRange('🔫 Machine gun fire rate',()=>WPN.mgRate,v=>{WPN.mgRate=v;saveWpn();},1,60,1,v=>v+' / second'),
    mItem(()=>'🎯 Weapons hurt aircraft: '+(WPN.dmg?'ON (bullets chip props, rockets crash you)':'off (paint only, nothing breaks)'),()=>{WPN.dmg=!WPN.dmg;saveWpn();}),
    mItem('🌲 Grow back all the knocked-down trees',()=>{CRATERS.length=0;LS.set('craters',[]);reloadWorld();toast('🌲 The woods grew back',1500);}),
    mInfo('Blast, trees, speed, fire rate and damage are shared with everyone in multiplayer.'),
    mItem('◀ Back',()=>menuBack())];}
function wSlot(sl,d){const L=[null,'paint','mg','rocket'],W=(SPEC.weapons||[]).filter(x=>x.slot!==sl),cur=(SPEC.weapons||[]).find(x=>x.slot===sl),i=L.indexOf(cur?cur.w:null),n=L[(i+d+L.length)%L.length];
  if(n)W.push({slot:sl,w:n});const sp=cloneSpec(SPEC);sp.weapons=W;SPEC=sanitize(sp);LS.set('spec',SPEC);const keep={p:D.pos.clone(),s:D.state,a:D.armed,y:D.yaw};rebuildDrone();D.state=keep.s;D.armed=keep.a;if(n){shotMode='gun';wCur=Math.max(0,weaponTypes().indexOf(n));}updBadge();mpSendSpec(true);}
