// ================================================================ v43: 🤖 an AI you can really PLAY with — tag, hide and seek, follow the leader · reacts to what you do · remembers you · lots more to say · answers "yes" to what it just asked
const AIC={offer:null,offerB:null,offerT:0,quiet:LS.get('aiQuiet',false),lastChat:0,mem:LS.get('aiMem',{})};
function aiMemSave(){LS.set('aiMem',AIC.mem);}
function meName(){return AIC.mem.name||CFG.name||'pilot';}
const PICK2=(a,n)=>{const c=a.slice(),o=[];while(o.length<n&&c.length)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o;};
JOKES.push('Why did the helicopter break up with the plane? It needed more space to hover! 🚁','What do you call a boat that tells jokes? A pun-toon! 🚤','Why don\'t submarines ever get lonely? They always have a sub-scription! 🌊','What\'s a tree\'s favorite drink? Root beer! 🌲',
  'Why was the tank so calm? It had thick skin! 🪖','How do bees get to school? On the school buzz! 🐝','What did the cloud say to the drone? "You\'re mist-ifying!" ☁️','Why did the raccoon bring a ladder? To reach the high-er-dumpster 🦝','What do you call a dinosaur that flies drones? A pterodactyl-pilot! 🦖',
  'Why did the rocket lose its job? It got fired! 🚀','What kind of music do planes like? Heavy metal! ✈️','Why don\'t fish play basketball? They\'re afraid of the net! 🐟','What do you call cheese that isn\'t yours? Nacho cheese! 🧀','Why did the car get a sweater? It had a cold engine! 🚙',
  'What\'s a drone\'s favorite game? Hide and SKY! 🙈','How does a train eat? It goes chew-chew! 🚂','Why was the fire truck sad? Its friends kept getting hosed! 🚒','What do you call a sleeping bull? A bulldozer! 🐂','Why did the TNT go to therapy? It had a short fuse! 💣','What did the propeller say to the wind? "You blow me away!" 🌀');
const RB={
  hi:['Hi {me}! 👋','Hey {me}! Ready to fly? 🚁','Hello hello! 😄','Yo {me}! What are we doing today?','Hiya! I was hoping you\'d show up!','Hey! Want to play a game? 🎮','Oh hi! I just did the coolest loop 😎','Howdy, pilot! 🤠','Hey there, {me}! 👋','Hi! The woods are awesome today 🌲'],
  how:['I\'m awesome! Just did three flips in a row 🔄','Pretty good! A little dizzy from spinning 😵‍💫','Great! Even better now that you\'re here 😊','Super! My propellers are extra zippy today ⚡','Doing great — how about you, {me}?','A bit tired, I\'ve been racing all day 🏁','Fantastic! Wanna race? 🏁','Good! I found a cool spot by the lake 🌊'],
  thanks:['You\'re welcome! 😊','Anytime, {me}!','No problem! 👍','Happy to help! 🚁','Of course, co-pilot!','You got it!'],
  bye:['Bye {me}! 👋 Come back soon!','See you later, pilot! ✈️','Aww, bye! That was fun 😊','Catch you next time! 🚁','Bye! I\'ll keep the sky warm for you ☀️'],
  yes:['Awesome! 😄','Yay! 🎉','Cool cool cool 😎','Let\'s go! 🚀','Sweet!'],no:['Okay, maybe later! 🙂','No worries!','Alright! Tell me if you change your mind.','That\'s okay! 👍'],
  huh:['Hmm, I didn\'t quite get that 🤔 Try "let\'s play tag", "race me", "follow me" or "tell me a joke"!','Say that again? I want to get it right 👂','I\'m not sure what you mean — but I\'d love to play tag! 🏃','Ooh, interesting! Want to play hide and seek? 🙈','Hmm! You could ask me to go somewhere, flip, race, or play a game 🎮','I\'m still learning that one 😅 Try "what can you do"!'],
  idle:['This {place} is so pretty right now 🌲','Anyone want to race? 🏁','I bet I can do more flips than you 😜','Hey {me}, wanna play tag? 🏃','I\'m bored… want to play hide and seek? 🙈','Did you see that bird? 🐦','Let\'s explore together! 🧭','I love flying over the lake 🌊','Follow the leader? I\'ll copy everything you do! 🔁','The fire tower has the BEST view 🗼'],
  flip:['Nice flip! 🔄','Whoa, smooth! 😎','10 out of 10 flip! 🏆','Teach me that one!','Show-off! 😆','Do another one! 🔁'],
  crash:['Ouch! You okay? 😬','Yikes — need a hand? 🔧','That looked like it hurt! 😵','Oof! Shake it off, you got this 💪','Uh oh, crash! Press 🔧 to fix up!'],
  boom:['WHOA! 😱','That was HUGE! 💥','My ears are ringing! 🙉','Holy smokes! 💨','Did you feel that?!','KABOOM! 🤯'],
  tagIt:['Tag! You\'re it! 😆','Gotcha! You\'re it! 🏃','TAG! Catch me if you can! 💨'],tagGot:['Aww, you got me! Now I\'m it 😤','Nooo! Okay, here I come! 👀','You\'re fast! My turn to chase 🏃'],
  found:['You found me! 🎉','Aww, you found me! Good eyes 👀','Found! You\'re a great seeker 🔍']};
