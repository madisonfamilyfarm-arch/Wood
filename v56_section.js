// ================================================================ v56: 🔧 fixes found by the overnight play-tests
// 🥽 VR: the phone is inside a headset, so on-screen buttons (TNT, chat, tools, health bar…) just get in the way of the picture → hide every floating overlay except Exit VR + the respawn countdown
const VRKEEP=new Set(['vrUI','dzCount','menu','repair','gal','prog','ws','wsGhost','start','mapEd','bsBox','djiStat','scrTurn']);
function vrHideOverlays(){const on=document.body.classList.contains('vr');for(const el of document.body.children){if(el.tagName==='CANVAS'||el.tagName==='SCRIPT'||VRKEEP.has(el.id))continue;
    if(on){if(el.dataset.vrh)continue;const cs=getComputedStyle(el);if(cs.position==='fixed'||cs.position==='absolute'){el.dataset.vrh='1';el.classList.add('vrHid');}}else if(el.dataset.vrh){delete el.dataset.vrh;el.classList.remove('vrHid');}}}
{const st=document.createElement('style');st.textContent='body.vr .vrHid{display:none!important}';document.head.appendChild(st);}
setInterval(()=>{try{if(document.body.classList.contains('vr')||document.querySelector('.vrHid'))vrHideOverlays();}catch(e){}},700);
{const t0=toggleVR;toggleVR=function(){const r=t0.apply(this,arguments);try{vrHideOverlays();}catch(e){}return r;};}
// 📱 phone layout: the "Hide chat" button sat on top of "💬 Chat" (zoom moved them), and the 2nd button row (DJI / VR / ⛶) covered the mini-map + its zoom buttons
function layoutFix(){if(!started||document.body.classList.contains('vr'))return;
  const cb=$('cbBtn'),ct=$('chatTog');if(cb&&ct&&ct.style.display!=='none'&&cb.style.display!=='none'&&!document.body.classList.contains('pt')){const a=cb.getBoundingClientRect(),b=ct.getBoundingClientRect();
    if(a.width&&b.right>a.left-4&&b.left<a.right){const z=parseFloat(getComputedStyle(ct).zoom)||1;ct.style.left=Math.max(4,(a.left-b.width-8))/z+'px';ct.style.bottom=getComputedStyle(cb).bottom;}}
  const mb=$('mapBox');if(mb&&getComputedStyle(mb).display!=='none'){const m=mb.getBoundingClientRect();if(m.width>0&&m.width<300){let low=0;for(const id of ['bDJI','bVR','bFS','coinBadge','money']){const e=$(id);if(!e||getComputedStyle(e).display==='none')continue;const r=e.getBoundingClientRect();if(r.left<m.right+60&&r.bottom>low&&r.top<m.top+20)low=r.bottom;}
      document.querySelectorAll('#top button, #top div').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&r.height<50&&r.left<m.right+60&&r.top<m.top+20&&r.bottom>low)low=r.bottom;});
      if(low>m.top-2){mb.style.top=(low+5)+'px';const bt=$('mapBtns');if(bt&&innerHeight<500){bt.style.display='grid';bt.style.gridTemplateColumns='repeat(2,30px)';bt.style.gap='3px';}}}}}
setInterval(()=>{try{layoutFix();}catch(e){}},800);
// 🧹 explosions, rockets and TNT used to leave their shapes on the graphics chip forever (it slowly filled up in long battles) → free them when they're gone.
// (only shapes — materials stay, so nothing has to be re-compiled = no freeze)
let GEO_KEEP=null;function geoDisp(o){try{if(!o)return;if(!GEO_KEEP){GEO_KEEP=new Set();try{Object.values(GEO).forEach(g=>g&&g.isBufferGeometry&&GEO_KEEP.add(g));}catch(e){}try{SHARED_GEO.forEach(g=>GEO_KEEP.add(g));}catch(e){}try{GEO_KEEP.add(DZG);}catch(e){}}
  o.traverse(m=>{if(m.geometry&&!m.isInstancedMesh&&!GEO_KEEP.has(m.geometry)&&!(typeof SHARED_GEO!=='undefined'&&SHARED_GEO.has(m.geometry))&&!m.geometry.userData.keep)m.geometry.dispose();});}catch(e){}}
