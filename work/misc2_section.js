// ================================================================ 🖥 CONSOLE (the ` ~ key): every message + what's connected (multiplayer, DJI remote, controller, Phone Link, AI)
const CONS={L:[],open:false};
function consLog(txt,kind){CONS.L.push({t:new Date(),txt:String(txt),kind:kind||'info'});if(CONS.L.length>300)CONS.L.shift();if(CONS.open)consDraw();}
{const t0=toast;toast=function(m,ms){if(m)consLog(m,'msg');return t0.apply(this,arguments);};}
{const c0=chatSys;chatSys=function(t){consLog(t,'chat');return c0.apply(this,arguments);};}
{const c0=chatAdd;chatAdd=function(w,t){consLog((w?w+': ':'')+t,'chat');return c0.apply(this,arguments);};}
addEventListener('error',e=>consLog('⚠ '+(e.message||'error'),'err'));
addEventListener('unhandledrejection',e=>consLog('⚠ '+((e.reason&&e.reason.message)||e.reason||'error'),'err'));
function consStatus(){const ok=(b,y,n)=>b?'<span style="color:#33ff66">✅ '+y+'</span>':'<span style="color:#ff6b6b">❌ '+n+'</span>';let gp=null;try{gp=rcGp();}catch(e){}
  return[ok(typeof mpOpen==='function'&&mpOpen(),'Multiplayer connected ('+(Object.keys(mp.peers).filter(k=>!/^bot/.test(k)).length)+' other players)','Multiplayer not connected (start it with Play Multiplayer.bat)'),
    ok(typeof djiLive==='function'&&djiLive(),'DJI remote connected','DJI remote not connected'),
    ok(!!gp,'Controller: '+(gp?gp.id.slice(0,40):''),'No USB controller / InterLink found (move a stick to wake it)'),
    ok(!!window._relay,'Phone Link helper running','Phone Link helper not running'),
    AIB.claude?ok(AIB.ok===true,'AI connected — flying the bots','AI not connected'+(AIB.err?' ('+AIB.err+')':'')+' — built-in AI flying'):'<span style="opacity:.7">🧠 AI: off (built-in AI)</span>',
    '🤖 AI pilots: '+(AIB.n||0)+' · 🧑‍🚒 campers: '+CAMPERS.L.length+' · 🔥 fires: '+FIRE.L.length+' · 💰 '+ECO.coins+(typeof CES!=='undefined'&&CES.on?' · 🌎 real world: '+(CES.ready?'loaded':'loading'):'')].join('<br>');}
function consDraw(){let el=$('consP');if(!el){el=document.createElement('div');el.id='consP';el.style.cssText='position:fixed;left:0;right:0;top:0;height:46vh;z-index:90;background:rgba(5,10,8,0.93);color:#cfe;font:12px ui-monospace,Menlo,monospace;padding:10px 12px;overflow:auto;border-bottom:2px solid #33ff66;display:none';
    el.addEventListener('pointerdown',e=>e.stopPropagation());document.body.appendChild(el);}
  el.style.display=CONS.open?'block':'none';if(!CONS.open)return;const col={err:'#ff6b6b',chat:'#9fd3ff',msg:'#e8f0e8'};
  el.innerHTML='<b style="color:#33ff66">🖥 CONSOLE</b> <span style="opacity:.6">( ` key closes · newest at the bottom )</span><div style="margin:6px 0 8px;line-height:1.6">'+consStatus()+'</div><hr style="border-color:#244">'+
    CONS.L.slice(-120).map(m=>'<div style="color:'+(col[m.kind]||'#cfe')+'">['+m.t.toTimeString().slice(0,8)+'] '+m.txt.replace(/</g,'&lt;')+'</div>').join('');el.scrollTop=el.scrollHeight;}
