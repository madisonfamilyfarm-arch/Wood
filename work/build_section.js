// ================================================================ 🛠 build ANYTHING (starter kits for every kind) · 🏷 name parts · 🎥 your own named cameras in the camera list
function isSubNow(){return vkind()==='boat'&&(SPEC.style==='sub'||!!(ST&&ST.sub));}
// ---- cameras: every camera part on your build is its own view, called whatever you named it
let CAMX=-1;
function camCur(){const L=DR&&DR.cams;return CAMX>=0&&L&&L[CAMX]?L[CAMX]:null;}
function camLabel(){const cc=camCur();return cc?'📷 '+(cc.n||('Camera '+(CAMX+1))):CAMS[camI];}
nextCam=function(d){d=d||1;const L=(DR&&DR.cams)||[],seq=[];CAMS.forEach(c=>{if(c==='FPV'&&L.length>1)L.forEach((x,i)=>seq.push([c,i]));else if(c==='FPV'&&L.length===1&&L[0].n)seq.push([c,0]);else seq.push([c,-1]);});
  let j=seq.findIndex(s=>s[0]===CAMS[camI]&&s[1]===CAMX);if(j<0)j=seq.findIndex(s=>s[0]===CAMS[camI]);j=((j+d)%seq.length+seq.length)%seq.length;camI=CAMS.indexOf(seq[j][0]);CAMX=seq[j][1];
  LS.set('cam',CAMS[camI]);$('camName').textContent=camLabel();chaseInit=false;toast('🎥 '+camLabel()+(CAMX>=0?' — your camera':' — '+CAMHELP[CAMS[camI]]),1300);$('bRC').style.display=CAMS[camI]==='PILOT'?'':'none';};
{const r0=rebuildDrone;rebuildDrone=function(){const r=r0.apply(this,arguments);if(!camCur())CAMX=-1;try{$('camName').textContent=camLabel();}catch(e){}return r;};}
// ---- name a part (a box pops up when you add a camera)
function wsName(i){i=i==null?WS.sel:i;const p=WS.parts[i];if(!p){toast('Tap a part first, then 🏷 name it');return;}
  const def=p.nm||(p.t==='camera'?'Camera '+(WS.parts.filter(q=>q.t==='camera').indexOf(p)+1):'');const n=prompt(p.t==='camera'?'📷 Name your camera (this name shows when you cycle cameras):':'🏷 Name this part:',def);
  if(n==null)return;wsSave();p.nm=String(n).slice(0,40);wsChanged();toast('🏷 '+(p.nm||'(no name)'),1200);}
WS.seen=new Set();
{const o0=openWorkshop;openWorkshop=function(){const r=o0.apply(this,arguments);WS.seen=new Set(WS.parts.map(p=>p.id));return r;};}
{const c0=wsChanged;wsChanged=function(){const r=c0.apply(this,arguments);if(WS.open){const fresh=WS.parts.filter(p=>!WS.seen.has(p.id));fresh.forEach(p=>WS.seen.add(p.id));
    const cam=fresh.find(p=>p.t==='camera'&&!p.nm);if(cam&&fresh.length<=2)setTimeout(()=>{const i=WS.parts.indexOf(cam);if(i>=0&&!cam.nm)wsName(i);},250);}return r;};}
