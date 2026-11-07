// ---------------------------------------------------------------- 👥 multiplayer (through the DJI Phone Link program). EVERYTHING is shared:
//  what you fly (the exact model, colours, parts, guns), exactly where and how it's tilted, crashes + broken props, paint on it,
//  every shot, explosions + knocked-down trees, balloons, placed things, chat, and the world settings (weather, wind, time, real-world, weapons).
//  Your own flight settings (speed, sticks, camera) stay yours.
const mp={ws:null,id:Math.random().toString(36).slice(2,8),peers:{},addr:LS.get('mpAddr',''),t:0,lastSpec:0,want:true,seq:0,seen:new Set(),seenQ:[],specKey:'',applying:false,wKey:'',wT:0,race:LS.get('mpRace',true),hello:0};
let WORLD_TS=LS.get('worldTs',0);
const r2=v=>Math.round(v*100)/100,r4=v=>Math.round(v*10000)/10000;
function hashStr(s){let h=5381;for(let i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))|0;return(h>>>0).toString(36);}
function mpUrl(addr){if(!addr&&!location.host)addr='localhost:8765';if(!addr)return(location.protocol==='https:'?'wss://':'ws://')+location.host+'/mp';addr=addr.replace(/^https?:\/\//,'').replace(/\/.*$/,'');if(!/:\d+$/.test(addr))addr+=':8765';return'ws://'+addr+'/mp';}
function mpOpen(){return !!(mp.ws&&mp.ws.readyState===1);}
function mpSend(m){if(!mpOpen())return false;m.id=mp.id;m.q=++mp.seq;if(!m.n)m.n=CFG.name;try{mp.ws.send(JSON.stringify(m));return true;}catch(e){return false;}}
function mpConnect(addr){
  if(mp.ws){const o=mp.ws;mp.ws=null;try{o.close();}catch(e){}}if(addr===null)return;
  let w;try{w=new WebSocket(mpUrl(addr));}catch(e){toast('👥 Couldn\'t connect');return;}mp.ws=w;mp.addr=addr;
  w.onopen=()=>{toast(addr?'🔗 Joined the game at '+addr+'!':'🏠 Hosting'+(mpCode()?' — game code '+mpCode():''),3000);mpHello();};
  w.onerror=()=>{if(addr)toast('🔗 Couldn\'t reach '+addr+' — is DJI Phone Link running there, same Wi-Fi, firewall allowed?',5000);};
  w.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch(x){return;}try{mpRecv(m);}catch(err){console.warn('mp',err);}};
  w.onclose=()=>{if(mp.ws===w){mp.ws=null;Object.keys(mp.peers).forEach(id=>mpDrop(id));setTimeout(()=>{if(!mp.ws&&mp.want)mpConnect(mp.addr);},4000);}};
}
// a new pilot (or we just joined): tell them everything about us and our world
function mpHello(){mp.hello=performance.now();mp.specKey='';mpSendSpec(true);mpSendNow();
  mpSend({t:'w',w:worldState(),ts:WORLD_TS});if(OBJS.length)mpSend({t:'objs',list:OBJS});if(CRATERS.length)mpSend({t:'craters',list:CRATERS.slice(-60)});
  const popped=balloons.map((b,i)=>b.alive?-1:i).filter(i=>i>=0);if(popped.length)mpSend({t:'pops',list:popped});}
function mpDrop(id,said){const pe=mp.peers[id];if(!pe)return;if(pe.mesh)scene.remove(pe.mesh.g);if(pe.tag)scene.remove(pe.tag);if(pe.pilot)scene.remove(pe.pilot);delete mp.peers[id];if(said)chatSys('👋 '+pe.name+' left');}
function mpRecv(m){
  if(!m||m.id===mp.id)return;
  if(m.q){const key=m.id+':'+m.q;if(mp.seen.has(key))return;mp.seen.add(key);mp.seenQ.push(key);if(mp.seenQ.length>1500)mp.seen.delete(mp.seenQ.shift());}
  if(m.t==='bye'){mpDrop(m.id,true);return;}
  let pe=mp.peers[m.id];
  if(!pe){pe=mp.peers[m.id]={id:m.id,name:m.n||'Pilot',p:new V3(),tp:new V3(),v:new V3(),q:new THREE.Quaternion(),tq:new THREE.Quaternion(),last:0,rt:0,rad:0.5,st:'landed',sp:0,ramT:0,pr:'',ab:'',fresh:true};
    chatSys('👥 '+(m.n||'Someone')+' joined');if(performance.now()-mp.hello>1500)mpHello();}
  pe.last=performance.now();if(m.n&&m.n!==pe.name){pe.name=m.n;if(pe.tag){scene.remove(pe.tag);pe.tag=null;}}
  const H_=MPH[m.t];if(H_)H_(m,pe);
}
const MPH={
  s(m,pe){if(m.p){pe.tp.set(m.p[0],m.p[1],m.p[2]);if(pe.fresh){pe.p.copy(pe.tp);}}if(m.r){pe.tq.set(m.r[0],m.r[1],m.r[2],m.r[3]);if(pe.fresh)pe.q.copy(pe.tq);}pe.fresh=false;
    if(m.v)pe.v.set(m.v[0],m.v[1],m.v[2]);pe.rt=performance.now();pe.st=m.st||'flying';pe.armed=!!m.a;pe.sp=+m.sp||0;pe.c=m.c;pe.cp=m.cp;pe.hd=!!m.hd;pe.wk=m.wk||null;pe.pl=m.pl||null;pe.walking=!!m.wk;
    if(pe.mesh&&m.pr!=null&&m.pr!==pe.pr){pe.pr=m.pr;const L={o:'ok',c:'chip',b:'broken',n:'none',l:'loose'};pe.mesh.props.forEach((P,i)=>{const s=L[m.pr[i]]||'ok';if(P.state!==s)setPropState(P,s);});}
    if(pe.mesh&&m.ab!=null&&m.ab!==pe.ab){pe.ab=m.ab;pe.mesh.arms.forEach((A,i)=>{A.g.rotation.x=m.ab[i]==='1'?-0.45:0;});}},
  sp(m,pe){if(!m.spec)return;const j=JSON.stringify(m.spec);pe.rad=+m.rad||0.5;pe.col=m.col||pe.col;pe.kind=m.spec.kind||m.spec.flyAs||'drone';if(j===pe.specJ&&pe.mesh)return;pe.specJ=j;
    if(pe.mesh)scene.remove(pe.mesh.g);let sp;try{sp=sanitize(m.spec);}catch(e){sp=sanitize(PRESETS.mini);}pe.spec=sp;pe.mesh=buildDrone(sp,{peer:true});pe.mesh.g.rotation.order='YXZ';scene.add(pe.mesh.g);pe.pr='';pe.ab='';
    pe.mesh.g.position.copy(pe.p);pe.mesh.g.quaternion.copy(pe.q);if(pe.tag){scene.remove(pe.tag);pe.tag=null;}if(typeof needModels==='function')needModels(sp,m.id);},
  w(m,pe){const mine=JSON.stringify(worldState()),theirs=JSON.stringify(m.w);if(mine===theirs){WORLD_TS=Math.max(WORLD_TS,m.ts||0);return;}
    if((m.ts||0)>WORLD_TS||((m.ts||0)===WORLD_TS&&m.id<mp.id)){const before=worldState();applyWorld(m.w);WORLD_TS=m.ts||0;LS.set('worldTs',WORLD_TS);mp.wKey=JSON.stringify(worldState());
      const what=worldDiff(before,worldState());if(what&&(m.ts||0)>0&&performance.now()-mp.hello>2500)chatSys('🌐 '+pe.name+' changed '+what);}},
  chat(m,pe){chatAdd(pe.name,m.txt,pe.col);},
  shot(m,pe){spawnShot(m.w,new V3().fromArray(m.p),new V3().fromArray(m.v),m.col,false,m.sid,m.id);},
  hit(m,pe){if(m.to===mp.id)gotHit(m,pe);else{const t=mp.peers[m.to];if(t&&t.mesh&&m.w==='paint'&&m.lp)paintOn(t.mesh,new V3().fromArray(m.lp),m.col);}},
  boom(m,pe){const s=shots.find(x=>x.sid===m.sid);if(s)killShot(s);explode(new V3().fromArray(m.p),m.r,m.dr,false,pe.name,m.id);},
  ram(m,pe){if(m.to===mp.id&&performance.now()-pe.ramT>1500){pe.ramT=performance.now();crashInto(pe,m.v);}},
  pop(m){const b=balloons[m.i];if(b)popBalloon(b,true);},
  pops(m){(m.list||[]).forEach(i=>{const b=balloons[i];if(b&&b.alive)popBalloon(b,true);});},
  obj(m){if(m.op==='add'&&m.o)objAdd(m.o,true);else if(m.op==='del')objDel(m.oid,true);else if(m.op==='clear')objClear(true);},
  objs(m){(m.list||[]).forEach(o=>{if(!OBJS.some(x=>x.id===o.id))objAdd(o,true);});},
  craters(m){(m.list||[]).forEach(c=>{if(!CRATERS.some(x=>Math.abs(x.x-c.x)<0.5&&Math.abs(x.z-c.z)<0.5))addCrater(c,false);});},
  race(m,pe){if(!mp.race)return;const C=courses[m.k];if(!C||!(C.kinds||['drone','heli']).includes(vkind()))return;if(cRun&&course&&course.key===m.k)return;startCourse(m.k,true);toast('🏁 '+pe.name+' started '+C.name+' — race!',2500);},
  mreq(m){if(typeof sendModel==='function')sendModel(m.mid);},
  mdl(m){if(typeof gotModel==='function')gotModel(m);},
};
function spinRate(){if(!DR)return 0;const k=vkind();if(D.state==='tumble'||D.state==='down')return 0;if(k==='plane')return D.thr*80+(D.armed?4:0);if(k==='car')return 0;if(k==='boat')return 8;return D.state==='flying'||D.state==='takeoff'||(D.state==='landed'&&D.armed)?60:0;}
function mpSendSpec(force){if(!mpOpen())return;const j=JSON.stringify(SPEC),k=j.length+':'+hashStr(j);if(!force&&k===mp.specKey&&performance.now()-mp.lastSpec<6000)return;mp.specKey=k;mp.lastSpec=performance.now();
  mpSend({t:'sp',spec:SPEC,rad:+ST.rad.toFixed(2),col:(SPEC.colors&&SPEC.colors.body)||'#ffd60a'});}
function mpSendNow(spec){if(!mpOpen()||!DR)return;if(spec)mpSendSpec(true);const g=DR.g,q=g.quaternion;
  const m={t:'s',p:[r2(g.position.x),r2(g.position.y),r2(g.position.z)],r:[r4(q.x),r4(q.y),r4(q.z),r4(q.w)],v:[r2(D.vel.x),r2(D.vel.y),r2(D.vel.z)],st:D.state,a:D.armed?1:0,sp:Math.round(spinRate()),c:course?course.key:'',cp:cpI,
    pr:DR.props.map(P=>P.state[0]).join(''),ab:DR.arms.map(A=>A.state==='bent'?1:0).join(''),hd:D.hidden?1:0};
  if(typeof WALK!=='undefined'&&WALK.on)m.wk=[r2(WALK.pos.x),r2(WALK.pos.y),r2(WALK.pos.z),r2(WALK.yaw)];else m.pl=[r2(D.home.x),r2(H(D.home.x,D.home.z)),r2(D.home.z)];
  mpSend(m);}
const _mq=new THREE.Quaternion();
function tickMP(dt){
  mp.t-=dt;if(mp.t<=0){mp.t=0.05;mpSendNow();mpSendSpec(false);}
  mp.wT-=dt;if(mp.wT<=0){mp.wT=0.5;const k=JSON.stringify(worldState());if(k!==mp.wKey){if(mp.wKey&&!mp.applying){WORLD_TS=Date.now();LS.set('worldTs',WORLD_TS);mpSend({t:'w',w:worldState(),ts:WORLD_TS});}mp.wKey=k;}}
  const now=performance.now(),t=now/1000;
  for(const id in mp.peers){const pe=mp.peers[id];if(now-pe.last>8000){mpDrop(id,true);continue;}if(!pe.mesh)continue;
    const age=Math.min(0.25,(now-pe.rt)/1000),fly=pe.st==='flying'||pe.st==='takeoff'||pe.st==='tumble';
    _p.copy(pe.tp);if(fly)_p.addScaledVector(pe.v,age);if(pe.p.distanceTo(_p)>25)pe.p.copy(_p);else pe.p.lerp(_p,1-Math.exp(-dt*14));
    pe.q.slerp(pe.tq,1-Math.exp(-dt*16));
    const g=pe.mesh.g;g.position.copy(pe.p);g.quaternion.copy(pe.q);g.visible=!pe.hd;
    pe.mesh.props.forEach((P,k)=>{if(P.state!=='none')P.g.rotation.y+=pe.sp*dt*(k%2?1:-1);});tickFx(pe.mesh,t);
    if(!pe.tag)pe.tag=label(pe.name,0,0,0,2.2,'rgba(0,0,0,0.6)');pe.tag.position.set(pe.p.x,pe.p.y+Math.max(1.1,pe.rad*1.6),pe.p.z);
    // their pilot standing (or walking) on the ground
    const pl=pe.wk||pe.pl;if(pl){if(!pe.pilot){pe.pilot=makePilot(pe.col||'#0a84ff');scene.add(pe.pilot);}pe.pilot.visible=true;pe.pilot.position.set(pl[0],H(pl[0],pl[2]),pl[2]);pe.pilot.rotation.y=pe.wk?pe.wk[3]:Math.atan2(pe.p.x-pl[0],pe.p.z-pl[2])+Math.PI;}else if(pe.pilot)pe.pilot.visible=false;
    // bump into each other: both crash
    if(DR&&(D.state==='flying'||D.state==='takeoff')&&(pe.st==='flying'||pe.st==='takeoff'||pe.st==='tumble'||pe.st==='landed'||pe.st==='down')&&now-pe.ramT>1500){
      const d=D.pos.distanceTo(pe.p),rr=ST.rad*0.85+pe.rad*0.85;if(d<rr){const rel=_v.copy(D.vel).sub(pe.v).length();pe.ramT=now;crashInto(pe,rel);mpSend({t:'ram',to:id,v:+rel.toFixed(2)});}}
  }
}
// we flew into someone (or they flew into us)
function crashInto(pe,rel){
  const nm=pe.name+'\'s '+(KINDS[pe.kind]?KINDS[pe.kind].n.toLowerCase():'aircraft');
  if(D.state!=='flying'&&D.state!=='takeoff'&&D.state!=='landed')return;
  const away=_w.copy(D.pos).sub(pe.p);away.y=Math.max(0.2,away.y);away.normalize();
  if(rel<1.6){D.vel.addScaledVector(away,2);bump();toast('💥 Bumped into '+nm,1200);return;}
  D.vel.copy(away.multiplyScalar(Math.max(1.5,rel*0.5)));
  if(DR.props.length){const L=DR.props.filter(P=>P.state!=='broken');L.slice(0,Math.max(1,Math.ceil(L.length/2))).forEach(P=>setPropState(P,'broken'));}
  if(D.state==='landed'){D.state='flying';}
  fall(nm);shake=0.8;beep(120,0.4,0.15);
}
function mpCode(){const ip=window._relayInfo&&window._relayInfo.ip;return ip?ip.split('.').pop():null;}
function mpHost(){
  const go=()=>{mp.want=true;LS.set('mpAddr','');mp.addr='';mpConnect('');mp.hosting=true;const ip=window._relayInfo&&window._relayInfo.ip;
    toast(ip?'🏠 You\'re the HOST! Tell your friend: JOIN, game code '+mpCode()+'   (address '+ip+')':'🏠 Hosting — friends JOIN with this computer\'s address',6000);};
  fetch((location.host?'':'http://localhost:8765')+'/dji-info?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.ok){window._relayInfo=j;go();}else throw 0;})
    .catch(()=>toast('🏠 To host, start "DJI Phone Link" on this computer first (it\'s the host program) — then press HOST again',6000));}
function mpJoin(){const pre=window._relayInfo&&window._relayInfo.ip?window._relayInfo.ip.split('.').slice(0,3).join('.')+'.':null;
  const a=prompt(pre?'Type the GAME CODE from the host (a number like 23)\n— or the full address like 192.168.1.23':'Type the HOST computer\'s address (like 192.168.1.23)\n— it\'s shown on the host\'s screen and in its black window',LS.get('mpAddr','')||'');
  if(!a)return;let ad=a.trim();if(/^\d{1,3}$/.test(ad)){if(!pre){toast('Type the full address (like 192.168.1.'+ad+')',3000);return;}ad=pre+ad;}
  mp.want=true;mp.hosting=false;LS.set('mpAddr',ad);mpConnect(ad);toast('🔗 Joining '+ad+'…',2000);}
function mpItems(){return[
  mInfo(()=>mpOpen()?'✅ '+(mp.addr?'In the game at '+mp.addr:'Connected'+(mpCode()?' · game code '+mpCode():''))+' · '+(Object.keys(mp.peers).length+1)+' playing: you'+Object.values(mp.peers).map(p=>', '+p.name).join(''):'Not in a game yet'),
  mInfo(()=>window._relayInfo&&window._relayInfo.links?'🔗 Linked automatically to '+window._relayInfo.links+' other computer'+(window._relayInfo.links>1?'s':'')+' on this Wi-Fi — everyone is in the same game':'Computers running DJI Phone Link on the same Wi-Fi find each other by themselves.'),
  mItem('🏠 HOST a game (this computer)',()=>mpHost()),
  mItem('🔗 JOIN a game (type the game code)',()=>mpJoin()),
  mInfo(()=>mp.addr?'You joined someone else\'s game. To host instead, press HOST.':mpCode()?'Friends on the same Wi-Fi: JOIN and type '+mpCode()+'  (or open http://'+window._relayInfo.ip+':'+(window._relayInfo.port||8765)+' on a phone)':'Hosting needs the DJI Phone Link program running on the host computer. Joining works from any browser.'),
  mItem('💬 Chat (or press Enter)',()=>{menuToggle(false);chatOpen();}),
  mItem(()=>'🏁 Race together: '+(mp.race?'ON — when anyone starts a race, everyone races':'off'),()=>{mp.race=!mp.race;LS.set('mpRace',mp.race);}),
  mItem(()=>'🎮 Use the DJI remote on this device: '+(CFG.useRemote===false?'off (touch / keys / controller)':'ON'),()=>{CFG.useRemote=CFG.useRemote===false;saveCfg();if(CFG.useRemote===false){try{ws&&ws.close();}catch(e){}dji.on=false;toast('🎮 This device ignores the remote — your friend can have it');}else{connectWifi();toast('🎮 Using the remote');}}),
  mItem(()=>'✏️ Your name: '+CFG.name,()=>{const n=prompt('Your pilot name',CFG.name);if(n){CFG.name=n.slice(0,16);saveCfg();mpSendNow(true);}}),
  mInfo('Shared with everyone: weather, wind, time of day, 🌍 real-world mode, weapon settings, placed things, explosions, balloons. Yours only: what you fly, speed, sticks, camera.'),
  mItem('🔌 Leave the game',()=>{mp.want=false;mp.hosting=false;mpSend({t:'bye'});mpConnect(null);Object.keys(mp.peers).forEach(id=>mpDrop(id));toast('👥 Left');}),
  mItem('◀ Back',()=>menuBack()),
];}
addEventListener('beforeunload',()=>{try{mpSend({t:'bye'});}catch(e){}});
// ---- shared world settings
function worldState(){return{wx:{mode:WX.W.mode,amount:WX.W.amount,wind:WX.W.wind,windDir:+(+WX.W.windDir||0).toFixed(2)},tod:CFG.tod,real:CFG.real!==false,wpn:Object.assign({},WPN)};}
function applyWorld(w){mp.applying=true;try{
  if(w.wx){if(w.wx.mode&&w.wx.mode!==WX.W.mode)WX.setMode(w.wx.mode);['amount','wind','windDir'].forEach(k=>{if(w.wx[k]!=null&&w.wx[k]!==WX.W[k])WX.set(k,w.wx[k]);});}
  if(w.tod!=null&&w.tod!==CFG.tod){CFG.tod=w.tod;saveCfg();applyTOD();}
  if(w.real!=null&&w.real!==(CFG.real!==false)){CFG.real=w.real;saveCfg();realChanged(true);}
  if(w.wpn){Object.assign(WPN,w.wpn);saveWpn();}
  if(menu.open)renderMenu();}finally{mp.applying=false;}}
function worldDiff(a,b){const L=[];if(a.wx.mode!==b.wx.mode)L.push('the weather to '+WX.NAMES[b.wx.mode]);else if(a.wx.amount!==b.wx.amount)L.push('how much rain/snow');if(a.wx.wind!==b.wx.wind)L.push('the wind to '+b.wx.wind+' m/s');
  if(a.tod!==b.tod)L.push(b.tod<0?'to the real clock':'the time of day');if(a.real!==b.real)L.push(b.real?'🌍 real-world mode ON':'🌍 real-world mode OFF (anything goes)');if(JSON.stringify(a.wpn)!==JSON.stringify(b.wpn))L.push('the weapon settings');return L.join(', ');}
// ---- chat (Enter)
const CHAT=[];
function chatEl(){let L=$('chatLog');if(!L){L=document.createElement('div');L.id='chatLog';document.body.appendChild(L);const f=document.createElement('div');f.id='chatBar';f.innerHTML='<input id="chatIn" maxlength="140" placeholder="Say something… (Enter = send, Esc = close)" autocomplete="off"><button class="btn" id="chatGo">Send</button>';document.body.appendChild(f);
  const i=$('chatIn');i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){chatSend(i.value);i.value='';chatClose();e.preventDefault();}else if(e.key==='Escape'){chatClose();e.preventDefault();}});i.addEventListener('keyup',e=>e.stopPropagation());
  $('chatGo').onclick=()=>{chatSend(i.value);i.value='';chatClose();};}return L;}
