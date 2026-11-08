// ================================================================ v41: ⚡ smoother on phones · 💬 hide/show chat with an unread number · no "blew up" spam in the chat · 🔍 menu search · 📱 pick your phone model
// ---------------------------------------------------------------- ⚡ runs smoother: lighter explosions on phones, and graphics turn down by themselves if it gets laggy
{const b0=bigBoom;bigBoom=function(p,r,dr,by,noTrees){if(!PERF.light)return b0.apply(this,arguments);const n0=BIG.L.length;const res=b0.apply(this,arguments);
  // phones: keep only half the smoke/debris and no smoke trails
  const add=BIG.L.slice(n0);add.forEach((f,i)=>{if(f.kind==='deb')f.trail=false;if((f.kind==='smoke'||f.kind==='deb')&&i%2){scene.remove(f.m);f.life=0;f.t=1;}});return res;};}
const PERF={light:false,fps:60,low:0,pr:null,told:false};
setInterval(()=>{PERF.light=!!(PHONE||LS.get('devMode','auto')==='phone'||LS.get('perfLight',false));},1000);
(function(){let last=performance.now(),n=0,acc=0;(function loop(){const now=performance.now(),dt=now-last;last=now;if(dt<500){acc+=dt;n++;}
  if(acc>2000){PERF.fps=n*1000/acc;acc=0;n=0;
    if(typeof started!=='undefined'&&started&&!menu.open&&document.visibilityState==='visible'&&LS.get('autoSmooth',true)&&performance.now()-(PERF.t0||0)>12000&&!(typeof $==='function'&&$('ws')&&getComputedStyle($('ws')).display!=='none')){
      if(PERF.fps<26){PERF.low++;}else PERF.low=Math.max(0,PERF.low-1);
      if(PERF.low>=3){PERF.low=0;const cur=renderer.getPixelRatio(),nx=cur>1?1:cur>0.75?0.75:cur;if(nx<cur){renderer.setPixelRatio(nx);renderer.setSize(innerWidth,innerHeight,false);if(!PERF.told){PERF.told=true;toast('⚡ It was getting laggy — made the picture a little lighter so it runs smoother (Menu → 🔍 search "smooth" to change)',4500);}}
        // lots of leftover smoke / fire? clear the oldest
        if(BIG.L.length>60){BIG.L.splice(0,30).forEach(f=>scene.remove(f.m));}}}}
  requestAnimationFrame(loop);})();})();
function perfItems(){return[mInfo(()=>'⚡ Right now: about '+Math.round(PERF.fps)+' frames per second'),
  mItem(()=>'⚡ Auto-smooth (turns graphics down when it lags): '+(LS.get('autoSmooth',true)?'ON':'off'),()=>LS.set('autoSmooth',!LS.get('autoSmooth',true))),
  mItem(()=>'🪶 Lighter explosions: '+(LS.get('perfLight',false)||PHONE?'ON':'off')+(PHONE?' (always on for phones)':''),()=>LS.set('perfLight',!LS.get('perfLight',false))),
  mItem('🖼 Sharper picture (slower)',()=>{renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(innerWidth,innerHeight,false);toast('🖼 Sharper',1200);}),
  mItem('🏎 Smoothest picture (blurrier)',()=>{renderer.setPixelRatio(0.75);renderer.setSize(innerWidth,innerHeight,false);toast('🏎 Smoothest',1200);}),mItem('◀ Back',()=>menuBack())];}
// ---------------------------------------------------------------- 💬 the "blew up" lines stay out of the chat (you still get a quick pop-up for YOUR kills)
const KILLS=[];
{const c0=chatSys;chatSys=function(txt){const t=String(txt||'');if(/blew up|blown up|💀|got their target|run over by|squashed by|smashed by|shot down/i.test(t)){KILLS.push({t:performance.now(),txt:t});if(KILLS.length>60)KILLS.shift();
    if(new RegExp('\\b'+String(CFG.name).replace(/[^\w]/g,'.')+'\\b').test(t)&&/blew up/.test(t)&&t.indexOf(CFG.name+' blew up')>=0)toast(t,1600);return;}return c0.apply(this,arguments);};}
