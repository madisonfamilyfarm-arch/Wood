// ================================================================ 🗺 TRACK DRAWING on the big map (click points, rubber-band line, gentle curves, click the start to make a loop, 🔀 switches/branches)
// + 💥 blow up ABSOLUTELY everything (buildings, tower, truck, poles, signs, train track…) — 🔧 Put back restores it all
TRAIN.br=LS.get('trainBr',[]);TRAIN.brB=[];TRAIN.at=-1;TRAIN.s=0;TRAIN.turn=LS.get('trainTurn',true);TRAIN.brk=[];
function railMesh(P,closed){const N=P.length,tie=new THREE.InstancedMesh(new THREE.BoxGeometry(2.6,0.14,0.45),new THREE.MeshLambertMaterial({color:0x5a3d22}),N),rail=new THREE.InstancedMesh(new THREE.BoxGeometry(0.12,0.16,1),new THREE.MeshLambertMaterial({color:0x8e8e93}),N*2),o=new THREE.Object3D();
  for(let i=0;i<N;i++){const p=P[i],q=P[closed?(i+1)%N:Math.min(i+1,N-1)],a=Math.atan2(q.x-p.x,q.z-p.z)||0,seg=Math.hypot(q.x-p.x,q.z-p.z),y=H(p.x,p.z);
    o.position.set(p.x,y+0.07,p.z);o.rotation.set(0,a,0);o.scale.set(1,1,1);o.updateMatrix();tie.setMatrixAt(i,o.matrix);
    for(const s of [-0.75,0.75]){o.position.set(p.x+Math.cos(a)*s,(y+H(q.x,q.z))/2+0.2,p.z-Math.sin(a)*s);o.rotation.set(0,a,0);o.scale.set(1,1,Math.max(0.01,seg+0.05));o.updateMatrix();rail.setMatrixAt(i*2+(s>0?1:0),o.matrix);}}
  tie.frustumCulled=false;rail.frustumCulled=false;scene.add(tie);scene.add(rail);return[tie,rail];}
// branches are built after the main track
{const b0=trainBuild;trainBuild=function(){const r=b0.apply(this,arguments);TRAIN.brB.forEach(b=>b.meshes.forEach(m=>scene.remove(m)));TRAIN.brB=[];
  (TRAIN.br||[]).forEach(br=>{if(!br.pts||br.pts.length<2)return;const cv=new THREE.CatmullRomCurve3(br.pts.map(p=>new V3(p[0],0,p[1])),false,'centripetal'),len=cv.getLength(),P=cv.getSpacedPoints(Math.max(8,Math.round(len/1.6)));TRAIN.brB.push({cv,len,P,u0:br.u0,meshes:railMesh(P,false)});});
  TRAIN.sw=TRAIN.brB.map(()=>TRAIN.turn);TRAIN.at=-1;
  if(TRAIN.brB.length&&typeof chunks!=='undefined')for(const [k,ch] of [...chunks]){if(ch.trees.some(t=>trainDist(t.x,t.z)<4.2)){unloadChunk(ch);chunks.set(k,buildChunk(ch.i,ch.j));}}return r;};}
{const d0=trainDist;trainDist=function(x,z){let b=d0(x,z);for(const B of TRAIN.brB||[])for(let i=0;i<B.P.length;i+=2){const p=B.P[i],d=Math.hypot(p.x-x,p.z-z);if(d<b)b=d;}return b;};}
// changing the main line clears the switches (they hang off the old line)
function trainBrClear(){TRAIN.br=[];LS.set('trainBr',[]);}
{const a0=trainAddPt;trainAddPt=function(){trainBrClear();return a0.apply(this,arguments);};}
{const r0=trainReset;trainReset=function(){trainBrClear();return r0.apply(this,arguments);};}
// where is the train? (main line u, or s metres down a branch)
function trainPosAt(back){if(TRAIN.at>=0){const b=TRAIN.brB[TRAIN.at];const s=TRAIN.s-back;if(s>=0)return{p:b.cv.getPointAt(clamp(s/b.len,0,1)),t:b.cv.getTangentAt(clamp(s/b.len,0,1))};let u=b.u0+s/TRAIN.len;u=TRAIN.closed?(u%1+1)%1:clamp(u,0,1);return{p:TRAIN.cv.getPointAt(u),t:TRAIN.cv.getTangentAt(u)};}
  let u=TRAIN.u-back/TRAIN.len;u=TRAIN.closed?(u%1+1)%1:clamp(u,0,1);return{p:TRAIN.cv.getPointAt(u),t:TRAIN.cv.getTangentAt(u)};}