function chatOpen(){chatEl();$('chatBar').style.display='flex';$('chatIn').focus();chatDraw(true);}
function chatClose(){const b=$('chatBar');if(b)b.style.display='none';try{$('chatIn').blur();}catch(e){}chatDraw();}
function chatSend(txt){txt=(txt||'').trim();if(!txt)return;if(!mpOpen()){toast('💬 Chat works when you\'re in a multiplayer game',2000);return;}mpSend({t:'chat',txt:txt.slice(0,140)});chatAdd(CFG.name+' (you)',txt.slice(0,140),'#ffd60a');}
function chatAdd(who,txt,col){CHAT.push({who,txt,col,t:performance.now()});if(CHAT.length>40)CHAT.shift();chatDraw();beep(1050,0.05,0.03);vrMsg(who+': '+txt,4000);}
function chatSys(txt){CHAT.push({who:'',txt,col:'#9fd3ff',t:performance.now()});if(CHAT.length>40)CHAT.shift();chatDraw();}
function chatDraw(all){const L=chatEl(),now=performance.now(),open=$('chatBar').style.display==='flex';const show=CHAT.filter(c=>open||all||now-c.t<14000).slice(open?-12:-6);
  L.innerHTML=show.map(c=>'<div>'+(c.who?'<b style="color:'+(c.col||'#fff')+'">'+esc(c.who)+':</b> ':'')+'<span'+(c.who?'':' style="color:'+c.col+'"')+'>'+esc(c.txt)+'</span></div>').join('');L.style.display=show.length?'block':'none';}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
