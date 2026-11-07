// ================================================================ 🛰 3D OVERHEAD TRACK EDITOR (like RealFlight's): look down on the real 3D world, tap to put pieces, drag to move them,
// drag empty ground to pan, wheel / 🔍 to zoom, 🔄 to tilt the view. 🗺 switches back to the flat map.
const MED3={on:true,cx:0,cz:0,h:80,tilt:0,g:null,drag:null,pan:null,moved:false};
function med3Start(){MED3.cx=D.pos.x;MED3.cz=D.pos.z;MED3.h=Math.max(40,Math.min(160,MED3.h||80));if(MED3.on)med3Enter();}
function med3Enter(){MAP.mode='corner';MAP.px=MAP.pz=0;mapApply();document.body.classList.add('med3');med3Preview();}
function med3Leave(){document.body.classList.remove('med3');if(MED3.g){scene.remove(MED3.g);MED3.g=null;}}
{const o0=medOpen;medOpen=function(){const r=o0.apply(this,arguments);med3Start();if(MED3.on)toast('🛰 3D track editor: tap the ground to put pieces · drag a piece to move it · drag the ground to look around · 🔍 zoom',4000);return r;};}
{const c0=medClose;medClose=function(){const r=c0.apply(this,arguments);med3Leave();return r;};}
{const b0=medBar;medBar=function(){const r=b0.apply(this,arguments);const b=$('mapEd');const B=(t,f)=>{const e=document.createElement('button');e.className='btn';e.textContent=t;e.onclick=ev=>{ev.stopPropagation();f();};b.insertBefore(e,b.children[1]||null);return e;};
    B(MED3.on?'🗺 flat map':'🛰 3D view',()=>{MED3.on=!MED3.on;if(MED3.on){MED3.cx=MED3.cx||D.pos.x;med3Enter();}else{med3Leave();mapMode('big');}medBar();});
    if(MED3.on){B('🔍+',()=>{MED3.h=Math.max(12,MED3.h/1.3);});B('🔍−',()=>{MED3.h=Math.min(400,MED3.h*1.3);});B(MED3.tilt?'⬇ straight down':'↗ tilt view',()=>{MED3.tilt=MED3.tilt?0:1;medBar();});B('📍 me',()=>{MED3.cx=D.pos.x;MED3.cz=D.pos.z;});}
    med3Preview();return r;};}
// camera: straight down (or tilted) over the editing spot
{const u0=updateCam;updateCam=function(dt){if(MED.on&&MED3.on){const r=u0.apply(this,arguments);const gy=H(MED3.cx,MED3.cz);
    if(MED3.tilt)cam.position.set(MED3.cx,gy+MED3.h*0.75,MED3.cz+MED3.h*0.65);else cam.position.set(MED3.cx,gy+MED3.h,MED3.cz+0.001);cam.lookAt(MED3.cx,gy,MED3.cz);cam.fov=55;cam.updateProjectionMatrix();
    if(scene.fog&&scene.fog.isFog){scene.fog.near=MED3.h*3;scene.fog.far=MED3.h*8+400;}return r;}return u0.apply(this,arguments);};}
const _mr=new THREE.Raycaster(),_mv=new THREE.Vector2(),_mp3=new V3();
function med3Ground(ev){const rc=$('gl').getBoundingClientRect();_mv.set((ev.clientX-rc.left)/rc.width*2-1,-(ev.clientY-rc.top)/rc.height*2+1);_mr.setFromCamera(_mv,cam);const o=_mr.ray.origin,d=_mr.ray.direction;
  let t=0;for(let i=0;i<800;i++){t+=Math.max(0.5,MED3.h/120);_mp3.copy(o).addScaledVector(d,t);if(_mp3.y<=H(_mp3.x,_mp3.z))break;}return{x:_mp3.x,z:_mp3.z};}
