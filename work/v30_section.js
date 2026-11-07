// ================================================================ 💬 a little CHAT box you tap open · smarter built-in AI that understands chat (works on the phone with no AI computer)
// ---------------------------------------------------------------- the chat box
function cbEl(){let P=$('cbBox');if(P)return P;P=document.createElement('div');P.id='cbBox';P.style.cssText='position:fixed;left:50%;top:calc(8px + env(safe-area-inset-top));transform:translateX(-50%);width:min(560px,94vw);z-index:95;display:none;flex-direction:column;background:rgba(18,18,20,0.94);border:2px solid rgba(255,255,255,0.35);border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,0.5);font:15px system-ui;color:#fff;overflow:hidden';
  P.innerHTML='<div style="display:flex;align-items:center;padding:6px 10px;background:rgba(255,255,255,0.08)"><b style="flex:1">💬 Chat</b><button id="cbX" style="font:800 16px system-ui;background:none;border:0;color:#fff;padding:2px 8px;cursor:pointer">✕</button></div><div id="cbLog" style="max-height:28vh;overflow-y:auto;padding:6px 10px;display:flex;flex-direction:column;gap:3px"></div><form id="cbForm" style="display:flex;gap:6px;padding:8px;margin:0"><input id="cbIn" maxlength="140" autocomplete="off" enterkeyhint="send" placeholder="Say something… (try: hi Sam · follow me · go to the lake · race me)" style="flex:1;min-width:0;font:16px system-ui;background:#fff;color:#111;border:0;border-radius:10px;padding:10px 12px;outline:none"><button type="submit" style="font:800 16px system-ui;padding:8px 14px;border-radius:10px;border:0;background:#0a84ff;color:#fff;cursor:pointer">Send ➤</button></form>';
  document.body.appendChild(P);const i=$('cbIn');['keydown','keyup','keypress'].forEach(ev=>i.addEventListener(ev,e=>{e.stopPropagation();if(ev==='keydown'&&e.key==='Escape'){cbClose();}}));
  $('cbForm').onsubmit=e=>{e.preventDefault();const v=i.value.trim();if(v){chatSend(v);i.value='';}i.focus();};$('cbX').onclick=()=>cbClose();P.addEventListener('pointerdown',e=>e.stopPropagation());return P;}
function cbDraw(){const L=$('cbLog');if(!L||$('cbBox').style.display==='none')return;L.innerHTML=CHAT.slice(-14).map(c=>'<div><b style="color:'+(c.col||'#9fd3ff')+'">'+esc(c.who||'')+(c.who?':':'')+'</b> '+esc(c.txt)+'</div>').join('')||'<div style="opacity:0.6">No messages yet — say hi!</div>';L.scrollTop=L.scrollHeight;}
function cbOpen(){const P=cbEl();P.style.display='flex';document.body.classList.add('cbopen');cbDraw();setTimeout(()=>{try{$('cbIn').focus();}catch(e){}},50);}
function cbClose(){const P=$('cbBox');if(P)P.style.display='none';document.body.classList.remove('cbopen');try{$('cbIn').blur();}catch(e){}}
chatOpen=function(){cbOpen();};{const c0=chatClose;chatClose=function(){const r=c0.apply(this,arguments);return r;};}
{const a0=chatAdd;chatAdd=function(){const r=a0.apply(this,arguments);setTimeout(cbDraw,0);return r;};}
{const s0=chatSys;chatSys=function(){const r=s0.apply(this,arguments);setTimeout(cbDraw,0);return r;};}
// the little "💬 Chat" box button (bottom middle, above the speed bar)
setTimeout(()=>{const b=document.createElement('button');b.id='cbBtn';b.textContent='💬 Chat';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(52px + env(safe-area-inset-bottom));z-index:21;font:800 14px system-ui;padding:7px 14px;border-radius:12px;border:2px solid rgba(255,255,255,0.6);background:rgba(10,132,255,0.85);color:#fff;cursor:pointer';
  b.addEventListener('pointerdown',e=>e.stopPropagation());b.onclick=e=>{e.stopPropagation();const P=$('cbBox');if(P&&P.style.display!=='none')cbClose();else cbOpen();};document.body.appendChild(b);
  setInterval(()=>{b.style.display=started&&!menu.open?'':'none';},500);},1200);