addEventListener('keydown',e=>{if(e.code==='Backquote'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))){CONS.open=!CONS.open;consDraw();e.preventDefault();e.stopPropagation();}},true);
setInterval(()=>{if(CONS.open)consDraw();},1500);
// remember connection changes in the console
(function(){let last='';setInterval(()=>{try{const s=[mpOpen()?'mp+':'mp-',(typeof djiLive==='function'&&djiLive())?'dji+':'dji-',AIB.ok===true?'ai+':AIB.ok===false?'ai-':'ai?'].join(' ');if(s!==last){if(last)consLog('🔌 '+(mpOpen()?'Multiplayer connected':'Multiplayer not connected')+' · '+((typeof djiLive==='function'&&djiLive())?'DJI remote connected':'DJI remote not connected')+(AIB.claude?' · '+(AIB.ok===true?'AI connected':'AI not connected'):''),'info');last=s;}}catch(e){}},2000);})();

// ================================================================ 🦴 falling hurts: walk off (or jump off) the fire tower → broken leg. You limp until you HEAL (Menu → 🩹 Heal)
const HURT={leg:false};
{const t0=tickWalk;tickWalk=function(dt){if(!WALK.on||TRUCK.in)return t0.apply(this,arguments);const px=WALK.pos.x,pz=WALK.pos.z,py=WALK.pos.y,vy0=WALK.vy,onDeck=typeof FT!=='undefined'&&Math.abs(py-FT.top)<0.25&&vy0===0;
  const r=t0.apply(this,arguments);
  // the railings keep you on the deck (unless you jump over them!)
  if(onDeck&&WALK.vy===0&&!WALK.climb){const dx=WALK.pos.x-FT.x,dz=WALK.pos.z-FT.z,gap=Math.abs(dx)<0.9&&dz>3.4;if((Math.abs(dx)>3.85||Math.abs(dz)>3.85)&&!gap){WALK.pos.x=px;WALK.pos.z=pz;WALK.pos.y=py;}}
  // landing hard = broken leg
  if(vy0<-9&&WALK.vy===0&&!HURT.leg){HURT.leg=true;shake=0.8;beep(150,0.4,0.1);toast('🦴 OUCH! You broke your leg falling. You can only limp — Menu → 🩹 Heal',5000);}
  if(HURT.leg){WALK.pos.x=px+(WALK.pos.x-px)*0.3;WALK.pos.z=pz+(WALK.pos.z-pz)*0.3;WALK.bob+=dt*1.5;}
  return r;};}
// no jumping or ladder climbing with a broken leg
addEventListener('keydown',e=>{if(HURT.leg&&WALK.on&&e.code==='Space'){e.stopImmediatePropagation();toast('🦴 Can\'t jump with a broken leg — Menu → 🩹 Heal',1500);}},true);
{const w0=walkCam;walkCam=function(){const r=w0.apply(this,arguments);if(HURT.leg&&WALK.on&&!TRUCK.in)cam.position.y-=Math.abs(Math.sin(WALK.bob*1.5))*0.12;return r;};}
function heal(){if(!HURT.leg){toast('💚 You\'re all healthy!',1200);return;}HURT.leg=false;beep(900,0.1,0.05);setTimeout(()=>beep(1300,0.15,0.05),120);toast('🩹 All better — your leg is healed!',2500);}
{const m0=mainItems;mainItems=function(){const L=m0();if(HURT.leg)L.splice(1,0,mItem('🩹 HEAL — fix my broken leg',()=>{heal();menuToggle(false);}));return L;};}