// ---- starter kits for every kind of vehicle
const KITS={
  car:{n:'🚙 RC car',flyAs:'car',wp:true,parts:[{t:'shape',style:'box',w:16,len:28,d:6,h:2,col:'#0a84ff'},{t:'battery',h:5.5,w:5,len:9},{t:'wheel',x:-9.5,y:-9,h:-1,r:4,w:3},{t:'wheel',x:9.5,y:-9,h:-1,r:4,w:3},{t:'wheel',x:-9.5,y:9,h:-1,r:4,w:3},{t:'wheel',x:9.5,y:9,h:-1,r:4,w:3},{t:'camera',style:'fpv',y:-13,h:5.5,nm:'Bumper cam'},{t:'light',x:-5,y:-14.5,h:2,col:'#ffffff'},{t:'light',x:5,y:-14.5,h:2,col:'#ffffff'}]},
  monster:{n:'🛻 Monster truck',flyAs:'car',wp:true,parts:[{t:'shape',style:'box',w:18,len:30,d:8,h:7,col:'#ff3b30'},{t:'battery',h:12,w:5,len:9},{t:'wheel',x:-12,y:-10,h:0,r:7,w:5},{t:'wheel',x:12,y:-10,h:0,r:7,w:5},{t:'wheel',x:-12,y:10,h:0,r:7,w:5},{t:'wheel',x:12,y:10,h:0,r:7,w:5},{t:'camera',style:'fpv',y:-14,h:12,nm:'Driver cam'}]},
  boat:{n:'🚤 Speed boat',flyAs:'boat',wp:true,parts:[{t:'shape',style:'capsule',w:14,len:40,d:8,col:'#f2f2f2'},{t:'shape',style:'wedge',w:12,len:10,d:5,y:-8,h:5,col:'#0a84ff'},{t:'wprop',y:21,h:-3,r:4,pow:6},{t:'battery',h:4,w:5,len:9},{t:'camera',style:'fpv',y:-16,h:5,nm:'Bow cam'}]},
  sub:{n:'🌊 Submarine',flyAs:'sub',wp:true,parts:[{t:'shape',style:'capsule',w:12,len:44,d:12,col:'#ffd60a'},{t:'shape',style:'sphere',mat:'glass',w:9,len:9,d:9,y:-17,h:2,col:'#9fd3ff'},{t:'shape',style:'box',w:5,len:9,d:6,y:-2,h:8,col:'#ffd60a'},{t:'wprop',y:23,r:4,pow:6},{t:'wing',w:16,len:5,d:1,y:18,h:0,col:'#111111'},{t:'battery',h:0,w:5,len:9},{t:'light',y:-22,h:0,col:'#ffffff'},{t:'camera',style:'fpv',y:-21,h:2,nm:'Periscope'}]},
  tank:{n:'🪖 Tank',flyAs:'tank',wp:false,parts:[{t:'shape',style:'box',w:22,len:34,d:8,h:3,col:'#5b6b3a'},{t:'wheel',style:'tread',x:-14,y:0,h:0,r:3.5,w:6,len:34,col:'#4a5530'},{t:'wheel',style:'tread',x:14,y:0,h:0,r:3.5,w:6,len:34,col:'#4a5530'},{t:'shape',style:'cyl',w:14,len:14,d:5,h:9,col:'#4f5e33'},{t:'gun',style:'mg',y:-12,h:9.5,len:16},{t:'battery',h:7.5,w:5,len:9,x:-4,y:8},{t:'camera',style:'fpv',y:-7,h:12,nm:'Turret cam'}]},
  plane:{n:'✈️ Rocket plane',flyAs:'plane',wp:false,parts:[{t:'shape',style:'capsule',w:8,len:50,d:8,col:'#ff3030'},{t:'wing',w:80,len:16,d:1.5,h:0,col:'#f2f2f2'},{t:'wing',w:24,len:10,d:1,y:22,h:0},{t:'wing',w:12,len:10,d:1,y:22,h:6,rz:90},{t:'rocket',y:30,w:4,len:14,pow:4},{t:'wheel',x:-10,y:-4,h:-3,r:3},{t:'wheel',x:10,y:-4,h:-3,r:3},{t:'wheel',x:0,y:-22,h:-5.5,r:3},{t:'battery',h:-3,w:4,len:8},{t:'camera',style:'fpv',y:-24,h:3,nm:'Cockpit'}]},
  mix:{n:'🧪 Mix: drone + rocket + wheels',flyAs:'combo',wp:true,parts:null}};
