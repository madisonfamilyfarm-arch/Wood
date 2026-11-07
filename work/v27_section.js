// ================================================================ v27: safe rockets while riding the train · DERAIL + 🛤 Rerail · put back one kind of thing at a time
const V27={own:false};
// remember whose explosion is happening
{const e0=explode;explode=function(p,r,dr,own,byName,byId){const was=V27.own;V27.own=!!(own||byId===mp.id);try{return e0.apply(this,arguments);}finally{V27.own=was;}};}
// your own rockets don't go off on the train you're riding…
{const f0=fuseTargets;fuseTargets=function(){const L=f0();if(!TRAIN.ride)return L;const cars=TRAIN.cars.map(g=>g.position);return L.filter(q=>!cars.some(c=>Math.hypot(c.x-q.x,c.z-q.z)<1&&Math.abs(c.y+1.7-q.y)<0.5));};}
// …and can't blow it (or the track right under it) up
{const b0=blowUp;blowUp=function(t,by){if(t&&t.k==='train'&&TRAIN.ride&&V27.own)return;return b0.apply(this,arguments);};}
{const s0=boomStatic;boomStatic=function(p,R,by){if(TRAIN.ride&&V27.own){const L=TRAIN.cars[0].position;if(Math.hypot(L.x-p.x,L.z-p.z)<R+16){const keep=TRAIN.brk.length;const r=s0.apply(this,arguments);TRAIN.brk.splice(keep);trainBuildKeepBroken();return r;}}return s0.apply(this,arguments);};}
// rebuild the rails but keep holes that were already there
function trainBuildKeepBroken(){const B=TRAIN.brk.slice();TRAIN.brk=[];trainBuild();B.forEach(q=>{TRAIN.brk.push(q);const zap=(P,M)=>P.forEach((p,i)=>{if(Math.hypot(p.x-q.x,p.z-q.z)<0.8){const z=new THREE.Matrix4().makeScale(0,0,0);M[0].setMatrixAt(i,z);M[1].setMatrixAt(i*2,z);M[1].setMatrixAt(i*2+1,z);M[0].instanceMatrix.needsUpdate=true;M[1].instanceMatrix.needsUpdate=true;}});zap(TRAIN_PTS,TRAIN.meshes);TRAIN.brB.forEach(b=>zap(b.P,b.meshes));});}
// 🚂 broken track = the train goes OFF THE RAILS (no explosion) · 🛤 Rerail puts it back
function trainDerail(){if(TRAIN.derailed)return;TRAIN.derailed=true;TRAIN.v=0;TRAIN.hold=0;TRAIN.cars.forEach((g,i)=>{g.rotation.z=(i%2?-1:1)*0.35;g.position.y-=0.4;});beep(120,0.5,0.12);shake=Math.max(shake,0.5);
  toast(TRAIN.ride?'🚂 DERAILED! The track is broken — tap 🛤 Rerail':'🚂 The train went off the rails at the broken track!',3500);if(!TRAIN.ride)TRAIN.reT=performance.now()+8000;}
function trainRerail(){if(!TRAIN.derailed)return;const back=(TRAIN.v>=0?1:-1)*22;if(TRAIN.at>=0){TRAIN.s=Math.max(0,TRAIN.s-back);}else{let u=TRAIN.u-back/TRAIN.len;TRAIN.u=TRAIN.closed?(u%1+1)%1:clamp(u,0.02,0.98);}
  TRAIN.derailed=false;TRAIN.v=0;TRAIN.dir=-(TRAIN.dir||1);TRAIN.cars.forEach(g=>g.rotation.z=0);toast('🛤 Back on the rails! (Fix the track with 🔧 Put back → Train track)',2500);beep(700,0.1,0.05);}
