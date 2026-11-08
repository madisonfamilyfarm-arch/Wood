// ================================================================ v59: 👀 AI pilots notice what YOU do and react like friends playing with you
// (stunts, crashes, smooth landings, new vehicles, going super high, diving under water, finding treasure)
const PRX={t:{},last:{state:null,kind:null,alt:0}};
function rxSay(key,lines,cd){const now=performance.now();if(PRX.t[key]&&now-PRX.t[key]<(cd||25000))return;const me=dzMe();if(!me)return;
  const B=pbAlive().filter(X=>X.p.distanceTo(me)<160).sort((a,b)=>a.p.distanceTo(me)-b.p.distanceTo(me))[0];if(!B)return;if(pbSay(B,PICK(lines).replace(/\{me\}/g,meName()),true))PRX.t[key]=now;}
// coins/awards = you just did something cool
{const a0=award;award=function(name){const r=a0.apply(this,arguments);try{const n=String(name||'');
  if(r!==false){if(/Inverted/.test(n))rxSay('inv',['Upside down?! 🙃 Show off!','Whoa, inverted! 😮']);
    else if(/Smooth landing/.test(n))rxSay('land',['Butter landing! 🧈','Smooth! 👌','Perfect landing, {me}! 🛬'],40000);
    else if(/Big air|🦘/.test(n))rxSay('air',['BIG AIR! 🦘','Sending it! 🚀','You flew! 😂']);
    else if(/Close call/.test(n))rxSay('close',['That was SO close 😱','Almost! 😅']);
    else if(/treasure|Treasure|gem/.test(n))rxSay('tre',['Treasure?! Share it! 💰','Ooh shiny! 💎','Lucky! 🍀'],60000);
    else if(/Speed record|⚡/.test(n))rxSay('spd',['Speed demon! ⚡','How fast was that?! 💨']);
    else if(/Fire out/.test(n))rxSay('fire',['Hero! 🚒','The woods thank you 🌲'],60000);
    else if(/Pirouette/.test(n))rxSay('pir',['Fancy spin! 🌪','Ballerina drone 🩰']);}}catch(e){}return r;};}
// watching your drone: crashes, new vehicles, super high, under water, walking
setInterval(()=>{try{if(!started||!AIB.L.length||menu.open||AIC.quiet)return;const L=PRX.last;const st=WALK.on?'walk':D.state;const k=WALK.on?'walk':vhKind();
  if(st!==L.state){if((st==='down'||st==='tumble')&&(L.state==='flying'||L.state==='takeoff')&&!DZ.dead)rxSay('crash',['Ouch! You okay, {me}? 😬','Oof, that looked painful 🤕','Did that tree jump out at you? 🌲😂','Crash! Need a hand? 🔧']);
    if(st==='walk'&&L.state&&L.state!=='walk')rxSay('walk',['Going for a walk? 🚶','Stretching your legs? 😄'],60000);}
  if(k!==L.kind&&L.kind&&k!=='walk'){rxSay('veh',k==='tank'?['A TANK?! I\'m scared now 😨','Ooh, tank time! 🪖']:k==='sub'?['Sub! Going to find the sea? 🌊','Bubbles! 🫧']:k==='plane'?['Nice plane! ✈️','Race you in the air! ✈️']:k==='boat'?['Boat party! 🚤','Splash! 🌊']:k==='car'||k==='monster'?['Vroom vroom! 🏎️','Nice ride! 🚙']:['New ride! 😎'],30000);}
  const me=dzMe();if(me){const alt=me.y-H(me.x,me.z);if(alt>90&&L.alt<=90)rxSay('high',['Whoa, you\'re SO high! ☁️','Can you see my house from up there? 🏠😂']);
    if(typeof WATER_Y!=='undefined'&&me.y<WATER_Y-3&&k==='sub'&&!(L.uw))rxSay('uw',['Down we go! 🐟','Look for the glowing ring at the bottom! ✨'],90000);L.uw=me.y<WATER_Y-3;L.alt=alt;}
  L.state=st;L.kind=k;}catch(e){}},700);
