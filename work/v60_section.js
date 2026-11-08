// ================================================================ v60: 🧑‍🏫 the AI pilots can explain how to play (and change settings for you): driving, diving, walking, battle on/off, more/fewer/harder AI, night…
const AIDIFF={k:LS.get('aiDiff',1)};
{const b0=dzBotsShoot;dzBotsShoot=function(dt){return b0.call(this,dt*AIDIFF.k);};}
const GQ2=[
 [/ how (do|can) (i|you) (drive|steer|control|use) (the |a |my )?(tank|car|truck|boat|buggy)/,()=>'🚙 Left stick ▲ = gas, ▼ = reverse · right stick ◀▶ = steer. The top button is 🚦 GO / 🛑 STOP'],
 [/ how (do|can) (i|you) (go|get|dive) (under ?water|under the water|underwater|to the bottom|deep)/,()=>'🐟 Get the submarine (Menu → ✈️ Fly → vehicles, or say "switch to a sub"), drive onto the lake, then right stick ▼ = dive!'],
 [/ how (do|can) (i|you) (get out|walk|climb out|leave the drone|get out of the (drone|car|plane|vehicle))| can i walk /,()=>'🚶 Tap the 🚶 button at the top (or press K) to climb out and walk. Tap it again to fly!'],
 [/ how (do|can) (i|you) (make it|go|fly|drive) (go )?faster /,()=>'⚡ Tap NORMAL at the top → SPORT for full speed! (Menu → 🔍 "speed" has more)'],
 [/ (my|the) (drone|plane|heli|car) (keeps|always|just) (crashing|crashes|falling|hitting)| i (keep|always) crash/,()=>'🛟 Tips: use 🎬 CINE or NORMAL speed, fly higher than the trees 🌲, and try Menu → ✈️ Fly → 🎓 Lessons. Obstacle braking helps too!'],
 [/ why (cant|can not|cannot|wont|doesnt) (i|it|my drone) (shoot|fire)| how (do|can) i (shoot|fire)( rockets)? /,()=>'🚀 Turn on Battle (Menu → 💥 Weapons & battle), then tap 🔁 until it shows 🚀 — a big 🎯 FIRE button appears!'],
 [/ why (cant|can not|cannot|wont|doesnt) (i|it|my drone) (fly|take off|go up|start)| (it|my drone|the drone) (wont|doesnt|cant|will not|does not) (take off|fly|start|go up) /,()=>'🛫 Tap TAKE OFF at the top (or pull both sticks down-and-in to start the motors, then push the left stick up). Broken? Tap 🔧 FIX. Battery empty? Land on the pad 🔋'],
 [/ (turn on|start|enable|activate) (the )?battle( mode)? | how do i (turn on|start) (a )?battle /,()=>{DZ.on=true;DZ.ai=true;LS.set('dzAi',true);return'💥 Battle is ON! Rockets ready — watch out 😈 (say "stop fighting" to end it)';}],
 [/ (turn off|stop|end|disable) (the )?battle( mode)? | how do i (turn off|stop|end) (the )?battle | stop the ai from (shooting|attacking|killing) me | make the ai stop (shooting|attacking)/,()=>{DZ.ai=false;LS.set('dzAi',false);AIB.L.forEach(B=>{B.hunt=null;B.bomb=null;});return'🕊 Okay — the AI won\'t shoot anymore. Friends! 🤝';}],
 [/ how many (ai|bots|ai pilots|computer players) (can|could) (there be|i have|you add)/,()=>'🤖 You can have lots! Menu → 🤖 AI players → AI pilots — or say "add more AI" / "remove the AI"'],
 [/ (add|spawn|get|bring|i want) (more|another|an|1|one more) (ai|bot|bots|ai pilot|ai pilots|computer player)/,()=>{const n=Math.min(10,AIB.L.length+1);try{aiSet(n);}catch(e){}return'🤖 Another pilot joined! ('+n+' now)';}],
 [/ (remove|delete|get rid of|kick|no more) (the |all the )?(ai|bots|ai pilots)/,()=>{try{aiSet(0);}catch(e){}toast('🤖 AI pilots removed — say "add more AI" to bring them back',2500);return null;}],
 [/ make (the )?(ai|bots|them|you) (harder|stronger|better|tougher|more difficult)/,()=>{AIDIFF.k=Math.min(2.5,AIDIFF.k+0.5);LS.set('aiDiff',AIDIFF.k);return'😈 Okay, we\'ll shoot faster now! (level '+AIDIFF.k+')';}],
 [/ make (the )?(ai|bots|them|you) (easier|weaker|worse|less hard|nicer)/,()=>{AIDIFF.k=Math.max(0.25,AIDIFF.k-0.5);LS.set('aiDiff',AIDIFF.k);return'😇 Okay, we\'ll go easy on you (level '+AIDIFF.k+')';}],
 [/ how (do|can) (i|you) save (my |the )?(build|drone|tank|car|creation|design)/,()=>'💾 The builder saves by itself as you go! To keep a copy, open the builder → start screen → 📂 files'],
 [/ (whats|what is|which is) (the )?best (drone|one to fly|plane|heli)/,()=>'🚁 Beginner: Mini 4 (easy). Fastest: the race drone 🏁. Toughest: build one with armor plates 🛡'],
 [/ can (i|you|we) fly (at|in the) night /,()=>'🌙 Yes! Say "make it night" or Menu → 🌦 World → Time of day. Turn on the night-vision camera too!'],
 [/ what (does|do) the red (button|thing) do /,()=>'🔴 The red one is 💣 TNT (hold it to pick a kind). In a battle the big round one is 🎯 FIRE'],
 [/ what is the (yellow|gold) (thing|arrow|triangle|dot) on the map /,()=>'📍 The yellow arrow is YOU! Red dots are fires 🔥, colored dots are other pilots'],
 [/ (what is|whats|explain) acro( mode)? /,()=>'🤸 Acro = no auto-leveling. YOU control every tilt — great for flips, harder to fly. Normal mode levels itself'],
 [/ can (i|you|we) jump /,()=>'🦘 When you\'re walking 🚶, press Space (keyboard) to jump!'],
 [/ how (big|large|huge) can (the )?(tnt|explosion|explosions|bomb|blast) (get|be|go)/,()=>'☢️ HUGE! Menu → 💥 Explosion settings → the size slider goes way up — there\'s even a NUKE that flattens 300 m 😱']];
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const W=nWho(s);const B=(W.find(w=>w.B)||{}).B||aiNear(1e9)[0];
    for(const [re,f] of GQ2){if(re.test(s)){const a=f(s,B);if(a===null)return true;if(B&&a){sbSay({B},a);return true;}if(a){toast(a,3000);return true;}}}}catch(e){console.warn('gq2',e);}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
