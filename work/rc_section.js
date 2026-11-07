// ---------------------------------------------------------------- RC-style USB controllers (Spektrum InterLink DX, RealFlight, FrSky/Radiomaster in USB joystick mode)
// These have a throttle stick that does NOT spring back: middle = hover, up = climb, down = sink.
// Every switch, knob and button can do any job (Menu → 🕹 Controller setup).
let RCMAP=LS.get('rcmap',null);
function isRCpad(gp){return !!gp&&((RCMAP&&RCMAP.id===gp.id&&RCMAP.kind!=='pad')||/interlink|spektrum|realflight|frsky|radiomaster|taranis|opentx|edgetx|\bsim\b|joystick.*rc/i.test(gp.id));}
function rcDefault(gp){return{id:gp.id,ax:{roll:[0,1],pitch:[1,-1],thr:[2,-1],yaw:[3,1]},ctl:{takeoff:{b:0},cam:{b:1},menu:{b:2},photo:{b:3}},guess:true};}
if(RCMAP&&RCMAP.btn&&!RCMAP.ctl){RCMAP.ctl={};for(const k in RCMAP.btn)if(RCMAP.btn[k]!=null)RCMAP.ctl[k]={b:RCMAP.btn[k]};delete RCMAP.btn;LS.set('rcmap',RCMAP);}
// what a switch / button / knob can do
const ACTS={
  takeoff:{n:'🛫 Take off / land',t:'mom'},rth:{n:'🏠 Fly home',t:'mom'},land:{n:'🛬 Land right here',t:'mom'},photo:{n:'📷 Photo · record · FIRE (hold = keep firing)',t:'mom'},
  shotmode:{n:'🔁 Photo → video → weapons',t:'mom'},weapon:{n:'🔫 Weapon mode / next weapon',t:'mom'},cam:{n:'🎥 Next camera',t:'mom'},menu:{n:'☰ Menu (and back)',t:'mom'},
  flip:{n:'🔄 Flip (push the right stick for which way)',t:'mom'},reset:{n:'↩ Reset (back to the pad / last checkpoint)',t:'mom'},battery:{n:'🔋 Swap the battery',t:'mom'},
  walk:{n:'🚶 Walk around / fly',t:'mom'},launch:{n:'📍 Launch right here',t:'mom'},speedcyc:{n:'🎚 Next speed (CINE/NORMAL/SPORT)',t:'mom'},
  speed:{n:'🎚 Speed switch: CINE · NORMAL · SPORT',t:'state',pos:['cine','normal','sport']},braking:{n:'🛑 Obstacle braking switch',t:'state',pos:['on','off']},
  gps:{n:'🛰 GPS position hold switch',t:'state',pos:['on','off']},assist:{n:'🧭 Flight assist / SAFE switch',t:'state',pos:['on','off']},motors:{n:'🌀 Motor arm switch (off = motors stop!)',t:'state',pos:['on','off']},
  gimbal:{n:'🎥 Camera tilt knob',t:'axis'},zoom:{n:'🔍 Zoom knob',t:'axis'}};
const ACT_ORDER=['takeoff','rth','land','photo','shotmode','weapon','cam','menu','flip','reset','battery','walk','launch','speed','speedcyc','braking','gps','assist','motors','gimbal','zoom'];
function doAct(a,down){
  if(a==='photo'){shutter(down!==false);return;}if(down===false)return;
  if(WS.open){if(a==='photo'||a==='takeoff')wsAddHighlighted();if(a==='menu')closeWorkshop();return;}
  if(repair.open){if(a==='photo'||a==='takeoff')jobAct(curJob(),0.34);if(a==='menu')closeRepair();return;}
  if(menu.open){if(a==='takeoff'||a==='photo')menuSelect();else if(a==='menu')menuBack();else if(a==='cam')menuMove(1);return;}
  ({takeoff:()=>takeoff(),rth:()=>{rth=null;rthPress();},land:()=>{if(D.state==='flying'||D.state==='takeoff'){rth=null;D.wantLand=true;toast('🛬 Landing right here');}},shotmode:()=>cycleShot(),weapon:()=>nextWeapon(),cam:()=>nextCam(),menu:()=>menuToggle(true),
    flip:()=>armFlip(),reset:()=>respawn(),battery:()=>$('cBat').onclick(),walk:()=>walkToggle(),launch:()=>launchHere(),speedcyc:()=>cycleSpeed(1),settings:()=>{menuToggle(true);menuPush('⚙️ Settings',flightItems());}}[a]||(()=>{}))();}