setInterval(()=>{if(CHAT.length)chatDraw();},2000);
// ---- a little person: your pilot, standing where you took off (others see it too)
function makePilot(col){const g=new THREE.Group(),skin=new THREE.MeshLambertMaterial({color:0xe0b48a}),shirt=new THREE.MeshLambertMaterial({color:col||0x0a84ff}),jeans=new THREE.MeshLambertMaterial({color:0x2c3e66}),dark=new THREE.MeshLambertMaterial({color:0x222222});
  const leg=x=>{const l=new THREE.Mesh(GEO.box,jeans);l.scale.set(0.14,0.8,0.16);l.position.set(x,0.4,0);g.add(l);return l;};g.userData.legs=[leg(-0.1),leg(0.1)];
  const b=new THREE.Mesh(GEO.box,shirt);b.scale.set(0.42,0.6,0.24);b.position.y=1.1;g.add(b);
  const arm=x=>{const a=new THREE.Group();a.position.set(x,1.36,0);const m=new THREE.Mesh(GEO.box,shirt);m.scale.set(0.11,0.55,0.12);m.position.y=-0.27;a.add(m);a.rotation.x=-0.9;g.add(a);return a;};g.userData.arms=[arm(-0.27),arm(0.27)];
  const h=new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),skin);h.position.y=1.55;g.add(h);const cap=new THREE.Mesh(new THREE.SphereGeometry(0.135,10,6,0,Math.PI*2,0,Math.PI/2),dark);cap.position.y=1.57;g.add(cap);
  const rc=new THREE.Mesh(GEO.box,dark);rc.scale.set(0.24,0.12,0.06);rc.position.set(0,1.08,-0.42);g.add(rc);g.userData.rc=rc;return g;}
