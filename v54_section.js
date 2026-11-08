// ================================================================ v54: 🎮 AI pilots play like REAL multiplayer players — own plans (targets, teams, retreat + fix up, comebacks), a scoreboard,
// player-style chat ("I'm going after Blaze, cover me!", "gg", "rematch?", "that was close!", "where'd you go?"), bot-vs-bot banter, and answers to player questions.
const PB={said:0,ev:0,score:{},grudge:{}};
function pbP(B){if(!B.pp){let h=0;for(const ch of B.name)h=(h*31+ch.charCodeAt(0))>>>0;const r=k=>((h>>>k)%100)/100;B.pp={chat:0.35+r(3)*0.6,brave:0.3+r(7)*0.7,trash:r(11),friendly:0.3+r(15)*0.7};}return B.pp;}
function pbS(id,n){return PB.score[id]||(PB.score[id]={n,k:0,d:0});}
function pbName(B){return B.name.replace('🤖 ','');}
function pbAlive(){return AIB.L.filter(B=>!B.dead);}
// say something unprompted (respects "be quiet", spaced out so it never floods the chat)
function pbSay(B,t,ev){if(!B||B.dead||AIC.quiet)return false;const now=performance.now();if(ev?now-PB.ev<2500:now-PB.said<14000)return false;if(now-AIC.lastChat<2500&&!ev)return false;PB.said=now;PB.ev=now;try{setTimeout(()=>{SAYLOW.add(t);aiSayAs(pbName(B),t);},300);}catch(e){}return true;}
const PBL={
  hunt:['I\'m going after {t}, cover me! 🎯','{t} is MINE 😈','Coming for you, {t}!','Watch out {t}, here I come 🚀','Targeting {t} — anyone wanna help?'],
  huntMe:['Hey {me}, I\'m coming for YOU 😜','{me}, you\'re next! 🎯','Ready or not, {me} — here I come!'],
  low:['I\'m low on health! Falling back 💔','Ouch — need to fix up, cover me!','Retreat! I\'m almost done for 😵','Gotta get out of here! 🏃'],
  back:['Back in the fight! 💪','Fixed up — let\'s go again! 🔧','I\'m back, baby! 😎'],
  respawn:['I\'m back! Rematch? 😤','gg… but I want a rematch! 😤','Okay that one hurt. Again! 💥','Respawned! Who got me? 👀'],
  gotYou:['Gotcha! 😆','gg {me} 😎','Boom! Got you, {me}!','Too easy 😜 (jk, gg)'],
  niceShot:['Nice shot, {me}! 🎯','Whoa, good aim! 👏','{me} is on fire! 🔥','Okay {me}, that was clean 😮'],
  trashShot:['Lucky shot! 😤','I\'ll get you back for that, {me}!','Grrr — rematch! 😤'],
  botKill:['Got \'em! 😎','Take that, {t}! 💥','{t} is down! 🎯'],
  closeCall:['That was close! 😅','Whoa, almost had me!','Missed me! 😜'],
  whereU:['Hey {me}, where\'d you go? 👀','{me}? Hello? You still there?','Anyone seen {me}? 🔍'],
  idleBattle:['Who should I blow up next? 🤔','Anyone wanna team up? 🤝','Score check! Who\'s winning? 🏆','I\'ve got rockets ready 🚀','Is it just me or is {t} hiding? 👀'],
  idleCalm:['Anyone wanna race? 🏁','I\'m gonna check out {place} 🧭','Who wants to play tag? 🏃','This is fun! 😄','Watch me do a trick! 🤸','Mind if I tag along, {me}? ✈️'],
  banter:['Not if I get you first, {t}! 😤','Bring it, {t}! 💪','Ha! You can\'t catch me, {t}! 💨','{t}, I\'ve got your number 😏']};