// menu info lines were black text on the dark menu (unreadable)
{const st=document.createElement('style');st.textContent='#menu .info{color:#cfe3d6!important}';document.head.appendChild(st);}
// builder: the game's top buttons showed through behind the builder's title line
{const st=document.createElement('style');st.textContent='#ws{background:#0a100c!important}';document.head.appendChild(st);}
// builder on a phone: tips pop up over the picture, not on top of the DRIVE IT / tool buttons
{const st=document.createElement('style');st.textContent='body.wsOn #toast{top:calc(120px + env(safe-area-inset-top))!important;bottom:auto!important}';document.head.appendChild(st);
 setInterval(()=>{try{const w=$('ws');document.body.classList.toggle('wsOn',!!(w&&getComputedStyle(w).display!=='none'));}catch(e){}},400);}
// 🪖 a tank you BUILT drove 60 km/h (like a race car!) — real RC tanks crawl. Same feel as the ready-made tank now.
{const u0=useSpec;useSpec=function(){const r=u0.apply(this,arguments);try{if(vhKind()==='tank'&&ST&&ST.top>8){ST.top=clamp(ST.top*0.36,3.5,8);ST.acc=Math.min(ST.acc,11);}}catch(e){}return r;};}
// auto-smooth: don't judge the speed in the first seconds after starting (the phone is still warming up the graphics) — it was turning the picture down for no reason
{const s0=startGame;startGame=function(){PERF.t0=performance.now();return s0.apply(this,arguments);};}
{const v0=document.onvisibilitychange;document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')PERF.t0=performance.now();});}
// start screen on a phone: it was taller than the screen and centered, so the title + top got cut off and couldn't be scrolled to
{const st=document.createElement('style');st.textContent='#start{justify-content:flex-start!important;padding-top:calc(20px + env(safe-area-inset-top))!important;padding-bottom:calc(24px + env(safe-area-inset-bottom))!important}#start>:first-child{margin-top:auto}#start>:last-child{margin-bottom:auto}';document.head.appendChild(st);}
// 💧 DROP (fire bucket) button was off the top of the screen on a phone held sideways
{const st=document.createElement('style');st.textContent='@media (max-height:500px){#dropB{bottom:auto!important;top:calc(122px + env(safe-area-inset-top))!important;right:calc(10px + env(safe-area-inset-right))!important;padding:8px 12px!important;font-size:14px!important}}';document.head.appendChild(st);}
// sideways phone: chat lines sat on top of the mini-map → show them in the middle, above the Chat button
{const st=document.createElement('style');st.textContent='@media (max-height:500px) and (orientation:landscape){#chatLog{left:calc(30% + env(safe-area-inset-left))!important;bottom:calc(98px + env(safe-area-inset-bottom))!important;max-width:40vw!important;font-size:12px!important}}';document.head.appendChild(st);}
// 🎥 the follow camera could end up INSIDE a tree (screen full of leaves) → it slides in toward your drone until it's out of the tree
{const _cp=new V3();const u0=updateCam;updateCam=function(dt){const r=u0.apply(this,arguments);try{const m=CAMS[camI];if(!/FOLLOW|CHASE|ORBIT|TPV|BEHIND/.test(String(m)))return r;
  const t=WALK.on?WALK.pos.clone().add(new V3(0,1.2,0)):D.pos;if(!t||!hitTest(cam.position,0.35))return r;
  for(let k=1;k<=12;k++){_cp.copy(cam.position).lerp(t,k/13);if(!hitTest(_cp,0.35)){cam.position.copy(_cp);break;}}}catch(e){}return r;};}
// phone held upright: chat lines sat behind the Chat / Hide-chat buttons → show them just above those buttons
{const st=document.createElement('style');st.textContent='body.pt #chatLog{left:calc(12px + env(safe-area-inset-left))!important;max-width:72vw!important;font-size:12px!important}';document.head.appendChild(st);}
// keep the chat lines right above the Hide-chat button (works with any phone zoom)
setInterval(()=>{try{const cl=$('chatLog'),t=$('chatTog')||$('cbBtn');if(!cl||!t)return;const r=t.getBoundingClientRect();if(!r.height)return;const z=parseFloat(getComputedStyle(cl).zoom)||1;cl.style.setProperty('bottom',((innerHeight-r.top+6)/z)+'px','important');}catch(e){}},500);
{const st=document.createElement('style');st.textContent='body.pt #dzCount{top:47%!important;font-size:26px!important}';document.head.appendChild(st);}
// sideways phone in a battle: the big 🎯 FIRE button was hidden UNDER the Chat buttons → chat buttons move up above it
{const st=document.createElement('style');st.textContent='body.fireUp:not(.pt) #cbBtn,body.fireUp:not(.pt) #chatTog{bottom:calc(128px + env(safe-area-inset-bottom))!important}';document.head.appendChild(st);
 setInterval(()=>{try{const f=$('bFire');document.body.classList.toggle('fireUp',!!(f&&getComputedStyle(f).display!=='none'));}catch(e){}},400);}
{const st=document.createElement('style');st.textContent='@media (max-height:500px){#dzCount{top:24%!important;font-size:24px!important}}';document.head.appendChild(st);}
// 🕹 the stick hints said "up/down · turn / fwd/back · sideways" even in a car, tank, boat or plane → each vehicle shows its own
const STKL={drone:['▲▼ up/down · ◀▶ turn','▲▼ fwd/back · ◀▶ sideways'],plane:['▲▼ throttle · ◀▶ rudder','▲▼ pitch · ◀▶ roll'],car:['▲▼ gas / reverse','◀▶ steer'],boat:['▲▼ gas / reverse','◀▶ steer'],sub:['▲▼ go / back · ◀▶ turn','▲ rise · ▼ dive'],walk:['▲▼ walk · ◀▶ turn','👀 look around']};
setInterval(()=>{try{if(!started)return;let k=WALK.on?'walk':vkind();if(k==='heli')k='drone';if(!WALK.on&&vhKind()==='sub')k='sub';const L=STKL[k]||STKL.drone;
  if((CFG.stickMode===1)&&k==='drone')return;const a=document.querySelector('#stL .t'),b=document.querySelector('#stR .t');if(a&&a.textContent!==L[0])a.textContent=L[0];if(b&&b.textContent!==L[1])b.textContent=L[1];}catch(e){}},600);
// cars + boats: the top button is 🚦 GO / 🛑 STOP (it said TAKE OFF / LAND)
{const t0=takeoff;takeoff=function(){try{const gv=!WALK.on&&(vkind()==='car'||vkind()==='boat');if(gv&&D.state!=='down'&&D.state!=='tumble'){if(D.armed&&D.state!=='landed'){D.vel.x*=0.3;D.vel.z*=0.3;D.state='landed';toast('🛑 Stopped — push the stick to drive again',1500);return;}D.armed=true;if(D.state==='landed')D.state='flying';toast('🚦 GO! Push the stick to drive',1500);return;}}catch(e){}return t0.apply(this,arguments);};}
// big map on a phone: the ⛰ 3D button sat on top of "⭐ My courses"
{const st=document.createElement('style');st.textContent='@media (max-width:500px){#mapTop{top:10px!important;bottom:auto!important}}';document.head.appendChild(st);}
// 🧹 switching vehicles (yours or the AI's) left the old vehicle's shapes in graphics memory (~55 per switch!) → freed now
function geoDispSafe(g){try{if(!g)return;const live=new Set();scene.traverse(o=>{if(o.geometry)live.add(o.geometry);});g.traverse(m=>{if(m.geometry&&!m.isInstancedMesh&&!live.has(m.geometry)&&!(GEO_KEEP&&GEO_KEEP.has(m.geometry))&&!(typeof SHARED_GEO!=='undefined'&&SHARED_GEO.has(m.geometry))&&!Object.values(GEO).includes(m.geometry))m.geometry.dispose();});}catch(e){}}
{const r0=rebuildDrone;rebuildDrone=function(){const old=DR&&DR.g;const r=r0.apply(this,arguments);if(old&&old!==(DR&&DR.g))setTimeout(()=>geoDispSafe(old),0);return r;};}
{const d0=mpDrop;mpDrop=function(id){const pe=mp.peers[id];const old=pe&&pe.mesh&&pe.mesh.g;const r=d0.apply(this,arguments);if(old)setTimeout(()=>geoDispSafe(old),0);return r;};}
{const s0=MPH.sp;MPH.sp=function(m,pe){const old=pe&&pe.mesh&&pe.mesh.g;const r=s0.apply(this,arguments);if(old&&pe.mesh&&pe.mesh.g!==old)setTimeout(()=>geoDispSafe(old),0);return r;};}