// ---------------------------------------------------------------- 🧠 smarter built-in chat AI
const JOKES=['Why did the drone go to school? To get a little HIGHER education! 🎓','What do you call a sleeping drone? A droooone 😴','Why are trees bad at flying? They always get stumped! 🌲','What\'s a pilot\'s favorite snack? Plane chips! ✈️'];
function sbWho(s){const P=AIB.L.filter(B=>!B.dead),C=CAMPERS.L.filter(c=>!c.dead);const named=[...P.filter(B=>s.includes(B.name.replace('🤖 ','').toLowerCase())).map(B=>({B})),...C.filter(c=>s.includes(c.name.toLowerCase())).map(c=>({C:c}))];
  if(named.length)return named;if(/\b(everyone|everybody|all of you|guys|y'?all|you all|team)\b/.test(s))return[...P.map(B=>({B})),...C.map(c=>({C:c}))];return null;}
function sbPlace(s){const P=aiPlaces();const al={lake:'the lake',pond:'the lake',water:'the lake',tower:'the fire tower','fire tower':'the fire tower',camp:'the campsite',campsite:'the campsite',tent:'the campsite',airport:'the airfield',airfield:'the airfield',runway:'the airfield',airstrip:'the airfield',meadow:'the meadow',field:'the meadow',track:'the dirt track',dirt:'the dirt track',pad:'the launch pad',home:'the launch pad',arena:'the arena',truck:'the fire truck',fire:'the fire'};
  for(const k in al)if(new RegExp('\\b'+k+'\\b').test(s)){const q=P.find(p=>p.n===al[k]);if(q)return q;}return null;}
function sbVeh(s){const m=s.match(/\b(plane|airplane|jet|boat|sub|submarine|car|truck|helicopter|heli|chopper|drone|quad)\b/);if(!m)return null;return{plane:'plane',airplane:'plane',jet:'plane',boat:'boat',sub:'sub',submarine:'sub',car:'car',truck:'car',helicopter:'heli',heli:'heli',chopper:'heli',drone:'drone',quad:'drone'}[m[1]];}
function sbSay(w,t,d){setTimeout(()=>{if(w.B)aiSayAs(w.B.name.replace('🤖 ',''),t);else if(w.C)aiSayAs(w.C.name,t);},d||600);}
function sbPilotGo(B,q){if(B.kind==='drone'||B.kind==='heli'){if(B.mode==='fly'||B.mode==='takeoff')B.goal={x:q.x+(Math.random()-0.5)*10,z:q.z+(Math.random()-0.5)*10,h:12,kind:'go'};B.t=20;}else if(B.kind==='plane')B.wp={x:q.x,z:q.z,alt:25};else if(B.kind==='car'){if(!inWater(q.x,q.z))B.wp={x:q.x,z:q.z};}B.wpT=25;}
function smartHear(txt){const s=' '+String(txt||'').toLowerCase().replace(/[!?.,]/g,' ')+' ';if(!s.trim())return false;let W=sbWho(s);const any=!W;
  const P=AIB.L.filter(B=>!B.dead),C=CAMPERS.L.filter(c=>!c.dead);const me=dzMe()||D.pos;
  if(!W){const near=[...P.map(B=>({B,d:B.p.distanceTo(me)})),...C.map(c=>({C:c,d:Math.hypot(c.x-me.x,c.z-me.z)}))].sort((a,b)=>a.d-b.d);W=near.slice(0,1);}
  if(!W.length)return false;const first=W[0];let did=false;const each=f=>W.forEach((w,i)=>f(w,i));
  const veh=sbVeh(s),place=sbPlace(s);
  // switch vehicles
  if(veh&&/\b(get|use|fly|take|switch|change|ride|drive|try|hop|jump|grab|in a|into)\b/.test(s)){each((w,i)=>{if(w.B){aiSwitch(w.B,veh,'Switching to a '+veh+'! '+(AI_VIC[veh]||''));}else if(w.C&&veh==='car'){CAMPERS.order='truck';sbSay(w,'I\'ll take the fire truck! 🚒',400+i*500);}});return true;}
  // go somewhere
  if(place&&/\b(go|fly|head|drive|come|meet|move|visit|over|to)\b/.test(s)){each((w,i)=>{if(w.B)sbPilotGo(w.B,place);else{w.C.hx2=place.x+(Math.random()-0.5)*6;w.C.hz2=place.z+(Math.random()-0.5)*6;w.C.goAway=performance.now()+40000;}sbSay(w,['On my way to '+place.n+'!','Heading to '+place.n+' 👍','See you at '+place.n+'!'][i%3],500+i*700);});return true;}
  // follow / come here
  if(/\b(follow|come here|come with|with me|this way|over here)\b/.test(s)){each((w,i)=>{if(w.B){if(w.B.kind==='drone'||w.B.kind==='heli')w.B.goal={kind:'chase',t:25};else if(w.B.kind==='plane')w.B.wp={x:me.x,z:me.z,alt:20};else if(w.B.kind==='car')w.B.wp={x:me.x,z:me.z};}else{CAMPERS.order='follow';CAMPERS.orderT=120;}sbSay(w,['Right behind you!','Following you! 🏃','Wait for me!'][i%3],500+i*600);});return true;}
  // race
  if(/\brace\b/.test(s)){each((w,i)=>{if(w.B){const k=Object.keys(courses).filter(k=>!courses[k].custom);if((w.B.kind==='drone'||w.B.kind==='heli')&&k.length)w.B.goal={kind:'race',C:courses[k[Math.floor(Math.random()*k.length)]],i:0};else w.B.goal={kind:'chase',t:20};}sbSay(w,['You\'re on! 🏁','Race you! Last one there is a rotten egg!','3… 2… 1… GO! 🏁'][i%3],500+i*600);});return true;}
  // fight / peace
  if(/\b(stop shooting|don'?t shoot|no shooting|peace|truce|be nice|friends)\b/.test(s)){DZ.ai=false;LS.set('dzAi',false);sbSay(first,'Okay, no more rockets — friends! 🤝');return true;}
  if(/\b(attack|fight|battle|shoot me|come at me|war|bring it)\b/.test(s)){DZ.ai=true;LS.set('dzAi',true);each((w,i)=>{if(w.B){w.B.rkT=1+i;if(w.B.kind==='drone'||w.B.kind==='heli')w.B.goal={kind:'chase',t:20};}});sbSay(first,['Bring it on! 🚀','Battle time! 💥','You asked for it! 😈'][Math.floor(Math.random()*3)]);return true;}
  // land / tricks / dance
  if(/\b(land|landing|come down)\b/.test(s)){each((w,i)=>{if(w.B&&(w.B.kind==='drone'||w.B.kind==='heli')){w.B.goal={x:w.B.p.x,z:w.B.p.z,h:0,kind:'land'};}sbSay(w,'Coming in to land 🛬',500+i*600);});return true;}
  if(/\b(flip|trick|loop|stunt|roll|show off)\b/.test(s)){each((w,i)=>{if(w.B){if(w.B.kind==='plane')w.B.loop=2.5;else if(w.B.kind==='drone'||w.B.kind==='heli')w.B.goal={kind:'flip',t:1.5};}else if(w.C)w.C.dance=performance.now()+4000;sbSay(w,['Watch this! 🤸','Wheee!','Ta-da! ✨'][i%3],400+i*600);});return true;}
  if(/\b(dance|party|celebrate)\b/.test(s)){each((w,i)=>{if(w.C)w.C.dance=performance.now()+8000;else if(w.B&&(w.B.kind==='drone'||w.B.kind==='heli'))w.B.goal={kind:'flip',t:1.5};sbSay(w,['Dance party! 🕺','💃 Let\'s go!','🎉 Woo!'][i%3],400+i*500);});return true;}
  // fires / truck / stay / home / more → the camper orders that already existed
  if(aiHear(txt))return true;
  // talk
  if(/\b(joke|funny|make me laugh)\b/.test(s)){sbSay(first,JOKES[Math.floor(Math.random()*JOKES.length)]);return true;}
  if(/\b(thank|thanks|thx|ty)\b/.test(s)){sbSay(first,['You\'re welcome! 😊','Anytime!','No problem!'][Math.floor(Math.random()*3)]);return true;}
  if(/\b(how are you|how'?s it going|you ok|you good)\b/.test(s)){sbSay(first,['Great! The flying is awesome today 😄','Doing awesome — how about you?','Super! Just zooming around.'][Math.floor(Math.random()*3)]);return true;}
  if(/\b(what are you doing|what'?re you doing|wyd|where are you|whatcha doing)\b/.test(s)){each((w,i)=>{let t;if(w.B){const pl=aiPlaces().reduce((a,q)=>Math.hypot(q.x-w.B.p.x,q.z-w.B.p.z)<Math.hypot(a.x-w.B.p.x,a.z-w.B.p.z)?q:a);t='Flying my '+(w.B.kind||'drone')+' '+(AI_VIC[w.B.kind||'drone']||'')+' near '+pl.n+'!';}else t='Hanging out by the '+(Math.hypot(w.C.x-16,w.C.z+14)<20?'campfire 🔥':'trees 🌲')+'.';sbSay(w,t,500+i*600);});return true;}
  if(/\b(who are you|your name|what'?s your name)\b/.test(s)){each((w,i)=>sbSay(w,'I\'m '+(w.B?w.B.name.replace('🤖 ',''):w.C.name)+'! Nice to meet you 👋',400+i*500));return true;}
  if(/\b(hi|hello|hey|yo|sup|howdy|hiya|good morning)\b/.test(s)){each((w,i)=>sbSay(w,['Hi! 👋','Hey there!','Hello, pilot! 🚁','Yo! What\'s up?'][(i+Math.floor(Math.random()*4))%4],400+i*500));return true;}
  if(/\b(bye|goodbye|see you|later)\b/.test(s)){sbSay(first,'See you later! 👋');return true;}
  if(/\b(yes|yeah|yep|ok|okay|sure)\b/.test(s)){sbSay(first,['👍','Cool!','Awesome!'][Math.floor(Math.random()*3)]);return true;}
  if(/\b(no|nope|nah)\b/.test(s)){sbSay(first,'Okay! 🙂');return true;}
  if(/\?\s*$/.test(String(txt))||/\b(can you|could you|will you|do you)\b/.test(s)){sbSay(first,['Hmm, I\'m not sure! Try "go to the lake", "follow me", "race me" or "switch to a plane".','Good question! I can follow you, race you, fly anywhere, switch vehicles or fight fires.'][Math.floor(Math.random()*2)]);return true;}
  if(!any){sbSay(first,['Yeah?','I\'m listening! 👂','What should I do? (follow me, race, go somewhere…)'][Math.floor(Math.random()*3)]);return true;}
  return false;}
// use it whenever the AI computer isn't the one answering
{const s0=chatSend;chatSend=function(txt){const t=String(txt||'').trim();if(!t)return;const big=aiLocalOn()&&AIB.ok===true&&AIX.answer;
  if(!big){const was=aiHear;aiHear=function(){return true;};let r;try{r=s0.apply(this,arguments);}finally{aiHear=was;}try{smartHear(t);}catch(e){console.warn('smart',e);}return r;}
  return s0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🐢 chat you can actually READ: AI messages come one at a time (≥2.5 s apart) and stay on screen longer
const SAYQ=[];
{const s0=aiSayAs;aiSayAs=function(name,text){SAYQ.push([name,text]);if(SAYQ.length>6)SAYQ.splice(0,SAYQ.length-6);};setInterval(()=>{const m=SAYQ.shift();if(m)s0(m[0],m[1]);},2600);}
// ---------------------------------------------------------------- 📱💻🥽 Settings: what are you playing on?
function devSet(m){LS.set('devMode',m);PHONE=devIsPhone();const sticks=document.querySelectorAll('.stick');sticks.forEach(s=>s.style.display=(m==='computer')?'none':'');
  if(m==='vr'&&!(typeof vr!=='undefined'&&vr.on))try{toggleVR();}catch(e){}if(m!=='vr'&&typeof vr!=='undefined'&&vr.on)try{toggleVR();}catch(e){}
  const box=$('asBox');if(box){if(!PHONE){[...box.children].forEach(c=>{if(c.id==='asFold')c.style.display='none';else c.style.display=c.dataset.hide?'none':'';});box.style.top='calc(96px + env(safe-area-inset-top))';box.style.maxHeight='';}}asBtn.open=false;asBtn();
  const bar=$('chatBar');if(bar&&!PHONE){bar.dataset.fixed='';}
  toast({phone:'📱 Phone mode — touch sticks + the 🎛 Tools button',computer:'💻 Computer mode — keyboard/mouse/controller, no touch sticks',vr:'🥽 VR mode',auto:'🔄 Auto — the game picks'}[m],2500);}
function devName(){return{auto:'🔄 Auto',phone:'📱 Phone',computer:'💻 Computer',vr:'🥽 VR'}[LS.get('devMode','auto')];}
{const m0=mainItems;mainItems=function(){const L=m0();L.splice(1,0,mItem(()=>'⚙️ Playing on: '+devName()+'  (tap to change)',()=>{const o=['auto','phone','computer','vr'];const m=o[(o.indexOf(LS.get('devMode','auto'))+1)%4];devSet(m);}));return L;};}
setTimeout(()=>{const m=LS.get('devMode','auto');if(m==='computer')document.querySelectorAll('.stick').forEach(s=>s.style.display='none');},800);

{const st=document.createElement('style');st.textContent='body.cbopen #chatLog{display:none!important}';document.head.appendChild(st);}