// ---------------------------------------------------------------- 💬 hide / show chat, with how many new messages you have
const CHT={hide:LS.get('chatHide',false),seen:0};
setTimeout(()=>{const b=document.createElement('button');b.id='chatTog';b.style.cssText='position:fixed;left:calc(50% - 128px);bottom:calc(52px + env(safe-area-inset-bottom));z-index:21;font:800 13px system-ui;padding:7px 10px;border-radius:12px;border:2px solid rgba(255,255,255,0.6);background:rgba(60,60,67,0.85);color:#fff;cursor:pointer;display:none';
  b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();CHT.hide=!CHT.hide;CHT.seen=CHAT.length;LS.set('chatHide',CHT.hide);if(!CHT.hide)CHT.seen=CHAT.length;chtDraw();try{chatDraw();}catch(x){}};document.body.appendChild(b);
  const st=document.createElement('style');st.textContent='body.chatHide #chatLog{display:none!important}body.pt #chatTog{left:calc(12px + env(safe-area-inset-left))!important;bottom:calc(240px + env(safe-area-inset-bottom))!important}#chatTog .n{display:inline-block;min-width:18px;padding:0 5px;margin-left:4px;border-radius:9px;background:#ff3b30;font:800 11px system-ui;line-height:18px}';document.head.appendChild(st);
  CHT.seen=CHAT.length;chtDraw();setInterval(chtDraw,700);},1700);
function chtDraw(){const b=$('chatTog');if(!b)return;document.body.classList.toggle('chatHide',CHT.hide);if(!CHT.hide)CHT.seen=CHAT.length;
  const n=Math.max(0,CHAT.length-CHT.seen);const h=CHT.hide?'💬 Show chat'+(n?'<span class="n">'+(n>99?'99+':n)+'</span>':''):'🙈 Hide chat';if(b._h!==h){b._h=h;b.innerHTML=h;}
  const cb=$('cbBtn');const dsp=started&&cb&&cb.style.display!=='none'&&!menu.open?'':'none';if(b.style.display!==dsp)b.style.display=dsp;}
// the counter keeps working even after old messages scroll away
{const p0=CHAT.push;CHAT.push=function(){const r=p0.apply(this,arguments);if(this.length>=40&&CHT.hide)CHT.seen--;return r;};}
// ---------------------------------------------------------------- 🔍 menu search: type anything (TNT, armor, voice, room…) and jump straight to it
(function(){const st=document.createElement('style');st.textContent='#menuSearch{width:100%;box-sizing:border-box;margin:0 0 8px;padding:8px 10px;border-radius:10px;border:1px solid #555;background:#111;color:#fff;font:600 15px system-ui}';document.head.appendChild(st);
  const i=document.createElement('input');i.id='menuSearch';i.type='search';i.placeholder='🔍 Search the menu (TNT, armor, voice, room…)';i.autocomplete='off';const L=$('menuList');L.parentNode.insertBefore(i,L);
  i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){i.value='';msRun();}if(e.key==='Enter'){const it=menu.items.find(x=>x.act&&!x.info);if(it)it.act();}});i.addEventListener('keyup',e=>e.stopPropagation());
  i.addEventListener('input',()=>msRun());})();
const MS={on:false};
function msIndex(){const out=[],seen=new Set();
  [[()=>'🎤 Voice chat on / off','voiceToggle'],[()=>'🛡 Armor + toughness (open the builder → 🎚 Easy sliders)',()=>{menuToggle(false);bsStart('tank');}],[()=>'💣 Drop TNT now',()=>{menuToggle(false);setTimeout(tntDrop,150);}],[()=>'🔧 Fix EVERYTHING',()=>{menuToggle(false);fixAll();}],[()=>'🔄 Flip',()=>{menuToggle(false);try{doFlip();}catch(e){}}],[()=>'💬 Hide / show chat',()=>{menuToggle(false);$('chatTog')&&$('chatTog').click();}],[()=>'🔦 Screen flash on explosions: '+(LS.get('boomFlash',true)?'ON':'off'),()=>{LS.set('boomFlash',!LS.get('boomFlash',true));renderMenu();}]]
    .forEach(([label,f])=>out.push({lab:label(),it:{label,act:typeof f==='string'?()=>{menuToggle(false);window[f]();}:f},where:'quick'}));const fns=Object.keys(window).filter(k=>/Items$/.test(k)&&typeof window[k]==='function'&&!/^(ms|bs)/.test(k));fns.unshift('mainItems');
  for(const fn of [...new Set(fns)]){let L;try{L=window[fn]();}catch(e){continue;}if(!Array.isArray(L))continue;
    for(const it of L){if(!it||it.info||!it.label)continue;let lab='';try{lab=String(it.label());}catch(e){continue;}if(!lab||/^◀ Back/.test(lab))continue;const key=lab.replace(/[:✅].*$/,'').trim();if(seen.has(fn+key))continue;seen.add(fn+key);
      out.push({lab,it,where:fn.replace(/Items$/,'')});}}return out;}