function crossedF(a,b,x){return a<=b?(x>a&&x<=b):(x>a||x<=b);}
trainTick=function(dt){if(!started||(typeof CES!=='undefined'&&CES.on)||GONE.train)return;trainBtns();const hasBr=TRAIN.brB.length>0;
  if(TRAIN.ride||!TRAIN.run||!TRAIN.closed||hasBr){const k=keys,inp=WALK.inp||{};const thr=TRAIN.ride?((k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)+(TRAIN.hold||0)+(Math.abs(inp.ly||0)>0.3?Math.sign(inp.ly):0)):(TRAIN.run?(TRAIN.dir||1):0);
    if(thr)TRAIN.v=clamp(TRAIN.v+clamp(thr,-1,1)*8*dt,-TRAIN.spd*1.5,TRAIN.spd*1.5);else if(!TRAIN.ride)TRAIN.v*=Math.exp(-dt*0.8);if(!TRAIN.ride&&TRAIN.run)TRAIN.v=clamp(TRAIN.v,-TRAIN.spd,TRAIN.spd);
    const d=TRAIN.v*dt;
    if(TRAIN.at<0){let u=TRAIN.u+d/TRAIN.len;if(TRAIN.closed)u=(u%1+1)%1;
      if(d>0)for(let j=0;j<TRAIN.brB.length;j++){const b=TRAIN.brB[j];if(crossedF(TRAIN.u,u,b.u0)&&(TRAIN.ride?TRAIN.sw[j]:Math.random()<0.5)){TRAIN.at=j;TRAIN.s=((u-b.u0+1)%1)*TRAIN.len;if(TRAIN.ride)toast('🔀 Took the switch',900);break;}}
      if(TRAIN.at<0){if(!TRAIN.closed&&(u>0.985||u<0.015)){u=clamp(u,0.015,0.985);TRAIN.dir=u>0.5?-1:1;if(TRAIN.ride)TRAIN.v=0;else TRAIN.v*=-0.2;}TRAIN.u=u;}}
    else{const b=TRAIN.brB[TRAIN.at];TRAIN.s+=d;if(TRAIN.s<0){TRAIN.u=((b.u0+TRAIN.s/TRAIN.len)%1+1)%1;TRAIN.at=-1;TRAIN.dir=1;}else if(TRAIN.s>b.len-1){TRAIN.s=b.len-1;if(TRAIN.ride)TRAIN.v=0;else{TRAIN.dir=-1;TRAIN.v=-Math.abs(TRAIN.v)*0.3;}}}}
  else{TRAIN.v=TRAIN.spd;TRAIN.at=-1;TRAIN.u=((Date.now()/1000)*TRAIN.spd/TRAIN.len)%1;}
  const gaps=[0,7.5,14,20.5];TRAIN.cars.forEach((g,i)=>{const q=trainPosAt(gaps[i]);g.position.set(q.p.x,H(q.p.x,q.p.z),q.p.z);g.rotation.y=Math.atan2(-q.t.x,-q.t.z)+Math.PI;});
  const L=TRAIN.cars[0];if(TRAIN.ride){WALK.pos.set(L.position.x,L.position.y+2.4,L.position.z);WALK.vy=0;WALK.yaw=L.rotation.y+Math.PI;}
  // blown-up track ahead = CRASH
  if(TRAIN.brk.length&&Math.abs(TRAIN.v)>0.5){for(const bp of TRAIN.brk)if(Math.hypot(bp.x-L.position.x,bp.z-L.position.z)<2.5||Math.hypot(bp.x-TRAIN.cars[3].position.x,bp.z-TRAIN.cars[3].position.z)<2.5){blowUp({k:'train',p:L.position.clone()},'the broken track');explode(L.position.clone().add(new V3(0,1.5,0)),6,3,false,'The train','');return;}}
  if(Math.abs(TRAIN.v)>2){for(const g of TRAIN.cars){const gp=g.position;const me=dzMe();if(me&&!TRAIN.ride&&Math.hypot(me.x-gp.x,me.z-gp.z)<3.4&&me.y-gp.y<3.5){if(DZ.on)dzDie('Run over by the train! 🚂','','');else if(!WALK.on&&D.state==='flying')impact(14,'the train');}
      for(const B of AIB.L)if(!B.dead&&Math.hypot(B.p.x-gp.x,B.p.z-gp.z)<3.4&&B.p.y-gp.y<3.5)dzBotDie(B,'🚂 The train flattened '+B.name);
      for(const C of CAMPERS.L)if(!C.dead&&C.g.visible&&Math.hypot(C.x-gp.x,C.z-gp.z)<3)dzCampDie(C,'🚂 The train got camper '+C.name);}}};
