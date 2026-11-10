// v78: 🪖 better-looking tank + a TURRET you aim with its own little joystick:
//      ◀▶ on the turret stick spins the turret (and the barrel with it) on the hull; ▲▼ tilts the barrel up/down together with the FPV camera tilt.
KITS.tank={n:'🪖 Tank',flyAs:'tank',wp:false,parts:[
  {t:'shape',style:'box',w:22,len:32,d:7,h:3,col:'#56663a'},{t:'shape',style:'wedge',w:22,len:7,d:5,y:-19,h:2.5,rx:180,col:'#4f5e33'},{t:'shape',style:'box',w:20,len:6,d:1.6,y:14,h:7,col:'#4a5530'},
  {t:'wheel',style:'tread',x:-14,y:0,h:0,r:3.5,w:6,len:34,col:'#2f3524'},{t:'wheel',style:'tread',x:14,y:0,h:0,r:3.5,w:6,len:34,col:'#2f3524'},
  {t:'shape',style:'box',w:1.2,len:30,d:3,x:-17.3,h:3.2,col:'#3f4a29'},{t:'shape',style:'box',w:1.2,len:30,d:3,x:17.3,h:3.2,col:'#3f4a29'},
  {t:'light',x:-8,y:-17.5,h:5.5,col:'#fff6d0'},{t:'light',x:8,y:-17.5,h:5.5,col:'#fff6d0'},{t:'shape',style:'cyl',w:2.4,len:2.4,d:4,x:7,y:16,h:8.5,col:'#2a2a2a'},
  {t:'shape',style:'box',w:6,len:3,d:2,x:-6,y:15.5,h:8.5,col:'#3f4a29'},
  // turret (everything from here sits on the turret ring and turns with it)
  {t:'shape',style:'cyl',w:14,len:14,d:2,h:7.5,col:'#4f5e33'},{t:'shape',style:'box',w:12,len:13,d:4,y:1,h:10.5,col:'#56663a'},{t:'shape',style:'wedge',w:12,len:5,d:4,y:-7.5,h:10.5,rx:180,col:'#4f5e33'},
  {t:'shape',style:'cyl',w:5,len:5,d:1,x:-3,y:3,h:13,col:'#3f4a29'},{t:'antenna',x:-4.5,y:6.5,h:12.6},
  {t:'gun',style:'barrel',y:-17,h:11,len:20},{t:'gun',style:'mg',x:3.5,y:-9.5,h:10.5,len:6},
  {t:'battery',h:5,w:5,len:9,x:-4,y:6},{t:'camera',style:'fpv',y:-6,h:13.4,nm:'Turret cam'},{t:'camera',style:'fpv',y:-19,h:5,nm:'Driver cam'}]};
