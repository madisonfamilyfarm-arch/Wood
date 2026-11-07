const TRAIN={u:0,v:12,dir:1,ride:false,cars:[],cv:null,len:0,closed:true,mine:LS.get('trainPts',[]),loop:LS.get('trainLoop',true),run:LS.get('trainRun',true),spd:LS.get('trainSpd',12),meshes:[]};
let TRAIN_PTS=[];
// the default track: runs beside the trails (off to the side) with extra wiggles
function trainDefaultPts(){const P=trail.getSpacedPoints(160);P.pop();const out=[];for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],tx=q.x-p.x,tz=q.z-p.z,l=Math.hypot(tx,tz)||1,nx=tz/l,nz=-tx/l,w=9+Math.sin(i*0.55)*4;out.push([p.x+nx*w,p.z+nz*w]);}
  const S=[];for(let i=0;i<out.length;i+=4)S.push(out[i]);return S;}
function trainDist(x,z){let b=1e9;for(let i=0;i<TRAIN_PTS.length;i+=2){const p=TRAIN_PTS[i],d=(p.x-x)**2+(p.z-z)**2;if(d<b)b=d;}return Math.sqrt(b);}
function trainBuild(){const mine=TRAIN.mine.length>=3,P=mine?TRAIN.mine:trainDefaultPts();TRAIN.closed=mine?TRAIN.loop:true;
  TRAIN.cv=new THREE.CatmullRomCurve3(P.map(p=>new V3(p[0],0,p[1])),TRAIN.closed,'centripetal');TRAIN.len=TRAIN.cv.getLength();TRAIN_PTS=TRAIN.cv.getSpacedPoints(Math.max(60,Math.round(TRAIN.len/1.6)));if(TRAIN.closed)TRAIN_PTS.pop();
  TRAIN.meshes.forEach(m=>scene.remove(m));TRAIN.meshes=[];
  const N=TRAIN_PTS.length,tie=new THREE.InstancedMesh(new THREE.BoxGeometry(2.6,0.14,0.45),new THREE.MeshLambertMaterial({color:0x5a3d22}),N),rail=new THREE.InstancedMesh(new THREE.BoxGeometry(0.12,0.16,1),new THREE.MeshLambertMaterial({color:0x8e8e93}),N*2),o=new THREE.Object3D();
  for(let i=0;i<N;i++){const p=TRAIN_PTS[i],q=TRAIN_PTS[TRAIN.closed?(i+1)%N:Math.min(i+1,N-1)],a=Math.atan2(q.x-p.x,q.z-p.z)||0,seg=Math.hypot(q.x-p.x,q.z-p.z),y=H(p.x,p.z);
    o.position.set(p.x,y+0.07,p.z);o.rotation.set(0,a,0);o.scale.set(1,1,1);o.updateMatrix();tie.setMatrixAt(i,o.matrix);
    for(const s of [-0.75,0.75]){o.position.set(p.x+Math.cos(a)*s,(y+H(q.x,q.z))/2+0.2,p.z-Math.sin(a)*s);o.rotation.set(0,a,0);o.scale.set(1,1,Math.max(0.01,seg+0.05));o.updateMatrix();rail.setMatrixAt(i*2+(s>0?1:0),o.matrix);}}
  tie.frustumCulled=false;rail.frustumCulled=false;scene.add(tie);scene.add(rail);TRAIN.meshes=[tie,rail];
  // clear trees off the new track
  if(typeof chunks!=='undefined')for(const [k,ch] of [...chunks]){if(ch.trees.some(t=>trainDist(t.x,t.z)<4.2)){unloadChunk(ch);chunks.set(k,buildChunk(ch.i,ch.j));}}}
{const b0=blocked;blocked=function(x,z){if(b0(x,z))return true;return TRAIN_PTS.length?trainDist(x,z)<4.2:false;};}
(function(){const mk=(col,len,loco)=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(2.4,loco?2.6:2.2,len),new THREE.MeshLambertMaterial({color:col}));b.position.y=1.7;g.add(b);
    if(loco){const ch=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.35,1.2,10),MAT.dark);ch.position.set(0,3.4,-len*0.3);g.add(ch);const cab=new THREE.Mesh(new THREE.BoxGeometry(2.5,1,2.2),new THREE.MeshLambertMaterial({color:0x1c1c1e}));cab.position.set(0,3.3,len*0.28);g.add(cab);const lt=new THREE.Mesh(GEO.ball,new THREE.MeshBasicMaterial({color:0xfff6c0}));lt.scale.setScalar(0.25);lt.position.set(0,2.4,-len/2-0.05);g.add(lt);}
    for(const z of [-len*0.32,len*0.32])for(const x of [-1.1,1.1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.2,12),MAT.dark);w.rotation.z=Math.PI/2;w.position.set(x,0.45,z);g.add(w);}scene.add(g);return g;};
  TRAIN.cars=[mk(0xd7263d,7,true),mk(0x0a84ff,6),mk(0xffd60a,6),mk(0x34c759,6)];})();