function applyStateAct(a,pos,quiet){
  if(a==='speed'){setSpeed(pos.toUpperCase());}
  else if(a==='braking'){CFG.avoid=pos==='on';saveCfg();if(!quiet)toast('🛑 Obstacle braking '+(CFG.avoid?'ON':'off'),1200);}
  else if(a==='gps'){CFG.gpsHold=pos==='on';saveCfg();if(!quiet)toast('🛰 GPS position hold '+(CFG.gpsHold?'ON':'off (drifts)'),1200);}
  else if(a==='assist'){SPEC.assist=pos==='on';if(!quiet)toast('🧭 Flight assist '+(SPEC.assist?'ON':'off'),1200);}
  else if(a==='motors'){if(pos==='on'){if(D.state==='landed'&&!D.armed)armMotors(true);}else if(D.armed||D.state==='flying'||D.state==='takeoff'){if(D.state==='landed')armMotors(false);else{D.armed=false;toast('⛔ Motor switch OFF — it drops!',2000);fall('');}}}}
function snapOf(gp){return{b:gp.buttons.map(x=>x.pressed?1:(x.value>0.5?1:0)),a:[...gp.axes].map(v=>+v.toFixed(3))};}
function ctlOn(S,c){if(c.b!=null)return S.b[c.b]===1;const v=S.a[c.a];if(v==null)return false;return Math.abs(v-c.v)<Math.abs(c.v-(c.r||0))/2;}
function nearestPos(S,c){let best=null,bd=1e9;for(const k in c.pos){const P=c.pos[k];let d=0;c.idx.forEach(([t,i])=>{const cur=t==='b'?S.b[i]:S.a[i],w=t==='b'?P.b[i]:P.a[i];d+=Math.abs((cur||0)-(w||0));});if(d<bd){bd=d;best=k;}}return best;}
function rcActions(gp,m){const S=snapOf(gp),P=gpPrev.rcS;gpPrev.rcS=S;if(!P||!m.ctl)return;
  for(const a in m.ctl){const c=m.ctl[a],A=ACTS[a];if(!A||!c)continue;
    if(A.t==='mom'){const was=ctlOn(P,c),now=ctlOn(S,c);if(c.sw?was!==now:now&&!was)doAct(a,true);if(!c.sw&&was&&!now)doAct(a,false);if(c.sw&&a==='photo'&&was!==now)setTimeout(()=>shutter(false),60);}
    else if(A.t==='state'&&c.pos){const pos=nearestPos(S,c);if(pos!==c._last){const first=c._last==null;c._last=pos;if(!first||a==='speed')applyStateAct(a,pos,first);}}
    else if(A.t==='axis'&&c.a!=null){const v=clamp((S.a[c.a]||0)*(c.inv?-1:1),-1,1);if(c._v==null||Math.abs(v-c._v)>0.01){c._v=v;if(a==='gimbal'){if(camName()==='FPV')CFG.fpvT=lerp(-30,70,(v+1)/2);else{D.gimbal=lerp(-Math.PI/2,0.35,(v+1)/2);$('gimbal').value=Math.round(D.gimbal*180/Math.PI);}}else zoom=lerp(1,4,(v+1)/2);}}}}
