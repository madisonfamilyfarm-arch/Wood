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