function trainBrokenAhead(){if(!TRAIN.brk.length)return false;const ends=[TRAIN.cars[0].position,TRAIN.cars[3].position];for(const q of TRAIN.brk)for(const e of ends)if(Math.hypot(q.x-e.x,q.z-e.z)<4)return true;return false;}
{const t0=trainTick;trainTick=function(dt){if(GONE.train)return;if(TRAIN.derailed){trainBtns();if(!TRAIN.ride&&performance.now()>(TRAIN.reT||0))trainRerail();return;}
  if(Math.abs(TRAIN.v)>0.3&&trainBrokenAhead()){trainDerail();return;}return t0.apply(this,arguments);};}
{const b0=trainBtns;trainBtns=function(){b0.apply(this,arguments);const b=$('trBtns');if(!b)return;let s=$('trRe');if(!s){s=document.createElement('button');s.id='trRe';s.textContent='🛤 Rerail';s.style.cssText=b.firstChild.style.cssText+';background:rgba(255,159,10,0.9);color:#111';s.onclick=()=>trainRerail();b.appendChild(s);}s.style.display=TRAIN.derailed?'':'none';};}
// ---------------------------------------------------------------- 🔧 put back ONE kind of thing
function pbTrain(){let n=0;if(GONE.train){GONE.train=false;TRAIN.cars.forEach(g=>scene.add(g));n++;}if(TRAIN.derailed){TRAIN.derailed=false;TRAIN.cars.forEach(g=>g.rotation.z=0);n++;}toast(n?'🚂 The train is back on the track':'🚂 The train is fine',1600);}
function pbTrack(){const n=TRAIN.brk.length;TRAIN.brk=[];trainBuild();toast(n?'🛤 Fixed '+n+' broken track pieces':'🛤 The track is fine',1600);}
function pbTrees(){const n=CRATERS.length;CRATERS.length=0;LS.set('craters',[]);if(n)reloadWorld();toast(n?'🌲 The trees, rocks and bushes grew back':'🌲 Nothing to grow back',1600);}
function pbPlaced(){let n=0;BOOMED.forEach(o=>{if(!OBJS.some(x=>x.id===o.id)){objAdd(o);n++;}});BOOMED.length=0;LS.set('boomedObjs',[]);toast('📦 Put back '+n+' placed thing'+(n===1?'':'s'),1600);}
function pbBuild(){const n=GONE.objs.length;GONE.objs.forEach(o=>o.visible=true);GONE.objs=[];GONE.cols.forEach(o=>{for(const k of o.keys){let L=CG.get(k);if(!L){L=[];CG.set(k,L);}if(!L.includes(o))L.push(o);}});GONE.cols=[];GONE.surf.forEach(s=>SURF.push(s));GONE.surf=[];toast(n?'🏠 Put back '+n+' buildings and things':'🏠 Nothing to put back',1600);}
function pbTruck(){if(GONE.truck){GONE.truck=false;TRUCK.g.visible=true;toast('🚒 The fire truck is fixed',1600);}else toast('🚒 The truck is fine',1200);}
function pbSky(){let n=(GONE.ufo?1:0)+GONE.birds.length+GONE.balloons.length;if(GONE.ufo&&XTRA.ufo){GONE.ufo=false;scene.add(XTRA.ufo);}GONE.birds.forEach(f=>{f.dead=false;scene.add(f.g);});GONE.birds=[];GONE.balloons.forEach(b=>{b.dead=false;scene.add(b.g);});GONE.balloons=[];toast(n?'🎈 The birds, balloons and UFO are back':'🎈 Nothing missing in the sky',1600);}
function putBackItems(){return[mInfo('Put back just one kind of thing:'),
  mItem(()=>'🚂 The train'+(GONE.train?' (blown up)':TRAIN.derailed?' (off the rails)':''),()=>pbTrain()),
  mItem(()=>'🛤 Train track'+(TRAIN.brk.length?' ('+TRAIN.brk.length+' broken bits)':''),()=>pbTrack()),
  mItem(()=>'🌲 Trees, rocks + bushes'+(CRATERS.length?' ('+CRATERS.length+' blast holes)':''),()=>pbTrees()),
  mItem(()=>'🏠 Buildings, tower, poles, signs…'+(GONE.objs.length?' ('+GONE.objs.length+')':''),()=>pbBuild()),
  mItem(()=>'📦 Things I placed'+(BOOMED.length?' ('+BOOMED.length+')':''),()=>pbPlaced()),
  mItem(()=>'🚒 The fire truck'+(GONE.truck?' (blown up)':''),()=>pbTruck()),
  mItem(()=>'🎈 Birds, balloons + UFO'+(GONE.birds.length+GONE.balloons.length+(GONE.ufo?1:0)?' ('+(GONE.birds.length+GONE.balloons.length+(GONE.ufo?1:0))+')':''),()=>pbSky()),
  mItem('🔧 EVERYTHING',()=>putBack()),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Put back everything/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem('🔧 Put back just one kind of thing ▸',()=>menuPush('🔧 Put back',putBackItems())));
  if(TRAIN.derailed)L.splice(1,0,mItem('🛤 Rerail the train',()=>{trainRerail();menuToggle(false);}));return L;};}
{const t0=trainItems;trainItems=function(){const L=t0();L.splice(1,0,mItem(()=>TRAIN.derailed?'🛤 Rerail the train (it went off the rails)':'🛤 Rerail the train',()=>trainRerail()),mItem('🔧 Put back the train / fix the track ▸',()=>menuPush('🔧 Put back',putBackItems())));return L;};}
