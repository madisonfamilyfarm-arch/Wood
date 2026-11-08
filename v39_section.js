// ================================================================ v39: 🛠 builder start screen (new / keep working / open saved) → 🎚 easy sliders or ✋ drag mode · kit part lists + big OTHER · 🤪 Build Crazy · 📱 phone-sized editor with collapse buttons
// keep armor + crazy + kit in saved builds
{const s0=sanitize;sanitize=function(s){const o=s0.apply(this,arguments);if(s&&o){if(s.armor!=null)o.armor=clamp(+s.armor||5,1,10);if(s.crazy)o.crazy=true;if(s.kit)o.kit=String(s.kit).slice(0,12);}return o;};}
{const w0=wsSpec;wsSpec=function(){const sp=w0.apply(this,arguments);if(WS.armor!=null)sp.armor=WS.armor;if(WS.crazy)sp.crazy=true;if(WS.kit)sp.kit=WS.kit;return sp;};}
// 🤪 Build Crazy: it flies/drives however YOU say, no "it can't fly yet"
{const s0=stats;stats=function(sp){const st=s0.apply(this,arguments);if(sp&&sp.crazy&&st){st.why='';if(st.tw!=null&&st.tw<1.6)st.tw=1.6;if(st.vz!=null&&st.vz<2.5)st.vz=2.5;}return st;};}
KITS.mix.n='🤪 Build Crazy — put ANYTHING together';
// ---------------------------------------------------------------- 🧰 each builder shows ITS parts first, then one big OTHER section with everything else
const WSC0=WSC.slice(),WSI0=WSI.slice();
const KITPART={
  tank:it=>/^(body|wheel|gun|camera|battery|light|strip|antenna|rx|sensor|armor)$/.test(it.t)||(it.t==='shape'&&/^(box|wedge|cyl)$/.test((it.o&&it.o.style)||'box')),
  car:it=>/^(body|wheel|gun|camera|battery|light|strip|antenna|rx|buzzer)$/.test(it.t)||(it.t==='shape'&&/^(box|wedge|capsule)$/.test((it.o&&it.o.style)||'box'))||(it.t==='wing'&&!(it.o&&it.o.rz)),
  boat:it=>/^(wprop|gun|camera|battery|light|antenna|rx|sensor)$/.test(it.t)||(it.t==='shape'&&/^(capsule|wedge|box)$/.test((it.o&&it.o.style)||'box')),
  sub:it=>/^(wprop|camera|battery|light|sensor|wing|gun)$/.test(it.t)||(it.t==='shape'&&/^(capsule|sphere|cyl)$/.test((it.o&&it.o.style)||'box')),
  plane:it=>/^(wing|rocket|jet|camera|battery|light|gun|antenna|rx)$/.test(it.t)||(it.t==='wheel'&&!(it.o&&it.o.style))||(it.t==='shape'&&/^(capsule|cone|wedge)$/.test((it.o&&it.o.style)||'box')),
  drone:it=>/^(body|arm|leg|skid|pad|motor|guard|battery|camera|light|strip|board|rx|gps|sensor|buzzer|antenna)$/.test(it.t)};
