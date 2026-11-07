// ================================================================ v9: 💰 coins for stunts + shop · 💥 lots more kinds of damage · 💻 micro:bit style inputs
// ---------------- 💰 coins + awards
const ECO={coins:+LS.get('coins',0)||0,kits:+LS.get('kits',5)||0,up:Object.assign({mot:0,bat:0,frm:0},LS.get('upg',{})),best:+LS.get('spdBest',0)||0,combo:0,lastT:-99,cd:{},rot:new V3(),q0:null,air:0,airAward:0,low:0,inv:0,prevState:'',prevVy:0,ck:0,vt:0};
function ecoSave(){LS.set('coins',ECO.coins);LS.set('kits',ECO.kits);LS.set('upg',ECO.up);LS.set('spdBest',Math.round(ECO.best));}
function ecoChip(){const c=$('cCoin');if(c)c.textContent='💰'+ECO.coins;}
setTimeout(()=>{ecoChip();const c=$('cCoin');if(c)c.onclick=e=>{e.stopPropagation();if(!menu.open)menuToggle(true);menuPush('💰 Shop',shopItems());};},0);
function award(name,n,key,cd){const now=performance.now()/1000;if(key){if(ECO.cd[key]&&now<ECO.cd[key])return false;ECO.cd[key]=now+(cd||3);}
  ECO.combo=now-ECO.lastT<4?Math.min(ECO.combo+1,6):0;ECO.lastT=now;const mult=1+ECO.combo*0.5,got=Math.round(n*mult);ECO.coins+=got;ecoSave();ecoChip();
  awardPop(name,got,ECO.combo);beep(1100+ECO.combo*110,0.07,0.05);setTimeout(()=>beep(1500+ECO.combo*110,0.1,0.05),80);return true;}
function awardPop(name,got,combo){let el=$('awardPop');if(!el){el=document.createElement('div');el.id='awardPop';el.style.cssText='position:fixed;left:50%;top:17%;transform:translateX(-50%);z-index:40;pointer-events:none;text-align:center;font:900 26px system-ui,sans-serif;color:#ffd60a;text-shadow:0 2px 8px #000,0 0 3px #000;transition:opacity .5s,transform .25s;opacity:0;white-space:nowrap';document.body.appendChild(el);}
  el.innerHTML=name+'<div style="font-size:18px;color:#fff">+'+got+' 💰'+(combo?' &nbsp;<span style="color:#ff6bd6">COMBO ×'+(1+combo*0.5)+'</span>':'')+'</div>';el.style.opacity=1;el.style.transform='translateX(-50%) scale(1.12)';setTimeout(()=>el.style.transform='translateX(-50%) scale(1)',140);clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity=0,1800);vrMsg(name+' +'+got+'💰',1400);}