const MS_WHERE={main:'Menu',build:'Build',weapon:'Weapons',ex:'Explosions',ai:'AI pilots',onl:'Online rooms',putBack:'Put things back',pai:'Phone AI',perf:'Smoothness',quick:'Quick'};
function msRun(){const q=$('menuSearch').value.trim().toLowerCase();
  if(!q){if(MS.on){MS.on=false;menuBack();}return;}
  const SYNQ={armor:'armor|tough|shield|health|damage',armour:'armor|tough|shield',voice:'voice|mic|talk|speak',gun:'weapon|gun|rocket|machine',guns:'weapon|gun',bomb:'tnt|bomb|explosion',explode:'explosion|tnt|blast',lag:'smooth|lag|fps',slow:'smooth|lag',ai:'ai|pilot|robot|bot',bots:'ai|pilot',friends:'room|online|multiplayer',car:'vehicle|car|drive',tank:'build|tank',build:'build|workshop|builder',chat:'chat|message'};
  const words=q.split(/\s+/).map(w=>SYNQ[w]?SYNQ[w]:w);const A=msIndex().map(o=>{const l=o.lab.toLowerCase();let sc=0;for(const w0 of words){const alts=w0.split('|');const w=alts.find(a=>l.includes(a));if(w){sc+=w.length>2?3:1;continue;}{const w=w0;const toks=l.split(/[^a-z0-9]+/);if(toks.some(t=>t.length>3&&alts.some(a=>levD(t,a)<=1)))sc+=1;else{sc=-1;break;}}}return{o,sc};}).filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc).slice(0,30);
  const items=A.length?A.map(({o})=>{const it=Object.assign({},o.it);const lb=o.it.label;it.label=()=>{let s='';try{s=lb();}catch(e){}return s+'  <span style="opacity:0.55;font-size:0.8em">· '+(MS_WHERE[o.where]||o.where)+'</span>';};return it;}):[mInfo('Nothing found for "'+q+'" — try another word')];
  if(!MS.on){MS.on=true;menuPush('🔍 Search',items);}else{menu.items=items;menu.i=0;renderMenu();}}
{const t0=menuToggle;menuToggle=function(){const r=t0.apply(this,arguments);const i=$('menuSearch');if(i){i.value='';MS.on=false;i.style.display=menu.open?'':'none';}return r;};}
// ---------------------------------------------------------------- 📱 pick your phone (sets phone mode + button sizes to fit that screen)
const PHONES=[['auto','🤖 Auto-detect',1],['se','iPhone SE / 8 (small)',0.82],['mini','iPhone 12/13 mini',0.88],['std','iPhone 13 / 14 / 15 / 16',0.95],['pro','iPhone 15 Pro / 16 Pro',1],['max','iPhone Pro Max / Plus (big)',1.08],['ipad','iPad / tablet',1.25],['android','Android phone',0.95]];
function phoneApply(){const m=LS.get('phoneModel','auto'),P=PHONES.find(x=>x[0]===m)||PHONES[0];document.documentElement.style.setProperty('--uiK',P[2]);document.body.classList.toggle('uiK',m!=='auto');
  if(m!=='auto'&&LS.get('devMode','auto')!=='phone'){LS.set('devMode','phone');try{devSet('phone');}catch(e){}}}
(function(){const st=document.createElement('style');st.textContent='body.uiK #flipBtn,body.uiK #tntBtn,body.uiK #cbBtn,body.uiK #chatTog,body.uiK #asBox .btn,body.uiK #asBtn,body.uiK #onlBadge{zoom:var(--uiK,1)}body.uiK #menu .box{zoom:var(--uiK,1)}';document.head.appendChild(st);setTimeout(phoneApply,500);})();
function phoneItems(){return[mInfo('Pick the phone you\'re playing on — buttons and controls get sized to fit it, and phone mode turns on.'),...PHONES.map(([k,n])=>mItem(()=>(LS.get('phoneModel','auto')===k?'✅ ':'')+n,()=>{LS.set('phoneModel',k);phoneApply();toast('📱 '+n,1500);renderMenu();})),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();let i=L.findIndex(x=>/Screen:/.test(String(x.label())));if(i<0)i=2;
  L.splice(i+1,0,mItem(()=>'📱 My phone: '+((PHONES.find(x=>x[0]===LS.get('phoneModel','auto'))||PHONES[0])[1])+' ▸',()=>menuPush('📱 My phone',phoneItems())),mItem('⚡ Smoothness (lag) ▸',()=>menuPush('⚡ Smoothness',perfItems())));return L;};}
// ---------------------------------------------------------------- 🔄 FPV (onboard) camera goes all the way round with the flip; the gimbal camera stays level like a real gimbal
{const u0=updateCam;const _fq=new THREE.Quaternion(),_fx=new V3(1,0,0),_fz=new V3(0,0,1);updateCam=function(dt){const r=u0.apply(this,arguments);try{
    if(D.flip&&camName()==='FPV'&&vkind()!=='plane'&&!WALK.on){const fa=D.flip.dir*Math.PI*2*smooth(0,CFG.flipT,D.flip.t);cam.quaternion.multiply(_fq.setFromAxisAngle(D.flip.ax==='pitch'?_fx:_fz,fa));}}catch(e){}return r;};}