KITPART.monster=KITPART.car;
const KITNAME={tank:'🪖 Tank parts',car:'🚙 Car parts',monster:'🛻 Truck parts',boat:'🚤 Boat parts',sub:'🌊 Submarine parts',plane:'✈️ Plane parts',drone:'🚁 Drone parts'};
// a real armor plate for tanks (heavy metal box)
const ARMORIT={t:'shape',ic:'🛡',n:'Armor plate (heavy)',o:{style:'box',mat:'metal',col:'#6b7280',w:22,len:4,d:7},armor:1};
function wsSetTray(kit){const f=KITPART[kit];WSC.length=0;WSI.length=0;
  if(!f){WSC.push(...WSC0);}else{WSC.push([KITNAME[kit]]);if(kit==='tank')WSC.push(ARMORIT);let sub=null;WSC0.forEach(it=>{if(!Array.isArray(it)&&f(it))WSC.push(it);});
    WSC.push(['🧰 OTHER — parts from every other builder']);WSC0.forEach(it=>{if(Array.isArray(it)){sub=it[0];return;}if(f(it))return;if(sub){WSC.push(['· '+sub]);sub=null;}WSC.push(it);});}
  WSC.forEach(it=>{if(!Array.isArray(it))WSI.push(it);});WS.tray=0;}
{const k0=openKit;openKit=function(k){WS.kit=k;WS.crazy=k==='mix';wsSetTray(k==='mix'?null:k);const r=k0.apply(this,arguments);WS.kit=k;WS.crazy=k==='mix';if(WS.armor==null||k!=='tank')WS.armor=k==='tank'?8:5;try{wsBuildUI();wsChanged();}catch(e){}return r;};}
{const o0=openWorkshop;openWorkshop=function(fromCurrent){const r=o0.apply(this,arguments);if(!BS.inKit){WS.kit=null;WS.crazy=false;wsSetTray(null);try{wsBuildUI();}catch(e){}}const sp=fromCurrent?SPEC:null;if(sp&&sp.armor)WS.armor=sp.armor;if(sp&&sp.crazy)WS.crazy=true;return r;};}
// remember what you were working on, for each builder
{const c0=wsChanged;wsChanged=function(){const r=c0.apply(this,arguments);clearTimeout(wsChanged.t);wsChanged.t=setTimeout(()=>{try{if(WS.open&&WS.kit)LS.set('wsCur_'+WS.kit,wsSpec());}catch(e){}},400);return r;};}
// ---------------------------------------------------------------- 🚪 the start screen: new · keep working · open saved → easy or drag
const BS={inKit:false};
(function(){const st=document.createElement('style');st.textContent=`
#bsBox{position:fixed;inset:0;z-index:62;background:rgba(5,10,7,0.86);display:none;align-items:center;justify-content:center;padding:12px}
#bsCard{background:#13201a;border:1px solid #2f4a37;border-radius:16px;padding:14px;max-width:min(560px,94vw);max-height:90vh;overflow:auto;color:#e9f5ec;font:600 14px system-ui;box-shadow:0 10px 40px #000}
#bsCard h2{margin:0 0 10px;font:800 20px system-ui;text-align:center}
#bsCard .bsO{display:flex;gap:10px;align-items:center;width:100%;text-align:left;margin:6px 0;padding:11px 12px;border-radius:12px;border:1px solid #3a5a44;background:#1b2c22;color:#fff;font:700 15px system-ui;cursor:pointer}
#bsCard .bsO:active{transform:scale(0.98)}#bsCard .bsO .i{font-size:26px;width:34px;text-align:center}#bsCard .bsO small{display:block;font:500 12px system-ui;opacity:0.75;margin-top:2px}
#bsCard .bsX{display:block;margin:10px auto 0;padding:7px 16px;border-radius:10px;border:1px solid #555;background:#222;color:#ddd;font:700 13px system-ui}`;document.head.appendChild(st);
  const b=document.createElement('div');b.id='bsBox';b.innerHTML='<div id="bsCard"></div>';document.body.appendChild(b);b.addEventListener('pointerdown',e=>{if(e.target===b)bsClose();});})();
function bsClose(){$('bsBox').style.display='none';}
function bsAsk(title,opts,noX){const c=$('bsCard');c.innerHTML='<h2>'+esc(title)+'</h2>';opts.forEach(o=>{const d=document.createElement('button');d.className='bsO';d.innerHTML='<span class="i">'+o.i+'</span><span>'+esc(o.t)+(o.s?'<small>'+esc(o.s)+'</small>':'')+'</span>';d.onclick=()=>{bsClose();o.fn();};c.appendChild(d);});
  if(!noX){const x=document.createElement('button');x.className='bsX';x.textContent='✕ Cancel';x.onclick=bsClose;c.appendChild(x);}$('bsBox').style.display='flex';}