// 🔀 switch button while riding
{const b0=trainBtns;trainBtns=function(){b0.apply(this,arguments);const b=$('trBtns');if(!b)return;let s=$('trSw');if(!s&&TRAIN.brB.length){s=document.createElement('button');s.id='trSw';s.style.cssText=b.firstChild.style.cssText;s.onclick=()=>{TRAIN.turn=!TRAIN.turn;LS.set('trainTurn',TRAIN.turn);TRAIN.sw=TRAIN.brB.map(()=>TRAIN.turn);};b.appendChild(s);}if(s){s.style.display=TRAIN.brB.length?'':'none';s.textContent=TRAIN.turn?'🔀 Turn at switches':'⬆ Go straight';}};}
// ---------------------------------------------------------------- 🗺 the map track editor
const TED={on:false,mode:'main',pts:[],br:null,mouse:null};
function tedOpen(){TED.on=true;TED.mode='main';TED.pts=[];TED.br=null;TED.mouse=null;if(BM.on)bmSet(false);if(menu.open)menuToggle(false);mapMode('big');tedBtns();toast('🗺 Click on the map to add track points. Click your first point again to make a loop. ✅ Done when finished.',5000);}
function tedClose(){TED.on=false;TED.mouse=null;tedBtns();mapMode('corner');}
function tedDone(loop){if(TED.mode==='branch'){if(TED.br&&TED.br.pts.length>=2){TRAIN.br.push(TED.br);LS.set('trainBr',TRAIN.br);trainBuild();toast('🔀 Switch + branch line built!',2000);}else toast('Add at least one more point for the branch',1600);tedClose();return;}
  if(TED.pts.length<2){toast('Click at least 2 points first',1500);return;}let P=TED.pts.slice();if(P.length===2){const a=P[0],b=P[1];P=[a,[(a[0]+b[0])/2,(a[1]+b[1])/2],b];}
  TRAIN.mine=P;LS.set('trainPts',P);TRAIN.loop=!!loop;LS.set('trainLoop',TRAIN.loop);trainBrClear();trainBuild();TRAIN.at=-1;TRAIN.u=0.02;toast(loop?'⭕ Loop track built!':'🛤 Track built (the train goes back and forth)',2200);tedClose();}
function tedBtns(){let b=$('tedBox');if(!b){b=document.createElement('div');b.id='tedBox';b.style.cssText='position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:40;display:none;gap:6px;flex-wrap:wrap;justify-content:center;max-width:96vw';
    const mk=(t,fn)=>{const e=document.createElement('button');e.textContent=t;e.style.cssText='font:800 14px system-ui;padding:9px 12px;border-radius:12px;border:2px solid #fff;background:rgba(20,20,20,0.85);color:#fff;cursor:pointer';e.onclick=ev=>{ev.stopPropagation();fn();};b.appendChild(e);return e;};
    mk('✅ Done',()=>tedDone(false));mk('⭕ Make it a loop',()=>tedDone(true));mk('↩ Undo',()=>{if(TED.mode==='branch'&&TED.br){if(TED.br.pts.length>1)TED.br.pts.pop();}else TED.pts.pop();});
    mk('🔀 Add switch',()=>{TED.mode='pick';toast('🔀 Click on the existing track where the switch should go',3000);});mk('✕ Close',()=>tedClose());document.body.appendChild(b);}
  b.style.display=TED.on?'flex':'none';}