// ---------------------------------------------------------------- 🎭 each AI pilot can describe its own personality (brave / chatty / trash-talker / friendly) — they really act that way in battles
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const W=nWho(s);const L=W.filter(w=>w.B).map(w=>w.B);
    if(/ (what is|whats|describe) your personality | what are you like | tell me about yourself | who are you really /.test(s)){const who=L.length?L:[aiNear(1e9)[0]];who.forEach((B,i)=>{if(!B)return;const p=pbP(B);const t=[];if(p.brave>0.75)t.push('super brave 💪');else if(p.brave<0.45)t.push('a bit careful 😅');if(p.chat>0.75)t.push('really chatty 🗣');if(p.trash>0.6)t.push('a trash-talker 😏');if(p.friendly>0.75)t.push('super friendly 🤗');if(!t.length)t.push('chill 😎');
      sbSay({B},'I\'m '+pbName(B)+' — '+t.join(', ')+'. Favorite ride: '+(['drone 🚁','heli 🚁','plane ✈️','car 🚙','boat 🚤','sub 🐟'][Math.floor(p.chat*5.99)]),400+i*700);});return true;}
    if(/ who is the (best|bravest|toughest|nicest|funniest) (pilot|ai|one|of you)/.test(s)){const k=/brav|tough/.test(s)?'brave':/nice/.test(s)?'friendly':/funn/.test(s)?'trash':'brave';const B=pbAlive().slice().sort((a,b)=>pbP(b)[k]-pbP(a)[k])[0];if(B){sbSay({B},PICK(['Me, obviously 😎','That\'d be me! 🙋','Ask anyone — it\'s me 😏']));return true;}}
  }catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
// ---------------------------------------------------------------- 🎚 the AI adjusts to you: lose a bunch in a row → they go easier; win a bunch → they get tougher (like real players would)
const ADAPT={streakD:0,streakK:0,t:0};
{const d0=dzDie;dzDie=function(){const was=DZ.dead;const r=d0.apply(this,arguments);try{if(!was&&DZ.dead&&DZ.ai){ADAPT.streakD++;ADAPT.streakK=0;if(ADAPT.streakD>=3&&AIDIFF.k>0.5){AIDIFF.k=Math.max(0.5,AIDIFF.k-0.25);ADAPT.streakD=0;const B=pbAlive()[0];if(B)setTimeout(()=>pbSay(B,PICK(['Okay okay, we\'ll go a little easier 😇','Rough round! We\'ll take it easy for a bit 🤝']),true),3000);}}}catch(e){}return r;};}
{const k0=dzBotDie;dzBotDie=function(B){const was=B&&B.dead;const c=HIT.ctx;const r=k0.apply(this,arguments);try{if(B&&!was&&B.dead&&c&&c.id===mp.id&&DZ.ai){ADAPT.streakK++;ADAPT.streakD=0;if(ADAPT.streakK>=4&&AIDIFF.k<2){AIDIFF.k=Math.min(2,AIDIFF.k+0.25);ADAPT.streakK=0;const X=pbAlive()[0];if(X)setTimeout(()=>pbSay(X,PICK(['You\'re too good! Time to get serious 😤','Okay, no more Mr. Nice Bot 😈']),true),2500);}}}catch(e){}return r;};}