function pbLine(k,B,t){let s=PICK(PBL[k]);let place='the lake';try{const pl=aiPlaces().filter(p=>!/truck|fire$/.test(p.n));place=PICK(pl).n;}catch(e){}return s.replace(/\{me\}/g,meName()).replace(/\{t\}/g,t||'someone').replace(/\{place\}/g,place);}
// someone listening to YOU right now doesn't make their own plans
function pbBusy(B){const now=performance.now();return (B.cmdT&&now-B.cmdT<35000)||(GAME.on&&GAME.B===B)||B.holdT>now||B.orbT>now||B.bomb||(B.team==='me'&&B.hunt&&B.huntCmd);}
{const s0=sbSay;sbSay=function(w,t){try{if(w&&w.B&&performance.now()-AIC.lastChat<1500)w.B.cmdT=performance.now();}catch(e){}return s0.apply(this,arguments);};}
// ---------------------------------------------------------------- 📊 scoreboard + reactions to kills
{const b0=dzBotDie;dzBotDie=function(B,txt){const was=B&&B.dead;const r=b0.apply(this,arguments);try{if(B&&!was&&B.dead){const c=HIT.ctx;pbS(B.id,pbName(B)).d++;B.diedT=performance.now();
      if(c&&c.id){const killer=c.id===mp.id?null:AIB.L.find(x=>x.id===c.id);pbS(c.id,c.id===mp.id?meName():(c.by||'?')).k++;PB.grudge[B.id]=c.id;
        if(c.id===mp.id){const o=pbAlive().filter(x=>x!==B);const w=o[Math.floor(Math.random()*o.length)];if(w){const pp=pbP(w);pbSay(w,pbLine(pp.trash>0.6?'trashShot':'niceShot',w),true);}}
        else if(killer&&!killer.dead)pbSay(killer,pbLine('botKill',killer,pbName(B)),true);}}}catch(e){}return r;};}
{const d0=dzDie;dzDie=function(txt,byId,byName){const was=DZ.dead;const r=d0.apply(this,arguments);try{if(!was&&DZ.dead){pbS(mp.id,meName()).d++;const B=AIB.L.find(x=>x.id===byId);if(B){pbS(B.id,pbName(B)).k++;pbSay(B,pbLine('gotYou',B),true);}}}catch(e){}return r;};}
// my kills count for me too
{const k0=MPH.dz;if(k0)MPH.dz=function(m){const r=k0.apply(this,arguments);try{if(m.op==='kill'&&m.by===mp.id)pbS(mp.id,meName()).k++;}catch(e){}return r;};}
// ---------------------------------------------------------------- 🧠 each AI pilot's own plan, every couple of seconds
const PBT={t:0,far:0};
setInterval(()=>{try{if(!started||!AIB.L.length||menu.open)return;const now=performance.now();const me=dzMe()||D.pos;const battle=DZ.on&&DZ.ai;
  for(const B of AIB.L){const pp=pbP(B);
    // came back after being blown up
    if(B.dead){B._dead=true;continue;}if(B._dead){B._dead=false;B.hp=B.hpMax||B.hp;if(Math.random()<0.7)pbSay(B,pbLine('respawn',B),true);}
    if(pbBusy(B))continue;if(!(B.kind==='drone'||B.kind==='heli'))continue;
    if(battle){const f=B.hpMax?B.hp/B.hpMax:1;
      // low health → fall back, fix up, come back
      if(f<0.35&&!(B.retreatT>now)&&pp.brave<0.85){B.retreatT=now+12000;B.hunt=null;const away=B.p.clone().sub(me);away.y=0;away.setLength(60);B.goal={x:B.p.x+away.x,z:B.p.z+away.z,h:10,kind:'go'};pbSay(B,pbLine('low',B),true);continue;}
      if(B.retreatT>now){B.hp=Math.min(B.hpMax||B.hp,(B.hp||0)+(B.hpMax||22)*0.02);continue;}if(B.retreatT&&B.retreatT<=now){B.retreatT=0;pbSay(B,pbLine('back',B),true);}
      // pick a target like a player: grudges first, then close / weak ones (never teammates)
      if(!(B.planT>now)){B.planT=now+9000+Math.random()*9000;const C=[];if(B.team!=='me'&&!DZ.dead&&!(D.shield>now))C.push({id:'me',p:me,hp:VH.max?VH.hp/VH.max:1,n:meName()});
        for(const X of pbAlive())if(X!==B&&!(B.team==='me'&&X.team==='me'))C.push({id:X.id,p:X.p,hp:X.hpMax?X.hp/X.hpMax:1,n:pbName(X)});
        if(C.length){C.forEach(c=>{c.sc=c.p.distanceTo(B.p)+c.hp*60-(PB.grudge[B.id]===(c.id==='me'?mp.id:c.id)?80:0)+Math.random()*40;});C.sort((a,b)=>a.sc-b.sc);const t=C[0];
          B.hunt=t.id==='me'?'me':t.id;B.huntCmd=false;if(Math.random()<pp.chat*0.6){if(t.id==='me')pbSay(B,pbLine('huntMe',B));else{if(pbSay(B,pbLine('hunt',B,t.n))){const T=AIB.L.find(x=>x.id===t.id);if(T&&Math.random()<0.6)setTimeout(()=>{if(!T.dead)pbSay(T,pbLine('banter',T,pbName(B)),true);},2600);}}}}}}
    else{B.hunt=B.huntCmd?B.hunt:null;
      // calm time: sometimes wander, follow you, show off, or invite you to play
      if(!(B.planT>now)){B.planT=now+25000+Math.random()*30000;const r=Math.random();
        if(r<0.3){const P=aiPlaces().filter(p=>!/truck|fire$/.test(p.n));const pl=PICK(P);sbPilotGo(B,pl);if(Math.random()<pp.chat*0.5)pbSay(B,'I\'m gonna check out '+pl.n+' 🧭');}
        else if(r<0.45&&B.p.distanceTo(me)<120){B.goal={kind:'chase',t:20};if(Math.random()<pp.chat)pbSay(B,pbLine('idleCalm',B).replace(/^.*$/,m=>/tag along/.test(m)?m:'Mind if I tag along, '+meName()+'? ✈️'));}
        else if(r<0.55&&B.p.distanceTo(me)<60){aiFlip(B);if(Math.random()<0.4)pbSay(B,'Watch this! 🤸');}
        else if(r<0.65){const k=PICK(['race','tag','hide']);if(pbSay(B,k==='race'?'Anyone wanna race? 🏁':k==='tag'?'Who wants to play tag? 🏃':'Hide and seek, anyone? 🙈'))aiOffer(k,B);}}}}
  // nobody's heard from you in a while and you're far away
  if(battle&&me&&now-AIC.lastChat>90000&&now-PBT.far>120000){const n=pbAlive().sort((a,b)=>a.p.distanceTo(me)-b.p.distanceTo(me));if(n.length&&n[0].p.distanceTo(me)>150){PBT.far=now;pbSay(n[0],pbLine('whereU',n[0]));}}
  // now and then, battle chatter
  if(battle&&Math.random()<0.04){const B=PICK(pbAlive());if(B){const t=PICK(pbAlive().filter(x=>x!==B));const l=pbLine('idleBattle',B,t?pbName(t):'Blaze');if(pbSay(B,l)&&/team up|blow up next/.test(l))aiOffer(/team up/.test(l)?'team':'advice',B);}}}catch(e){console.warn('pb',e);}},2000);
