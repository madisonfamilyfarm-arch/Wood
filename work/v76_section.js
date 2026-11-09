// v76: SIMPLE WORDS FIRST — a plain "word understander" that runs before everything else.
// It reads short everyday sentences ("don't blow me up", "why did you blow up the fire truck", "who shot me", "thanks", "do it again")
// by looking for: NOT-words (don't / stop / quit / nobody), ACTION words (blow up, shoot, follow…), WHO/WHAT (me, Blaze, the fire truck…),
// and QUESTION words (why / who / did / are). Then it answers plainly AND does it.
const SW={kill:null,shots:[],last:{},lastCmd:'',lastReply:'',peace:0,protObj:{}};
// ---- memory: who blew who up, and what each pilot was shooting at
{const d0=dzDie;dzDie=function(txt,byId,byName){const was=DZ.dead;const r=d0.apply(this,arguments);try{if(!was&&DZ.dead)SW.kill={by:byName||'',txt:String(txt||''),t:performance.now()};}catch(e){}return r;};}
{const f0=dzBotFire;dzBotFire=function(B,tg){try{if(SW.peace>performance.now())return;}catch(e){}const r=f0.apply(this,arguments);try{if(B&&tg){let what='something';const me=D.pos;if(tg.distanceTo(me)<6)what='you';else{const X=AIB.L.find(b=>b!==B&&!b.dead&&b.p&&b.p.distanceTo(tg)<6);if(X)what=pbName(X);}
  SW.shots.push({by:pbName(B),what,t:performance.now()});if(SW.shots.length>40)SW.shots.shift();B.lastShot={what,t:performance.now()};}}catch(e){}return r;};}
{const s0=sbSay;sbSay=function(w,t){try{if(HEARING)SW.lastReply=String(t);}catch(e){}return s0.apply(this,arguments);};}
function swNorm(t){let s=' '+String(t||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]+/g,' ')+' ';
  const C=[[/ don'?t /g,' do not '],[/ dont /g,' do not '],[/ doesn'?t /g,' does not '],[/ didn'?t /g,' did not '],[/ can'?t /g,' can not '],[/ cannot /g,' can not '],[/ won'?t /g,' will not '],[/ i'?m /g,' i am '],[/ im /g,' i am '],[/ you'?re /g,' you are '],[/ youre /g,' you are '],[/ u r /g,' you are '],[/ ur /g,' your '],[/ u /g,' you '],[/ r /g,' are '],
    [/ that'?s /g,' that is '],[/ thats /g,' that is '],[/ it'?s /g,' it is '],[/ what'?s /g,' what is '],[/ whats /g,' what is '],[/ let'?s /g,' let us '],[/ lets /g,' let us '],[/ gonna /g,' going to '],[/ wanna /g,' want to '],[/ gotta /g,' got to '],[/ pls /g,' please '],[/ plz /g,' please '],
    [/ fire ?truck /g,' firetruck '],[/ fire tower /g,' firetower '],[/ blowed /g,' blew '],[/ blown /g,' blew '],[/ blowing /g,' blow '],[/ shooting /g,' shoot '],[/ shot /g,' shoot '],[/ killing /g,' kill '],[/ killed /g,' kill '],[/ attacking /g,' attack '],[/ bombing /g,' bomb '],[/ hitting /g,' hit '],[/ chasing /g,' chase '],[/ following /g,' follow '],[/ destroying /g,' destroy '],[/ destroyed /g,' destroy '],[/ nuked /g,' nuke ']];
  C.forEach(([a,b])=>{s=s.replace(a,b);s=s.replace(a,b);});return s.replace(/ (please|hey|hi|yo|um|uh|just) /g,' ').replace(/ (please|hey|hi|yo|um|uh|just) /g,' ').replace(/\s+/g,' ');}
