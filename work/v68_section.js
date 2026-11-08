// v68: ✈️ a REAL-SIZE passenger airliner (hand-built model, not builder parts) — swept wings, winglets, two big engines, striped tail,
//      windows, flaps, slats, landing gear, blinking lights — parked at the secret runway and flown with the normal plane controls
const AIRL_F=37;   // the flying "skeleton" is the RC passenger-jet kit; the whole thing is scaled up 37× to real size (≈40 m long, 36 m wingspan)
function airlTex(draw,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t;}
function makeAirliner(){const G=new THREE.Group();G.name='airliner';
  const silver=new THREE.MeshPhongMaterial({color:0xd8dde2,shininess:70,specular:0x777777}),grey=new THREE.MeshPhongMaterial({color:0xb4bac1,shininess:40}),
    dark=new THREE.MeshPhongMaterial({color:0x1d2633,shininess:90}),black=new THREE.MeshLambertMaterial({color:0x111111}),metal=new THREE.MeshPhongMaterial({color:0x9aa1a9,shininess:100,specular:0xaaaaaa}),
    tire=new THREE.MeshLambertMaterial({color:0x1a1a1a});
  const add=(geo,mat,x,y,z,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);G.add(m);return m;};
  // ---- fuselage: a smooth lathe from the round nose to the up-swept tail cone
  const R=1.88,prof=[[0,-19.75],[0.55,-19.55],[0.95,-19.15],[1.3,-18.6],[1.58,-17.8],[1.78,-16.8],[R,-15.3],[R,9.5],[1.8,11.5],[1.6,13.5],[1.28,15.5],[0.9,17.4],[0.5,19.1],[0.22,19.75]];
  const lg=new THREE.LatheGeometry(prof.map(p=>new THREE.Vector2(p[0],p[1])),40);lg.rotateX(Math.PI/2);
  {const P=lg.attributes.position;for(let i=0;i<P.count;i++){const z=P.getZ(i);if(z>9.5){P.setY(i,P.getY(i)+Math.pow((z-9.5)/10.25,1.6)*1.25);}if(z<-15.3){P.setY(i,P.getY(i)-((-15.3-z)/4.45)*0.35);}}lg.computeVertexNormals();}
  add(lg,silver);
  // belly fairing where the wings join
  {const f=add(new THREE.SphereGeometry(1,24,16),grey,0,-1.35,0.5);f.scale.set(2.05,0.85,7.2);}
  // ---- cabin windows (two rows of little dark ovals) + doors
  {const wg=new THREE.BoxGeometry(0.06,0.34,0.24);const N=56,im=new THREE.InstancedMesh(wg,dark,N*2),o=new THREE.Object3D();let k=0;
    for(let i=0;i<N;i++){const z=-14.2+i*0.46;if(Math.abs(z+1)<0.5)continue;for(const s of [-1,1]){o.position.set(s*(R-0.02),0.55,z);o.updateMatrix();im.setMatrixAt(k++,o.matrix);}}im.count=k;G.add(im);
    const dg=new THREE.BoxGeometry(0.05,1.75,0.85);for(const z of [-15,-1,11.8])for(const s of [-1,1]){const d=add(dg,grey,s*(R-0.01),0.1,z);d.scale.set(1,1,1);}}
  // ---- cockpit windows
  {const cw=new THREE.BoxGeometry(0.42,0.32,0.06);[[-0.95,-17.35,0.5],[-0.36,-17.55,0.15],[0.36,-17.55,-0.15],[0.95,-17.35,-0.5]].forEach(([x,z,ry])=>{const m=add(cw,dark,x,0.95,z,-0.45,ry,0);});}
  // ---- livery: red + blue cheat lines toward the tail, and a name on the side
  {const st=new THREE.BoxGeometry(0.05,0.22,9);for(const s of [-1,1]){add(st,new THREE.MeshLambertMaterial({color:0xc8102e}),s*(R+0.005),-0.55,13.2);add(st,new THREE.MeshLambertMaterial({color:0x0b3d91}),s*(R-0.04),-0.85,13.4);}
    const tx=airlTex((g,w,h)=>{g.clearRect(0,0,w,h);g.font='italic 800 84px Arial, sans-serif';g.fillStyle='#24345c';g.textBaseline='middle';g.fillText('Woods Air',30,h/2+4);g.fillStyle='#c8102e';g.beginPath();g.moveTo(w-150,20);g.lineTo(w-110,20);g.lineTo(w-60,h-20);g.lineTo(w-100,h-20);g.fill();g.fillStyle='#2f6fd6';g.beginPath();g.moveTo(w-100,20);g.lineTo(w-60,20);g.lineTo(w-110,h/2);g.fill();},640,128);
    const nm=new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false});const pg=new THREE.PlaneGeometry(6.4,1.28);
    const a=add(pg,nm,R+0.03,0.15,-9.5,0,Math.PI/2,0);const b=add(pg,nm,-(R+0.03),0.15,-9.5,0,-Math.PI/2,0);}
  // ---- wings: swept-back, tapered, a little dihedral, mirrored left/right
  function wingGeo(side,root,tip,sw,span,chR,chT,thick){const s=new THREE.Shape(),tLE=root[1]+(span-root[0])*Math.tan(sw*D2R);
    s.moveTo(side*root[0],root[1]);s.lineTo(side*span,tLE);s.lineTo(side*span,tLE+chT);s.lineTo(side*root[0],root[1]+chR);s.lineTo(side*root[0],root[1]);
    const g=new THREE.ExtrudeGeometry(s,{depth:thick,bevelEnabled:true,bevelThickness:thick*0.35,bevelSize:thick*0.5,bevelSegments:2,steps:1});g.rotateX(Math.PI/2);g.translate(0,thick/2,0);return g;}
  const WSPAN=17.9,WR=[1.4,-4.2],WCR=6.6,WCT=1.45,WSW=25,DIH=6*D2R;
  for(const s of [-1,1]){const w=new THREE.Group();w.position.set(0,-1.15,0);w.rotation.z=s*DIH;G.add(w);
    const wm=new THREE.Mesh(wingGeo(s,WR,0,WSW,WSPAN,WCR,WCT,0.32),silver);w.add(wm);
    const teAt=x=>WR[1]+WCR+(x-WR[0])*((WR[1]+(WSPAN-WR[0])*Math.tan(WSW*D2R)+WCT)-(WR[1]+WCR))/(WSPAN-WR[0]);const leAt=x=>WR[1]+(x-WR[0])*Math.tan(WSW*D2R);const tAng=Math.atan2((WR[1]+(WSPAN-WR[0])*Math.tan(WSW*D2R)+WCT)-(WR[1]+WCR),WSPAN-WR[0]);
    // flaps (inboard + outboard), aileron, slats — slightly darker panels along the edges
    [[2.4,9.6,0.95,grey],[10,13.6,0.8,grey],[13.9,17,0.6,metal]].forEach(([a,b,ch,mat])=>{const mx=(a+b)/2,L=b-a;const f=new THREE.Mesh(new THREE.BoxGeometry(L,0.1,ch),mat);f.position.set(s*mx,-0.02,teAt(mx)+ch*0.42);f.rotation.y=-s*tAng;w.add(f);});
    [[6.5,17.2,0.55]].forEach(([a,b,ch])=>{const mx=(a+b)/2,L=(b-a)/Math.cos(WSW*D2R);const f=new THREE.Mesh(new THREE.BoxGeometry(L,0.12,ch),metal);f.position.set(s*mx,0,leAt(mx)-ch*0.3);f.rotation.y=-s*WSW*D2R;w.add(f);});
    // flap-track fairings (the little canoes under the wing)
    [5,8.5,12].forEach(x=>{const c=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),grey);c.scale.set(0.22,0.25,1.6);c.position.set(s*x,-0.3,teAt(x)+0.3);w.add(c);});
    // blended winglet
    {const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(1.35,0);sh.lineTo(1.9,2.4);sh.lineTo(1.35,2.4);sh.lineTo(0,0);const g=new THREE.ExtrudeGeometry(sh,{depth:0.12,bevelEnabled:false});g.rotateY(-Math.PI/2);
      const wl=new THREE.Mesh(g,silver);wl.position.set(s*(WSPAN-0.05)+ (s>0?0.06:0.06),0.1,leAt(WSPAN)+0.05);wl.rotation.z=-s*0.22;w.add(wl);
      const fl=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.5,0.6),new THREE.MeshLambertMaterial({color:0xc8102e}));fl.position.set(s*(WSPAN+0.3),1.9,leAt(WSPAN)+1.55);fl.rotation.z=-s*0.22;w.add(fl);}
    // nav light on the tip: red left, green right
    {const L=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6),new THREE.MeshBasicMaterial({color:s<0?0xff2020:0x20ff40}));L.position.set(s*(WSPAN+0.05),0.05,leAt(WSPAN)+0.3);w.add(L);}
    // ---- engine on a pylon, hanging below and ahead of the wing
    {const ex=s*5.6,ez=-5.2,ey=-1.55;const eg=new THREE.Group();eg.position.set(ex,ey,ez);w.add(eg);
      const nac=new THREE.Mesh(new THREE.CylinderGeometry(1.0,0.86,4.3,28,1,true),silver);nac.rotation.x=Math.PI/2;eg.add(nac);
      const lip=new THREE.Mesh(new THREE.TorusGeometry(0.97,0.09,10,28),metal);lip.position.z=-2.15;eg.add(lip);
      const fan=new THREE.Mesh(new THREE.CircleGeometry(0.95,28),new THREE.MeshPhongMaterial({color:0x2a2e33,shininess:60,side:THREE.DoubleSide}));fan.position.z=-1.95;eg.add(fan);
      const sp=new THREE.Mesh(new THREE.ConeGeometry(0.28,0.6,16),metal);sp.rotation.x=-Math.PI/2;sp.position.z=-2.1;eg.add(sp);
      const blades=new THREE.Group();for(let i=0;i<18;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.85,0.03),new THREE.MeshPhongMaterial({color:0x6b7178}));b.position.set(0,0.45,0);const h=new THREE.Group();h.rotation.z=i*Math.PI*2/18;h.add(b);blades.add(h);}blades.position.z=-1.9;eg.add(blades);eg.userData.fan=blades;
      const cone=new THREE.Mesh(new THREE.ConeGeometry(0.5,1.5,16),metal);cone.rotation.x=Math.PI/2;cone.position.z=2.75;eg.add(cone);
      const ins=new THREE.Mesh(new THREE.CylinderGeometry(0.96,0.84,4.25,28,1,true),new THREE.MeshLambertMaterial({color:0x22262b,side:THREE.BackSide}));ins.rotation.x=Math.PI/2;eg.add(ins);
      const py=new THREE.Mesh(new THREE.BoxGeometry(0.32,1.1,4.2),grey);py.position.set(0,0.95,0.9);eg.add(py);G.userData.fans=(G.userData.fans||[]).concat([blades]);}}
  // ---- tail: swept stabilizers + tall fin with red/white/blue stripes
  for(const s of [-1,1]){const t=new THREE.Group();t.position.set(0,0.95,0);t.rotation.z=s*7*D2R;G.add(t);t.add(new THREE.Mesh(wingGeo(s,[0.4,14.2],0,31,7.1,3.9,1.25,0.2),silver));}
  {const sh=new THREE.Shape();const z0=12.2,ch=6.4,H2=7.6,sw=36,cht=2.1;const tl=z0+H2*Math.tan(sw*D2R);sh.moveTo(z0,0);sh.lineTo(tl,H2);sh.lineTo(tl+cht,H2);sh.lineTo(z0+ch+1.4,0);sh.lineTo(z0,0);
    const g=new THREE.ExtrudeGeometry(sh,{depth:0.34,bevelEnabled:true,bevelThickness:0.08,bevelSize:0.1,bevelSegments:1});g.rotateY(-Math.PI/2);g.translate(0.17,1.55,0);
    const tex=airlTex((c,w,h)=>{c.fillStyle='#e9ecef';c.fillRect(0,0,w,h);c.save();c.translate(0,h);c.scale(1,-1);
      for(let i=0;i<16;i++){const y=i*h/16;const blue=i>=8;c.fillStyle=i%2?'#ffffff':(blue?'#2f6fd6':'#c8102e');if(blue&&i%2===0)c.fillStyle=i%4===0?'#0b3d91':'#4a8ff0';c.beginPath();c.moveTo(-w,y);c.lineTo(w*2,y+w*0.55);c.lineTo(w*2,y+w*0.55+h/16);c.lineTo(-w,y+h/16);c.fill();}c.restore();},256,256);
    tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;tex.repeat.set(1/9,1/7.6);tex.offset.set(-12.2/9,0);
    const fm=new THREE.MeshPhongMaterial({map:tex,shininess:50});const fin=new THREE.Mesh(g,fm);G.add(fin);
    const bc=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));bc.position.set(0,2.0,19.75);G.add(bc);G.userData.strobe=bc;}
  // ---- red beacons top + bottom
  {const bm=new THREE.MeshBasicMaterial({color:0xff2020});const b1=add(new THREE.SphereGeometry(0.17,8,6),bm,0,R+0.05,-2);const b2=add(new THREE.SphereGeometry(0.17,8,6),bm,0,-R-0.05,3);G.userData.beacons=[b1,b2];}
  // ---- landing gear (folds away once you're flying)
  {const gear=new THREE.Group();G.add(gear);G.userData.gear=gear;const strut=(x,z,len,r)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,len,8),metal);m.position.set(x,-R-len/2+0.2,z);gear.add(m);
      for(const s of [-1,1]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,0.32,18),tire);wh.rotation.z=Math.PI/2;wh.position.set(x+s*0.3,-R-len+0.2,z);gear.add(wh);const hub=new THREE.Mesh(new THREE.CylinderGeometry(r*0.5,r*0.5,0.34,12),metal);hub.rotation.z=Math.PI/2;hub.position.copy(wh.position);gear.add(hub);}};
    strut(0,-15.2,1.55,0.38);strut(-2.85,1.4,1.5,0.55);strut(2.85,1.4,1.5,0.55);}
  G.userData.groundY=-R-1.5+0.2-0.55;   // bottom of the main wheels
  G.traverse(o=>{if(o.isMesh){o.castShadow=true;}});
  return G;}