// ================================================================ ✨ 15 MORE THINGS TO DO
// 1 🏆 Trophies: every award you've ever won, counted
const TROPHY=LS.get('trophies',{});{const a0=award;award=function(name,n){const k=String(name).replace(/[\d.]+\s*(s|m|km\/h|coins?)?!?/g,'').replace(/\s+/g,' ').trim();TROPHY[k]=(TROPHY[k]||0)+1;LS.set('trophies',TROPHY);try{XTRA.chalHit(k);}catch(e){}return a0.apply(this,arguments);};}
function trophyItems(){const K=Object.keys(TROPHY).sort((a,b)=>TROPHY[b]-TROPHY[a]);return[mInfo('🏆 Everything you\'ve earned — '+K.reduce((a,k)=>a+TROPHY[k],0)+' awards so far'),...K.slice(0,40).map(k=>mInfo(k+'  ×'+TROPHY[k])),mItem('◀ Back',()=>menuBack())];}
const XTRA={chal:LS.get('chal',null),hiker:null,pkg:null,ufo:null,birds:[],flies:null,balloons:[],buried:LS.get('buried',null),safari:{},t:0,arrow:null};
// 2 🎯 Daily challenges: 3 goals a day, coins when you finish them
const CHAL_POOL=[['🔄 Flip','Do 5 flips',5],['😱 Close call','Get 3 close calls',3],['🚒 Fire out','Put out 3 fires',3],['🏁 Low pass','Do 2 low passes',2],['🎈 Pop','Pop 5 balloons',5],['🪶 Smooth landing','Do 3 smooth landings',3],['🧭 Hiker rescued','Rescue a lost hiker',1],['📦 Package delivered','Deliver 2 packages',2],['📸 Wildlife photo','Take 3 wildlife photos',3],['🌀 Roll','Do 3 rolls',3]];
XTRA.chalNew=function(){const day=new Date().toDateString();if(XTRA.chal&&XTRA.chal.day===day)return;const P=CHAL_POOL.slice().sort(()=>Math.random()-0.5).slice(0,3);XTRA.chal={day,L:P.map(p=>({k:p[0],n:p[1],need:p[2],got:0,done:false}))};LS.set('chal',XTRA.chal);};
XTRA.chalHit=function(k){if(!XTRA.chal)return;XTRA.chal.L.forEach(c=>{if(!c.done&&k.indexOf(c.k)===0){c.got++;if(c.got>=c.need){c.done=true;setTimeout(()=>{toast('🎯 Daily challenge done: '+c.n+'! +25 coins',3000);ECO.coins+=25;ecoSave();ecoChip();},800);}}});LS.set('chal',XTRA.chal);};
function chalItems(){XTRA.chalNew();return[mInfo('🎯 Today\'s challenges (new ones every day, +25 coins each)'),...XTRA.chal.L.map(c=>mInfo((c.done?'✅ ':'⬜ ')+c.n+'  ('+Math.min(c.got,c.need)+'/'+c.need+')')),mItem('◀ Back',()=>menuBack())];}
// 3 🧭 Lost hiker rescue: someone is lost in the woods waving a red flare — find them and hover close
function hikerStart(){if(XTRA.hiker)return;const a=Math.random()*6.28,d=120+Math.random()*200,x=D.pos.x+Math.cos(a)*d,z=D.pos.z+Math.sin(a)*d;const g=makePilot(0xff6a00);g.position.set(x,H(x,z),z);scene.add(g);
  const fl=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,6),new THREE.MeshBasicMaterial({color:0xff2020}));fl.position.set(0.3,2,0);g.add(fl);XTRA.hiker={g,x,z,fl,t:0};chatSys('📻 Ranger: "A hiker is lost in the woods! Look for the red flare smoke and fly close to them."');toast('🧭 Lost hiker! Follow the arrow / red smoke',3500);}
// 4 📦 Package delivery: grab the box at the helipad (hover low over it), fly it to the cabin / campsite / fire tower
function pkgStart(){if(XTRA.pkg)return;const box=new THREE.Mesh(GEO.box,new THREE.MeshLambertMaterial({color:0xb8864b}));box.scale.setScalar(0.5);box.position.set(PAD.x+2.5,H(PAD.x+2.5,PAD.z+2.5)+0.25,PAD.z+2.5);scene.add(box);
  const T=[[-14,12,'🏠 the cabin'],[16,-14,'🏕 the campsite'],[FT.x+2.9,FT.z-2.9,'🔥 the fire tower deck'],[LAKE.x-LAKE.rx-6,LAKE.z+3,'🚤 the lake dock']][Math.floor(Math.random()*4)];
  XTRA.pkg={box,carried:false,tx:T[0],tz:T[1],name:T[2]};toast('📦 Package job: hover low over the box by the helipad to grab it, then take it to '+T[2],4500);}