function kitLabel(k){return k==='drone'?'🚁 Drone':KITS[k].n.split(' — ')[0];}
function kitThing(k){return k==='mix'?'crazy build':k==='drone'?'drone':KITS[k].n.replace(/^\S+\s/,'').replace(/^RC /,'').toLowerCase().split(':')[0];}
function bsStart(k){const cur=LS.get('wsCur_'+k,null),th=kitThing(k);const O=[{i:'✨',t:'Start a new '+th,s:'Fresh starter you can change any way you like',fn:()=>bsOpen(k,null)}];
  if(cur&&cur.parts)O.push({i:'🔧',t:'Keep working on "'+(cur.name||'my '+th)+'"',s:'Right where you left off',fn:()=>bsOpen(k,cur)});
  O.push({i:'📂',t:'Open a saved build',s:'From your hangar ⭐ or a file on this device',fn:()=>bsSaved(k)});bsAsk(kitLabel(k)+' builder',O);}
function bsSaved(k){const H=LS.get('hangar',[]).filter(x=>x&&x.parts);const O=H.slice(0,12).map(sp=>({i:sp.kit==='tank'?'🪖':sp.kit==='car'?'🚙':sp.kit==='boat'?'🚤':sp.kit==='sub'?'🌊':sp.kit==='plane'?'✈️':sp.crazy?'🤪':'⭐',t:sp.name||'Saved build',s:(sp.parts||[]).length+' parts',fn:()=>bsOpen(k,sp)}));
  O.push({i:'📁',t:'Open a file from this device…',s:'A .drone.json file you saved before',fn:()=>loadDroneFile(sp=>{if(sp&&sp.parts)bsOpen(k,sp);else toast('That file has no parts to build with',2500);})});
  O.push({i:'◀',t:'Back',fn:()=>bsStart(k)});bsAsk('📂 Open a saved build',O);}
function bsOpen(k,sp){BS.inKit=true;try{openKit(k);}finally{BS.inKit=false;}
  if(sp&&sp.parts){WS.parts=JSON.parse(JSON.stringify(sp.parts)).map(cleanPart);WS.wires=sp.wires?JSON.parse(JSON.stringify(sp.wires)):[];WS.name=sp.name||WS.name;WS.flyAs=sp.flyAs||WS.flyAs;if(sp.armor)WS.armor=sp.armor;if(sp.crazy)WS.crazy=true;WS.waterproof=!!sp.waterproof;WS.sel=-1;wsChanged();}
  bsMode(k);}
function bsMode(k){const O=[{i:'🎚',t:'Easy — sliders',s:'Make it bigger, faster, tougher, change colour + weapons with sliders',fn:()=>ezOpen()},{i:'✋',t:'Drag parts (advanced)',s:'Drag any part on, move it, rotate it, wire it',fn:()=>ezClose(true)}];
  if(k==='mix')O.unshift({i:'🕹',t:'First: how should it move?',s:'You decide — drone, plane, car, tank, boat, sub or everything at once',fn:()=>bsMove(()=>bsMode(k))});bsAsk('How do you want to build?',O,true);}
const MOVES=[['drone','🚁','Fly like a drone / helicopter'],['plane','✈️','Fly like a plane'],['car','🚙','Drive like a car'],['tank','🪖','Drive like a tank'],['boat','🚤','Float like a boat'],['sub','🌊','Dive like a submarine'],['combo','🧪','EVERY part works at once']];
function bsMove(then){bsAsk('🕹 How should it move?',MOVES.map(([v,i,t])=>({i,t:t+(WS.flyAs===v?'  ✅':''),fn:()=>{WS.flyAs=v;wsChanged();toast(i+' '+t,1500);if(then)then();}})));}
// all the "build a…" menu items now open the start screen
{const b0=buildItems;buildItems=function(){const L=b0();L.forEach(it=>{const lab=String(it.label?it.label():'');const k=Object.keys(KITS).find(k=>lab===KITS[k].n||lab===KITS[k].n.split(' — ')[0])||(lab==='🚁 Drone'?'drone':null);if(k&&it.act){it.act=()=>{menuToggle(false);bsStart(k);};}});return L;};}
// ---------------------------------------------------------------- 🎚 EASY mode: sliders instead of dragging
const EZB={on:false,base:null,v:{size:100,wid:100,len:100,hgt:100,wheel:100,pow:100}};
(function(){const st=document.createElement('style');st.textContent=`
#ezPanel{position:absolute;right:0;top:0;bottom:0;width:250px;overflow-y:auto;padding:calc(8px + env(safe-area-inset-top)) calc(8px + env(safe-area-inset-right)) 8px 8px;border-left:1px solid #2f4a37;display:none;background:#0f1913;color:#e9f5ec;font:700 12px system-ui}
#ws.ez #ezPanel{display:block}#ws.ez #wsTools,#ws.ez #wsTray{display:none}#ws.ez #wsMid{left:0!important;right:250px!important}
#ezPanel .ezR{margin:6px 0 10px}#ezPanel .ezL{display:flex;justify-content:space-between}#ezPanel input[type=range]{width:100%;margin:4px 0 0}
#ezPanel .ezB{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0 10px}#ezPanel .ezB button{flex:1 1 auto;padding:6px 6px;border-radius:9px;border:1px solid #3a5a44;background:#1b2c22;color:#fff;font:700 12px system-ui}
#ezPanel .ezB button.on{background:#34c759;color:#000;border-color:#34c759}#ezPanel h4{margin:8px 0 4px;color:#33ff66;font:800 11px system-ui;text-transform:uppercase;letter-spacing:0.05em}
#ezPanel .ezBig{display:block;width:100%;margin:5px 0;padding:10px;border-radius:12px;border:0;font:800 15px system-ui;color:#fff}`;document.head.appendChild(st);
  const p=document.createElement('div');p.id='ezPanel';$('ws').appendChild(p);})();