const _eq=new THREE.Quaternion(),_eq2=new THREE.Quaternion(),_ev3=new V3(),_ep3=new V3();
function ecoTick(dt){if(!DR||!DR.g||!(dt>0))return;const st=D.state;
  if(ECO.prevState==='flying'&&st==='landed'&&ECO.air>6&&Math.abs(ECO.prevVy)<1.2)award('🪶 Smooth landing!',3,'land',15);
  if(ECO.prevState!==st&&(st==='tumble'||st==='down'))ECO.combo=0;
  ECO.prevState=st;ECO.prevVy=D.vel.y;dmgTick(dt);
  if(st!=='flying'){ECO.air=0;ECO.airAward=0;ECO.q0=null;ECO.rot.set(0,0,0);ECO.low=0;ECO.inv=0;return;}
  ECO.air+=dt;if(ECO.air-ECO.airAward>=60){ECO.airAward+=60;award('⏱ '+Math.round(ECO.airAward/60)+' min in the air!',2);}
  // flips, rolls, loops, pirouettes: add up how far it has turned around each of its own axes
  _eq.copy(DR.g.quaternion);
  if(ECO.q0){_eq2.copy(ECO.q0).invert().multiply(_eq);if(_eq2.w<0){_eq2.x=-_eq2.x;_eq2.y=-_eq2.y;_eq2.z=-_eq2.z;_eq2.w=-_eq2.w;}
    const s=Math.sqrt(Math.max(0,1-_eq2.w*_eq2.w)),ang=2*Math.acos(Math.min(1,_eq2.w));
    if(s>1e-6&&ang<1.6){const ax=_eq2.x/s*ang,ay=_eq2.y/s*ang,az=_eq2.z/s*ang;ECO.rot.x+=ax;ECO.rot.y+=ay;ECO.rot.z+=az;
      const dec=Math.exp(-dt*2.5);if(Math.abs(ax)/dt<0.8)ECO.rot.x*=dec;if(Math.abs(az)/dt<0.8)ECO.rot.z*=dec;if(Math.abs(ay)/dt<2.4)ECO.rot.y*=dec;}}
  ECO.q0=(ECO.q0||new THREE.Quaternion()).copy(_eq);
  const T=Math.PI*2*0.88,pl=vkind()==='plane';
  if(Math.abs(ECO.rot.x)>T){ECO.rot.x=0;award(pl?'➰ Loop!':'🔄 Flip!',5);}
  if(Math.abs(ECO.rot.z)>T){ECO.rot.z=0;award(pl?'🌀 Roll!':'🔄 Side flip!',5);}
  if(Math.abs(ECO.rot.y)>T){ECO.rot.y=0;award('🌪 Pirouette!',2,'pir',1.5);}
  const hs=Math.hypot(D.vel.x,D.vel.z),agl=D.pos.y-groundY(D.pos.x,D.pos.z);
  // threading between branches / buzzing a trunk without hitting it
  ECO.ck-=dt;if(ECO.ck<=0){ECO.ck=0.12;if(hs>3.5&&agl>0.5&&hitTest(_ep3.copy(D.pos),1.1)&&!hitTest(_ep3.copy(D.pos),0.3))award('😱 Close call!',3,'close',2.2);}
  if(hs>7&&agl>0.12&&agl<1.6){ECO.low+=dt;if(ECO.low>1.2){ECO.low=0;award('🏁 Low pass!',4,'low',8);}}else ECO.low=0;
  const kmh=D.vel.length()*3.6;if(kmh>Math.max(45,ECO.best+3)){ECO.best=kmh;award('⚡ Speed record '+Math.round(kmh)+' km/h!',5,'spd',4);ecoSave();}
  _ev3.set(0,1,0).applyQuaternion(DR.g.quaternion);if(_ev3.y<-0.6&&agl>2){ECO.inv+=dt;if(ECO.inv>2){ECO.inv=0;award('🙃 Inverted flying!',5,'inv',10);}}else ECO.inv=0;
}
// races, lessons and balloons pay too
{const f0=finishCourse;finishCourse=function(){const k=course&&course.key,b=LS.get('best_'+k,0);const r=f0.apply(this,arguments);const nb=LS.get('best_'+k,0);setTimeout(()=>award(nb!==b?'🏆 NEW BEST race time!':'🏁 Race finished!',nb!==b?30:20),600);return r;};}
{const f0=lesDone;lesDone=function(){const r=f0.apply(this,arguments);setTimeout(()=>award('🎓 Lesson complete!',25),900);return r;};}
{const f0=popBalloon;popBalloon=function(b,fromNet){const was=b&&b.alive;const r=f0.apply(this,arguments);if(was&&!fromNet)award('🎈 Pop!',2);return r;};}
// spare parts never run out: buy them, or get free ones when you're broke (or turn on unlimited)
function ecoRestock(){if(CFG.freeParts){repair.spares=12;}else if(ECO.coins>=5){ECO.coins-=5;repair.spares+=4;toast('💰 Bought 4 props for 5 coins',1600);}else{repair.spares+=2;toast('🎁 Out of props and coins — here are 2 free ones. Do stunts to earn coins!',2600);}LS.set('spares',repair.spares);ecoSave();ecoChip();return true;}
function ecoKit(){if(CFG.freeParts)return;if(ECO.kits>0){ECO.kits--;}else if(ECO.coins>=4){ECO.coins-=4;toast('💰 Bought a spare part for 4 coins',1400);}else toast('🎁 Free emergency part (no coins left)',1600);ecoSave();ecoChip();}
function shopItems(){const U=ECO.up,cost=(k,l)=>(k==='bat'?30:40)*(l+1);
  const buy=(n,fn)=>{if(ECO.coins<n){toast('💰 That costs '+n+' — you have '+ECO.coins+'. Do flips, close calls and races to earn more!',2600);beep(300,0.15,0.05);return;}ECO.coins-=n;fn();ecoSave();ecoChip();beep(1300,0.08,0.05);};
  const up=(k,name,what)=>mItem(()=>name+' '+'★'.repeat(U[k])+'☆'.repeat(3-U[k])+(U[k]>=3?'  MAXED':'  — '+cost(k,U[k])+'💰  ('+what+')'),()=>{if(U[k]>=3){toast('Already maxed out ★★★');return;}buy(cost(k,U[k]),()=>{U[k]++;ST=stats(SPEC);toast('⬆ '+name+' — level '+U[k]+'!',1600);});});
  return[mInfo(()=>'💰 '+ECO.coins+' coins · earn them with flips, rolls, loops, close calls between branches, low passes, speed records, smooth landings, races, lessons and balloons (chain them for a COMBO)'),
    mItem(()=>'🪛 4 spare propellers — 5💰  (you have '+repair.spares+')',()=>buy(5,()=>{repair.spares+=4;LS.set('spares',repair.spares);toast('🪛 +4 props',1000);})),
    mItem(()=>'🧰 3 spare parts (motors, antennas, lenses…) — 10💰  (you have '+ECO.kits+')',()=>buy(10,()=>{ECO.kits+=3;toast('🧰 +3 spare parts',1000);})),
    up('mot','⚡ Faster motors','+10% speed + punch each'),up('bat','🔋 Bigger battery','+20% flight time each'),up('frm','🛡 Tougher frame','takes harder hits'),
    mItem(()=>'🔧 Spare parts: '+(CFG.freeParts?'UNLIMITED (free)':'buy with coins (free ones if you\'re broke)'),()=>{CFG.freeParts=!CFG.freeParts;saveCfg();}),
    mItem('↺ Sell back all upgrades (refund)',()=>{let r=0;['mot','bat','frm'].forEach(k=>{for(let l=0;l<U[k];l++)r+=cost(k,l);U[k]=0;});if(!r){toast('No upgrades to sell');return;}ECO.coins+=r;ecoSave();ecoChip();ST=stats(SPEC);toast('↺ Refunded '+r+' coins',1600);})];}
{const s0=stats;stats=function(sp){const st=s0(sp),U=ECO.up;if(st&&(U.mot||U.bat||U.frm)){const m=1+0.1*U.mot;['top','vz','tw','thrust'].forEach(k=>{if(typeof st[k]==='number')st[k]*=m;});if(typeof st.mins==='number')st.mins*=1+0.2*U.bat;if(typeof st.tough==='number')st.tough+=3*U.frm;}return st;};ST=stats(SPEC);}

// ---------------- 💥 more kinds of damage (not just chipped props)
const DMG={
  motor:{n:'🔥 Motor burnt out',fix:'⚙️ Swap the burnt-out motor',hold:'HOLD to swap the motor',msg:'🔥 A motor burnt out — it spins and sinks! Land and fix it'},
  cam:{n:'📷 Camera lens cracked',fix:'📷 Put in a new camera lens',hold:'HOLD to swap the lens',msg:'📷 Cracked the camera lens!'},
  bat:{n:'🔋 Battery knocked loose',fix:'🔋 Plug the battery in + strap it down',hold:'HOLD to strap it down',msg:'🔋 The battery got knocked loose!'},
  ant:{n:'📡 Antenna snapped',fix:'📡 Fit a new antenna',hold:'HOLD to fit the antenna',msg:'📡 Snapped the antenna — the signal keeps cutting out!'},
  gps:{n:'🛰 GPS knocked off',fix:'🛰 Stick the GPS back on',hold:'HOLD to fix the GPS',msg:'🛰 GPS knocked off — no more position hold!'},
  frame:{n:'🪵 Frame cracked',fix:'🩹 Glue + zip-tie the cracked frame',hold:'HOLD to glue the frame',msg:'🪵 Cracked the frame — it shakes and is slower'}};
D.dmg={};
function dmgAny(){return !!(D.dmg&&Object.keys(D.dmg).length);}
function dmgJobs(J){if(D.dmg)for(const k in D.dmg)J.push({t:'dmg',k});}
function dmgList(all){if(D.dmg)for(const k in D.dmg)all.push([DMG[k].fix,'dmg',k]);}
function dmgFix(k){ecoKit();if(D.dmg)delete D.dmg[k];toast('✅ '+DMG[k].n.replace(/^\S+\s/,'')+' — fixed',900);dmgVis();}
function dmgClear(){D.dmg={};dmgVis();}
function dmgAdd(k,quiet){if(!D.dmg)D.dmg={};if(D.dmg[k]||!DMG[k])return false;D.dmg[k]=1;if(!quiet)setTimeout(()=>toast(DMG[k].msg,2600),400);dmgVis();
  if(k==='bat'&&(D.state==='flying'||D.state==='takeoff')){D.armed=false;fall('');}return true;}