function rcAxes(gp){
  const m=RCMAP&&RCMAP.id===gp.id?RCMAP:rcDefault(gp);const A=k=>{const q=m.ax[k];return q&&gp.axes[q[0]]!=null?clamp(gp.axes[q[0]]*q[1],-1,1):0;};
  const dz=(v,d)=>Math.abs(v)<d?0:(v-Math.sign(v)*d)/(1-d);
  const thr=A('thr');let ly=dz(thr,0.12);
  if(gpPrev.rcLatch){if(Math.abs(thr)<0.2)gpPrev.rcLatch=0;else if(thr<0)ly=0;} // after 🛫 with the throttle at the bottom: hover until the stick reaches the middle
  if(!rcw2.capture)rcActions(gp,m);
  return{lx:dz(A('yaw'),0.05),ly,rx:dz(A('roll'),0.04),ry:dz(A('pitch'),0.04),gim:0,rc:true,thrRaw:thr};
}
// ---- 🕹 Controller setup: pick DJI / Spektrum / game pad, teach the sticks, give every switch a job
const rcw={on:false};const rcw2={on:false,page:'pick',capture:null};
function rcSetup(){if(menu.open){menu.open=false;renderMenu();}rcw2.on=true;rcw2.page='pick';rcwDraw();}
function rcGp(){let L=[];try{L=[...navigator.getGamepads()].filter(Boolean);}catch(e){}return L.find(g=>RCMAP&&g.id===RCMAP.id)||L.find(isRCpad)||L[0]||null;}
function rcwEl(){let el=$('rcw2');if(!el){el=document.createElement('div');el.id='rcw2';document.body.appendChild(el);el.addEventListener('pointerdown',e=>e.stopPropagation());}return el;}
function rcwClose(){rcw2.on=false;rcw2.capture=null;rcwEl().style.display='none';['takeoff','photo','cam','menu'].forEach(k=>gpPrev['rc'+k]=true);gpPrev.rcS=null;}
function rcwDraw(){const el=rcwEl();el.style.display='flex';const pg=rcw2.page,gp=rcGp();let h='';
  const B=(id,t,cls)=>'<button class="btn '+(cls||'')+'" data-k="'+id+'">'+t+'</button>';
  if(pg==='pick'){h='<div class="card"><h2>🕹 Controller setup</h2><div style="opacity:0.8;margin-bottom:8px">What are you flying with?</div>'+
    '<div class="row"><span>🎮 <b>Spektrum InterLink DX</b> or another RC transmitter / sim controller (RealFlight, Radiomaster, FrSky…)</span>'+B('p:rc','Set it up ▶','big')+'</div>'+
    '<div class="row"><span>📡 <b>DJI remote</b> (RC-N1 / RC-N1C, by USB or DJI Phone Link)</span>'+B('p:dji','Choose what its buttons do ▶','big')+'</div>'+
    '<div class="row"><span>🎮 <b>Xbox / PlayStation controller</b></span>'+B('p:pad','How it works ▶','big')+'</div>'+
    '<div style="font-size:12px;opacity:0.7;margin-top:8px">Plugged in now: '+(gp?esc(gp.id.slice(0,70)):'nothing yet — plug it in and wiggle a stick')+'</div></div>'+B('x','✕ Close','big');}
  else if(pg==='rc'){
    if(!gp){h='<div class="card"><h2>🎮 RC transmitter</h2><p>Plug the InterLink in by USB, then move a stick (browsers only notice a controller after a stick moves).</p></div>'+B('p:pick','◀ Back','big');}
    else{if(!RCMAP||RCMAP.id!==gp.id){RCMAP=Object.assign(rcDefault(gp),{guess:true});}
      const axN={roll:'➡️ Right stick left/right (roll)',pitch:'⬆️ Right stick up/down (pitch)',thr:'⬆️ Left stick up/down (THROTTLE, middle = hover)',yaw:'➡️ Left stick left/right (turn)'};
      h='<div class="card"><h2>🎮 '+esc(gp.id.slice(0,46))+'</h2><div style="opacity:0.8">1) Teach it your sticks · 2) give any switch, button or knob a job · 3) Done. Bars move when you move things.</div></div>';
      h+='<div class="card"><b>Sticks</b>'+Object.keys(axN).map(k=>{const q=RCMAP.ax[k];return'<div class="row"><span>'+axN[k]+'<br><span class="as">'+(q?'axis '+q[0]+(q[1]<0?' (reversed)':''):'not set')+'</span></span><span><span class="bar"><i id="bar_'+k+'"></i></span> '+B('ax:'+k,'Teach')+B('inv:'+k,'⇅ Reverse')+'</span></div>';}).join('')+
        '<div class="row"><span style="opacity:0.8">Do all four, one after another</span>'+B('axall','▶ Teach all 4 sticks')+'</div></div>';
      h+='<div class="card"><b>Switches, buttons and knobs</b> <span style="opacity:0.7;font-size:12px">— press Set, then flip/press/turn the one you want</span>'+ACT_ORDER.map(a=>{const c=RCMAP.ctl&&RCMAP.ctl[a];return'<div class="row"><span>'+ACTS[a].n+'<br><span class="as" id="as_'+a+'">'+ctlTxt(a,c)+'</span></span><span>'+B('set:'+a,c?'Change':'Set')+(c?B('clr:'+a,'✕'):'')+'</span></div>';}).join('')+'</div>';
      h+='<div class="card" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">'+B('done','✅ Done','big')+B('reset','↺ Start over','big')+B('p:pick','◀ Back','big')+'</div>';}}
  else if(pg==='dji'){const M=djiMap(),opts=['nothing','takeoff','rth','land','photo','shotmode','weapon','cam','menu','flip','reset','battery','walk','launch','speedcyc','settings'];
    const nm=a=>a==='nothing'?'— nothing':a==='settings'?'⚙️ Settings':ACTS[a].n;
    const rows=[['photo','PHOTO button (hold = keep firing)'],['mode','PHOTO / VIDEO switch'],['rth','Return-home button: tap'],['rth2','Return-home button: double-tap'],['fn1','Fn: tap'],['fn2','Fn: tap tap'],['fn3','Fn: tap tap tap'],['fnh','Fn: hold']];
    h='<div class="card"><h2>📡 DJI remote buttons</h2><div style="opacity:0.8">The sticks and wheel always fly. Pick what each button does:</div>'+rows.map(([k,t])=>'<div class="row"><span>'+t+'</span><select data-dj="'+k+'">'+opts.map(o=>'<option value="'+o+'"'+(M[k]===o?' selected':'')+'>'+nm(o)+'</option>').join('')+'</select></div>').join('')+
      '<div class="row"><span>C / N / S switch</span><select data-dj="csn">'+[['speed','🎚 Speed: CINE / NORMAL / SPORT'],['brake','🛑 S = obstacle braking off'],['nothing','— nothing']].map(([v,t])=>'<option value="'+v+'"'+(M.csn===v?' selected':'')+'>'+t+'</option>').join('')+'</select></div>'+
      '<div class="row"><span>Wheel</span><span class="as">camera tilt (FPV camera too) · hold Fn + wheel = zoom</span></div></div><div class="card" style="display:flex;gap:8px;justify-content:center">'+B('djireset','↺ DJI defaults','big')+B('p:pick','◀ Back','big')+B('x','✅ Done','big')+'</div>';}
  else if(pg==='pad'){h='<div class="card"><h2>🎮 Xbox / PlayStation</h2><div class="row"><span>Left stick</span><span class="as">up/down + turn</span></div><div class="row"><span>Right stick</span><span class="as">fly</span></div><div class="row"><span>A / ✕</span><span class="as">photo · fire</span></div><div class="row"><span>B / ○</span><span class="as">next camera</span></div><div class="row"><span>Y / △</span><span class="as">take off / land</span></div><div class="row"><span>X / □</span><span class="as">fly home</span></div><div class="row"><span>LB / RB</span><span class="as">flip / photo→video→weapons</span></div><div class="row"><span>LT / RT</span><span class="as">camera tilt</span></div><div class="row"><span>Start</span><span class="as">menu</span></div><p style="opacity:0.7">It works by itself — nothing to set up. If it acts like an RC transmitter by mistake, choose it here:</p>'+B('aspad','Treat it as a normal game pad')+'</div>'+B('p:pick','◀ Back','big');}
  if(rcw2.capture)h='<div class="card" style="border-color:#ffd60a;background:#2a2405"><h2>'+rcw2.capture.msg+'</h2><div class="as" id="capv"></div>'+B('capskip',rcw2.capture.skippable?'Skip this one':'Cancel')+'</div>'+h;
  el.innerHTML=h;
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>rcwBtn(b.dataset.k));
  el.querySelectorAll('select').forEach(s=>s.onchange=()=>{const M=djiMap();M[s.dataset.dj]=s.value;CFG.djiMap=M;saveCfg();toast('✅ Saved',700);});}