// 5 🎆 Fireworks show
function fireworks(n){n=n||8;for(let k=0;k<n;k++)setTimeout(()=>{const x=D.pos.x+(Math.random()-0.5)*60,z=D.pos.z-40+(Math.random()-0.5)*40,y=H(x,z)+40+Math.random()*30,c=new THREE.Color().setHSL(Math.random(),1,0.6);beep(200+Math.random()*200,0.3,0.05);
    for(let i=0;i<40;i++){fireTex();const s=new THREE.Sprite(new THREE.SpriteMaterial({map:FIRE.tex,color:c,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.position.set(x,y,z);s.scale.setScalar(1.6);scene.add(s);const v=new V3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).setLength(9+Math.random()*5);
      const t0=performance.now();(function f(){const t=(performance.now()-t0)/1000;if(t>2.2){scene.remove(s);return;}s.position.addScaledVector(v,1/60);v.y-=9.8/60*0.4;v.multiplyScalar(0.985);s.material.opacity=1-t/2.2;requestAnimationFrame(f);})();}},k*450+Math.random()*300);}
// 6 ✨ fireflies at night · 7 🐦 bird flocks over the woods · 8 🎈 hot-air balloons drifting by
function xtraBuild(){const ffG=new THREE.BufferGeometry(),N=160,P=new Float32Array(N*3);for(let i=0;i<N;i++){P[i*3]=(Math.random()-0.5)*80;P[i*3+1]=0.5+Math.random()*2.5;P[i*3+2]=(Math.random()-0.5)*80;}ffG.setAttribute('position',new THREE.BufferAttribute(P,3));
  XTRA.flies=new THREE.Points(ffG,(fireTex(),new THREE.PointsMaterial({map:FIRE.tex,color:0xd8ff6a,size:0.3,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false})));XTRA.flies.visible=false;scene.add(XTRA.flies);
  for(let f=0;f<3;f++){const fl={g:new THREE.Group(),a:Math.random()*6.28,R:80+f*60,h:35+f*8,cx:(Math.random()-0.5)*200,cz:(Math.random()-0.5)*200,b:[]};
    for(let i=0;i<9;i++){const b=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:0x2a2a2a,side:THREE.DoubleSide});const w1=new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.15),m);w1.position.x=0.3;const W1=new THREE.Group();W1.add(w1);const w2=w1.clone();w2.position.x=-0.3;const W2=new THREE.Group();W2.add(w2);b.add(W1,W2);b.position.set((i%3-1)*1.4,Math.random(),-Math.abs(i%3-1)*1.4-Math.floor(i/3)*1.2);fl.g.add(b);fl.b.push([W1,W2,Math.random()*6]);}
    scene.add(fl.g);XTRA.birds.push(fl);}
  const cols=[0xff3b30,0xffd60a,0x0a84ff,0x34c759];for(let k=0;k<3;k++){const g=new THREE.Group(),env=new THREE.Mesh(new THREE.SphereGeometry(5,16,12),new THREE.MeshLambertMaterial({color:cols[k]}));env.scale.y=1.2;g.add(env);
    const bask=new THREE.Mesh(GEO.box,new THREE.MeshLambertMaterial({color:0x8b5a2b}));bask.scale.set(1.6,1.1,1.6);bask.position.y=-8;g.add(bask);for(const [x,z] of[[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]]){const r=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,3.4,4),MAT.dark||MAT.metal);r.position.set(x,-6,z);g.add(r);}
    g.position.set(-300+k*150,80+k*15,-200+k*120);scene.add(g);XTRA.balloons.push({g,v:new V3(1.2+k*0.3,0,0.6)});}}