function dmgRoll(sev,crashed){const pool=['frame','cam','ant'];if(DR.props.length&&vkind()!=='plane')pool.push('motor');if(ST.elec?ST.elec.gps:SPEC.assist)pool.push('gps');if(crashed)pool.push('bat','motor');
  let n=sev<1.5?(Math.random()<0.45?1:0):sev<2.4?1+(Math.random()<0.3?1:0):2+Math.floor(Math.random()*2);const got=[];
  while(n-->0&&pool.length){const k=pool.splice(Math.floor(Math.random()*pool.length),1)[0];if(dmgAdd(k,true))got.push(k);}
  if(got.length){const m=got.map(k=>DMG[k].n).join(' + ');setTimeout(()=>toast('💥 '+m+(crashed?' — press 🔧 to fix':' — land and fix it'),3400),crashed?2700:300);if(!crashed&&got.includes('motor'))shake=0.5;}
  debrisBurst(sev);}
function debrisBurst(sev){if(!DR)return;const n=Math.min(12,Math.round(2+sev*2.5)),cols=[(SPEC.colors&&SPEC.colors.body)||'#555','#202226','#9aa0a6',DR.props[0]?'#'+DR.props[0].mat.color.getHexString():'#ccc'];
  for(let i=0;i<n;i++){const s=(0.008+Math.random()*0.02)*VS,m=new THREE.Mesh(new THREE.BoxGeometry(s,s*0.5,s*(1+Math.random()*2)),new THREE.MeshLambertMaterial({color:cols[i%cols.length]}));m.position.copy(D.pos);m.position.y+=0.05;scene.add(m);
    const a=Math.random()*6.28,sp=1.5+Math.random()*2.5*Math.min(3,sev);debris.push({m,v:new V3(Math.cos(a)*sp,1+Math.random()*2.5,Math.sin(a)*sp),s:new V3(Math.random()*9,Math.random()*9,Math.random()*9),t:0});}}
{const i0=impact;impact=function(v,what){const t=ST.tough||0,tk=CFG.tough/100,bmax=(2.5+t*0.35+(ST.guards||SPEC.guards?(ST.cage?4.5:2.6):0))*tk,was=D.state;const r=i0.apply(this,arguments);
  if(!DR||!(v>=bmax*1.1))return r;dmgRoll(v/bmax,D.state==='tumble'&&was!=='tumble');return r;};}
{const r0=rebuildDrone;rebuildDrone=function(){const r=r0.apply(this,arguments);D.dmg={};dmgVis();return r;};}
function dmgRadio(inp,dt){const R=dmgRadio;R.t=(R.t||0)-dt;if(R.t<=0){R.cut=!R.cut;R.t=R.cut?0.2+Math.random()*0.45:1.2+Math.random()*2.8;if(R.cut&&D.state==='flying')toast('📡 Signal lost!',450);}return R.cut?Object.assign({},inp,{lx:0,ly:0,rx:0,ry:0}):inp;}
function dmgTick(dt){if(!D.dmg)return;if(D.dmg.frame&&D.state==='flying')shake=Math.max(shake,0.045);
  dmgTick.t=(dmgTick.t||0)-dt;if(dmgTick.t<=0){dmgTick.t=0.3;dmgVis();}
  if(D.dmg.motor&&D.state==='flying'&&Math.random()<dt*6&&typeof SMK!=='undefined'&&SMK.puff)try{SMK.puff(D.pos,0.4);}catch(e){}}
function dmgVis(){let el=$('crackFx');const c=CAMS[camI],on=!!(D.dmg&&D.dmg.cam)&&(c==='FPV'||c==='GIMBAL');
  if(on&&!el){el=document.createElement('div');el.id='crackFx';el.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:4';
    let p='';const cx=64,cy=36,rnd=(a,b)=>a+Math.random()*(b-a);for(let k=0;k<11;k++){let a=k/11*6.28+rnd(-0.2,0.2),x=cx,y=cy,d='M'+x+' '+y;const L=rnd(18,60);for(let s=0;s<6;s++){a+=rnd(-0.35,0.35);x+=Math.cos(a)*L/6;y+=Math.sin(a)*L/6*0.6;d+=' L'+x.toFixed(1)+' '+y.toFixed(1);}p+='<path d="'+d+'"/>';}
    for(let k=0;k<3;k++){const r=rnd(3,9)*(k+1);p+='<path d="M'+(cx+r)+' '+cy+' A'+r+' '+(r*0.6)+' 0 0 1 '+(cx-r*0.7)+' '+(cy+r*0.4)+'"/>';}
    el.innerHTML='<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><g fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="3" vector-effect="non-scaling-stroke" style="stroke-width:3px">'+p+'</g><g fill="none" stroke="rgba(255,255,255,0.85)" style="stroke-width:1.3px">'+p+'</g><circle cx="'+cx+'" cy="'+cy+'" r="1.2" fill="rgba(255,255,255,0.5)"/></svg>';
    el.querySelectorAll('path').forEach(q=>q.setAttribute('vector-effect','non-scaling-stroke'));document.body.appendChild(el);}
  if(el)el.style.display=on?'block':'none';}

// ---------------- 💻 micro:bit style programs: on start · forever · on button pressed · on switch moved · stick / knob values
const MB={h:null,scr:{'Ⓐ':false,'Ⓑ':false},prev:{},map:LS.get('mbmap',{}),crashMsg:0};
const MB_PAD=['A','B','X','Y','LB','RB','LT','RT','View','Menu','L-stick click','R-stick click','D-pad up','D-pad down','D-pad left','D-pad right'];
const MB_RC_SW=['A','B','C','D','E','F','G'],MB_RC_BT=['H','I','RESET','CANCEL'],MB_DJI_BT=['Photo','Mode','Home','Fn'];
const MB_RC_DEF={A:{b:[0]},G:{b:[9,10]},I:{b:[12]},RESET:{b:[13]}};
function mbGp(){try{return rcGp();}catch(e){return null;}}
function mbKind(){if(typeof djiLive==='function'&&djiLive())return'dji';const gp=mbGp();if(gp&&isRCpad(gp))return'rc';if(gp)return'pad';return'none';}
function mbNames(kind){kind=kind||mbKind();const scr=['Ⓐ','Ⓑ'];
  if(kind==='rc')return{sw:MB_RC_SW.slice(),bt:MB_RC_SW.concat(MB_RC_BT,scr),kn:['R knob']};
  if(kind==='dji')return{sw:['Flight mode C/N/S'],bt:MB_DJI_BT.concat(scr),kn:['Wheel']};
  if(kind==='pad')return{sw:[],bt:MB_PAD.concat(scr),kn:['LT','RT']};
  return{sw:[],bt:scr,kn:[]};}
