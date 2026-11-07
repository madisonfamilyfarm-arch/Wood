// ================================================================ 🌐 ONLINE ROOMS: multiplayer phone-to-phone over the internet (no computer needed). One player creates a room → gets a code → friends type the code.
// Uses PeerJS (MIT) + its free public broker; the room creator's phone passes everyone's messages on.
const ONL={on:false,peer:null,host:false,conns:[],hc:null,code:''};
function onlCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<4;i++)s+=A[Math.floor(Math.random()*A.length)];return s;}
function onlLoad(cb){if(window.Peer)return cb();toast('🌐 Getting online play ready…',1500);const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js';s.onload=cb;s.onerror=()=>toast('❌ Couldn\'t load online play — is the phone on the internet?',4000);document.head.appendChild(s);}
// a pretend WebSocket so all the normal multiplayer code works unchanged
const PWS={readyState:0,send(str){if(ONL.host){ONL.conns.forEach(c=>{if(c.open)try{c.send(str);}catch(e){}});}else if(ONL.hc&&ONL.hc.open){try{ONL.hc.send(str);}catch(e){}}},close(){onlLeave();}};
function onlAttach(){if(mp.ws&&mp.ws!==PWS){const o=mp.ws;mp.ws=null;try{o.onclose=null;o.close();}catch(e){}}mp.ws=PWS;PWS.readyState=1;mp.want=true;try{mpHello();}catch(e){}}
function onlRecv(str,from){let m;try{m=typeof str==='string'?JSON.parse(str):str;}catch(e){return;}if(ONL.host){const s=typeof str==='string'?str:JSON.stringify(str);ONL.conns.forEach(c=>{if(c!==from&&c.open)try{c.send(s);}catch(e){}});}try{mpRecv(m);}catch(e){console.warn('onl',e);}}
function onlHost(tries){onlLoad(()=>{onlLeave(true);const code=onlCode();let p;try{p=new Peer('woodsrc-'+code);}catch(e){toast('❌ Online play didn\'t start: '+e.message,4000);return;}ONL.peer=p;ONL.host=true;ONL.code=code;
  p.on('open',()=>{ONL.on=true;onlAttach();onlShowCode();chatSys('🌐 Room '+code+' is open — friends: Menu → 🌐 Online rooms → Join, and type '+code);});
  p.on('connection',c=>{ONL.conns.push(c);c.on('open',()=>{chatSys('👋 Someone joined room '+code+'!');setTimeout(()=>{try{mpHello();}catch(e){}},300);});c.on('data',d=>onlRecv(d,c));c.on('close',()=>{ONL.conns=ONL.conns.filter(x=>x!==c);chatSys('👋 Someone left the room');});});
  p.on('disconnected',()=>{try{p.reconnect();}catch(e){}});
  p.on('error',e=>{if(e.type==='unavailable-id'&&(tries||0)<4){onlHost((tries||0)+1);return;}toast('❌ Online play: '+(e.type==='network'||e.type==='server-error'?'can\'t reach the internet room server':e.type),4000);});});}
function onlJoin(code){code=String(code||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<3){toast('Type the 4-letter room code',1600);return;}
  onlLoad(()=>{onlLeave(true);let p;try{p=new Peer();}catch(e){toast('❌ '+e.message,3000);return;}ONL.peer=p;ONL.host=false;ONL.code=code;toast('🌐 Joining room '+code+'…',2000);
    p.on('open',()=>{const c=p.connect('woodsrc-'+code,{reliable:true});ONL.hc=c;const t=setTimeout(()=>{if(!ONL.on){toast('❌ Couldn\'t join room '+code+' — check the code, and that the room creator is still playing',5000);onlLeave(true);}},15000);
      c.on('open',()=>{clearTimeout(t);ONL.on=true;onlAttach();toast('🌐 You joined room '+code+'! 🎉',3000);chatSys('🌐 Joined room '+code);});c.on('data',d=>onlRecv(d,null));c.on('close',()=>{if(ONL.on){toast('🌐 The room closed',3000);onlLeave();}});});
    p.on('error',e=>toast(e.type==='peer-unavailable'?'❌ No room called '+code+' — check the code':'❌ Online play: '+e.type,4000));});}
function onlLeave(quiet){const was=ONL.on;if(ONL.peer)try{ONL.peer.destroy();}catch(e){}ONL.peer=null;ONL.conns=[];ONL.hc=null;ONL.on=false;
  if(mp.ws===PWS){mp.ws=null;PWS.readyState=0;Object.keys(mp.peers).forEach(id=>{if(!/^(bot|tg|tst)/.test(id))mpDrop(id);});}if(was&&!quiet)toast('🚪 Left the online room',1500);onlShowCode(true);}
// the normal (computer) connection must not kick the room out
{const c0=mpConnect;mpConnect=function(){if(ONL.on||ONL.peer)return;return c0.apply(this,arguments);};}
// room code badge (tap to copy / share)
function onlShowCode(hide){let b=$('onlBadge');if(!b){b=document.createElement('div');b.id='onlBadge';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:calc(56px + env(safe-area-inset-top));z-index:22;background:rgba(10,132,255,0.9);color:#fff;font:800 14px system-ui;padding:5px 12px;border-radius:12px;cursor:pointer;display:none';
    b.onclick=()=>{const t='Join my Woods RC Sim room: '+ONL.code+'  https://madisonfamilyfarm-arch.github.io/Wood/';if(navigator.share)navigator.share({text:t}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>toast('📋 Copied!',1200));};document.body.appendChild(b);}
  if(hide||!ONL.on){b.style.display='none';return;}b.style.display='block';b.textContent='🌐 Room '+ONL.code+(ONL.host?' · '+(ONL.conns.filter(c=>c.open).length+1)+' players · tap to share':' · online');}
setInterval(()=>{if(ONL.on)onlShowCode();},2000);
function onlItems(){return[mInfo('🌐 Play with friends on their phones (or computers) anywhere — no home computer needed. One person creates a room, everyone else joins with the code.'),
  mInfo(()=>ONL.on?'You are in room '+ONL.code+(ONL.host?' (you made it — keep the game open!)':''):'Not in a room'),
  mItem('➕ Create a room',()=>{onlHost();menuToggle(false);}),
  mItem('🔑 Join a room (type the code)',()=>{const c=prompt('Type the room code your friend sees (like K7QX):','');if(c){onlJoin(c);menuToggle(false);}}),
  mItem(()=>ONL.on?'📤 Share the room code':'📤 Share (make a room first)',()=>{if(ONL.on)$('onlBadge').click();}),
  mItem('🚪 Leave the room',()=>onlLeave()),mItem('◀ Back',()=>menuBack())];}
{const m0=mainItems;mainItems=function(){const L=m0();L.splice(1,0,mItem(()=>'🌐 Online rooms — multiplayer on phones'+(ONL.on?' (in room '+ONL.code+')':'')+' ▸',()=>menuPush('🌐 Online rooms',onlItems())));return L;};}
// the AI on the phone = the smart built-in brain (it lives in the game, works anywhere)