// 9 🪙 buried treasure all over the woods + a treasure detector that beeps faster when you're close (⛏ dig mode)
function buriedInit(){if(XTRA.buried&&XTRA.buried.length)return;XTRA.buried=[];for(let i=0;i<8;i++){const a=Math.random()*6.28,d=40+Math.random()*300;XTRA.buried.push({x:Math.cos(a)*d,z:Math.sin(a)*d,c:10+Math.floor(Math.random()*30)});}LS.set('buried',XTRA.buried);}
{const d0=digHere;digHere=function(){if(WALK.on&&!D.sea&&XTRA.buried){const i=XTRA.buried.findIndex(b=>Math.hypot(b.x-WALK.pos.x,b.z-WALK.pos.z)<2.2);if(i>=0){const b=XTRA.buried.splice(i,1)[0];LS.set('buried',XTRA.buried);beep(300,0.1,0.05);setTimeout(()=>{award('🪙 Buried treasure!',b.c);toast('🪙 You dug up buried treasure! '+XTRA.buried.length+' more hidden in the woods',3000);},1200);return;}}return d0.apply(this,arguments);};}
// 10 🛸 a UFO shows up at night — take its photo!  11 📸 wildlife photos (deer, crabs, the whale, birds, the UFO) pay coins
function ufoMake(){const g=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:0x9aa0a6,emissive:0x111111});const d=new THREE.Mesh(new THREE.SphereGeometry(4,20,8),m);d.scale.y=0.25;g.add(d);const dome=new THREE.Mesh(new THREE.SphereGeometry(1.6,14,10,0,6.3,0,1.6),new THREE.MeshLambertMaterial({color:0x7cff9a,emissive:0x2a8a3a,transparent:true,opacity:0.8}));dome.position.y=0.6;g.add(dome);
  for(let i=0;i<8;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(0.25,6,4),new THREE.MeshBasicMaterial({color:0xffffff}));l.position.set(Math.cos(i/8*6.28)*3.6,-0.2,Math.sin(i/8*6.28)*3.6);g.add(l);}scene.add(g);return g;}
{const g0=grabPhoto;grabPhoto=function(){const r=g0.apply(this,arguments);try{photoSafari();}catch(e){}return r;};}
const _svx=new V3();
function photoSafari(){const seen=[];const chk=(p,n,max)=>{_svx.copy(p).project(cam);if(_svx.z<1&&Math.abs(_svx.x)<0.85&&Math.abs(_svx.y)<0.85&&cam.position.distanceTo(p)<(max||60))seen.push(n);};
  (deer||[]).forEach(d=>d.g&&chk(d.g.position,'🦌 deer'));if(XTRA.ufo&&XTRA.ufo.visible)chk(XTRA.ufo.position,'🛸 UFO',250);XTRA.birds.forEach(f=>chk(f.g.position,'🐦 birds',90));XTRA.balloons.forEach(b=>chk(b.g.position,'🎈 hot-air balloon',200));
  if(typeof ISL!=='undefined'&&D.sea){ISL.crabs.forEach(c=>chk(c.g.position,'🦀 crab',25));if(SEA.whale&&SEA.whale.pos)chk(SEA.whale.pos,'🐋 whale',120);if(SEA.shark&&SEA.shark.pos)chk(SEA.shark.pos,'🦈 shark',80);}
  const now=performance.now();[...new Set(seen)].forEach(n=>{if(now-(XTRA.safari[n]||0)<60000)return;XTRA.safari[n]=now;award('📸 Wildlife photo: '+n+'!',n.indexOf('UFO')>=0?30:5);});}
// 12 🧑‍🚒 campers wave + cheer when you fly low over the camp
// 13 🧭 an arrow at the top of the screen points to your goal (fire, hiker, package) + a siren when a new wildfire starts
function arrowDraw(){let el=XTRA.arrow;if(!el){el=document.createElement('div');el.style.cssText='position:fixed;left:50%;top:58px;transform:translateX(-50%);z-index:13;pointer-events:none;font:900 15px system-ui,sans-serif;color:#fff;text-shadow:0 1px 4px #000;text-align:center;display:none';document.body.appendChild(el);XTRA.arrow=el;}
  const me=WALK.on?WALK.pos:D.pos,yaw=WALK.on?WALK.yaw:D.yaw;let tgt=null,lab='';
  if(XTRA.pkg){if(XTRA.pkg.carried){tgt=[XTRA.pkg.tx,XTRA.pkg.tz];lab='📦 '+XTRA.pkg.name;}else{tgt=[XTRA.pkg.box.position.x,XTRA.pkg.box.position.z];lab='📦 the package';}}
  else if(XTRA.hiker){tgt=[XTRA.hiker.x,XTRA.hiker.z];lab='🧭 lost hiker';}else if(FIRE.L.length){const F=nearestFire(me.x,me.z);tgt=[F.x,F.z];lab='🔥 fire';}
  if(!tgt||menu.open){el.style.display='none';return;}const dx=tgt[0]-me.x,dz=tgt[1]-me.z,d=Math.hypot(dx,dz);if(d<6){el.style.display='none';return;}
  const a=Math.atan2(-dx,-dz)-yaw;el.style.display='block';el.innerHTML='<div style="font-size:30px;transform:rotate('+(-a)+'rad)">⬆</div>'+lab+' · '+Math.round(d)+' m';}