function mbAll(t){const o=[];['rc','dji','pad'].forEach(k=>mbNames(k)[t].forEach(n=>{if(!o.includes(n))o.push(n);}));if(t==='bt')['Ⓐ','Ⓑ'].forEach(n=>{if(!o.includes(n))o.push(n);});return o;}
function mbIn(){const o={},k=mbKind();const S=(n,pos,v)=>{o[n]={pos,on:pos!=='up',v:v||0};},Bn=(n,on)=>{o[n]={pos:on?'down':'up',on:!!on,v:on?1:0};};
  Bn('Ⓐ',MB.scr['Ⓐ']);Bn('Ⓑ',MB.scr['Ⓑ']);const gp=mbGp();
  if(k==='dji'){const m=(dji.btn&&dji.btn.mask)||0,f=dji.btn&&dji.btn.flight;Bn('Photo',m&0x60);Bn('Mode',m&0x04);Bn('Home',m&0x80);Bn('Fn',dji.btn&&dji.btn.fallback?dji.fnFallback:(m&0x02));S('Flight mode C/N/S',f==='CINE'?'up':f==='SPORT'?'down':'middle');o.Wheel={v:(dji.ax&&dji.ax.dial)||0,pos:'middle',on:false};}
  else if(gp){const b=i=>{const x=gp.buttons[i];return !!x&&(x.pressed||x.value>0.5);},ax=i=>gp.axes[i]||0;
    if(k==='rc'){MB_RC_SW.concat(MB_RC_BT,['R knob']).forEach(n=>{const m=MB.map[n]||MB_RC_DEF[n];if(!m){S(n,'up');return;}
      if(m.a!=null){const v=ax(m.a);if(n==='R knob')o[n]={v,pos:'middle',on:false};else S(n,v<-0.33?'up':v>0.33?'down':'middle',v);}
      else if(m.b&&m.b.length>1)S(n,b(m.b[0])?'up':b(m.b[1])?'down':'middle');else if(m.b)S(n,b(m.b[0])?'down':'up');});}
    else{MB_PAD.forEach((n,i)=>Bn(n,b(i)));o.LT.v=gp.buttons[6]?gp.buttons[6].value:0;o.RT.v=gp.buttons[7]?gp.buttons[7].value:0;}}
  return o;}
function mbBegin(){MB.h={start:[],fv:[],btn:[],sw:[]};MB.prev={};MB.crashMsg=0;AP.ev=false;AP.drive=null;}
function mbEnd(){AP.ev=false;AP.drive=null;MB.h=null;mbButtons(false);}
function mbErr(e){const m=String(e&&e.message||e);if(m==='stopped')return true;if(/crash/.test(m)){if(!MB.crashMsg){MB.crashMsg=1;apLog('💥 It crashed — fix it and the program keeps going');}return true;}apLog('❌ '+m);return false;}
function mbFire(e){if(e.busy)return;e.busy=true;(async()=>{try{await e.f();}catch(err){mbErr(err);}e.busy=false;if(AP.tgt&&AP.tgt.type==='hold')AP.tgt=null;})();}
function mbTick(){const h=MB.h;if(!h)return;const I=mbIn(),P=MB.prev||{};MB.prev=I;
  h.btn.forEach(e=>{const a=I[e.n],b=P[e.n];if(a&&b&&a.on&&!b.on)mbFire(e);});
  h.sw.forEach(e=>{const a=I[e.n],b=P[e.n];if(a&&b&&a.pos!==b.pos&&(e.pos==='any'||a.pos===e.pos))mbFire(e);});}
async function mbRun(){const h=MB.h;if(!h||!(h.start.length+h.fv.length+h.btn.length+h.sw.length))return;
  AP.ev=true;mbButtons(true);apSay('running · your sticks + switches are live');apLog('🎮 micro:bit mode: on start, then forever + your inputs. ⏹ STOP when you\'re done.');
  for(const f of h.start){if(AP.stop||!AP.on)return;try{await f();}catch(e){mbErr(e);}}
  if(AP.tgt&&AP.tgt.type==='hold')AP.tgt=null;
  h.fv.forEach(f=>{(async()=>{while(AP.on&&!AP.stop&&MB.h===h){try{await f();}catch(e){if(!mbErr(e))break;await new Promise(r=>setTimeout(r,300));}await new Promise(r=>setTimeout(r,20));}})();});
  await new Promise(r=>{AP.evDone=r;if(AP.stop||!AP.on)r();});}
function mbButtons(on){let w=$('mbBtns');const bar=$('apBar');if(!w&&on&&bar){w=document.createElement('span');w.id='mbBtns';w.style.cssText='display:inline-flex;gap:6px';
    w.innerHTML='<button class="btn" data-b="Ⓐ" style="font-size:20px;min-width:52px">Ⓐ</button><button class="btn" data-b="Ⓑ" style="font-size:20px;min-width:52px">Ⓑ</button>';
    [...w.children].forEach(b=>{const n=b.dataset.b,up=()=>{MB.scr[n]=false;};b.onpointerdown=e=>{e.stopPropagation();MB.scr[n]=true;};b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up;});
    bar.insertBefore(w,$('apStopB'));}
  if(w)w.style.display=on?'inline-flex':'none';if(!on){MB.scr['Ⓐ']=MB.scr['Ⓑ']=false;}}
Object.assign(droneAPI,{
  on_start:f=>{if(MB.h)MB.h.start.push(f);},
  forever:f=>{if(MB.h)MB.h.fv.push(f);},
  on_button:(n,f)=>{if(MB.h)MB.h.btn.push({n:String(n),f});},
  on_switch:(n,pos,f)=>{if(typeof pos==='function'){f=pos;pos='any';}if(MB.h)MB.h.sw.push({n:String(n),pos:String(pos||'any').toLowerCase(),f});},
  fly:(y,t,r,p)=>{AP.drive={lx:clamp((+y||0)/100,-1,1),ly:clamp((+t||0)/100,-1,1),rx:clamp((+r||0)/100,-1,1),ry:clamp((+p||0)/100,-1,1),t:performance.now()};},
  stick:n=>{const L=AP.lastInp||rawIn,k={yaw:'lx',throttle:'ly',roll:'rx',pitch:'ry'}[String(n).toLowerCase()]||n;return Math.round((L[k]||0)*100);},
  button:n=>{const a=mbIn()[String(n)];return !!(a&&a.on);},
  switch_pos:n=>{const a=mbIn()[String(n)];return a?a.pos:'up';},
  knob:n=>{const I=mbIn(),a=I[String(n)]||I[String(n)+' knob'];return Math.round((a?a.v:0)*100);},
  pause:ms=>apSleep((+ms||0)/1000),
  show:t=>droneAPI.say(t)});
function mbOpts(t){return function(){const N=mbNames()[t],all=mbAll(t),rest=all.filter(n=>!N.includes(n)),L=N.map(n=>[n,n]);const cur=this&&this.getValue?this.getValue():null;
  rest.forEach(n=>L.push([n+(L.length&&(t==='bt'||t==='sw')?' (other remote)':''),n]));if(cur&&!all.includes(cur))L.unshift([cur,cur]);return L.length?L:[['Ⓐ','Ⓐ']];};}