function ctlTxt(a,c){if(!c)return'not set';const A=ACTS[a];if(A.t==='axis')return'knob/axis '+c.a+(c.inv?' (reversed)':'');if(A.t==='state')return'switch · '+Object.keys(c.pos||{}).join(' / ');return(c.b!=null?'button '+c.b:'axis '+c.a+' → '+c.v)+(c.sw?' (switch: every flip)':'');}
function rcwBtn(k){const gp=rcGp();
  if(k==='x'){rcwClose();return;}if(k.startsWith('p:')){rcw2.page=k.slice(2);rcw2.capture=null;rcwDraw();return;}
  if(k==='done'){if(RCMAP){RCMAP.guess=false;RCMAP.kind='rc';LS.set('rcmap',RCMAP);}rcwClose();toast('✅ Controller set up! Middle throttle = hover',3000);return;}
  if(k==='reset'){if(gp)RCMAP=rcDefault(gp);rcwDraw();return;}if(k==='aspad'){if(gp){RCMAP={id:gp.id,kind:'pad',ax:{},ctl:{}};LS.set('rcmap',RCMAP);}toast('🎮 Treated as a game pad',1500);rcwClose();return;}
  if(k==='djireset'){CFG.djiMap=null;saveCfg();rcwDraw();return;}
  if(k==='capskip'){const c=rcw2.capture;rcw2.capture=null;if(c&&c.skippable&&c.next)c.next(true);else rcwDraw();return;}
  if(!gp)return;
  if(k.startsWith('inv:')){const q=RCMAP.ax[k.slice(4)];if(q)q[1]=-q[1];LS.set('rcmap',RCMAP);rcwDraw();return;}
  if(k.startsWith('clr:')){delete RCMAP.ctl[k.slice(4)];LS.set('rcmap',RCMAP);rcwDraw();return;}
  if(k.startsWith('ax:'))capAxis(k.slice(3));
  if(k==='axall'){const L=['roll','pitch','thr','yaw'];const go=i=>{if(i>=L.length){rcwDraw();toast('✅ Sticks learned',1500);return;}capAxis(L[i],()=>go(i+1));};go(0);}
  if(k.startsWith('set:'))capAct(k.slice(4));}