trainBuild();
// 🛤 lay your own track
function trainHere(){const p=WALK.on?WALK.pos:D.pos;return[+p.x.toFixed(1),+p.z.toFixed(1)];}
function trainAddPt(){TRAIN.mine.push(trainHere());LS.set('trainPts',TRAIN.mine);if(TRAIN.mine.length>=3){trainBuild();toast('🛤 Track point '+TRAIN.mine.length+' added — the track is rebuilt',1800);}else toast('🛤 Track point '+TRAIN.mine.length+' — add '+(3-TRAIN.mine.length)+' more to make a track',2200);}
function trainUndo(){TRAIN.mine.pop();LS.set('trainPts',TRAIN.mine);trainBuild();toast('↩ Removed the last track point',1400);}
function trainReset(){TRAIN.mine=[];LS.set('trainPts',[]);trainBuild();toast('🛤 Back to the trail-side track',1600);}
function trainItems(){return[mInfo('🛤 Lay your own track: go somewhere (walk or fly) and tap "Add a track point here". After 3 points the track appears; keep adding to make it longer and squigglier.'),
  mItem(()=>'➕ Add a track point here ('+TRAIN.mine.length+' so far)',()=>{trainAddPt();menuToggle(false);}),mItem('↩ Undo last point',()=>trainUndo()),mItem('🗑 Clear my track (use the trail-side track)',()=>trainReset()),
  mItem(()=>'🔁 My track: '+(TRAIN.loop?'loops round':'goes back and forth (end to end)'),()=>{TRAIN.loop=!TRAIN.loop;LS.set('trainLoop',TRAIN.loop);trainBuild();}),
  mItem(()=>'🚂 Train: '+(TRAIN.run?'running by itself':'stopped (until you drive it)'),()=>{TRAIN.run=!TRAIN.run;LS.set('trainRun',TRAIN.run);}),
  mItem(()=>'⚡ Train speed: '+TRAIN.spd+' m/s  ◀ ▶',()=>{TRAIN.spd=TRAIN.spd>=30?6:TRAIN.spd+6;LS.set('trainSpd',TRAIN.spd);},d=>{TRAIN.spd=clamp(TRAIN.spd+d*3,3,40);LS.set('trainSpd',TRAIN.spd);}),
  mItem('🚂 Take me to the train',()=>trainGoto()),mItem('◀ Back',()=>menuBack())];}
function trainGoto(){if(menu.open)menuToggle(false);if(!WALK.on){if(D.state!=='landed'&&D.state!=='down')resetDrone();walkToggle(true);}const g=TRAIN.cars[3].position;WALK.pos.set(g.x+4,0,g.z+4);WALK.pos.y=H(WALK.pos.x,WALK.pos.z);toast('🚂 Press K next to the train to hop on!',3000);}
// ⏩ / ⏪ buttons while riding (phone too)
function trainBtns(){let b=$('trBtns');if(!b){b=document.createElement('div');b.id='trBtns';b.style.cssText='position:fixed;left:50%;bottom:calc(70px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:22;display:none;gap:10px';
    const mk=(t,fn)=>{const e=document.createElement('button');e.textContent=t;e.style.cssText='font:800 18px system-ui;padding:12px 18px;border-radius:14px;border:2px solid #fff;background:rgba(0,0,0,0.6);color:#fff;touch-action:none';e.onpointerdown=ev=>{ev.preventDefault();fn(true);};e.onpointerup=e.onpointerleave=()=>fn(false);b.appendChild(e);};
    mk('⏪ Back',on=>TRAIN.hold=on?-1:0);mk('⏹ Stop',on=>{if(on){TRAIN.v=0;TRAIN.hold=0;}});mk('⏩ Forward',on=>TRAIN.hold=on?1:0);mk('🚪 Off',on=>{if(on)trainToggle();});document.body.appendChild(b);}
  b.style.display=TRAIN.ride?'flex':'none';}