function kitParts(k){if(k==='drone')return presetToParts(PRESETS.mini);if(k==='mix'){const P=presetToParts(PRESETS.mini).concat([{t:'rocket',y:12,h:0,w:3,len:12,pow:4},{t:'wheel',x:-6,y:-6,h:-5,r:2.5,w:2},{t:'wheel',x:6,y:-6,h:-5,r:2.5,w:2},{t:'wheel',x:-6,y:6,h:-5,r:2.5,w:2},{t:'wheel',x:6,y:6,h:-5,r:2.5,w:2}]);return P;}return KITS[k].parts.map(p=>Object.assign({x:0,y:0,h:0,a:0},p));}
function openKit(k){openWorkshop(false);WS.parts=kitParts(k).map(cleanPart);WS.wires=[];WS.flyAs=k==='drone'?'auto':KITS[k].flyAs;WS.waterproof=k==='drone'?false:!!KITS[k].wp;WS.name=k==='drone'?'My drone':KITS[k].n.replace(/^\S+\s/,'My ');WS.seen=new Set(WS.parts.map(p=>p.id));
  if(typeof autoWire==='function'&&WS.parts.some(p=>p.t==='board'))try{autoWire();}catch(e){}wsChanged();toast('🛠 '+(k==='drone'?'🚁 Drone':KITS[k].n)+' starter — change anything, add any part, then ✅ FLY IT',3000);}
{const b0=buildItems;buildItems=function(){const L=b0();L.splice(0,0,mInfo('Start from a kit (everything is changeable — add rockets to a car, wheels to a drone, anything):'),
    mItem('🚁 Drone',()=>openKit('drone')),...['car','monster','boat','sub','tank','plane','mix'].map(k=>mItem(KITS[k].n,()=>openKit(k))));return L;};}
// ↔ wider / thinner and ➕ longer / ➖ shorter now work on EVERY part (cameras, lights, boards, motors, guards…), like ↧ squash
{const t0=wsTool;wsTool=function(k){const p=WS.parts[WS.sel];const NW=['camera','light','motor','guard','rx','gps','board','sensor','buzzer','pad','sprop','wprop','hover','gun','strip','skid','leg','antenna'],NL=['camera','light','board','rx','gps','sensor','buzzer','pad','hover'];
  const f=(key,up,nm)=>{wsSave();p[key]=clamp(+((p[key]||1)*(up?1.12:1/1.12)).toFixed(3),0.15,8);wsChanged();toast(nm+' '+Math.round(p[key]*100)+'%',900);};
  if(p&&(k==='wide'||k==='thin')&&NW.includes(p.t)){f('sx',k==='wide',k==='wide'?'↔ wider':'↕ thinner');return;}
  if(p&&(k==='long'||k==='short')&&NL.includes(p.t)){f('sz',k==='long',k==='long'?'➕ longer':'➖ shorter');return;}
  return t0.apply(this,arguments);};}
// 🔽 SHRINK / 🔼 EXPAND: every dimension of a part (or of the whole build, positions too) gets smaller / bigger
function partScale(p,k){const R=v=>+(v*k).toFixed(3);
  if(['motor','sprop','wprop','hover','guard','pad'].includes(p.t))p.r=R(p.r);
  else if(p.t==='wheel'){p.r=R(p.r);p.w=R(p.w);if(p.style==='tread')p.len=R(p.len);}
  else if(p.t==='model')p.sc=R(p.sc);
  else if(p.t==='shape'||p.t==='wing'){p.len=R(p.len);p.w=R(p.w);p.d=R(p.d);}
  else if(['body','arm','battery','rocket','jet','strip','skid','leg','antenna','gun'].includes(p.t)){p.len=R(p.len);p.w=R(p.w);if(['body','battery','strip','skid'].includes(p.t))p.sq=R(p.sq||1);}
  else{p.sx=R(p.sx||1);p.sz=R(p.sz||1);p.sq=R(p.sq||1);}}
{const t0=wsTool;wsTool=function(k){if(k==='shrink'||k==='expand'||k==='shrinkAll'||k==='expandAll'){const f=k.indexOf('shrink')===0?0.85:1/0.85,all=k.endsWith('All');
    if(!all&&!WS.parts[WS.sel]){toast('Tap a part first (or use 🔽 shrink WHOLE build)',1600);return;}wsSave();
    (all?WS.parts:[WS.parts[WS.sel]]).forEach(p=>{partScale(p,f);if(all){p.x=+(p.x*f).toFixed(2);p.y=+(p.y*f).toFixed(2);p.h=+(p.h*f).toFixed(2);}});
    WS.parts=WS.parts.map(cleanPart);wsChanged();toast((f<1?'🔽 Shrunk ':'🔼 Expanded ')+(all?'the whole build':'the part')+' to '+Math.round(f*100)+'%',1100);return;}
  return t0.apply(this,arguments);};}