function ezApply(){const v=EZB.v,s=v.size/100,X=s*v.wid/100,Y=s*v.len/100,Z=s*v.hgt/100,W=s*v.wheel/100,P=v.pow/100;
  WS.parts=EZB.base.map(p0=>{const p=JSON.parse(JSON.stringify(p0));p.x=(p.x||0)*X;p.y=(p.y||0)*Y;p.h=(p.h||0)*Z;
    if(p.t==='wheel'){p.r=(p.r||3)*W;p.w=(p.w||2)*X;if(p.style==='tread')p.len=(p.len||28)*Y;p.h=(p0.h||0)*Z-((p.r-(p0.r||3)*s));}
    else if(['motor','sprop','wprop','hover','guard','pad'].includes(p.t)){p.r=(p.r||5)*s;}
    else{if(p.w!=null)p.w*=X;if(p.len!=null)p.len*=Y;if(p.d!=null)p.d*=Z;}
    if(p.pow!=null)p.pow=+(p.pow*P).toFixed(2);return cleanPart(p);});wsChanged();}
function ezTop(){let t=0;WS.parts.forEach(p=>{if(p.t==='shape'||p.t==='body')t=Math.max(t,(p.h||0)+(p.d||4)/2);});return t;}
function ezGuns(kind){EZB.base=EZB.base.filter(p=>p.t!=='gun');const top=ezTop()/((EZB.v.size/100)*(EZB.v.hgt/100)||1);
  if(kind==='mg'||kind==='both')EZB.base.push(cleanPart({t:'gun',style:'mg',x:kind==='both'?-3:0,y:-10,h:top+0.5,a:0,len:16}));
  if(kind==='rocket'||kind==='both')EZB.base.push(cleanPart({t:'gun',style:'rocket',x:kind==='both'?3:0,y:-8,h:top+0.5,a:0,len:14}));
  if(kind==='paint')EZB.base.push(cleanPart({t:'gun',style:'paint',x:0,y:-10,h:top+0.5,a:0,len:12}));ezApply();ezDraw();}