function tedScreen(x,z){const c=$('mini'),r=c.getBoundingClientRect(),p=MAP.T.transformPoint(new DOMPoint(x,z));return{x:p.x/(MAP.dpr||1)+r.left,y:p.y/(MAP.dpr||1)+r.top};}
setTimeout(()=>{const c=$('mini');if(!c)return;let dn=null;
  c.addEventListener('pointerdown',e=>{if(TED.on)dn={x:e.clientX,y:e.clientY};},true);
  c.addEventListener('pointermove',e=>{if(TED.on&&MAP.T)TED.mouse=mapToWorld(e.clientX,e.clientY);},true);
  c.addEventListener('pointerup',e=>{if(!TED.on||!dn)return;const moved=Math.hypot(e.clientX-dn.x,e.clientY-dn.y)>6;dn=null;if(moved)return;MAP.tapT=-1e9;const w=mapToWorld(e.clientX,e.clientY);
    if(TED.mode==='pick'){let bi=-1,bd=1e9;TRAIN_PTS.forEach((p,i)=>{const d=Math.hypot(p.x-w.x,p.z-w.z);if(d<bd){bd=d;bi=i;}});if(bi<0||bd>25){toast('Click right on the track',1200);return;}
      const p=TRAIN_PTS[bi];TED.mode='branch';TED.br={u0:bi/TRAIN_PTS.length,pts:[[+p.x.toFixed(1),+p.z.toFixed(1)]]};toast('🔀 Switch placed! Now click where the branch line goes, then ✅ Done',3000);beep(900,0.08,0.05);return;}
    if(TED.mode==='branch'){TED.br.pts.push([+w.x.toFixed(1),+w.z.toFixed(1)]);beep(700,0.05,0.04);return;}
    if(TED.pts.length>=3){const f=tedScreen(TED.pts[0][0],TED.pts[0][1]);if(Math.hypot(f.x-e.clientX,f.y-e.clientY)<22){tedDone(true);return;}}
    TED.pts.push([+w.x.toFixed(1),+w.z.toFixed(1)]);beep(700,0.05,0.04);},true);},700);
// draw the work-in-progress track: gentle curve through the points + a line to your mouse
{const d0=drawMini;drawMini=function(){const r=d0.apply(this,arguments);try{if(!MAP.T)return r;const c=$('mini'),x=c.getContext('2d'),W=c.width,Hh=c.height,big=MAP.mode!=='corner',px=1/MAP.s*MAP.dpr;
  x.save();x.setTransform(1,0,0,1,0,0);x.beginPath();if(big)x.rect(0,0,W,Hh);else x.arc(W/2,Hh/2,Math.min(W,Hh)/2-2,0,7);x.clip();x.setTransform(MAP.T);
  x.strokeStyle='#8e5a2b';x.lineWidth=2.2*px;x.setLineDash([3*px,2*px]);for(const B of TRAIN.brB){x.beginPath();B.P.forEach((p,i)=>{if(!i)x.moveTo(p.x,p.z);else x.lineTo(p.x,p.z);});x.stroke();}x.setLineDash([]);
  if(TRAIN.brk.length){x.fillStyle='#ff3b30';TRAIN.brk.forEach(p=>{x.beginPath();x.arc(p.x,p.z,3*px,0,7);x.fill();});}
  if(TED.on){const pts=TED.mode==='branch'&&TED.br?TED.br.pts:TED.pts,all=pts.map(p=>new V3(p[0],0,p[1]));const ms=TED.mouse&&TED.mode!=='pick'?new V3(TED.mouse.x,0,TED.mouse.z):null;
    if(all.length>=2){const cv=new THREE.CatmullRomCurve3(all,false,'centripetal'),S=cv.getSpacedPoints(Math.max(10,all.length*12));x.strokeStyle='#ffd60a';x.lineWidth=3*px;x.beginPath();S.forEach((p,i)=>{if(!i)x.moveTo(p.x,p.z);else x.lineTo(p.x,p.z);});x.stroke();}
    if(all.length&&ms){x.strokeStyle='rgba(255,214,10,0.7)';x.lineWidth=2*px;x.setLineDash([4*px,3*px]);x.beginPath();x.moveTo(all[all.length-1].x,all[all.length-1].z);x.lineTo(ms.x,ms.z);x.stroke();x.setLineDash([]);}
    all.forEach((p,i)=>{x.fillStyle=i===0?'#34c759':'#ffd60a';x.beginPath();x.arc(p.x,p.z,(i===0?5:3.5)*px,0,7);x.fill();});
    if(TED.mode==='pick'&&TED.mouse){x.strokeStyle='#64d2ff';x.lineWidth=2*px;x.beginPath();x.arc(TED.mouse.x,TED.mouse.z,8*px,0,7);x.stroke();}}
  x.restore();}catch(e){}return r;};}