function med3Near(w){let best=-1,bd=Math.max(2,MED3.h*0.045);MED.g.forEach((g,i)=>{const d=Math.hypot(g.x-w.x,g.z-w.z);if(d<bd){bd=d;best=i;}});return best;}
(function(){const c=$('gl');
  c.addEventListener('pointerdown',e=>{if(!(MED.on&&MED3.on))return;e.stopPropagation();const w=med3Ground(e),i=med3Near(w);MED3.moved=false;MED3.down=[e.clientX,e.clientY];
    if(i>=0){medSave();MED.sel=i;MED3.drag=i;medBar();}else{MED3.drag=-1;MED3.pan={x:e.clientX,y:e.clientY,cx:MED3.cx,cz:MED3.cz};}},true);
  addEventListener('pointermove',e=>{if(!(MED.on&&MED3.on)||!MED3.down)return;if(Math.hypot(e.clientX-MED3.down[0],e.clientY-MED3.down[1])>6)MED3.moved=true;
    if(MED3.drag>=0){const w=med3Ground(e),g=MED.g[MED3.drag];if(g){g.x=+w.x.toFixed(1);g.z=+w.z.toFixed(1);med3Preview();}}
    else if(MED3.pan&&MED3.moved){const k=2*MED3.h*Math.tan(27.5*D2R)/innerHeight;MED3.cx=MED3.pan.cx-(e.clientX-MED3.pan.x)*k;MED3.cz=MED3.pan.cz-(e.clientY-MED3.pan.y)*k;}});
  addEventListener('pointerup',e=>{if(!(MED.on&&MED3.on)||!MED3.down)return;const was=MED3.drag;MED3.down=null;MED3.pan=null;MED3.drag=null;
    if(!MED3.moved&&was<0){const w=med3Ground(e);MED.dragI=-1;medUp(w,false);}else if(!MED3.moved&&was>=0){medBar();}med3Preview();});
  c.addEventListener('wheel',e=>{if(!(MED.on&&MED3.on))return;e.preventDefault();e.stopPropagation();MED3.h=clamp(MED3.h*(e.deltaY>0?1.12:1/1.12),12,400);},{passive:false,capture:true});})();
// live 3D preview of every piece while you edit
function med3Preview(){if(MED3.g){scene.remove(MED3.g);MED3.g=null;}if(!(MED.on&&MED3.on))return;const g=new THREE.Group();MED3.g=g;scene.add(g);const G=MED.g,K=KDEF[MED.kind]||{};
  const M=c=>new THREE.MeshBasicMaterial({color:c}),pts=[];
  G.forEach((p,j)=>{const n=G.length>1?trkPieceN(G,j):new V3(0,0,-1),gy=H(p.x,p.z),sel=j===MED.sel,col=sel?0xffd60a:p.t==='hoop'||p.t==='tunnel'?0x33ccff:p.t==='jump'?0xff9f0a:p.t==='neon'?0xff4fd8:0xff6b3a;
    const side=new V3(-n.z,0,n.x);let cy;
    if(p.t==='hoop'||p.t==='tunnel'){const R=p.s;cy=gy+Math.max(R+0.3,p.y);for(const d of(p.t==='tunnel'?[-6,-3,0,3,6]:[0])){const c=new V3(p.x+n.x*d,cy,p.z+n.z*d),r=new THREE.Mesh(new THREE.TorusGeometry(R,Math.max(0.12,MED3.h*0.004),6,28),M(col));r.position.copy(c);r.lookAt(c.clone().add(n));g.add(r);}
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,Math.max(0.1,cy-R-gy),5),M(0x888888));post.position.set(p.x,(cy-R+gy)/2,p.z);g.add(post);}
    else{const w=p.s,h=MED.kind==='plane'?Math.max(6,p.y*2):MED.kind==='car'||MED.kind==='boat'?3.6:Math.max(3,p.y+1.5);cy=gy+h/2;
      for(const sg of[-1,1]){const pl=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,h,6),M(col));pl.position.set(p.x+side.x*w/2*sg,gy+h/2,p.z+side.z*w/2*sg);g.add(pl);}
      const bm=new THREE.Mesh(GEO.box,M(col));bm.scale.set(w,0.3,0.3);bm.position.set(p.x,gy+h,p.z);bm.rotation.y=Math.atan2(-side.z,side.x);g.add(bm);
      if(p.t==='jump'){const L=5,rx=p.x-n.x*(L/2+3),rz=p.z-n.z*(L/2+3);rampDeco(g,rx,H(rx,rz),rz,n.x,n.z,L,Math.max(3,w*0.7),1.6,0xb07a45);}}
    pts.push(new V3(p.x,cy,p.z));
    const sp=numberSprite(),cv=sp.material.map.image,x=cv.getContext('2d');x.fillStyle=sel?'#ffd60a':'#111';x.beginPath();x.arc(32,32,30,0,7);x.fill();x.fillStyle=sel?'#111':'#fff';x.font='bold 32px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(j+1,32,34);sp.material.map.needsUpdate=true;
    sp.position.set(p.x,cy+(p.s||2)+1.5,p.z);const s=Math.max(1.2,MED3.h*0.035);sp.scale.set(s,s,1);sp.material.depthTest=false;sp.renderOrder=9;g.add(sp);});
  if(pts.length>1){const geo=new THREE.BufferGeometry().setFromPoints(pts.concat([pts[0]]));const ln=new THREE.Line(geo,new THREE.LineDashedMaterial({color:0xffd60a,dashSize:2,gapSize:1.2,depthTest:false}));ln.computeLineDistances();ln.renderOrder=8;g.add(ln);}}
{const s0=medSave;medSave=function(){const r=s0.apply(this,arguments);setTimeout(med3Preview,0);return r;};}
{const u0=medUp;medUp=function(){const r=u0.apply(this,arguments);med3Preview();return r;};}