function ezColor(c){EZB.base.forEach(p=>{if(p.t==='shape'&&p.mat!=='glass'&&p.mat!=='glow'||p.t==='body')p.col=c;});ezApply();}
function ezGunKind(){const g=WS.parts.filter(p=>p.t==='gun').map(p=>p.style);return !g.length?'none':g.includes('mg')&&g.includes('rocket')?'both':g[0];}
function ezDraw(){const P=$('ezPanel');const v=EZB.v,th=WS.kit?kitThing(WS.kit):'build';
  const sl=(k,label,min,max,unit)=>'<div class="ezR"><div class="ezL"><span>'+label+'</span><b id="ezv_'+k+'">'+v[k]+unit+'</b></div><input type="range" min="'+min+'" max="'+max+'" step="5" value="'+v[k]+'" data-k="'+k+'" data-u="'+unit+'"></div>';
  const btns=(arr,cur,fn)=>'<div class="ezB">'+arr.map(([val,lab])=>'<button data-fn="'+fn+'" data-v="'+val+'" class="'+(cur===val?'on':'')+'">'+lab+'</button>').join('')+'</div>';
  P.innerHTML='<div style="font:800 15px system-ui;margin-bottom:4px">🎚 Easy builder</div><div style="opacity:0.7;font-weight:600;margin-bottom:6px">'+esc(WS.name)+'</div>'+
    '<h4>Size + shape</h4>'+sl('size','📏 Overall size',40,300,'%')+sl('len','↕ Longer / shorter',50,250,'%')+sl('wid','↔ Wider / thinner',50,250,'%')+sl('hgt','⬆ Taller / flatter',50,250,'%')+
    (WS.parts.some(p=>p.t==='wheel')?sl('wheel',WS.parts.some(p=>p.style==='tread')?'🪖 Track size':'🛞 Wheel size',50,250,'%'):'')+
    '<h4>Power</h4>'+sl('pow','⚡ Speed + power',50,300,'%')+
    '<h4>Toughness</h4><div class="ezR"><div class="ezL"><span>🛡 Armor</span><b id="ezv_armor">'+(WS.armor||5)+'/10</b></div><input type="range" min="1" max="10" step="1" value="'+(WS.armor||5)+'" data-k="armor"></div>'+
    '<h4>Weapons</h4>'+btns([['none','🚫 None'],['mg','🔫 Machine gun'],['rocket','🚀 Rockets'],['both','💥 Both'],['paint','🎨 Paint']],ezGunKind(),'gun')+
    '<h4>Colour</h4>'+btns([['#5b6b3a','🟢 Army'],['#0a84ff','🔵 Blue'],['#ff3b30','🔴 Red'],['#ffd60a','🟡 Yellow'],['#1c1c1e','⚫ Black'],['#f2f2f2','⚪ White'],['#bf5af2','🟣 Purple'],['#ff9f0a','🟠 Orange']],'','col')+
    '<h4>How it moves</h4>'+btns(MOVES.map(([m,i,t])=>[m,i+' '+t.split(' ').slice(-1)[0]]).concat([['auto','🤖 Auto']]),WS.flyAs,'move')+
    '<button class="ezBig" style="background:#34c759;color:#000" data-fn="go">✅ '+(/car|tank|boat|sub/.test(WS.flyAs)||/tank|car|monster|boat|sub/.test(WS.kit||'')?'DRIVE IT':'FLY IT')+'</button>'+
    '<button class="ezBig" style="background:#0a84ff" data-fn="drag">✋ Switch to drag-parts mode</button>'+
    '<button class="ezBig" style="background:#3a3a3c" data-fn="save">⭐ Save to my hangar</button><button class="ezBig" style="background:#3a3a3c" data-fn="file">💾 Save as a file</button>'+
    '<button class="ezBig" style="background:#3a3a3c" data-fn="reset">↩️ Sliders back to normal</button><button class="ezBig" style="background:#3a3a3c" data-fn="close">✕ Close builder</button>';
  P.querySelectorAll('input[type=range]').forEach(r=>{r.oninput=()=>{const k=r.dataset.k;if(k==='armor'){WS.armor=+r.value;$('ezv_armor').textContent=r.value+'/10';wsChanged();return;}v[k]=+r.value;$('ezv_'+k).textContent=r.value+'%';clearTimeout(ezDraw.t);ezDraw.t=setTimeout(ezApply,60);};});
  P.querySelectorAll('button[data-fn]').forEach(b=>{b.onclick=()=>{const f=b.dataset.fn,val=b.dataset.v;
    if(f==='gun')ezGuns(val);else if(f==='col')ezColor(val);else if(f==='move'){WS.flyAs=val;wsChanged();ezDraw();}
    else if(f==='go'){const sp=wsSpec(),st=stats(sp);if(st.why){toast('⚠ It can\'t go yet: '+st.why+' — try ⚡ more power, or 🕹 How it moves',3500);return;}ezClose();closeWorkshop();useSpec(sp);}
    else if(f==='drag')ezClose(true);else if(f==='save'){const h=LS.get('hangar',[]).filter(x=>x.name!==WS.name);h.unshift(wsSpec());hangarStore(h.slice(0,20));toast('⭐ Saved "'+WS.name+'" — open it from 📂 Open a saved build',2500);}
    else if(f==='file')saveDroneFile(wsSpec());else if(f==='reset'){Object.assign(EZB.v,{size:100,wid:100,len:100,hgt:100,wheel:100,pow:100});ezApply();ezDraw();}else if(f==='close'){ezClose();closeWorkshop();}};});}