const AXMSG={roll:'➡️ Push the RIGHT stick to the RIGHT and hold it',pitch:'⬆️ Push the RIGHT stick UP (away from you) and hold it',thr:'⬆️ Push the LEFT stick (throttle) all the way UP and hold it',yaw:'➡️ Push the LEFT stick to the RIGHT and hold it'};
function capAxis(k,after){const gp=rcGp();if(!gp)return;delete RCMAP.ax[k];rcw2.capture={kind:'axis',k,rest:[...gp.axes],msg:AXMSG[k],wait:0.4,skippable:!!after,next:()=>{if(after)after();else rcwDraw();}};rcwDraw();}
function capAct(a){const gp=rcGp();if(!gp)return;const A=ACTS[a],S=snapOf(gp);
  if(A.t==='axis'){rcw2.capture={kind:'knob',a,rest:S,msg:'Turn the knob (or slider) you want for: '+A.n,wait:0.3};rcwDraw();return;}
  if(A.t==='state'){const pos={},order=A.pos;let i=0;const ask=()=>{const p=order[i];rcw2.capture={kind:'pos',a,p,msg:A.n+'<br>➜ Put the switch in the <b style="color:#ffd60a">'+p.toUpperCase()+'</b> position, then tap “Got it”',wait:0.2,pos,skippable:false};rcwDraw();
      const el=rcwEl(),b=document.createElement('button');b.className='btn big';b.textContent='✅ Got it ('+p.toUpperCase()+')';b.onclick=()=>{const g=rcGp();if(!g)return;pos[p]=snapOf(g);i++;if(i<order.length)ask();else finishPos(a,pos);};el.firstChild.appendChild(b);};ask();return;}
  rcw2.capture={kind:'mom',a,rest:S,msg:'Press, flip or turn the one you want for:<br>'+A.n,wait:0.25};rcwDraw();}