// ---- animate fans, strobes, beacons, gear
function airlTick(G,dt){if(!G)return;const t=performance.now()/1000;const thr=(typeof D!=='undefined'&&D.thr!=null)?D.thr:0.5;(G.userData.fans||[]).forEach(f=>{f.rotation.z+=dt*(8+thr*40);});
  if(G.userData.strobe)G.userData.strobe.visible=(t%1.2)<0.08;(G.userData.beacons||[]).forEach(b=>{b.visible=(t%1.0)<0.15;});
  const gr=G.userData.gear;if(gr){let up=false;try{up=D.state==='flying'&&D.pos.y-H(D.pos.x,D.pos.z)>12;}catch(e){}gr.userData.k=THREE.MathUtils.lerp(gr.userData.k||0,up?1:0,Math.min(1,dt*1.5));gr.scale.y=1-gr.userData.k*0.92;gr.position.y=gr.userData.k*1.2;gr.visible=gr.userData.k<0.97;}}
{const z0=sanitize;sanitize=function(s){const o=z0.apply(this,arguments);try{if(s&&s.airliner&&o)o.airliner=true;}catch(e){}return o;};}
// ---- the flying version: the RC passenger-jet kit is the "skeleton" (for physics), the real-size model is what you see
{const s0=stats;stats=function(sp){const st=s0.apply(this,arguments);try{if(sp&&sp.airliner&&st){st.tough=10;st.airliner=true;st.top*=1.3;st.Tm*=1.2;}}catch(e){}return st;};}
{const b0=buildDrone;buildDrone=function(sp,opt){const m=b0.apply(this,arguments);try{if(sp&&sp.airliner&&m&&m.g&&!m.g.userData.airl){m.g.userData.airl=1;
  m.g.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.g);const sc0=m.g.scale.x||1;const low=(bb.min.y-m.g.position.y)/sc0;m.g.children.forEach(c=>{c.visible=false;});
  m.g.scale.multiplyScalar(AIRL_F);const A=makeAirliner();const k=1/m.g.scale.x;A.scale.setScalar(k);let legs=0.2;try{legs=stats(sp).legs||0.2;}catch(e){}A.position.y=(-legs)*k-A.userData.groundY*k;m.g.add(A);m.g.userData.airliner=A;try{(m.cams||[]).forEach(c=>{c.x*=AIRL_F;c.y*=AIRL_F;c.z*=AIRL_F;});}catch(e){}}}catch(e){console.warn('airliner',e);}return m;};}
{let last=performance.now();const tk=()=>{const now=performance.now(),dt=Math.min(0.1,(now-last)/1000);last=now;try{if(DR&&DR.g&&DR.g.userData.airliner)airlTick(DR.g.userData.airliner,dt);}catch(e){}requestAnimationFrame(tk);};requestAnimationFrame(tk);}
function airlinerGo(){try{if(menu.open)menuToggle(false);}catch(e){}try{if(WALK.on)walkToggle(false);}catch(e){}try{if(WS.open)closeWorkshop();}catch(e){}
  openKit('jet');const sp=wsSpec();sp.name='✈️ Woods Air jet';closeWorkshop();sp.airliner=true;sp.flyAs='plane';useSpec(sp);
  resetDrone({x:SECRET.x,z:SECRET.z+SECRET.len/2-30,yaw:0});setTimeout(()=>{try{if(D.state==='landed'||D.state==='idle')takeoff();}catch(e){}},400);try{camI=CAMS.indexOf('CHASE');CAMX=-1;AIRLCAM.on=0;$('camName').textContent=camLabel();}catch(e){}toast('✈️ Your airliner is on the secret runway! Throttle up, roll down the runway, then pull back to take off.',5000);}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /GIGA drone/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem('✈️ Real-size airliner at the secret runway',()=>airlinerGo()));return L;};}
{const b0=buildItems;buildItems=function(){const L=b0();try{L.splice(1,0,mItem('✈️ Real-size airliner (fly it now)',()=>{menuToggle(false);airlinerGo();}));}catch(e){}return L;};}
// big airliner landing gear soaks up bumps on the runway (only a really hard crash counts)
{const i0=impact;impact=function(v,what){try{if(ST&&ST.airliner&&/ground/.test(String(what))){const vy=D.vel?-D.vel.y:0;if(vy<15){if(D.vel&&D.vel.y<0)D.vel.y=0;return;}}}catch(e){}return i0.apply(this,arguments);};}
const AIRLCAM={on:0,p:new THREE.Vector3()};
// chase / follow camera stays far enough back to see the whole jet
{const u0=updateCam;const _d=new THREE.Vector3(),_t=new THREE.Vector3();updateCam=function(dt){const r=u0.apply(this,arguments);try{if(ST&&ST.airliner&&!WALK.on&&DR&&DR.g){const m=CAMS[camI];if(CAMX<0&&/CHASE|FOLLOW/.test(String(m))){DR.g.getWorldDirection(_d);_d.y=0;if(_d.lengthSq()<1e-4)_d.set(0,0,1);_d.normalize();
  _t.copy(D.pos).addScaledVector(_d,m==='FOLLOW'?48:62);_t.y=Math.max(D.pos.y+13,H(_t.x,_t.z)+4);if(!AIRLCAM.on||AIRLCAM.p.distanceTo(_t)>200)AIRLCAM.p.copy(_t);else AIRLCAM.p.lerp(_t,Math.min(1,(dt||0.016)*4));AIRLCAM.on=1;cam.position.copy(AIRLCAM.p);cam.lookAt(D.pos.x,D.pos.y+3,D.pos.z);}}}catch(e){}return r;};}