// near misses: a rocket whooshes right past an AI pilot
{const t0=tickShots;tickShots=function(dt){const r=t0.apply(this,arguments);try{for(const s of shots){if(!s.own||s.w!=='rocket'||!s.m||s.nm)continue;for(const B of AIB.L){if(B.dead)continue;const d=B.p.distanceTo(s.m.position);if(d<4&&d>2.2){s.nm=1;if(Math.random()<0.5)pbSay(B,pbLine('closeCall',B),true);break;}}}}catch(e){}return r;};}
// "yes" to "anyone wanna team up?"
{const o0=gameStart;gameStart=function(kind,B){if(kind==='team'){const L=B?[B]:aiNear(1e9).slice(0,1);L.forEach(x=>{x.team='me';x.hunt=null;sbSay({B:x},PICK(['Teammates! 🤝 I\'ve got your back','Team us! Let\'s get \'em 💪']),300);});return;}if(kind==='advice'){smartHear('who should i blow up next');return;}return o0.apply(this,arguments);};}
// ---------------------------------------------------------------- 💬 things players say to each other
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const W=nWho(s);const B=(W.find(w=>w.B)||{}).B||aiNear(1e9)[0];const now=performance.now();if(!B)return s0.apply(this,arguments);
    const L=W.length?W.filter(w=>w.B).map(w=>w.B):pbAlive().slice(0,3);
    if(/ (which|what) team (are you|you) on | are you on my team | whose side are you on | are you with me /.test(s)){L.forEach((X,i)=>sbSay({B:X},X.team==='me'?'I\'m on YOUR team! 🤝':DZ.on&&DZ.ai?'Free-for-all — I\'m on my own team 😈 (say "be on my team"!)':'No teams right now — we\'re just flying for fun 😄',400+i*600));return true;}
    if(/ (help me|i need help|save me|i am under attack|they are attacking me|someone help) /.test(s)&&DZ.on&&DZ.ai){const me=dzMe()||D.pos;const foe=pbAlive().filter(X=>X.hunt==='me'||X.p.distanceTo(me)<60).filter(X=>X.team!=='me').sort((a,b)=>a.p.distanceTo(me)-b.p.distanceTo(me))[0];
      const helpers=pbAlive().filter(X=>X!==foe).sort((a,b)=>a.p.distanceTo(me)-b.p.distanceTo(me)).slice(0,2);helpers.forEach((X,i)=>{X.team='me';X.cmdT=now;if(foe){X.hunt=foe.id;X.huntCmd=true;}else X.goal={kind:'chase',t:25};sbSay({B:X},foe?PICK(['On my way! I\'ll get '+pbName(foe)+' 🛡️','Hang on '+meName()+', I\'m coming! 🚀']):'Coming to help! 🛡️',400+i*600);});if(foe&&foe.hunt==='me')setTimeout(()=>pbSay(foe,'Uh oh, they called for backup 😬',true),2500);return true;}
    if(/ (gg|good game|ggs|well played|wp) /.test(s)){L.slice(0,2).forEach((X,i)=>sbSay({B:X},PICK(['gg! 🤝','gg — rematch? 😤','Good game! That was fun 😄']),400+i*700));aiOffer('race',L[0]);return true;}
    if(/ rematch /.test(s)){DZ.on=true;DZ.ai=true;LS.set('dzAi',true);L.forEach((X,i)=>{X.hp=X.hpMax||X.hp;sbSay({B:X},PICK(['You\'re ON! 😤','Rematch! Let\'s go 💥','This time I\'m winning 😈']),400+i*600);});return true;}
    if(/ (how much health|your health|how hurt|are you hurt|are you ok|you okay|you alright|how damaged) /.test(s)){L.forEach((X,i)=>{const f=X.hpMax?X.hp/X.hpMax:1;sbSay({B:X},f>0.8?'I\'m all good! 💪 ('+Math.round(f*100)+'%)':f>0.4?'A bit beat up — '+Math.round(f*100)+'% 🩹':'Barely hanging on… '+Math.round(f*100)+'% 💔',400+i*600);});return true;}
    if(/ (who is winning|whos winning|leaderboard|scoreboard|scores|standings) /.test(s)){if(!Object.values(PB.score).some(x=>x.k||x.d)){sbSay({B},DZ.on&&DZ.ai?'Nobody\'s scored yet — it\'s anybody\'s game! 🏆':'No battle going — say "battle" to start one! 💥');return true;}const T=Object.values(PB.score).filter(x=>x.k||x.d).sort((a,b)=>(b.k-b.d*0.5)-(a.k-a.d*0.5)).slice(0,5);sbSay({B},'🏆 '+T.map((x,i)=>(i+1)+'. '+x.n+' '+x.k+'💥/'+x.d+'💀').join(' · '));return true;}
    if(/ (nice shot|good shot|great shot|nice one|good one) /.test(s)){sbSay({B},PICK(['Thanks! 😎','I\'ve been practicing 🎯','You saw that?! 😄']));return true;}
    if(/ (lol|lmao|haha+|hehe+|rofl) /.test(s)){sbSay({B},PICK(['😂','haha 😆','lol 🤣']));return true;}
    if(/ (you missed|missed me|ha missed) /.test(s)){sbSay({B},PICK(['Next one won\'t miss 😤','Lucky dodge! 😠','Hold still then! 😆']));return true;}
    if(/ (i will get you|im coming for you|you are going down|youre going down|watch out) /.test(s)){sbSay({B},PICK(['Bring it! 😤','Try me! 😜','Ooh, scary 😆']));return true;}
  }catch(e){console.warn('pb hear',e);}return s0.apply(this,arguments);};}
// the scoreboard in the battle menu
{const i0=typeof dzItems==='function'?dzItems:null;if(i0)dzItems=function(){const L=i0();try{const T=Object.values(PB.score).filter(x=>x.k||x.d).sort((a,b)=>b.k-a.k).slice(0,6);if(T.length)L.splice(1,0,mInfo('🏆 '+T.map(x=>x.n+' '+x.k+'💥/'+x.d+'💀').join(' · ')));}catch(e){}return L;};}

// chat queue: answers to YOU never get dropped for chatter, and a backlog drains faster
const SAYLOW=new Set();
{SAYQ.push=function(m){Array.prototype.push.call(this,m);while(this.length>6){let i=this.findIndex(x=>SAYLOW.has(x[1]));if(i<0)i=0;this.splice(i,1);}return this.length;};
 setInterval(()=>{if(SAYQ.length>2){const i=SAYQ.findIndex(x=>!SAYLOW.has(x[1]));const m=SAYQ.splice(i<0?0:i,1)[0];if(m){SAYLOW.delete(m[1]);try{aiSayAs.__raw?aiSayAs.__raw(m[0],m[1]):null;}catch(e){}}}},1300);}
