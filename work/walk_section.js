// =====================================================================================
// ===== 🚶 WALK AROUND as the pilot · 📍 launch whatever you fly right where you're standing =====
// =====================================================================================
const WALK={on:false,pos:new V3(),yaw:0,pitch:-0.12,vy:0,bob:0,me:null,pilotAt:null,inp:null};
const Z0={lx:0,ly:0,rx:0,ry:0,gim:0};
function pilotPos(){return WALK.on?WALK.pos:(WALK.pilotAt||D.home);}
function walkToggle(on){on=on===undefined?!WALK.on:!!on;if(on===WALK.on)return;
  if(on){const b=WALK.pilotAt&&WALK.pilotAt.distanceTo(D.pos)<300?WALK.pilotAt:(D.state==='landed'||D.state==='down'?D.pos:D.home);
    WALK.pos.set(b.x+(b===WALK.pilotAt?0:1.6),0,b.z+(b===WALK.pilotAt?0:1.6));WALK.pos.y=H(WALK.pos.x,WALK.pos.z);WALK.yaw=Math.atan2(-(D.pos.x-WALK.pos.x),-(D.pos.z-WALK.pos.z))||D.yaw;WALK.pitch=-0.12;WALK.vy=0;WALK.on=true;
    document.body.classList.add('walking');toast('🚶 Walking — W/S or ↑↓ walk · A/D side-step · ←→ or drag = look around · Shift = run · Space = jump · L = launch here · K = fly again',5500);}
  else{WALK.on=false;WALK.pilotAt=WALK.pos.clone();document.body.classList.remove('walking');toast('🎮 Flying again — your pilot stays where you were standing',2200);}
  if(menu.open)renderMenu();}
function launchHere(){
  const flying=D.state==='flying'||D.state==='takeoff'||D.state==='tumble';
  if(flying&&isReal()&&!WALK.on){toast('🛬 Land first — or walk somewhere (K) and launch there. (With 🌍 real-world OFF you can launch anywhere, any time.)',3500);return;}
  const W=WALK.on,yaw=W?WALK.yaw:D.yaw;let x=W?WALK.pos.x-Math.sin(yaw)*2.6:D.pos.x,z=W?WALK.pos.z-Math.cos(yaw)*2.6:D.pos.z;
  if(isReal()&&!floats()&&inWater(x,z)){toast('💦 That spot is water — find dry land (or make it 💧 waterproof)',2500);return;}
  if(course){course=null;setCourseVisible();$('course').style.display='none';$('arrow').style.display='none';$('count').style.display='none';count=0;D.lock=false;}
  const k=vkind(),air=!isReal()&&(W?WALK.pitch>0.25:flying);
  resetDrone({x,z,yaw});
  if(W){WALK.pilotAt=WALK.pos.clone();}else WALK.pilotAt=null;
  if(air){const y=W?WALK.pos.y+1.7+Math.max(0,Math.tan(WALK.pitch)*6):Math.max(D.pos.y,groundY(x,z)+3);
    if(W){x=WALK.pos.x-Math.sin(yaw)*6;z=WALK.pos.z-Math.cos(yaw)*6;D.pos.x=x;D.pos.z=z;}D.pos.y=Math.max(y,groundY(x,z)+2);D.armed=true;D.state='flying';D.home.set(x,groundY(x,z),z);
    if(k==='plane'){planeSetFromEuler();D.planeInit=true;const f=new V3(0,0,-1).applyQuaternion(D.pq);D.vel.copy(f.multiplyScalar(Math.max(ST.stall*1.6,8)));D.thr=0.7;}}
  if(W)walkToggle(false);
  toast('📍 '+KINDS[k].ic+' '+SPEC.name+(air?' launched in the air!':' is ready right here — start the motors (🛫)'),2500);mpSendNow();}
const _wv=new V3();
function tickWalk(dt){
  const showMe=!WALK.on&&DR&&camName()!=='PILOT'&&camName()!=='SHOW';
  if(!WALK.me){WALK.me=makePilot('#ffd60a');scene.add(WALK.me);}
  const pp=pilotPos();WALK.me.visible=showMe&&pp.distanceTo(D.pos)<400;if(WALK.me.visible){WALK.me.position.set(pp.x,H(pp.x,pp.z),pp.z);WALK.me.rotation.y=Math.atan2(D.pos.x-pp.x,D.pos.z-pp.z)+Math.PI;}
  if(!WALK.on||menu.open||WS.open||repair.open||$('prog').style.display==='flex')return;
  const k=keys,inp=WALK.inp||Z0,kb=k.KeyW||k.KeyS||k.KeyA||k.KeyD||k.ArrowUp||k.ArrowDown||k.ArrowLeft||k.ArrowRight;
  let fwd,side,turn,look;
  if(kb){fwd=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0);side=(k.KeyD?1:0)-(k.KeyA?1:0);turn=(k.ArrowRight?1:0)-(k.ArrowLeft?1:0);look=(k.KeyE?1:0)-(k.KeyQ?1:0);}
  else{fwd=inp.ly;side=0;turn=inp.lx+inp.rx;look=-inp.ry;} // left stick = walk + turn · right stick = look (up/down inverted, like a plane)
  WALK.yaw-=turn*2.0*dt;WALK.pitch=clamp(WALK.pitch+look*1.4*dt,-1.35,1.35);
  const run=k.ShiftLeft||k.ShiftRight||Math.abs(fwd)>0.92?5.2:2.6,fx=-Math.sin(WALK.yaw),fz=-Math.cos(WALK.yaw);
  _wv.set(fx*fwd+(-fz)*side,0,fz*fwd+fx*side);if(_wv.lengthSq()>1)_wv.normalize();
  const nx=WALK.pos.x+_wv.x*run*dt,nz=WALK.pos.z+_wv.z*run*dt;_p.set(nx,WALK.pos.y+1.0,nz);
  if(!hitTest(_p,0.3)&&!(inWater(nx,nz)&&H(nx,nz)<WATER_Y-0.6)){WALK.pos.x=nx;WALK.pos.z=nz;}
  const g=H(WALK.pos.x,WALK.pos.z);WALK.vy-=9.8*dt;WALK.pos.y+=WALK.vy*dt;if(WALK.pos.y<=g){WALK.pos.y=g;WALK.vy=0;}
  WALK.bob+=_wv.length()*run*dt*2.2;
}
function walkCam(){const p=WALK.pos;cam.position.set(p.x,p.y+1.65+Math.sin(WALK.bob*2)*0.035,p.z);cam.quaternion.setFromEuler(_e.set(WALK.pitch,WALK.yaw,0,'YXZ'));}
(function(){const c=$('gl');let drag=null;
  c.addEventListener('pointerdown',e=>{if(!WALK.on)return;drag=[e.clientX,e.clientY];});
  addEventListener('pointermove',e=>{if(!WALK.on||!drag)return;const dx=e.clientX-drag[0],dy=e.clientY-drag[1];drag=[e.clientX,e.clientY];WALK.yaw-=dx*0.006;WALK.pitch=clamp(WALK.pitch-dy*0.006,-1.35,1.35);});
  addEventListener('pointerup',()=>drag=null);})();