const SW_HURT=/ (blow|blew|shoot|kill|attack|bomb|hit|hurt|nuke|destroy|explode|tnt|rocket|smash|crash into|fire at|wreck|touch|mess with|fight|fighting) /;
const SW_NOT=/ (do not|does not|did not|stop|quit|no more|never|nobody|no one|noone|none of you|cease|will not|can not|leave) /;
const SW_OBJ=[['firetruck','the fire truck 🚒'],['house','the house 🏠'],['cabin','the cabin 🛖'],['tree','the trees 🌲'],['woods','the trees 🌲'],['forest','the trees 🌲'],['firetower','the fire tower 🗼'],['tower','the tower 🗼'],['camper','the campers ⛺'],['campers','the campers ⛺'],['hangar','the hangar'],['car','the car 🚗'],['truck','the truck 🚚'],['boat','the boat ⛵'],['plane','the plane ✈️'],['tank','the tank 🪖'],['barn','the barn'],['dock','the dock'],['bridge','the bridge 🌉'],['train','the train 🚂']];
{const s0=smartHear;smartHear=function(txt){try{const raw=String(txt||'');const s=swNorm(raw);const now=performance.now();
  const names=AIB.L.filter(b=>!b.dead).map(b=>pbName(b).toLowerCase());const inTxt=names.filter(n=>new RegExp(' '+n+' ').test(s)).sort((a,b)=>s.indexOf(' '+a+' ')-s.indexOf(' '+b+' '));const first=s.trim().split(' ')[0];const tgt=inTxt.find(n=>new RegExp(' (blow up|blow|shoot|kill|attack|hit|hurt|bomb|leave|touch|get|chase|nuke|fight|mess with|destroy) '+n+' ').test(s));const named=names.includes(first)&&first!==tgt?first:(inTxt.find(n=>n!==tgt)||null);
  let B=(named&&AIB.L.find(b=>pbName(b).toLowerCase()===named))||(CONV&&CONV.B&&!CONV.B.dead&&AIB.L.includes(CONV.B)?CONV.B:null)||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);
  const say=(t)=>{sbSay({B},t);try{CONV.B=B;}catch(e){}return true;};const Nm=n=>n[0].toUpperCase()+n.slice(1);
  const words=s.trim().split(' ').length;const neg=SW_NOT.test(s),hurt=SW_HURT.test(s);const me=/ (me|us|my drone|my plane|my tank|my car|my helicopter|myself|i) /.test(s);
  const obj=SW_OBJ.find(([k])=>new RegExp(' '+k+'(s|es)? ').test(s));const anyone=/ (anyone|anybody|everyone|everybody|anything|everything|people|nobody|no one) /.test(s);
  const other=tgt||inTxt.find(n=>n!==named)||null;
  // ---------- WHY did you blow up / shoot …?
  if(/ why /.test(s)&&hurt){const sh=[...SW.shots].reverse().find(x=>x.by.toLowerCase()===pbName(B).toLowerCase());
    if(obj)return say(PICK(['Oops! 😬 I was aiming at '+(sh&&sh.what!=='you'?sh.what:'someone')+' and hit '+obj[1]+' by accident. I\'ll be more careful!','Sorry! '+obj[1]+' was in the way 😅 Say "don\'t blow up '+obj[1].replace(/ [^a-z ].*$/,'')+'" and I won\'t.']));
    if(me||/ you /.test(s.replace(/ why (did|do|are|would) you /,' ')))return say(DZ.on?PICK(['It\'s battle mode, so everybody\'s a target 💥 Say "don\'t blow me up" and I\'ll stop!','Sorry! 😅 We\'re in battle mode. Want me to leave you alone? Just say "don\'t blow me up".']):'I didn\'t mean to! 😬 I\'ll be careful.');
    return say(DZ.on?'Because it\'s battle mode 💥 — say "stop" and I\'ll calm down.':'I didn\'t mean to! 😅');}
  // ---------- WHO blew me up / did YOU blow me up
  if(/ who (blew|blow|shoot|kill|attack|hit|bomb|nuke|got|destroy) (me|us|my|up me) /.test(s)||/ who (blew|blow) (me|us) up /.test(s)){const k=SW.kill&&now-SW.kill.t<120000?SW.kill:null;return say(k&&k.by?('It was '+k.by+'! 😈'+(k.by.toLowerCase()===pbName(B).toLowerCase()?' …that was me, sorry 😅':'')):'Nobody has blown you up lately 🙂');}
  if(/ did you /.test(s)&&hurt&&me){const k=SW.kill&&now-SW.kill.t<120000?SW.kill:null;const mine=k&&k.by&&k.by.toLowerCase()===pbName(B).toLowerCase();return say(mine?'Yeah… that was me 😅 Sorry! Say "don\'t blow me up" and I\'ll stop.':k&&k.by?'Nope, that was '+k.by+'!':'Nope, not me! 😇');}
  // ---------- "why did you do that" / "who did that" / "you blew me up"
  if(/^ (why did you do that|why would you do that|why did you do it|why do you do that|who did that|what was that|why did that happen) $/.test(s)){const k=SW.kill&&now-SW.kill.t<90000?SW.kill:null;const sh=B.lastShot&&now-B.lastShot.t<60000?B.lastShot:null;
    if(k&&k.by)return say(k.by.toLowerCase()===pbName(B).toLowerCase()?'That was me — sorry! 😅 It\'s battle mode. Say "don\'t blow me up" and I\'ll stop.':'That was '+k.by+'! 😈 Want me to get them back?');
    if(sh)return say('I was shooting at '+sh.what+' 💥 It\'s battle mode!');return say('Do what? 🤔 I was just flying around!');}
  if(/ you (blew|blow) me up | you (kill|got|hit|shoot) me /.test(s)&&!/ why | did /.test(s)){PROT.me=now+180000;return say(PICK(['Sorry! 😅 I\'ll leave you alone now.','Oops! My bad 😬 No more rockets at you.']));}
  if(/^ (not funny|that is not funny|that was not funny|not cool man|rude) $/.test(s))return say(PICK(['Sorry! 😅','Okay okay, sorry! 🙏']));
  if(/^ (do not do that|do not do it|can you not|can you stop|could you stop|will you stop|i said stop|stop i said|stop it now|i said no|no stop|stop stop|stop stop stop) $/.test(s)){PROT.me=now+180000;try{s0.call(this,'stop');}catch(e){}return say(PICK(['Okay, okay — stopping! 🛑','Sorry! Stopping now ✋']));}
  if(/^ (are you listening|do you understand me|did you hear me|can you hear me|do you get it|do you understand|hello are you there|are you there) $/.test(s))return say(PICK(['Yes! I\'m listening 👂','I hear you! 👂 What should I do?']));
  // ---------- DON'T / STOP / NOBODY + hurt
  if((neg||/ nobody | no one /.test(s))&&hurt||/ leave (me|us) alone /.test(s)||/ leave .+ alone /.test(s)){
    if(obj&&!me){SW.protObj[obj[0]]=now+600000;return say(PICK(['Okay! I won\'t blow up '+obj[1]+' 👍','Got it — '+obj[1]+' will stay safe 🛡','Promise! Nobody touches '+obj[1]+' 🤞']));}
    if(other&&!me){PROT[other]=now+180000;AIB.L.forEach(b=>{try{if(b.hunt&&pbName(b.hunt.B||b.hunt).toLowerCase&&String(pbName(b.hunt.B||b.hunt)).toLowerCase()===other){b.hunt=null;b.huntCmd=false;}}catch(e){}});return say('Okay, I\'ll leave '+Nm(other)+' alone 😇');}
    if(anyone&&!me){SW.peace=now+300000;AIB.L.forEach(b=>{b.hunt=null;b.huntCmd=false;});return say(PICK(['Okay — no more blowing anything up! Peace ✌️','Everybody stand down! 🕊']));}
    if(!me&&/ (stop|cease|quit|no more) /.test(s)){SW.peace=now+300000;PROT.me=now+300000;AIB.L.forEach(b=>{b.hunt=null;b.huntCmd=false;});return say(PICK(['Okay — no more fighting! Peace ✌️','Ceasefire! 🕊 Everybody stand down.']));}
    PROT.me=now+300000;AIB.L.forEach(b=>{try{if(b.hunt&&(b.hunt.me||b.hunt==='me'))b.hunt=null;}catch(e){}b.aimMe=0;});return say(PICK(['Okay! I won\'t blow you up 🤝','Got it — you\'re safe from me 🛡','No more rockets at you, promise! 🤞']));}
  // ---------- stop / quit it / everyone stop
  if(/^ (stop|stop it|quit it|quit|please stop|cut it out|knock it off|enough|everyone stop|everybody stop|all stop|stop that) $/.test(s)){PROT.me=now+120000;try{s0.call(this,'stop');}catch(e){}if(/ (everyone|everybody|all) /.test(s)){AIB.L.forEach(b=>{b.hunt=null;b.huntCmd=false;b.goal=null;});return say('Everybody stopping! 🛑');}return true;}
  // ---------- feelings about what the AI did
  if(/^ (that is mean|that was mean|so mean|you are mean|rude|that is rude|that was rude|not nice|that is not nice|that was not nice|not cool|that is not cool|ouch|hey) $/.test(s)||/ i (do not|dont|did not) like (that|it|this) /.test(s)){PROT.me=now+180000;return say(PICK(['Sorry! 😢 I\'ll stop.','Oops, my bad! I\'ll be nicer 🤝','Sorry about that! I won\'t do it again 😇']));}
  if(/ (are you mad|are you angry|are you upset) /.test(s))return say(PICK(['Nope! Never 😊','Not at all — we\'re buddies! 🤝']));
  if(/ (are you my friend|can we be friends|will you be my friend|be my friend|are we friends|we are friends) /.test(s)){PROT.me=now+300000;return say(PICK(['Yes! Best friends 🤝','Of course! Friends forever 😄']));}
  if(/^ (i like you|i love you|you are nice|you are awesome|you are cool|you are the best|you are funny) $/.test(s)||/ i (really )?(like|love) you /.test(s))return say(PICK(['Aww, thanks! You\'re awesome too 😊','You\'re the best pilot! 🙌']));
  if(/^ (thanks|thank you|thank you so much|thanks a lot|thx|ty) $/.test(s))return say(PICK(['You\'re welcome! 😊','Anytime! 👍','No problem! ✈️']));
  if(/^ (nice|cool|awesome|sweet|wow|that was fun|that was cool|that was awesome|fun|epic|yay|woo|whoa) $/.test(s))return say(PICK(['I know, right?! 😄','So fun! 🎉','Yeah! Let\'s do more! 🚀']));
  // ---------- go away / come here / where are you
  if(/^ (go away|go somewhere else|shoo|get away|get lost|scram) $/.test(s)){const pl=aiPlaces();const q=PICK(pl);try{aiGoTo(B,q.x,q.z,12);}catch(e){}return say('Okay, see ya! 👋 I\'ll go hang out at '+q.n+'.');}
  if(/^ (where are you|where are you at|where is everyone|where did you go) $/.test(s)){const L=named?[B]:AIB.L.filter(b=>!b.dead).slice(0,3);const mp=(typeof dzMe==='function'&&dzMe())||D.pos;L.filter(b=>b.p&&isFinite(b.p.x)&&isFinite(b.p.z)).forEach((b,i)=>{const pl=aiPlaces().reduce((a,q)=>Math.hypot(q.x-b.p.x,q.z-b.p.z)<Math.hypot(a.x-b.p.x,a.z-b.p.z)?q:a);const d=Math.round(Math.hypot(b.p.x-mp.x,b.p.z-mp.z));
      const line=d<15?'Right here next to you! 👋':'I\'m near '+pl.n+' — about '+d+' m away 📍';if(i===0)sbSay({B:b},line);else setTimeout(()=>sbSay({B:b},line),i*500);});return true;}
  if(/^ (watch this|watch me|look at me|look|can you see me|see me) $/.test(s))return say(PICK(['👀 I\'m watching!','I see you! 👀 Show me something cool!']));
  if(/^ (i am back|back|i am here|here i am) $/.test(s))return say(PICK(['Welcome back! 👋','Yay, you\'re back! 😄']));
  if(/^ (how are you|how are you doing|how is it going|you good|how do you do|what is up|sup) $/.test(s)){try{CONV.B=B;CONV.ask='how';CONV.askT=now;}catch(e){}return say(PICK(['I\'m great! How about you? 😊','Doing awesome — props spinning! How are you?']));}
  if(/^ (let us play|play|let us play something|let us play a game|want to play|play with me) $/.test(s)){try{CONV.B=B;CONV.ask='play';CONV.askT=now;}catch(e){}return say(PICK(['Yes! Race, tag, or hide and seek? 🏁','Let\'s play! Race, tag, or hide and seek?']));}
  // ---------- playful threats / chase
  if(/ (i am going to|i will) (get|blow|shoot|catch|beat) you /.test(s))return say(PICK(['Ha! You\'ll have to catch me first! 😜','Bring it on! 😎']));
  if(/^ (you can not catch me|catch me|catch me if you can|come get me) $/.test(s)){try{s0.call(this,'let us play tag');}catch(e){}return true;}
  if(/^ (run|run away|hide|flee) $/.test(s)){const pl=aiPlaces();const q=PICK(pl);try{aiGoTo(B,q.x,q.z,20);}catch(e){}return say('Aaah! 🏃💨');}
  // ---------- broken / crashed / fix me
  if(/ (fix me|fix my|repair me|repair my|heal me|my (drone|plane|tank|car|helicopter|boat) is broken|i am broken|i broke|i crashed|i died|i am dead|help i am hurt) /.test(s)){try{if(/ died | dead /.test(s)&&DZ.dead){dzRespawn();}else if(typeof quickFix==='function')quickFix(false);}catch(e){}return say(PICK(['🔧 There you go — all fixed!','🔧 Patched you up, good as new!']));}
  if(/^ (i need help|help me please|can you help|can you help me|i need you) $/.test(s))return s0.call(this,'help me');
  if(/^ (fight with me|be on my team|team up|help me fight|join my team|you are on my team) $/.test(s)){try{s0.call(this,'be on my team');}catch(e){}return true;}
  // ---------- do it again / what?
  if(/^ (again|do it again|one more time|repeat|do that again|again please) $/.test(s)){if(SW.lastCmd){return s0.call(this,SW.lastCmd);}return say('Do what again? 🤔');}
  if(/^ (what|huh|what did you say|say that again|pardon|come again) $/.test(s)&&SW.lastReply)return say('I said: '+SW.lastReply.replace(/^I said: /,''));
  if(/^ (what did you do|what have you done) $/.test(s)){const sh=B.lastShot&&now-B.lastShot.t<60000?B.lastShot:null;return say(sh?'I was shooting at '+sh.what+' 💥':'Just flying around! ✈️');}
  if(/^ (stop follow me|stop follow|do not follow me|quit follow me|stop chase me|do not chase me) $/.test(s)){return s0.call(this,'stop');}
}catch(e){}
  const r=s0.apply(this,arguments);try{if(/ (follow|race|tag|land|take off|go|fly|attack|get|shoot|blow|come|switch|climb|faster|slower|higher|lower|flip|loop|spin|hide|seek)/.test(' '+String(txt).toLowerCase()+' '))SW.lastCmd=String(txt);}catch(e){}return r;};}
// keep the friendly promises: "peace" stops every AI rocket; protected things/people stay safe
{const t0=aiDropTnt;aiDropTnt=function(B){try{if(SW.peace>performance.now())return;}catch(e){}return t0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
{const s0=smartHear;smartHear=function(){HEARING++;try{return s0.apply(this,arguments);}finally{HEARING--;}};}