// 14 🌙 night-vision camera   15 🎒 an AI "missions" menu that ties it all together
function nvApply(){document.getElementById('gl').style.filter=CFG.nv?'sepia(1) hue-rotate(60deg) saturate(3) brightness(1.4) contrast(1.1)':'';}
setTimeout(nvApply,500);
function xtraItems(){return[mItem('🎯 Today\'s challenges ▸',()=>menuPush('🎯 Challenges',chalItems())),mItem('🏆 My trophies ▸',()=>menuPush('🏆 Trophies',trophyItems())),
  mItem(()=>XTRA.hiker?'🧭 Lost hiker — still out there!':'🧭 Rescue mission: find a lost hiker',()=>{hikerStart();menuToggle(false);}),
  mItem(()=>XTRA.pkg?'📦 Package job in progress → '+XTRA.pkg.name:'📦 Delivery job: carry a package',()=>{pkgStart();menuToggle(false);}),
  mItem('🎆 Fireworks show!',()=>{fireworks(10);menuToggle(false);}),
  mItem(()=>'🌙 Night-vision camera: '+(CFG.nv?'ON':'off'),()=>{CFG.nv=!CFG.nv;saveCfg();nvApply();}),
  mItem(()=>'🪙 Buried treasure: '+(XTRA.buried?XTRA.buried.length:8)+' left (⛏ dig mode beeps when you\'re close)',()=>{buriedInit();while(shotMode!=='dig')cycleShot();if(!WALK.on)walkToggle(true);menuToggle(false);}),
  mInfo('📸 Photograph deer, birds, hot-air balloons, crabs, the whale — or the UFO that comes out at night — for coins'),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(it=>{try{return /Races & games/.test(it.label());}catch(e){return false;}});L.splice(i+1,0,mItem('🎒 Missions, challenges + fun stuff ▸',()=>menuPush('🎒 Missions + fun',xtraItems())));return L;};}