function ezOpen(){if(!WS.open)return;EZB.on=true;EZB.base=JSON.parse(JSON.stringify(WS.parts));Object.assign(EZB.v,{size:100,wid:100,len:100,hgt:100,wheel:100,pow:100});$('ws').classList.add('ez');ezDraw();setTimeout(()=>{try{edResize&&edResize();}catch(e){}window.dispatchEvent(new Event('resize'));},50);
  toast('🎚 Slide to change it · drag on the picture to spin it · ✋ for drag-parts mode',3000);}
function ezClose(toDrag){EZB.on=false;$('ws').classList.remove('ez');setTimeout(()=>window.dispatchEvent(new Event('resize')),50);if(toDrag)toast(PHONE?'✋ Drag a part from '+(document.body.classList.contains('pt')?'the row below':'the left')+' onto it · 1 finger = spin · 2 fingers = zoom':'✋ Drag a part from the left onto it',2800);}
{const c0=closeWorkshop;closeWorkshop=function(){EZB.on=false;$('ws').classList.remove('ez');bsClose();return c0.apply(this,arguments);};}
// the drag-mode tools get a "🎚 Easy sliders" button too
{const u0=wsBuildUI;wsBuildUI=function(){const r=u0.apply(this,arguments);try{const T=$('wsTools');if(T&&!$('ezBtn')){const b=document.createElement('button');b.id='ezBtn';b.className='btn wide';b.style.gridColumn='1 / -1';b.textContent='🎚 Easy sliders';b.onclick=()=>ezOpen();T.insertBefore(b,T.children[2]||null);
      const m=document.createElement('button');m.className='btn wide';m.style.gridColumn='1 / -1';m.textContent='🕹 How it moves…';m.onclick=()=>bsMove();T.insertBefore(m,b.nextSibling);}}catch(e){}return r;};}
// ---------------------------------------------------------------- 📱 the editor fits a phone: smaller panels + ◀ ▶ buttons to fold the part list and tools away
setInterval(()=>{document.body.classList.toggle('ph',!!(PHONE||LS.get('devMode','auto')==='phone'));},700);
(function(){const st=document.createElement('style');st.textContent=`
#wsTools{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;overflow-x:hidden}#wsTools .btn{min-width:0;white-space:normal;word-break:break-word}
body.ph #wsTray{width:74px!important;padding-left:calc(4px + env(safe-area-inset-left))!important;padding-right:4px!important}
body.ph .wsPart{font-size:9.5px!important;padding:4px 2px!important}body.ph .wsPart .ic{font-size:18px!important}body.ph .wsHead{font-size:8.5px!important}
body.ph #wsMid{left:74px!important;right:186px!important}body.ph #wsTools{width:186px!important;gap:4px!important}body.ph #wsTools .btn{font-size:10.5px!important;padding:6px 2px!important}
body.ph #wsTop{font-size:10px!important;padding-top:calc(3px + env(safe-area-inset-top))!important}body.ph #wsHelp{display:none}
body.ph #ws.ez #wsMid{right:220px!important}body.ph #ezPanel{width:220px!important}
#ws.noTray #wsTray{display:none}#ws.noTray #wsMid{left:0!important}#ws.noTools #wsTools{display:none}#ws.noTools #wsMid{right:0!important}#ws.ez.noTools #ezPanel{display:none}#ws.ez.noTools #wsMid{right:0!important}
.wsFold{position:absolute;z-index:3;top:calc(28px + env(safe-area-inset-top));padding:5px 9px;border-radius:10px;border:1px solid #3a5a44;background:rgba(19,32,26,0.92);color:#fff;font:800 12px system-ui;cursor:pointer}
#wsFoldL{left:4px}#wsFoldR{right:4px}`;document.head.appendChild(st);
  const L=document.createElement('button');L.id='wsFoldL';L.className='wsFold';L.onclick=()=>{$('ws').classList.toggle('noTray');wsFoldLabel();window.dispatchEvent(new Event('resize'));};
  const R=document.createElement('button');R.id='wsFoldR';R.className='wsFold';R.onclick=()=>{$('ws').classList.toggle('noTools');wsFoldLabel();window.dispatchEvent(new Event('resize'));};$('wsMid').appendChild(L);$('wsMid').appendChild(R);wsFoldLabel();})();