// AI pilots' random "flying over the lake ✈️" lines came out every couple of seconds → each pilot says a random line at most every 25 s (answers to YOU are never held back)
const BOTSAY={b:{},g:0};
{const c0=chatAdd;chatAdd=function(who,txt){try{if(!chatAdd.force&&!chatAdd.remote&&typeof who==='string'&&/^🤖 /.test(who)&&AIB.L.some(B=>B.name===who)){const now=performance.now();if(now-(BOTSAY.b[who]||-1e9)<25000||now-BOTSAY.g<6000)return;BOTSAY.b[who]=now;BOTSAY.g=now;}}catch(e){}return c0.apply(this,arguments);};}
// ---------------------------------------------------------------- 🧠 the AI remembers your favorites + pets ("my favorite color is purple" → later "what's my favorite color?")
function memSave(){try{LS.set('aiMem',AIC.mem);}catch(e){}}
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const W=nWho(s);const B=(W.find(w=>w.B)||{}).B||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);const M=AIC.mem;M.fav=M.fav||{};M.pets=M.pets||{};
    let m=s.match(/ my (?:favorite|favourite|fav) ([a-z ]{2,20}?) (?:is|are) ([a-z0-9' -]{1,30}) $/);
    if(m){const k=m[1].trim(),v=m[2].trim().replace(/ (too|also)$/,'');M.fav[k]=v;memSave();sbSay({B},PICK([v[0].toUpperCase()+v.slice(1)+' — nice! I\'ll remember 😄','Ooh, '+v+'! Good choice 👍','Got it — your favorite '+k+' is '+v+' 📝']));return true;}
    m=s.match(/ (?:what is|whats|what are|do you know|do you remember|tell me) my (?:favorite|favourite|fav) ([a-z ]{2,20}?) $/);
    if(m){const k=m[1].trim();const v=M.fav[k]||M.fav[k.replace(/s$/,'')];sbSay({B},v?'Your favorite '+k+' is '+v+'! 😄':'You haven\'t told me your favorite '+k+' yet! What is it? 🤔');return true;}
    m=s.match(/ i (?:have|got|own) (?:a|an|two|three|\d+) ([a-z]{2,15}) (?:named|called|whose name is) ([a-z0-9'-]{1,20}) /)||s.match(/ my ([a-z]{2,15})s? name is ([a-z0-9'-]{1,20}) /);
    if(m&&!/^(first|last|middle|user|screen|real|nick)$/.test(m[1])){m[2]=m[2][0].toUpperCase()+m[2].slice(1);M.pets[m[1]]=m[2];memSave();sbSay({B},PICK(['Aww, '+m[2][0].toUpperCase()+m[2].slice(1)+' the '+m[1]+'! 🐾','I love that name! Hi '+m[2]+'! 👋']));return true;}
    m=s.match(/ (?:what is|whats|what s|do you know|do you remember) my ([a-z]{2,15}?)s? (?:name|called) /);
    if(m&&m[1]!=='name'){const v=M.pets[m[1]];sbSay({B},v?'Your '+m[1]+' is '+v+'! 🐾':'You didn\'t tell me your '+m[1]+'\'s name yet! 🐾');return true;}
    if(/ (what did i say my name was|did you forget my name|do you know my name|what did i tell you my name was) /.test(s)){sbSay({B},M.name?'You\'re '+M.name+'! How could I forget 😄':'You haven\'t told me yet! Say "my name is …" 😊');return true;}
    if(/ (forget|delete|erase) my name /.test(s)){delete M.name;memSave();sbSay({B},'Okay, forgotten! 🧹');return true;}
    if(/ (forget|delete|erase) (everything|all of it|what you know)( about me)? /.test(s)){AIC.mem={};memSave();sbSay({B},'All forgotten! Fresh start 🧹✨');return true;}
    if(/ i am \d+ (years old|year old|yrs old)? ?$| im \d+ years old /.test(s)){sbSay({B},PICK(['Cool! 🎂','Nice! I\'m as old as this game 😄']));return true;}
    if(/ how old am i /.test(s)){sbSay({B},'You\'d know better than me! 😄');return true;}
    if(/^ i live (on|in|at|near|by) /.test(s)){sbSay({B},PICK(['Sounds awesome! 🏡','Cool! I live in these woods 🌲']));return true;}
    if(/ where do i live /.test(s)){sbSay({B},'Somewhere awesome, I bet! 🏡 (I only know these woods 🌲)');return true;}
    if(/ what do you (know|remember) about me /.test(s)){const L=[];if(M.name)L.push('you\'re '+M.name);if(M.likes&&M.likes.length)L.push('you like '+M.likes.slice(-4).join(', '));for(const k in M.fav)L.push('your favorite '+k+' is '+M.fav[k]);for(const k in M.pets)L.push('your '+k+' is '+M.pets[k]);sbSay({B},L.length?'I know '+L.join(', ')+' 😊':'Not much yet! Tell me stuff — "my name is…", "I like…" 😄');return true;}
  }catch(e){console.warn('mem',e);}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
// ---------------------------------------------------------------- 🤔 vague messages get a real question back (not "say that again"), "come on / let's go" = follow me, "everyone except Ace …"
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const W=nWho(s);const B=(W.find(w=>w.B)||{}).B||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);
    const s2=s.replace(/ (ace|blaze|comet|gizmo|dash|max|nova|zip|bolt|rex) /g,' ').replace(/ +/g,' ');if(AIC.offer&&performance.now()-(AIC.offerT||0)<30000)return s0.apply(this,arguments);
    if(/^ (go there|go over there|go that way|over there|there) $/.test(s2)){sbSay({B},'Go where? 🤔 Say a place — like "the lake", "the airfield" or "the fire tower"!');return true;}
    if(/^ (do it|do that|do that thing|do the thing|the thing|that thing|get it|get that|that one|this one) $/.test(s2)){sbSay({B},'Do what? 🤔 Tell me — like "do a flip", "follow me" or "race me"!');return true;}
    if(/^ (come on|cmon|c mon|lets go|let us go|lets roll|move it|come along|on me|with me) $/.test(s2)){return s0.call(this,(W.length?W.map(w=>pbName(w.B||{name:''})).join(' and ')+' ':'')+'follow me');}
    const ex=s.match(/ (everyone|everybody|all of you|you all|guys) (except|but|but not|other than) ([a-z0-9 -]+?) (follow|land|come|race|attack|go|stop|hover|flip|spin|dance)/);
    if(ex){const skip=AIB.L.filter(X=>ex[3].indexOf(pbName(X).toLowerCase())>=0);const keep=pbAlive().filter(X=>!skip.includes(X));if(skip.length&&keep.length){const rest=s.slice(s.indexOf(' '+ex[4]+' ')).trim();return s0.call(this,keep.map(pbName).join(' and ')+' '+rest);}}
  }catch(e){console.warn('vague',e);}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