// ---- every frame
let _lastFires=0;
function xtraTick(dt){if(typeof CES!=='undefined'&&CES.on)return;if(!XTRA.flies&&started)xtraBuild();if(!XTRA.flies)return;const t=performance.now()/1000,night=document.body.classList.contains('night');XTRA.chalNew();if(!XTRA.buried)buriedInit();
  // fireflies follow you around at night
  XTRA.flies.visible=night&&!D.sea;if(XTRA.flies.visible){const me=WALK.on?WALK.pos:D.pos;XTRA.flies.position.set(me.x,H(me.x,me.z),me.z);const P=XTRA.flies.geometry.attributes.position;for(let i=0;i<P.count;i++)P.setY(i,P.getY(i)+Math.sin(t*2+i)*0.004);P.needsUpdate=true;XTRA.flies.material.opacity=0.5+0.5*Math.sin(t*3);}
  XTRA.birds.forEach(f=>{f.a+=dt*0.08;f.g.position.set(f.cx+Math.cos(f.a)*f.R,H(f.cx,f.cz)+f.h,f.cz+Math.sin(f.a)*f.R);f.g.rotation.y=-f.a;f.b.forEach(([a,b,p])=>{const s=Math.sin(t*7+p)*0.6;a.rotation.z=s;b.rotation.z=-s;});});
  XTRA.balloons.forEach(b=>{b.g.position.addScaledVector(b.v,dt);b.g.position.y+=Math.sin(t*0.2+b.v.x)*0.02;if(b.g.position.x>500)b.g.position.x=-500;});
  // UFO at night
  if(night&&!XTRA.ufo)XTRA.ufo=ufoMake();if(XTRA.ufo){XTRA.ufo.visible=night;if(night){const a=t*0.15;XTRA.ufo.position.set(Math.cos(a)*180,90+Math.sin(t*0.7)*10,Math.sin(a*1.3)*180);XTRA.ufo.rotation.y=t*1.5;}}
  // the lost hiker
  if(XTRA.hiker){const h=XTRA.hiker;h.t+=dt;h.fl.material.color.setHSL(0,1,0.4+0.3*Math.sin(t*8));if(Math.random()<dt*6&&FIRE.smk){fireTex();const m=new THREE.Sprite(new THREE.SpriteMaterial({map:FIRE.smk,color:0xff4040,transparent:true,depthWrite:false,opacity:0.6}));m.position.set(h.x,H(h.x,h.z)+2.2,h.z);m.scale.setScalar(1.5);FIRE.g.add(m);FIRE.smoke.push({m,t:0,life:7,v:new V3(wind.x*0.3,2.5,wind.z*0.3),s:1.5});}
    const me=WALK.on?WALK.pos:D.pos;if(Math.hypot(me.x-h.x,me.z-h.z)<6&&Math.abs(me.y-H(h.x,h.z))<12){scene.remove(h.g);XTRA.hiker=null;award('🧭 Hiker rescued!',35);chatSys('📻 Ranger: "You found them! Great rescue, pilot!"');}}
  // the package
  if(XTRA.pkg){const P=XTRA.pkg,b=P.box;if(!P.carried){if(D.state==='flying'&&b.position.distanceTo(D.pos)<2.2){P.carried=true;beep(900,0.1,0.05);toast('📦 Got it! Now fly it to '+P.name,2500);}}
    else{b.position.set(D.pos.x,D.pos.y-0.5,D.pos.z);if(D.state==='tumble'||D.state==='down'){P.carried=false;b.position.y=H(b.position.x,b.position.z)+0.25;toast('📦 You dropped the package! Go pick it up',2000);}
      else if(Math.hypot(D.pos.x-P.tx,D.pos.z-P.tz)<4&&D.pos.y-groundY(D.pos.x,D.pos.z)<3){scene.remove(b);XTRA.pkg=null;award('📦 Package delivered!',25);}}}
  // campers cheer when you buzz the camp
  if(D.state==='flying'&&Math.hypot(D.pos.x-16,D.pos.z+14)<14&&D.pos.y-H(D.pos.x,D.pos.z)<6&&!xtraTick.cheer){xtraTick.cheer=1;setTimeout(()=>xtraTick.cheer=0,20000);const C=CAMPERS.L[Math.floor(Math.random()*CAMPERS.L.length)];if(C)campSay(C,['👋 Nice flying!','🎉 Wooo!','📸 Do a flip!','😄 Hi pilot!'][Math.floor(Math.random()*4)]);}
  CAMPERS.L.forEach((C,i)=>{if(C.state==='walk'||C.state==='idle'){const near=Math.hypot(D.pos.x-C.x,D.pos.z-C.z)<12&&D.state==='flying';const arm=C.g.children.find(o=>o.userData&&o.userData.arm);C.g.rotation.z=near?Math.sin(t*8+i)*0.08:0;}});
  // treasure detector in dig mode
  if(shotMode==='dig'&&WALK.on&&XTRA.buried&&XTRA.buried.length){let bd=1e9;XTRA.buried.forEach(b=>{bd=Math.min(bd,Math.hypot(b.x-WALK.pos.x,b.z-WALK.pos.z));});if(bd<40){XTRA.detT=(XTRA.detT||0)-dt;if(XTRA.detT<=0){XTRA.detT=clamp(bd/25,0.08,1.5);beep(1200+(40-bd)*25,0.04,0.03);}}}
  // siren for new fires
  if(FIRE.L.length>_lastFires&&_lastFires===0){beep(700,0.3,0.06);setTimeout(()=>beep(950,0.3,0.06),320);setTimeout(()=>beep(700,0.3,0.06),640);}_lastFires=FIRE.L.length;
  arrowDraw();}
{const f0=fireTick;fireTick=function(dt){const r=f0.apply(this,arguments);try{xtraTick(dt);}catch(e){if(!xtraTick.e){xtraTick.e=1;console.warn('xtra',e);}}return r;};}