// menus + an on-screen button
{const t0=trainItems;trainItems=function(){const L=t0();L.splice(1,0,mItem('🗺 Draw the train track on the map (click points, loops, switches)',()=>tedOpen()),mItem(()=>'🔀 Switches: '+TRAIN.br.length+(TRAIN.br.length?' — tap to remove them all':''),()=>{trainBrClear();trainBuild();}),mItem(()=>'🔀 Train at switches: '+(TRAIN.turn?'turns onto the branch':'goes straight'),()=>{TRAIN.turn=!TRAIN.turn;LS.set('trainTurn',TRAIN.turn);TRAIN.sw=TRAIN.brB.map(()=>TRAIN.turn);}));return L;};}
{const b0=asBtn;asBtn=function(){b0.apply(this,arguments);let v=$('trkBtn');if(!v){v=document.createElement('button');v.id='trkBtn';v.className='btn';v.style.cssText=$('asBtn').style.cssText;v.onclick=()=>{if(TED.on)tedClose();else tedOpen();};$('asBox').appendChild(v);}v.textContent=TED.on?'🗺 Close track map':'🛤 Draw track';};}
// ---------------------------------------------------------------- 💥 BLOW UP EVERYTHING
GONE.objs=[];GONE.cols=[];GONE.surf=[];GONE.truck=false;
function boomSkip(){const S=new Set([cam]);const add=o=>{if(o)S.add(o);};add(DR&&DR.g);add(WALK.me);add(CHUTE.g);add(FIRE.g);add(TRUCK.g);
  for(const id in mp.peers){const pe=mp.peers[id];add(pe.mesh&&pe.mesh.g);add(pe.tag);add(pe.pilot);}
  TRAIN.cars.forEach(add);TRAIN.meshes.forEach(add);TRAIN.brB.forEach(b=>b.meshes.forEach(add));objMesh.forEach(m=>add(m.g));BM.marks.forEach(add);
  if(typeof XTRA!=='undefined'){XTRA.birds.forEach(f=>add(f.g));XTRA.balloons.forEach(b=>add(b.g));add(XTRA.ufo);add(XTRA.flies);}
  CAMPERS.L.forEach(C=>add(C.g));deer.forEach(d=>{add(d.g);add(d.m);add(d.mesh);});FXB.forEach(f=>add(f.m));shots.forEach(s=>add(s.m));DZ.rk.forEach(s=>add(s.m));
  for(const [k,ch] of chunks)ch.objs.forEach(add);return S;}