function wsFoldLabel(){const w=$('ws');$('wsFoldL').textContent=w.classList.contains('noTray')?'▶ Parts':'◀ Hide parts';$('wsFoldR').textContent=w.classList.contains('noTools')?(EZB.on?'Sliders ◀':'Tools ◀'):(EZB.on?'Hide sliders ▶':'Hide tools ▶');$('wsFoldL').style.display=EZB.on?'none':'';}
setInterval(()=>{if(WS.open)wsFoldLabel();},800);
// ---------------------------------------------------------------- 🎯 the tools only show what fits the part you picked (no wiring an arm, power only on things with power…)
const FIT_ELEC=/^(board|motor|rx|gps|sensor|buzzer|camera|light|strip|battery|esc|sprop|wprop|hover|jet|rocket|antenna|gun)$/;
const FIT_POW=/^(motor|sprop|wprop|hover|jet|rocket)$/;
const FIT_VAR=/^(motor|light|strip|camera|shape|gun|wheel|guard|body|board|sprop|battery)$/;
const FIT_MAT=/^(shape|body|wing|model)$/;
function wsToolFit(){const T=$('wsTools');if(!T)return;const p=WS.parts[WS.sel],t=p&&p.t;let sec='';const arms=WS.parts.some(q=>q.t==='arm');
  for(const el of T.children){const tx=(el.textContent||'').trim();if(el.classList.contains('wsHead')){sec=tx.toLowerCase();}
    let show=true;
    if(/^(rotate|size \+ place|copy|look)$/.test(sec)&&!p&&!/WHOLE build/.test(tx))show=false;
    if(sec==='wiring'){if(/wire mode|unplug/.test(tx))show=!!p&&FIT_ELEC.test(t);if(/auto-wire/.test(tx))show=WS.parts.some(q=>q.t==='board');}
    if(/^⚡ power/.test(tx))show=!!p&&FIT_POW.test(t);
    if(/type \/ shape/.test(tx))show=!!p&&FIT_VAR.test(t);
    if(/material/.test(tx))show=!!p&&FIT_MAT.test(t);
    if(/copy to every arm/.test(tx))show=!!p&&arms&&/^(motor|guard|light|leg|pad|sprop)$/.test(t);
    if(/name this part/.test(tx))show=!!p;
    if(el.classList.contains('wsHead')){show=true;}
    el.style.display=show?'':'none';}
  // hide section titles that have nothing left under them
  let head=null,any=false;for(const el of T.children){if(el.classList.contains('wsHead')){if(head)head.style.display=any?'':'none';head=el;any=false;}else if(el.style.display!=='none')any=true;}if(head)head.style.display=any?'':'none';
  let hint=$('wsPickHint');if(!hint){hint=document.createElement('div');hint.id='wsPickHint';hint.style.cssText='grid-column:1 / -1;font:700 11px system-ui;color:#ffd60a;text-align:center;padding:4px';T.insertBefore(hint,T.children[4]||null);}
  hint.textContent=p?'Editing: '+(WSI.find(i=>i.t===t&&(!i.o||!i.o.style||i.o.style===p.style))||{n:t}).n:'👆 Tap a part on the picture to change it';}
{const d0=wsDraw;wsDraw=function(){const r=d0.apply(this,arguments);try{if(!wsDraw.q){wsDraw.q=1;requestAnimationFrame(()=>{wsDraw.q=0;wsToolFit();});}}catch(e){}return r;};}