function rb(k,B){let t=PICK(RB[k]);const me=meName();let place='woods';try{const p=B?B.p:dzMe();const pl=aiPlaces().reduce((a,q)=>Math.hypot(q.x-p.x,q.z-p.z)<Math.hypot(a.x-p.x,a.z-p.z)?q:a);place=pl.n;}catch(e){}return t.replace(/\{me\}/g,me).replace(/\{place\}/g,place);}
function aiNear(max,flyOnly){const me=dzMe()||D.pos;return AIB.L.filter(B=>!B.dead&&(!flyOnly||B.kind==='drone'||B.kind==='heli')).map(B=>[B,B.p.distanceTo(me)]).filter(x=>x[1]<(max||1e9)).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);}
function aiTalk(B,t,d){if(!B)return;sbSay({B},t,d||300);AIC.lastChat=performance.now();}
// ---------------------------------------------------------------- 🎮 games
const GAME={on:null,B:null,it:null,t0:0,score:{me:0,ai:0},cool:0,hide:null,lastD:0};
function gameStop(say){if(GAME.B&&say)aiTalk(GAME.B,say);if(GAME.B){GAME.B.spdK=1;GAME.B.holdT=0;GAME.B.follow=null;}GAME.on=null;GAME.B=null;$('gameBadge')&&($('gameBadge').style.display='none');}
function gameBadge(t){let b=$('gameBadge');if(!b){b=document.createElement('div');b.id='gameBadge';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);top:calc(110px + env(safe-area-inset-top));z-index:22;background:rgba(191,90,242,0.88);color:#fff;font:800 13px system-ui;padding:4px 10px;border-radius:10px;pointer-events:none';document.body.appendChild(b);}b.style.display=t?'block':'none';if(t)b.textContent=t;}
function gameStart(kind,B){B=B||aiNear(1e9,true)[0];if(!B){chatSys('🤖 Turn on AI pilots first (Menu → AI pilots), and make one a drone!');return;}
  if(!(B.kind==='drone'||B.kind==='heli')){try{aiSwitch(B,'drone');}catch(e){}B=AIB.L.find(x=>x.name===B.name&&!x.dead)||B;}
  gameStop();GAME.on=kind;GAME.B=B;GAME.t0=performance.now();GAME.cool=performance.now()+2500;
  if(kind==='tag'){GAME.it='ai';aiTalk(B,'Tag! I\'m it first — counting to 3… RUN! 🏃');gameBadge('🏃 TAG — '+B.name.replace('🤖 ','')+' is IT · say "stop playing" to end');}
  if(kind==='hide'){const me=dzMe()||D.pos;let best=null;for(let i=0;i<20;i++){const a=Math.random()*6.28,d=60+Math.random()*90,x=me.x+Math.cos(a)*d,z=me.z+Math.sin(a)*d;if(!inWater(x,z)&&Math.abs(x)<900&&Math.abs(z)<900){best={x,z};break;}}best=best||{x:me.x+80,z:me.z};
    GAME.hide=best;aiTalk(B,'Okay! Close your eyes and count to 10… I\'m hiding! 🙈');gameBadge('🙈 HIDE AND SEEK — find '+B.name.replace('🤖 ','')+'! Ask "where are you?" for hints');setTimeout(()=>{if(GAME.on==='hide')chatSys('🙈 Ready or not — go find '+B.name.replace('🤖 ','')+'!');},9000);}
  if(kind==='leader'){B.follow=true;aiTalk(B,'Follow the leader! I\'ll copy everything you do 🔁');gameBadge('🔁 FOLLOW THE LEADER — flip and '+B.name.replace('🤖 ','')+' flips too');}}
{const a0=aiTick;aiTick=function(dt){const now=performance.now();try{const B=GAME.B;if(GAME.on&&B){if(B.dead){gameStop();}else{const me=dzMe()||D.pos;const d=B.p.distanceTo(me);
      if(GAME.on==='tag'){if(GAME.it==='ai'){B.spdK=1.15;B.goal={x:me.x,z:me.z,h:Math.max(2,me.y-H(me.x,me.z)),kind:'go'};if(d<3&&now>GAME.cool){GAME.it='me';GAME.score.ai++;GAME.cool=now+2500;aiTalk(B,rb('tagIt'));beep(1200,0.1,0.05);gameBadge('🏃 TAG — YOU are IT! Catch '+B.name.replace('🤖 ','')+' · '+GAME.score.me+' – '+GAME.score.ai);}}
        else{B.spdK=0.85;const away=B.p.clone().sub(me);away.y=0;if(away.length()<0.1)away.set(1,0,0);away.normalize();B.goal={x:B.p.x+away.x*25+Math.sin(now/1500)*8,z:B.p.z+away.z*25+Math.cos(now/1500)*8,h:4+Math.sin(now/900)*2,kind:'go'};
          if(d<3&&now>GAME.cool){GAME.it='ai';GAME.score.me++;GAME.cool=now+2500;aiTalk(B,rb('tagGot'));beep(900,0.1,0.05);gameBadge('🏃 TAG — '+B.name.replace('🤖 ','')+' is IT · '+GAME.score.me+' – '+GAME.score.ai);}}}
      else if(GAME.on==='hide'&&GAME.hide){const h=GAME.hide,dh=Math.hypot(B.p.x-h.x,B.p.z-h.z);B.goal={x:h.x,z:h.z,h:dh<6?0.6:14,kind:'go'};if(dh<4){B.holdT=now+1000;B.hx=h.x;B.hz=h.z;B.hh=0.6;}
        if(d<8&&now-GAME.t0>9000){const s=Math.round((now-GAME.t0)/1000);aiTalk(B,rb('found')+' It took you '+s+' seconds!');gameStop();}}
      else if(GAME.on==='leader'){B.goal={x:me.x+Math.sin(D.yaw)*4,z:me.z+Math.cos(D.yaw)*4,h:Math.max(2,me.y-H(me.x,me.z)),kind:'go'};}}}}catch(e){}return a0.apply(this,arguments);};}
// ---------------------------------------------------------------- 👀 reacting to what you do
const RX={flip:false,state:'',t:0};
setInterval(()=>{try{if(!started||!AIB.L.length)return;const now=performance.now();const fl=!!D.flip;
  if(fl&&!RX.flip){if(GAME.on==='leader'&&GAME.B){aiFlip(GAME.B);aiTalk(GAME.B,'Copying you! 🔄',400);}else if(now-RX.t>8000&&Math.random()<0.6){const B=aiNear(60)[0];if(B){aiTalk(B,rb('flip',B),600);RX.t=now;}}}RX.flip=fl;
  const st=D.state;if((st==='down'||st==='tumble')&&RX.state!=='down'&&RX.state!=='tumble'&&!WALK.on&&now-RX.t>6000){const B=aiNear(80)[0];if(B&&Math.random()<0.7){aiTalk(B,rb('crash',B),800);RX.t=now;}}RX.state=st;
  // chatting by themselves now and then (offers a game you can answer "yes" to)
  if(!AIC.quiet&&now-AIC.lastChat>75000&&now-(RX.idle||0)>75000&&!GAME.on&&!menu.open){RX.idle=now;const B=aiNear(120)[0];if(B&&Math.random()<0.55){let t=rb('idle',B);aiTalk(B,t);if(/tag/.test(t))aiOffer('tag',B);else if(/hide and seek/.test(t))aiOffer('hide',B);else if(/race/.test(t))aiOffer('race',B);else if(/Follow the leader/.test(t))aiOffer('leader',B);}}}catch(e){}},400);
{const e0=explode;explode=function(p,r){const res=e0.apply(this,arguments);try{if((r||0)>=15&&performance.now()-RX.t>5000){const me=dzMe();if(me&&me.distanceTo(p)<r*5){const B=aiNear(150).find(b=>b.p.distanceTo(p)>r);if(B){aiTalk(B,rb('boom',B),900);RX.t=performance.now();}}}}catch(e){}return res;};}
function aiOffer(k,B){AIC.offer=k;AIC.offerB=B;AIC.offerT=performance.now();}
// ---------------------------------------------------------------- 💬 understanding: games, yes/no to what it asked, remembering you, quiet mode, and way more replies
{const s0=smartHear;smartHear=function(txt){const s=' '+synNorm(String(txt||'').toLowerCase().replace(/[!?.,]/g,' '))+' ';const now=performance.now();AIC.lastChat=now;
  const W=sbWho(s);const named=W&&W.find(w=>w.B)?W.find(w=>w.B).B:null;const B=named||aiNear(1e9)[0];
  // remember you
  let m=s.match(/\b(?:my name is|call me|i'?m called) ([a-z][a-z'-]{1,15})\b/);if(m){AIC.mem.name=m[1][0].toUpperCase()+m[1].slice(1);aiMemSave();aiTalk(B,'Nice to meet you, '+AIC.mem.name+'! I\'ll remember that 😊');return true;}
  m=s.match(/\bi (?:really )?(?:like|love) ([a-z][a-z' -]{2,24}?)(?: a lot| so much)? $/);if(m&&!/\byou\b/.test(m[1])){AIC.mem.likes=(AIC.mem.likes||[]).filter(x=>x!==m[1]).concat(m[1]).slice(-8);aiMemSave();aiTalk(B,PICK(['Ooh, '+m[1]+' is awesome! I\'ll remember 😄','No way, I like '+m[1]+' too!','Cool! '+m[1][0].toUpperCase()+m[1].slice(1)+' — got it 📝']));return true;}
  if(/\b(what do i like|do you remember me|what do you know about me|what'?s my name)\b/.test(s)){const L=AIC.mem.likes||[];aiTalk(B,(AIC.mem.name?'You\'re '+AIC.mem.name+'! ':'')+(L.length?'You like '+L.join(', ')+' 😊':'Tell me what you like! Say "I like …"'));return true;}
  // quiet mode
  if(/\b(be quiet|shh+|stop talking|quiet please|hush|zip it)\b/.test(s)){AIC.quiet=true;LS.set('aiQuiet',true);aiTalk(B,'Okay, I\'ll only talk when you talk to me 🤐');return true;}
  if(/\b(you can talk|talk again|chat with me|keep talking|say stuff)\b/.test(s)){AIC.quiet=false;LS.set('aiQuiet',false);aiTalk(B,'Yay! I\'ll chat more 😄');return true;}
  // games
  if(/\b(stop playing|end the game|game over|i quit|stop the game|done playing)\b/.test(s)&&GAME.on){gameStop('Good game! 🤝 '+(GAME.on==='tag'?'Final score — you '+GAME.score.me+', me '+GAME.score.ai:''));return true;}
  if(/\b(play tag|tag you'?re it|let'?s play tag|wanna play tag|tag game|you'?re it)\b|^ tag $/.test(s)){gameStart('tag',named);return true;}
  if(/\b(hide and seek|hide ?n ?seek|hide and go seek|play hide)\b/.test(s)){gameStart('hide',named);return true;}
  if(/\b(follow the leader|copy me|do what i do|simon says)\b/.test(s)){gameStart('leader',named);return true;}
  if(/\b(play a game|let'?s play|wanna play|what game|play something|play with me|i want to play)\b/.test(s)){aiTalk(B,'Let\'s play! 🎮 Tag 🏃, hide and seek 🙈, follow the leader 🔁, a race 🏁, rock paper scissors ✊ or riddles 🤔 — which one?');aiOffer('tag',B);return true;}
  if(GAME.on==='hide'&&/\b(where are you|hint|clue|warmer|colder|marco)\b/.test(s)&&GAME.B){const me=dzMe()||D.pos,d=GAME.B.p.distanceTo(me),was=GAME.lastD||d;GAME.lastD=d;const dir=compass(GAME.B.p.x-me.x,GAME.B.p.z-me.z);
    aiTalk(GAME.B,/marco/.test(s)?'POLO! 😆 (go '+dir+')':d<20?'🔥 You\'re SO close!':d<was-5?'Warmer! 🔥 Keep going '+dir:d>was+5?'Colder! 🥶 Try '+dir:'I\'m somewhere '+dir+' of you… 🤫');return true;}
  // yes / no to what the AI just asked
  if(AIC.offer&&now-AIC.offerT<45000){if(/^ (yes|yeah|yep|sure|ok|okay|yes please|let'?s do it|let'?s go|why not|ya|yup|alright|sounds good|totally|of course) /.test(s+' ')){const k=AIC.offer;AIC.offer=null;aiTalk(AIC.offerB||B,rb('yes'));
      if(k==='race')return s0.call(this,'race me');gameStart(k,AIC.offerB);return true;}
    if(/^ (no|nope|nah|no thanks|not now|maybe later) /.test(s+' ')){AIC.offer=null;aiTalk(AIC.offerB||B,rb('no'));return true;}
    const pick=s.match(/\b(tag|hide|seek|leader|race|rock|riddle)\b/);if(pick&&/\b(play|do|pick|choose|wanna|want|let'?s|that one)\b|^ \w+ $/.test(s)){AIC.offer=null;const k={tag:'tag',hide:'hide',seek:'hide',leader:'leader'}[pick[1]];if(k){gameStart(k,AIC.offerB);return true;}}}
  // richer everyday replies
  if(/^ (hi|hello|hey|yo|hiya|heya|howdy|greetings|good (morning|afternoon|evening)) ?(there|everyone|guys|all)? $/.test(s)){(W&&W.length?W:aiNear(1e9).slice(0,2).map(B=>({B}))).slice(0,3).forEach((w,i)=>w.B?aiTalk(w.B,rb('hi',w.B),400+i*700):sbSay(w,'Hi! 👋',400+i*700));return true;}
  if(/\b(how are you|how'?s it going|how you doing|you ok|you good|how do you feel|how'?re you)\b/.test(s)){aiTalk(B,rb('how',B));return true;}
  if(/\b(thanks|thank you)\b/.test(s)){aiTalk(B,rb('thanks',B));return true;}
  if(/\b(bye|goodbye|see you|gtg)\b/.test(s)){aiTalk(B,rb('bye',B));return true;}
  if(/\b(what can you do|what do you know)\b/.test(s)){aiTalk(B,'Lots! 🎮 Games: tag, hide and seek, follow the leader, race, rock paper scissors, riddles. Flying: follow, hover, circle, higher/lower, faster/slower, flip, spin, land. Battle: team up, attack someone, drop TNT. Ask me directions, math, facts, jokes, or tell me about you!');return true;}
  const r=s0.call(this,s.trim());return r;};}
{const m0=mainItems;mainItems=function(){const L=m0();const i=L.findIndex(x=>/AI pilots/.test(String(x.label())));L.splice(i>=0?i+1:3,0,mItem('🎮 Play a game with the AI ▸',()=>menuPush('🎮 Play with the AI',[mInfo('Pick a game — or just type / say it in chat!'),mItem('🏃 Tag',()=>{menuToggle(false);gameStart('tag');}),mItem('🙈 Hide and seek',()=>{menuToggle(false);gameStart('hide');}),mItem('🔁 Follow the leader',()=>{menuToggle(false);gameStart('leader');}),mItem('🏁 Race',()=>{menuToggle(false);smartHear('race me');}),mItem('⏹ Stop the game',()=>{menuToggle(false);gameStop('Good game! 🤝');}),mItem(()=>'🤐 AI chats by itself: '+(AIC.quiet?'off':'ON'),()=>{AIC.quiet=!AIC.quiet;LS.set('aiQuiet',AIC.quiet);}),mItem('◀ Back',()=>menuBack())])));return L;};}