const _bb=new THREE.Box3(),_bsph=new THREE.Sphere();
function boomStatic(p,R,by){const skip=boomSkip();let n=0;
  for(const o of [...scene.children]){if(!o.visible||skip.has(o)||o.isLight||o.isInstancedMesh||o.isPoints||o.type==='Sky')continue;
    if(!o.userData.bs){_bb.setFromObject(o);if(_bb.isEmpty())continue;_bb.getBoundingSphere(_bsph);o.userData.bs={c:_bsph.center.clone(),r:_bsph.radius};}
    const bs=o.userData.bs;if(bs.r>35||bs.r<0.05)continue;if(bs.c.distanceTo(p)<R+bs.r*0.6){o.visible=false;GONE.objs.push(o);n++;puff(bs.c.clone(),0x555555,Math.min(2,bs.r*0.3),2);}}
  // the fire truck
  if(!GONE.truck&&TRUCK.g&&Math.hypot(TRUCK.x-p.x,TRUCK.z-p.z)<R+3){if(TRUCK.in)truckToggle();GONE.truck=true;TRUCK.g.visible=false;chatSys('💥 '+(by||'Someone')+' blew up the fire truck! 🚒');}
  // its solid parts go too (no invisible walls)
  const cx0=Math.floor((p.x-R)/CGS),cx1=Math.floor((p.x+R)/CGS),cz0=Math.floor((p.z-R)/CGS),cz1=Math.floor((p.z+R)/CGS),seen=new Set();
  for(let a=cx0;a<=cx1;a++)for(let b=cz0;b<=cz1;b++){const L=CG.get(a+','+b);if(!L)continue;for(const o of [...L]){if(seen.has(o))continue;seen.add(o);
      const c=o.t==='b'?new V3((o.x0+o.x1)/2,(o.y0+o.y1)/2,(o.z0+o.z1)/2):o.t==='h'?o.a.clone().add(o.b).multiplyScalar(0.5):o.t==='t'?o.c:new V3(o.x,o.y!=null?o.y:((o.y0||0)+(o.y1||0))/2,o.z);
      if(c.distanceTo(p)<R*0.9){gridRemove(o);GONE.cols.push(o);}}}
  if(typeof SURF!=='undefined')for(let i=SURF.length-1;i>=0;i--){const s=SURF[i];if(Math.hypot((s.x0+s.x1)/2-p.x,(s.z0+s.z1)/2-p.z)<R+2&&Math.abs(s.y-p.y)<R+3){GONE.surf.push(SURF.splice(i,1)[0]);}}
  // the train track
  const hit=(P,meshes)=>{let any=false;P.forEach((q,i)=>{if(Math.hypot(q.x-p.x,q.z-p.z)<R&&p.y-H(q.x,q.z)<R+1){const z=new THREE.Matrix4().makeScale(0,0,0);meshes[0].setMatrixAt(i,z);meshes[1].setMatrixAt(i*2,z);meshes[1].setMatrixAt(i*2+1,z);TRAIN.brk.push(q.clone());any=true;}});if(any){meshes[0].instanceMatrix.needsUpdate=true;meshes[1].instanceMatrix.needsUpdate=true;}return any;};
  let trk=hit(TRAIN_PTS,TRAIN.meshes);TRAIN.brB.forEach(b=>{trk=hit(b.P,b.meshes)||trk;});if(trk&&!boomStatic.tw){boomStatic.tw=1;chatSys('💥 The train track got blown up — the train will crash there!');setTimeout(()=>boomStatic.tw=0,8000);}
  return n;}
{const e0=explode;explode=function(p,r,dr,own,byName,byId){const res=e0.apply(this,arguments);try{boomStatic(p,Math.max(r||4,3)*0.85,DZ.bn||byName);}catch(e){console.warn('boom',e);}return res;};}
{const t0=truckToggle;truckToggle=function(){if(GONE.truck&&!TRUCK.in){toast('🚒 The fire truck is blown up — 🔧 Put back fixes it',2000);return;}return t0.apply(this,arguments);};}
{const p0=putBack;putBack=function(){const n=GONE.objs.length;GONE.objs.forEach(o=>o.visible=true);GONE.objs=[];GONE.cols.forEach(o=>{for(const k of o.keys){let L=CG.get(k);if(!L){L=[];CG.set(k,L);}if(!L.includes(o))L.push(o);}});GONE.cols=[];
  GONE.surf.forEach(s=>SURF.push(s));GONE.surf=[];if(GONE.truck){GONE.truck=false;TRUCK.g.visible=true;}const tb=TRAIN.brk.length;TRAIN.brk=[];if(tb)trainBuild();return p0.apply(this,arguments);};}
// 🚒 rockets go off at the fire truck too (it had no hit-box), and it burns when blown up
{const f0=fuseTargets;fuseTargets=function(){const L=f0();if(!GONE.truck&&TRUCK.g&&TRUCK.g.visible){const q=new V3(TRUCK.x,H(TRUCK.x,TRUCK.z)+1.4,TRUCK.z);q.fr=2.5;L.push(q);}return L;};}
{const b0=boomStatic;boomStatic=function(p,R,by){const was=GONE.truck;if(!was&&TRUCK.ai&&Math.hypot(TRUCK.x-p.x,TRUCK.z-p.z)<R+3){try{truckAiOut();}catch(e){}}const r=b0.apply(this,arguments);
  if(!was&&GONE.truck){const c=new V3(TRUCK.x,H(TRUCK.x,TRUCK.z)+1,TRUCK.z);for(let k=0;k<6;k++)puff(c.clone().add(new V3((Math.random()-0.5)*4,Math.random()*2,(Math.random()-0.5)*6)),0x222222,1,2.5);try{fireAdd({id:'trk'+Date.now(),x:TRUCK.x+1,z:TRUCK.z,r:2});}catch(e){}}return r;};}
