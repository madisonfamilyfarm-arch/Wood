// ================================================================ v56: 🔧 fixes found by the overnight play-tests
// 🥽 VR: the phone is inside a headset, so on-screen buttons (TNT, chat, tools, health bar…) just get in the way of the picture → hide every floating overlay except Exit VR + the respawn countdown
const VRKEEP=new Set(['vrUI','dzCount']);
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