function mbDefine(){
  const BA='#1E90FF',IN='#D400D4',DRN='#FF8C1A',dd=(name,t)=>({type:'field_dropdown',name,options:mbOpts(t)}),POS=[['⬆ up','up'],['⏺ middle','middle'],['⬇ down','down']];
  try{Blockly.Extensions.register('mb_hat',function(){this.hat='cap';});}catch(e){}
  Blockly.defineBlocksWithJsonArray([
    {type:'mb_start',message0:'on start %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:BA,extensions:['mb_hat'],tooltip:'Runs once when you press ▶ RUN'},
    {type:'mb_forever',message0:'forever %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:BA,extensions:['mb_hat'],tooltip:'Runs over and over until you press ⏹ STOP'},
    {type:'mb_onbtn',message0:'on button %1 pressed %2 %3',args0:[dd('N','bt'),{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:IN,extensions:['mb_hat'],tooltip:'Runs when you press this button on your remote (or the on-screen Ⓐ Ⓑ)'},
    {type:'mb_onsw',message0:'on switch %1 moved %2 %3 %4',args0:[dd('N','sw'),{type:'field_dropdown',name:'P',options:POS.concat([['any way','any']])},{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:IN,extensions:['mb_hat'],tooltip:'Runs when you flick this switch on your remote'},
    {type:'mb_btnis',message0:'button %1 is pressed',args0:[dd('N','bt')],output:'Boolean',colour:IN},
    {type:'mb_swis',message0:'switch %1 is %2',args0:[dd('N','sw'),{type:'field_dropdown',name:'P',options:POS}],output:'Boolean',colour:IN},
    {type:'mb_stick',message0:'stick %1',args0:[{type:'field_dropdown',name:'S',options:[['🔄 yaw (left ↔)','yaw'],['⏫ throttle (left ↕)','throttle'],['↔ roll (right ↔)','roll'],['↕ pitch (right ↕)','pitch']]}],output:'Number',colour:IN,tooltip:'−100 … 100'},
    {type:'mb_knob',message0:'knob %1',args0:[dd('N','kn')],output:'Number',colour:IN,tooltip:'−100 … 100'},
    {type:'mb_fly',message0:'🕹 fly with  yaw %1 throttle %2 roll %3 pitch %4',args0:[{type:'input_value',name:'Y',check:'Number'},{type:'input_value',name:'T',check:'Number'},{type:'input_value',name:'R',check:'Number'},{type:'input_value',name:'P',check:'Number'}],inputsInline:false,previousStatement:null,nextStatement:null,colour:DRN,tooltip:'Moves the sticks for you, −100 … 100 each'},
    {type:'mb_pause',message0:'pause (ms) %1',args0:[{type:'input_value',name:'N',check:'Number'}],inputsInline:true,previousStatement:null,nextStatement:null,colour:BA},
    {type:'mb_show',message0:'show string %1',args0:[{type:'input_value',name:'T'}],inputsInline:true,previousStatement:null,nextStatement:null,colour:BA}]);
  const G=Blockly.JavaScript,num=(b,n,d)=>G.valueToCode(b,n,G.ORDER_NONE)||String(d),q=s=>JSON.stringify(String(s)),body=b=>G.statementToCode(b,'DO');
  G.forBlock.mb_start=b=>'on_start(async () => {\n'+body(b)+'});\n';
  G.forBlock.mb_forever=b=>'forever(async () => {\n'+body(b)+'});\n';
  G.forBlock.mb_onbtn=b=>'on_button('+q(b.getFieldValue('N'))+', async () => {\n'+body(b)+'});\n';
  G.forBlock.mb_onsw=b=>'on_switch('+q(b.getFieldValue('N'))+', '+q(b.getFieldValue('P'))+', async () => {\n'+body(b)+'});\n';
  G.forBlock.mb_btnis=b=>['button('+q(b.getFieldValue('N'))+')',G.ORDER_FUNCTION_CALL];
  G.forBlock.mb_swis=b=>['(switch_pos('+q(b.getFieldValue('N'))+') == '+q(b.getFieldValue('P'))+')',G.ORDER_EQUALITY];
  G.forBlock.mb_stick=b=>['stick('+q(b.getFieldValue('S'))+')',G.ORDER_FUNCTION_CALL];
  G.forBlock.mb_knob=b=>['knob('+q(b.getFieldValue('N'))+')',G.ORDER_FUNCTION_CALL];
  G.forBlock.mb_fly=b=>'fly('+num(b,'Y',0)+', '+num(b,'T',0)+', '+num(b,'R',0)+', '+num(b,'P',0)+');\n';
  G.forBlock.mb_pause=b=>'await pause('+num(b,'N',100)+');\n';
  G.forBlock.mb_show=b=>'show('+(G.valueToCode(b,'T',G.ORDER_NONE)||'""')+');\n';
}
function mbToolbox(){const old=BL_TOOLBOX.contents,cat=(n,nm,col)=>Object.assign({},old.find(c=>c.name===n)||{kind:'category',contents:[]},{name:nm,colour:col}),bk=(type,x)=>Object.assign({kind:'block',type},x||{});
  const stk=s=>({shadow:{type:'math_number',fields:{NUM:0}},block:{type:'mb_stick',fields:{S:s}}}),fly=cat('🚁 Fly','Drone','#FF8C1A');
  fly.contents=[bk('mb_fly',{inputs:{Y:stk('yaw'),T:stk('throttle'),R:stk('roll'),P:stk('pitch')}}),bk('mb_fly',{inputs:{Y:shadowN(0),T:shadowN(30),R:shadowN(0),P:shadowN(50)}})].concat(fly.contents);
  const sens=(old.find(c=>c.name==='👀 Sensors')||{contents:[]}).contents;
  return{kind:'categoryToolbox',contents:[
    {kind:'category',name:'Basic',colour:'#1E90FF',contents:[bk('mb_start'),bk('mb_forever'),bk('mb_show',{inputs:{T:{shadow:{type:'text',fields:{TEXT:'Hello!'}}}}}),bk('mb_pause',{inputs:{N:shadowN(100)}})]},
    {kind:'category',name:'Input',colour:'#D400D4',contents:[bk('mb_onbtn'),bk('mb_onsw'),bk('mb_btnis'),bk('mb_swis'),bk('mb_stick',{fields:{S:'yaw'}}),bk('mb_stick',{fields:{S:'throttle'}}),bk('mb_stick',{fields:{S:'roll'}}),bk('mb_stick',{fields:{S:'pitch'}}),bk('mb_knob')].concat(sens)},
    fly,cat('💡 Lights & sound','Lights & Music','#E63022'),cat('🔁 Loops','Loops','#00AA00'),cat('❓ Logic','Logic','#00A4A6'),cat('📦 Variables','Variables','#DC143C'),cat('🔢 Math','Math','#9400D3'),cat('🔤 Text','Text','#B8860B'),cat('🧱 My blocks','Functions','#3455DB')]};}
function mbPresetJson(){const k=mbKind(),stk=s=>({shadow:{type:'math_number',fields:{NUM:0}},block:{type:'mb_stick',fields:{S:s}}}),txt=t=>({shadow:{type:'text',fields:{TEXT:t}}});
  const B=[{type:'mb_start',x:20,y:20,inputs:{DO:{block:{type:'mb_show',inputs:{T:txt('🎮 Sticks are in charge!')},next:{block:{type:'d_lmode',fields:{M:'rainbow'}}}}}}},
    {type:'mb_forever',x:20,y:160,inputs:{DO:{block:{type:'mb_fly',inputs:{Y:stk('yaw'),T:stk('throttle'),R:stk('roll'),P:stk('pitch')}}}}},
    {type:'mb_onbtn',x:20,y:300,fields:{N:'Ⓐ'},inputs:{DO:{block:{type:'d_photo'}}}},
    {type:'mb_onbtn',x:20,y:400,fields:{N:'Ⓑ'},inputs:{DO:{block:{type:'d_flip',fields:{D:'front'}}}}},
    {type:'mb_onsw',x:20,y:500,fields:{N:k==='dji'?'Flight mode C/N/S':'A',P:'down'},inputs:{DO:{block:{type:'d_flip',fields:{D:'back'}}}}},
    {type:'mb_onsw',x:20,y:600,fields:{N:k==='dji'?'Flight mode C/N/S':'A',P:'up'},inputs:{DO:{block:{type:'d_beep',next:{block:{type:'d_lights',fields:{C:'#33ff66'}}}}}}}];
  if(k==='pad')B.push({type:'mb_onbtn',x:20,y:700,fields:{N:'Y'},inputs:{DO:{block:{type:'d_flip',fields:{D:'left'}}}}});
  if(k==='rc')B.push({type:'mb_onbtn',x:20,y:700,fields:{N:'I'},inputs:{DO:{block:{type:'d_home'}}}});
  return{blocks:{languageVersion:0,blocks:B}};}
function mbPreset(quiet){if(!BL.ws){progTab('blocks');let n=0;const iv=setInterval(()=>{if(BL.ws||++n>100){clearInterval(iv);if(BL.ws)mbPreset(true);}},100);return;}
  if(!quiet&&BL.ws.getAllBlocks(false).length>1&&!confirm('Swap your blocks for the 🎮 sticks preset? (💾 save yours first if you want to keep them)'))return;
  BL.ws.clear();Blockly.serialization.workspaces.load(mbPresetJson(),BL.ws);PROG.mbv=1;progSave();if(PROG.tab!=='blocks')progTab('blocks');toast('🎮 Sticks preset loaded — ▶ RUN, then fly with your sticks (switch A / Ⓐ Ⓑ do tricks)',3200);}
function mbFirstOpen(){const ws=BL.ws,top=ws.getTopBlocks(false);
  if(!top.length||(!PROG.mbv&&top.length===1&&top[0].type==='d_takeoff')){ws.clear();Blockly.serialization.workspaces.load(mbPresetJson(),ws);}
  else if(!PROG.mbv)setTimeout(()=>toast('🎮 New: micro:bit style blocks (Basic + Input) — press 🎮 Sticks preset to try it',3600),400);
  PROG.mbv=1;}
// 🎓 teach the program which button/axis each InterLink switch is (only needed for switches the game can't guess)
function mbTeach(){let el=$('mbTeach');if(!el){el=document.createElement('div');el.id='mbTeach';el.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:80;background:#14201a;border:2px solid #D400D4;border-radius:14px;padding:14px;color:#fff;font:14px system-ui,sans-serif;max-width:92vw;max-height:84vh;overflow:auto';el.addEventListener('pointerdown',e=>e.stopPropagation());document.body.appendChild(el);}
  const k=mbKind(),draw=msg=>{const names=MB_RC_SW.concat(MB_RC_BT,['R knob']);
    el.innerHTML='<b style="font-size:17px">🎓 Teach your switches</b><div style="opacity:.8;margin:6px 0 10px">'+(k==='rc'?'Tap a name, then flick that switch through all its positions (or press the button / turn the knob).':k==='none'?'Plug in your InterLink / controller and move a stick first.':k==='dji'?'Your DJI remote already works — its buttons are Photo, Mode, Home, Fn and the C/N/S switch.':'Game pads already work — buttons A B X Y LB RB LT RT, D-pad…')+'</div>'+
      (msg?'<div style="color:#ffd60a;margin-bottom:8px">'+msg+'</div>':'')+(k==='rc'?'<div style="display:flex;flex-wrap:wrap;gap:6px">'+names.map(n=>{const m=MB.map[n]||MB_RC_DEF[n];return'<button class="btn" data-n="'+n+'">'+n+' <small style="opacity:.7">'+(m?(m.a!=null?'axis '+m.a:'btn '+m.b.join('+')):'?')+'</small></button>';}).join('')+'</div>':'')+
      '<div style="margin-top:10px;display:flex;gap:6px"><button class="btn" data-x="test">👀 Show live</button><button class="btn" data-x="reset">↺ Defaults</button><button class="btn" data-x="close">✕ Done</button></div><div id="mbLive" style="font:12px ui-monospace,monospace;margin-top:8px;white-space:pre-wrap"></div>';
    el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>learn(b.dataset.n));
    el.querySelector('[data-x=close]').onclick=()=>{clearInterval(mbTeach.lv);el.remove();};el.querySelector('[data-x=reset]').onclick=()=>{MB.map={};LS.set('mbmap',MB.map);draw('↺ Back to the defaults');};
    el.querySelector('[data-x=test]').onclick=()=>{clearInterval(mbTeach.lv);mbTeach.lv=setInterval(()=>{const L=$('mbLive');if(!L){clearInterval(mbTeach.lv);return;}const I=mbIn();L.textContent=Object.keys(I).map(n=>n+': '+(n.indexOf('knob')>=0||n==='Wheel'?Math.round(I[n].v*100):I[n].pos)).join('   ');},120);};};
  const learn=n=>{const gp=mbGp();if(!gp){draw('No controller found — move a stick first');return;}const s0={b:gp.buttons.map(x=>x.pressed?1:0),a:[...gp.axes]};const m=RCMAP&&RCMAP.id===gp.id?RCMAP:rcDefault(gp),stickAx=new Set(Object.values(m.ax||{}).map(q=>q[0]));
    const changed=[],amax={};draw('⏳ Now flick / press <b>'+n+'</b> (3 seconds)…');const t0=performance.now();
    const iv=setInterval(()=>{const g=mbGp();if(!g)return;g.buttons.forEach((x,i)=>{const v=x.pressed?1:0;if(v!==s0.b[i]&&!changed.includes(i))changed.push(i);});g.axes.forEach((v,i)=>{if(stickAx.has(i))return;const d=Math.abs(v-(s0.a[i]||0));if(d>(amax[i]||0))amax[i]=d;});
      if(performance.now()-t0>3000){clearInterval(iv);let best=-1,bd=0.5;for(const i in amax)if(amax[i]>bd){bd=amax[i];best=+i;}
        if(changed.length){MB.map[n]={b:changed.slice(0,2).sort((a,b)=>a-b)};}else if(best>=0)MB.map[n]={a:best};else{draw('Didn\'t see anything move for '+n+' — try again');return;}
        LS.set('mbmap',MB.map);draw('✅ '+n+' = '+(MB.map[n].a!=null?'axis '+MB.map[n].a:'button '+MB.map[n].b.join(' + ')));}},30);};
  draw('');}

// ---------------- 🧪 COMBO builds: props hover, rockets + jets BOOST (hold Shift / 🚀), wheels drive on the ground, water props drive on the pond, wings glide
const CB={held:false,act:false,btn:false,u:0,fuel:1,bv:new V3(),wv:0};const _cf=new V3(),_cn=new V3();
function comboDesc(st){const I=st.info||{},L=['🚁 hovers'];if(I.rFwd>0||I.rUp>0)L.push('🚀 boost');if(I.wheels&&I.wheels.length>=2)L.push('🛞 drives');if(I.wp>0)L.push('🚤 boats');if(I.wingA>0)L.push('🪽 glides');if(I.hov>0)L.push('🛸 hovers on pads');return L.join(' + ');}
function comboKinds(){const P=(SPEC.parts||[]);return{rocket:P.some(p=>p.t==='rocket'),jet:P.some(p=>p.t==='jet')};}
{const t0=tickDrone;tickDrone=function(dt,inp){const r=t0.apply(this,arguments);try{if(ST&&ST.combo&&DR)comboTick(dt,inp||{});else{CB.u=0;CB.bv.set(0,0,0);CB.wv=0;const b=$('boostB');if(b)b.style.display='none';}}catch(e){console.warn('combo',e);}return r;};}
function comboTick(dt,inp){const I=ST.info||{},W=Math.max(30,I.W||300),st=D.state,fx=-Math.sin(D.yaw),fz=-Math.cos(D.yaw);comboBtn();
  if(st==='tumble'||st==='down'){CB.u=0;CB.bv.set(0,0,0);CB.wv=0;return;}
  // 🚀 BOOST
  const hasR=I.rFwd>0||I.rUp>0,K=comboKinds();CB.held=CB.btn||CB.act||!!(keys.ShiftLeft||keys.ShiftRight);
  const can=hasR&&CB.held&&CB.fuel>0&&(st==='flying'||st==='takeoff'||st==='landed');
  if(can){CB.u=Math.min(1,CB.u+dt*3);if(K.rocket&&!K.jet)CB.fuel=Math.max(0,CB.fuel-dt/8);else D.batt=Math.max(0,D.batt-dt*1.5);if(CB.fuel<=0)toast('🚀 Out of rocket fuel — land to refuel',1800);}
  else CB.u=Math.max(0,CB.u-dt*2.5);
  if(st==='landed'&&!CB.held&&CB.fuel<1)CB.fuel=Math.min(1,CB.fuel+dt/4);
  const top=clamp(12+Math.max(0,I.rFwd)/W*26,12,120),upV=I.rUp>0?clamp(14+Math.max(0,I.rUp)/W*45,0,160):0;
  _cf.set(fx*top*CB.u,st==='landed'?0:upV*CB.u,fz*top*CB.u);CB.bv.lerp(_cf,Math.min(1,dt*(CB.u>0?2.2:1.2)));
  // 🛞 wheels on the ground / 🚤 water props on the pond (right stick: push = go, sideways = steer)
  const onWater=inWater(D.pos.x,D.pos.z),drive=st==='landed'&&((I.wheels&&I.wheels.length>=2&&!onWater)||(I.wp>0&&onWater));
  if(drive){const wTop=onWater?clamp(3+I.wp/W*14,3,14):clamp(ST.top*0.55,5,16);CB.wv+=(inp.ry*wTop-CB.wv)*Math.min(1,dt*(Math.abs(inp.ry)>0.05?1.6:2.5));
    D.yaw-=inp.rx*clamp(Math.abs(CB.wv)/3,0,1)*1.8*dt*(CB.wv<0?-1:1);if(DR.wheels)DR.wheels.forEach(w=>{w.g.rotation.x-=CB.wv*dt*6;});}
  else CB.wv*=Math.exp(-dt*3);
  // move (and crash into things like everything else)
  const vx=CB.bv.x+fx*CB.wv,vy=CB.bv.y,vz=CB.bv.z+fz*CB.wv,sp=Math.hypot(vx,vy,vz);
  if(sp>0.02){_cn.set(D.pos.x+vx*dt,D.pos.y+vy*dt,D.pos.z+vz*dt);
    if((st==='flying'||sp>6)&&hitTest(_cn,(ST.rad||0.3)*0.7)){const hit=hitTest(_cn,(ST.rad||0.3)*0.7);CB.bv.set(0,0,0);CB.wv=0;if(st==='landed'){D.armed=false;D.state='flying';}impact(sp+Math.hypot(D.vel.x,D.vel.z),hitName(hit));return;}
    D.pos.x=_cn.x;D.pos.z=_cn.z;if(st==='landed')D.pos.y=groundY(D.pos.x,D.pos.z);else D.pos.y=Math.max(_cn.y,groundY(D.pos.x,D.pos.z)+0.15);
    // a rocket car going fast enough off the ground takes off
    if(st==='landed'&&CB.u>0.6&&upV>2&&!D.lock){D.armed=true;D.state='flying';D.vel.y=1;}}
  // 🪽 wings: fast forward flight is cheaper on the battery (gliding)
  if(st==='flying'&&I.wingA>0){const hs=Math.hypot(D.vel.x,D.vel.z)+Math.hypot(CB.bv.x,CB.bv.z);D.batt=Math.min(100,D.batt+dt*100/(ST.mins*60)*0.45*clamp(hs/10,0,1));}}
function comboBtn(){const I=ST&&ST.info||{},show=!!(ST&&ST.combo&&(I.rFwd>0||I.rUp>0))&&started&&!menu.open&&!WS.open;let b=$('boostB');
  if(show&&!b){b=document.createElement('button');b.id='boostB';b.className='btn';b.textContent='🚀 BOOST';b.title='Hold to fire the rockets / jets (or hold Shift)';
    b.style.cssText='position:fixed;right:24px;bottom:240px;z-index:12;font:900 16px system-ui,sans-serif;padding:12px 14px;border-radius:14px;background:rgba(255,90,16,0.85);color:#fff;border:2px solid #ffd60a;touch-action:none';
    const up=()=>{CB.btn=false;};b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();CB.btn=true;};b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up;document.body.appendChild(b);}
  if(b){b.style.display=show?'block':'none';if(show){const f=comboKinds();b.textContent='🚀 BOOST'+(f.rocket&&!f.jet?' '+Math.round(CB.fuel*100)+'%':'');}}}

// ---------------- 🔓 ACRO: no self-levelling. Triple-tap 🏠 (button, H key, DJI home, or the InterLink switch you gave "fly home") to switch SAFE ↔ ACRO.
// In ACRO the sticks spin the drone (it stays tilted where you leave it), the left stick is power (middle = hover).
function acroToggle(){SPEC.assist=!SPEC.assist;D.aq=null;const pl=vkind()==='plane';beep(SPEC.assist?900:600,0.12,0.06);setTimeout(()=>beep(SPEC.assist?1300:400,0.15,0.06),120);
  toast(SPEC.assist?'🛡 SAFE mode ON — it levels itself again':'🔓 ACRO mode — no self-levelling! '+(pl?'':'Right stick spins it, left stick up/down = power (middle hovers). ')+'Triple-tap 🏠 for SAFE',3600);}
{const r0=rthPress;rthPress=function(){const now=performance.now(),T=rthPress;T.n=now-(T.t||0)<650?(T.n||0)+1:1;T.t=now;if(T.n>=3){T.n=0;rth=null;D.wantLand=false;acroToggle();return;}return r0.apply(this,arguments);};}
function acroOn(){return !SPEC.assist&&vkind()==='drone'&&!(typeof AP!=='undefined'&&AP.on)&&!rth&&!D.flip&&!D.flipQ&&!D.autoLand&&!D.wantLand&&D.state==='flying';}
const _aq=new THREE.Quaternion(),_ae=new THREE.Euler(0,0,0,'YXZ'),_au=new V3(),_ap=new V3();
{const t0=tickDrone;tickDrone=function(dt,inp){if(acroOn()&&DR){acroTick(dt,inp||{});try{if(ST&&ST.combo)comboTick(dt,inp||{});}catch(e){}return;}D.aq=null;return t0.apply(this,arguments);};}
function acroTick(dt,inp){const prev=_ap.copy(D.pos);
  if(!D.aq){D.aq=new THREE.Quaternion().setFromEuler(_ae.set(D.pitch,D.yaw,D.roll,'YXZ'));}
  if(D.dmg&&D.dmg.ant)inp=dmgRadio(inp,dt);
  let lx=inp.lx||0,ly=inp.ly||0,rx=inp.rx||0,ry=inp.ry||0;if(ST.elec&&!ST.elec.rx){lx=ly=rx=ry=0;}
  DR.props.forEach((P,i)=>{if(P.state!=='none')P.g.rotation.y+=60*dt*(i%2?1:-1);});
  const use=0.75+0.5*Math.min(1,Math.abs(ly)+Math.hypot(rx,ry)*0.6);D.batt=Math.max(0,D.batt-dt*100/(ST.mins*60)*use*CFG.drain/100);if(D.batt<=3){D.autoLand=true;toast('🔋 Battery empty — SAFE mode is landing it');}
  const ex=v=>v*(0.35+0.65*v*v),R=(ST.agile?4+ST.agile*0.35:6.5)*(RADIO&&RADIO.rate==='low'?0.55:1);
  _ae.set(-ex(ry)*R*dt,-ex(lx)*R*0.6*dt,-ex(rx)*R*dt,'YXZ');_aq.setFromEuler(_ae);D.aq.multiply(_aq).normalize();
  const chips=DR.props.filter(P=>P.state==='chip').length+(D.dmg&&D.dmg.motor?2:0);
  const tw=Math.max(1.2,ST.tw||2)*(1-0.12*chips),thr=9.8*(ly>=0?1+ly*(tw-1):1+ly),up=_au.set(0,1,0).applyQuaternion(D.aq);
  D.vel.addScaledVector(up,thr*dt);D.vel.y-=9.8*dt;
  const top=Math.max(8,(ST.top||15)*1.3),c=9.8*tw/(top*top),sp=D.vel.length();if(sp>0.01)D.vel.multiplyScalar(Math.max(0,1-c*sp*dt));
  D.vel.y-=D.vel.y*0.5*dt;D.vel.x+=wind.x*dt*0.25;D.vel.z+=wind.z*dt*0.25;
  D.pos.addScaledVector(D.vel,dt);
  {const lim=H(D.pos.x,D.pos.z)+CFG.maxH;if(D.pos.y>lim){D.pos.y=lim;if(D.vel.y>0)D.vel.y=0;}}
  _ae.setFromQuaternion(D.aq,'YXZ');D.pitch=_ae.x;D.yaw=_ae.y;D.roll=_ae.z;
  if(chips){D.wobT=(D.wobT||0)+dt;D.aq.multiply(_aq.setFromEuler(_ae.set(Math.cos(D.wobT*23)*0.004*chips,0,Math.sin(D.wobT*19)*0.005*chips,'YXZ')));}
  // ground: land gently when level + slow, otherwise it's a crash
  const gy=groundY(D.pos.x,D.pos.z);
  if(D.pos.y<gy){const v=D.vel.length();D.pos.y=gy;if(up.y>0.75&&v<3.2){D.state='landed';D.vel.set(0,0,0);D.pitch=D.roll=0;D.aq=null;beep(500,0.08,0.04);}else{D.vel.y=Math.abs(D.vel.y)*0.2;impact(Math.max(v,up.y<0.3?9:v),'the ground');}tickCourse(dt,prev,D.pos);return;}
  if(!floats()&&inWater(D.pos.x,D.pos.z)&&D.pos.y<WATER_Y+ST.legs){D.wet=true;D.armed=false;D.state='tumble';D.spinV.set(0,0,0);D.fall.set(D.pitch,D.yaw,D.roll,'YXZ');D.vel.set(0,-0.5,0);toast('💦 Splash! It went in the pond');return;}
  const hit=hitTest(D.pos,ST.rad);if(hit){const v=D.vel.length();D.pos.copy(prev);if(hitTest(D.pos,ST.rad))D.pos.y+=0.08;D.vel.multiplyScalar(-0.3);impact(v,hitName(hit));if(D.state!=='flying'){D.aq=null;return;}}
  tickCourse(dt,prev,D.pos);}