function finishPos(a,pos){const ks=Object.keys(pos),idx=[];const P0=pos[ks[0]];P0.b.forEach((v,i)=>{if(ks.some(k=>pos[k].b[i]!==v))idx.push(['b',i]);});P0.a.forEach((v,i)=>{if(rcStickAxis(i))return;if(ks.some(k=>Math.abs(pos[k].a[i]-v)>0.3))idx.push(['a',i]);});
  rcw2.capture=null;if(!idx.length){toast('⚠ Nothing changed between the positions — flip the switch between them. Try again.',3500);rcwDraw();return;}
  RCMAP.ctl[a]={pos,idx};LS.set('rcmap',RCMAP);beep(900,0.06,0.05);toast('✅ '+ACTS[a].n+' set',1500);rcwDraw();}
function rcStickAxis(i){return RCMAP&&Object.values(RCMAP.ax).some(q=>q&&q[0]===i);}
function tickRcSetup(dt){
  if(!rcw2.on)return;const gp=rcGp();if(!gp)return;
  if(RCMAP&&RCMAP.ax){for(const k of['roll','pitch','thr','yaw']){const el=$('bar_'+k);if(!el)continue;const q=RCMAP.ax[k],v=q&&gp.axes[q[0]]!=null?clamp(gp.axes[q[0]]*q[1],-1,1):0;el.style.left=(v<0?50+v*50:50)+'%';el.style.width=Math.abs(v)*50+'%';}}
  const c=rcw2.capture;if(!c)return;const cv=$('capv');if(cv)cv.textContent=gp.axes.map((x,i)=>i+':'+x.toFixed(2)).join('  ')+'   buttons: '+gp.buttons.map((b,i)=>b.pressed?i:null).filter(x=>x!==null).join(',');
  c.wait-=dt;if(c.wait>0)return;
  if(c.kind==='axis'){let bi=-1,bd=0;gp.axes.forEach((x,i)=>{if(Object.values(RCMAP.ax).some(q=>q&&q[0]===i))return;const d=x-c.rest[i];if(Math.abs(d)>Math.abs(bd)){bd=d;bi=i;}});
    if(bi>=0&&Math.abs(bd)>0.45){RCMAP.ax[c.k]=[bi,bd>0?1:-1];LS.set('rcmap',RCMAP);beep(900,0.06,0.05);rcw2.capture=null;c.next();}return;}
  const S=snapOf(gp);
  if(c.kind==='knob'){let bi=-1,bd=0;S.a.forEach((x,i)=>{if(rcStickAxis(i))return;const d=x-c.rest.a[i];if(Math.abs(d)>Math.abs(bd)){bd=d;bi=i;}});if(bi>=0&&Math.abs(bd)>0.3){RCMAP.ctl[c.a]={a:bi,inv:bd<0};LS.set('rcmap',RCMAP);beep(900,0.06,0.05);rcw2.capture=null;toast('✅ '+ACTS[c.a].n+' set',1300);rcwDraw();}return;}
  if(c.kind==='mom'){
    if(!c.got){let got=null;S.b.forEach((v,i)=>{if(!got&&v!==c.rest.b[i])got={b:i,on:v};});if(!got)S.a.forEach((v,i)=>{if(!got&&!rcStickAxis(i)&&Math.abs(v-c.rest.a[i])>0.5)got={a:i,v:+v.toFixed(2),r:c.rest.a[i]};});
      if(got){if(got.b!=null&&got.on===0){c.rest=S;return;} // a switch that was ON went off: wait for the next change
        c.got=got;c.t=0;beep(900,0.06,0.05);}return;}
    c.t+=dt;const on=ctlOn(S,c.got);if(!on||c.t>1.3){const sw=on;const ctl=c.got.b!=null?{b:c.got.b}:{a:c.got.a,v:c.got.v,r:c.got.r};if(sw)ctl.sw=true;RCMAP.ctl[c.a]=ctl;LS.set('rcmap',RCMAP);rcw2.capture=null;toast('✅ '+ACTS[c.a].n+' → '+ctlTxt(c.a,ctl),1800);rcwDraw();}}
}
// DJI remote button jobs
function djiMap(){return Object.assign({photo:'photo',mode:'shotmode',rth:'rth',rth2:'land',fn1:'cam',fn2:'flip',fn3:'settings',fnh:'menu',csn:'speed'},CFG.djiMap||{});}