// ---- find the turret in any tank build: a round ring on top of the hull + everything sitting on it
const TUR={yaw:0,pitch:-0.05,stick:{x:0,y:0},on:false};
function turretSetup(){try{const g=DR&&DR.g;if(!g||g.userData.tur!==undefined)return g&&g.userData.tur;g.userData.tur=null;if(!SPEC||!SPEC.parts||!((typeof vhKind==='function'&&vhKind()==='tank')||SPEC.flyAs==='tank'))return null;
  const P=SPEC.parts,kids=g.children.slice();const hullTop=Math.max(...P.filter(p=>p.t==='shape'&&(p.w||0)>=14&&(p.len||0)>=20).map(p=>(p.h||0)+(p.d||0)/2),-99);
  const ring=P.map((p,i)=>({p,i})).filter(o=>o.p.t==='shape'&&o.p.style==='cyl'&&(o.p.w||0)>=8&&(o.p.h||0)>=hullTop-3).sort((a,b)=>(b.p.w||0)-(a.p.w||0))[0];if(!ring)return null;
  const R=ring.p,rw=(R.w||10)/2;const mem=P.map((p,i)=>({p,i})).filter(o=>o.i===ring.i||(o.p.t!=='wheel'&&o.p.t!=='light'&&Math.abs((o.p.x||0)-(R.x||0))<=rw+3&&(o.p.h||0)>=(R.h||0)-0.5&&((o.p.y||0)>=(R.y||0)-rw-14)&&((o.p.y||0)<=(R.y||0)+rw+3)));
  const rc=kids[ring.i];if(!rc)return null;const piv=new THREE.Group();piv.position.copy(rc.position);g.add(piv);
  const guns=[];mem.forEach(o=>{const c=kids[o.i];if(!c)return;const off=c.position.clone().sub(piv.position);g.remove(c);c.position.copy(off);
    if(o.p.t==='gun'){const pp=new THREE.Group();const back=(o.p.len||10)*0.005*(g.userData.bigF?1:1);pp.position.copy(off).add(new THREE.Vector3(0,0,(o.p.len||10)*0.45/100*((c.scale&&c.scale.z)||1)));c.position.set(0,0,-(o.p.len||10)*0.45/100*((c.scale&&c.scale.z)||1));pp.add(c);piv.add(pp);guns.push(pp);}else piv.add(c);});
  g.userData.tur={piv,guns};return g.userData.tur;}catch(e){console.warn('turret',e);return null;}}
{const r0=rebuildDrone;rebuildDrone=function(){const r=r0.apply(this,arguments);TUR.yaw=0;return r;};}
// ---- the little turret joystick
(function(){const st=document.createElement('style');st.textContent=`#turStick{position:fixed;right:calc(170px + env(safe-area-inset-right));bottom:calc(26px + env(safe-area-inset-bottom));width:86px;height:86px;border-radius:50%;background:rgba(40,48,30,.55);border:2px solid rgba(255,255,255,.55);z-index:14;touch-action:none;display:none}
#turStick .k{position:absolute;left:50%;top:50%;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;background:#56663a;border:2px solid #fff;box-shadow:0 2px 6px #0007}
#turStick .l{position:absolute;left:-10px;right:-10px;top:-17px;text-align:center;font:700 11px system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000}
body.pt #turStick{right:calc(72px + env(safe-area-inset-right));bottom:40%;width:84px;height:84px}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='turStick';d.innerHTML='<div class="l">🪖 turret</div><div class="k"></div>';document.body.appendChild(d);const k=d.querySelector('.k');let id=null;
  const mv=e=>{const r=d.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width/2;let x=(e.clientX-cx)/R,y=(e.clientY-cy)/R;const m=Math.hypot(x,y);if(m>1){x/=m;y/=m;}TUR.stick.x=x;TUR.stick.y=y;k.style.transform='translate('+(x*R*0.6)+'px,'+(y*R*0.6)+'px)';};
  d.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();id=e.pointerId;d.setPointerCapture(id);mv(e);});d.addEventListener('pointermove',e=>{if(e.pointerId===id){e.preventDefault();mv(e);}});
  const up=e=>{if(e.pointerId!==id)return;id=null;TUR.stick.x=0;TUR.stick.y=0;k.style.transform='';};d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up);})();
// keyboard: J / L turn the turret, I / K tilt the barrel
const TURK={};addEventListener('keydown',e=>{if(/^Key[JLIK]$/.test(e.code))TURK[e.code]=1;});addEventListener('keyup',e=>{delete TURK[e.code];});
{let last=performance.now();const tk=()=>{const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;try{
  const T=started&&!WALK.on&&DR&&DR.g?turretSetup():null;const show=!!T&&!(menu&&menu.open)&&!(WS&&WS.open)&&!document.body.classList.contains('vr');$('turStick').style.display=show?'block':'none';TUR.on=!!T;
  if(T){const sx=TUR.stick.x+(TURK.KeyL?1:0)-(TURK.KeyJ?1:0),sy=TUR.stick.y+(TURK.KeyK?1:0)-(TURK.KeyI?1:0);
    TUR.yaw-=sx*Math.abs(sx)*1.6*dt;T.piv.rotation.y=TUR.yaw;
    // ▲▼ moves the FPV tilt, and the barrel follows the FPV tilt
    if(Math.abs(sy)>0.05){D.gimbal=clamp(D.gimbal-sy*Math.abs(sy)*0.9*dt,-0.25,0.7);try{const gs=$('gimbal');if(gs)gs.value=Math.round(D.gimbal*180/Math.PI);}catch(e){}}
    TUR.pitch=clamp(D.gimbal,-0.15,0.6);T.guns.forEach(pp=>pp.rotation.x=TUR.pitch);}}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
// shots leave the way the barrel points
{const a0=aimDir;aimDir=function(o){try{if(TUR.on&&DR.g.userData.tur&&DR.g.userData.tur.guns.length&&!/GIMBAL|FPV/.test(camName())){const pp=DR.g.userData.tur.guns[0];pp.updateMatrixWorld(true);const q=new THREE.Quaternion();pp.getWorldQuaternion(q);return new V3(0,0,-1).applyQuaternion(q).normalize();}}catch(e){}return a0.apply(this,arguments);};}
// the turret camera turns with the turret
{const u0=updateCam;updateCam=function(dt){const r=u0.apply(this,arguments);try{if(TUR.on&&/FPV/.test(camName())&&Math.abs(TUR.yaw)>0.001){const tp=DR.g.userData.tur.piv;const q=new THREE.Quaternion();tp.getWorldQuaternion(q);const e=new THREE.Euler().setFromQuaternion(q,'YXZ');cam.quaternion.setFromEuler(new THREE.Euler(D.gimbal,e.y,0,'YXZ'));}}catch(e){}return r;};}
