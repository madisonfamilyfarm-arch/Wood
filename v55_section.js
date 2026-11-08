// ================================================================ v55: 📚 GIANT VOCABULARY — the AI knows ~83,000 dictionary words (WordNet): meanings, synonyms, opposites.
// Any word it doesn't know in a command gets looked up and swapped for a synonym it DOES know ("ascend" → higher, "obliterate Blaze" → attack Blaze).
const NSYN_MORE={attack:'ravage devastate exterminate nuke torpedo bombard barrage shell strafe snipe raid storm pound batter clobber wallop whack thump bash pummel ram hammer terminate frag vaporize incinerate erase defeat conquer vanquish overpower destroy eliminate pulverize smash wreck blast bomb assault',
 follow:'chase escort pursue shadow tail trail stalk hound tailgate convoy accompany',go:'explore journey proceed roam travel venture wander drift ramble rove trek voyage cruise sightsee meander mosey',
 hover:'hover idle linger loiter remain wait tarry freeze halt pause stall standby',higher:'arise ascend climb elevate levitate soar rise skyward upward uplift heighten hoist',
 faster:'accelerate hasten hurry quicken speed sprint zoom zip whizz scoot hustle',slower:'brake decelerate slacken slow dawdle crawl creep',lower:'descend plummet plunge dive sink dip nosedive swoop downward',
 land:'alight dock perch settle touchdown',flip:'somersault tumble cartwheel backflip handspring',peace:'armistice befriend ceasefire forgive pacify placate reconcile surrender truce parley',
 dance:'boogie groove jive shimmy tango waltz jig salsa twerk breakdance moonwalk disco',race:'compete contest duel showdown',spin:'pirouette revolve rotate spiral swirl twirl whirl gyrate'};
for(const k in NSYN_MORE){NSYN[k]=NSYN[k]||[];for(const w of NSYN_MORE[k].split(' '))if(!NSYN[k].includes(w))NSYN[k].push(w);}
// ---------------------------------------------------------------- the dictionary loads one letter at a time, only when needed (so the game stays fast on the phone)
const AIW={d:{},st:{},cb:{}};
function AIW_ADD(L,d){AIW.d[L]=d;AIW.st[L]=2;(AIW.cb[L]||[]).forEach(f=>{try{f();}catch(e){}});AIW.cb[L]=[];}
function aiwLoad(L,cb){L=String(L||'').toLowerCase()[0];if(!L||!/[a-z]/.test(L)){cb&&cb();return;}if(AIW.st[L]===2){cb&&cb();return;}(AIW.cb[L]=AIW.cb[L]||[]).push(cb||(()=>{}));if(AIW.st[L])return;AIW.st[L]=1;
  const tryUrl=(urls)=>{if(!urls.length){AIW.st[L]=0;const c=AIW.cb[L];AIW.cb[L]=[];c.forEach(f=>{try{f();}catch(e){}});return;}const s=document.createElement('script');s.src=urls[0];s.onerror=()=>{s.remove();tryUrl(urls.slice(1));};document.head.appendChild(s);};
  tryUrl(['words/ai-words-'+L+'.js','https://madisonfamilyfarm-arch.github.io/Wood/words/ai-words-'+L+'.js']);}
// word forms: "ascending" → ascend, "obliterated" → obliterate, "bunnies" → bunny
function aiwForms(w){w=w.toLowerCase();const f=[w];const add=x=>{if(x&&x.length>=2&&!f.includes(x))f.push(x);};
  if(/ies$/.test(w))add(w.slice(0,-3)+'y');if(/ied$/.test(w))add(w.slice(0,-3)+'y');if(/es$/.test(w))add(w.slice(0,-2));if(/s$/.test(w))add(w.slice(0,-1));
  if(/ing$/.test(w)){add(w.slice(0,-3));add(w.slice(0,-3)+'e');if(/(.)\1ing$/.test(w))add(w.slice(0,-4));}if(/ed$/.test(w)){add(w.slice(0,-2));add(w.slice(0,-1));if(/(.)\1ed$/.test(w))add(w.slice(0,-3));}
  if(/er$/.test(w)){add(w.slice(0,-2));add(w.slice(0,-1));}if(/est$/.test(w)){add(w.slice(0,-3));add(w.slice(0,-2));}if(/ly$/.test(w))add(w.slice(0,-2));return f;}
function aiwGet(w){for(const x of aiwForms(w)){const d=AIW.d[x[0]];if(d&&d[x]!=null){const [g,s,a]=d[x].split('|');return{w:x,g,s:s?s.split(','):[],a:a?a.split(','):[]};}}return null;}
function aiwCount(){return 82697;}
// a known command word for an unknown one (checks the word, its synonyms, and the synonyms' meanings)
function aiwMap(w){const e=aiwGet(w);if(!e)return null;for(const x of [e.w,...e.s]){const k=nDecode(x);if(k)return k;}
  const KN=['follow','attack','land','race','flip','spin','dance','hide','hover','faster','slower','higher','lower','go','home','fly','shoot','explode','climb','stop','wait','come'];for(const x of e.s)if(KN.includes(x))return x;return null;}
// every word the game itself uses (place names, games, commands…) counts as known — no dictionary needed
let AIW_G=null;function aiwGame(w){if(!AIW_G){AIW_G=new Set();try{for(const sc of document.scripts){const q=(sc.textContent||'').toLowerCase().match(/'[^'\n]{1,400}'|"[^"\n]{1,400}"|\/[^\/\n*][^\/\n]{1,400}\//g)||[];for(const z of q){const m=z.match(/[a-z]{4,}/g);if(m)for(const x of m)AIW_G.add(x);}}}catch(e){}}return aiwForms(w).some(x=>AIW_G.has(x));}
// a fancy verb we can't map, followed by a place → just "go"
function aiwVerb(w,t){const e=aiwGet(w);if(!e||!/verb:/.test(e.g))return null;if(new RegExp(' '+w+' (home|to|over|back|towards?|into|at) ').test(t))return'go';return null;}
// game words the dictionary doesn't have (or explains wrong for RC)
const GLOSS={quadcopter:'a drone with 4 propellers — two spin one way, two the other, so it can hover 🚁',fpv:'"first person view" — you see from a camera ON the drone, like you\'re the pilot 🎥',gimbal:'a motor mount that keeps the camera steady and level while the drone tilts 📷',
 lipo:'a lithium-polymer battery — the light, powerful kind RC stuff uses 🔋',mah:'battery size (milliamp-hours) — bigger number = longer flights 🔋',esc:'"electronic speed controller" — it tells each motor how fast to spin ⚡',
 throttle:'the stick that sets power — up = more lift / more speed',yaw:'turning left/right on the spot (like shaking your head "no")',pitch:'tilting nose up/down — tilt forward to fly forward',roll:'tilting left/right — that\'s how a drone slides sideways',
 gyro:'a sensor that feels rotation so the drone stays stable 🌀',acro:'acro mode = no self-leveling. You control every flip yourself 🤸',rth:'"return to home" — the drone flies itself back to where it took off 🏠',gps:'satellites tell the drone where it is so it can hold still or fly home 🛰️',
 drone:'a flying robot you pilot with a remote 🚁',heli:'a helicopter — one big rotor on top and a little tail rotor',prop:'a propeller — the spinning blade that makes lift',props:'propellers — the spinning blades that make lift',
 tnt:'the explosive you can drop or throw in the game 💣 (Weapons menu → TNT type lets you pick 17 kinds)',rpg:'a rocket launcher 🚀',torpedo:'an underwater missile — subs fire them, and in this game they turn into rockets out of the water 🌊🚀',
 kamikaze:'flying straight into something on purpose 💥',strafe:'flying sideways while shooting',rc:'"radio controlled" — anything you drive or fly with a remote 🎮'};
// ---------------------------------------------------------------- 💬 dictionary questions + unknown-word decoding
{const s0=smartHear;smartHear=function(txt){try{const raw=String(txt||'');const s=nNorm(raw);const W=nWho(s);const B=(W.find(w=>w.B)||{}).B||aiNear(1e9)[0];
    const q=s.match(/ (?:what does|what do|whats|what is the meaning of|meaning of|define|definition of|what is a|what is an|what are|what is) ([a-z'-]{3,24}) (?:mean|means|stand for )?$/)||s.match(/ (?:what does|what do) ([a-z'-]{3,24}) mean /)||s.match(/ (?:define|definition of|meaning of) ([a-z'-]{3,24}) /);
    const sy=s.match(/ (?:another word for|synonyms? (?:for|of)|other words for|a word for|what is another word for) ([a-z'-]{3,24}) /);
    const an=s.match(/ (?:opposite of|antonyms? (?:for|of)) ([a-z'-]{3,24}) /);
    const iw=s.match(/ is ([a-z'-]{3,24}) a (?:real )?word /);
    const sp=s.match(/ (?:how do you spell|how to spell|spell) ([a-z'-]{3,24}) /);
    const hm=s.match(/ how many words do you know /);
    if(hm&&B){sbSay({B},'📚 About '+aiwCount().toLocaleString()+' dictionary words — ask me "what does enormous mean?" or "another word for fast"!');return true;}
    const ask=(q&&q[1])||(sy&&sy[1])||(an&&an[1])||(iw&&iw[1])||(sp&&sp[1]);
    if(ask&&B&&!(q&&(typeof FACTS!=='undefined')&&/ what is (a|an) /.test(s)&&false)){const w=ask.replace(/^(a|an|the) /,'');
      // let the game answer its own stuff first ("what is TNT", "what is a quadcopter")
      const plainWhat=q&&!sy&&!an&&!iw&&!sp&&/ what (is|are) /.test(s)&&!/ mean /.test(s);
      if(plainWhat&&/^(that|this|those|these|there|here|what|which|who|your|you|happening|going|wrong|new|next|good|best|fun|everyone|everybody|the|time|today|up|its|it|my|our|their|his|her|score|winning|left|right|north|south|east|west)$/.test(w))return s0.apply(this,arguments);
      if(GLOSS[w]&&(q||iw)){sbSay({B},'📖 '+w+' — '+GLOSS[w]);return true;}
      const me=this,args=arguments;
      aiwLoad(w,()=>{const e=aiwGet(w);if(plainWhat&&!e){s0.apply(me,args);return;}
        if(sp){sbSay({B},'🔤 '+(e?e.w:w).toUpperCase().split('').join('-')+(e?'':' (that\'s how it sounds — not sure it\'s a real word!)'));return;}
        if(!e){sbSay({B},PICK(['Hmm, "'+w+'" isn\'t in my dictionary 🤔 Maybe it\'s spelled differently?','I don\'t know the word "'+w+'" yet 📚']));return;}
        if(iw){sbSay({B},'✅ Yep! "'+e.w+'" is a word — '+e.g.split(' ¦ ')[0]);return;}
        if(sy){sbSay({B},e.s.length?'📚 Other words for "'+e.w+'": '+e.s.slice(0,6).join(', '):'Hmm, I don\'t know another word for "'+e.w+'" 🤔');return;}
        if(an){sbSay({B},e.a.length?'↔️ The opposite of "'+e.w+'" is "'+e.a.join('" or "')+'"':'Hmm, I don\'t know an opposite for "'+e.w+'" 🤔');return;}
        sbSay({B},'📖 '+e.w+' — '+e.g.replace(/ ¦ /g,' • ')+(e.s.length?' (like: '+e.s.slice(0,3).join(', ')+')':''));});return true;}
    // unknown words in a command: look them up, swap in a word the AI knows, then hear it again
    {let t=' '+s.trim()+' ',ch=false;for(const w of nWords(s)){if(w.length<5||nDecode(w))continue;for(const f of aiwForms(w).slice(1)){const k=nDecode(f);if(k&&f.length>=4){t=t.replace(' '+w+' ',' '+f+' ');ch=true;break;}}}if(ch&&!AIW.busy){AIW.busy=true;try{return smartHear(t.trim());}finally{AIW.busy=false;}}}
    if(!AIW.busy&&!/ (my name|call me|called|i am) ?/.test(s)){const ws=nWords(s).filter(w=>w.length>=5&&!/^\d/.test(w)&&!SPEECH_KEEP.has(w)&&!aiwGame(w)&&!nDecode(w)&&!W.some(x=>((x.B&&x.B.name)||(x.C&&x.C.name)||'').toLowerCase().includes(w))).slice(0,3);
      if(ws.length&&ws.every(w=>AIW.st[w[0]]!==2)){let n=ws.length;const done=()=>{if(--n>0)return;let t=' '+s.trim()+' ',ch=false;for(const w of ws){const m=aiwMap(w)||aiwVerb(w,t);if(m!=null){t=t.replace(' '+w+' ',m?' '+m+' ':' ');ch=true;}}AIW.busy=true;try{if(ch)smartHear(t.trim());else s0.call(this,raw);}finally{AIW.busy=false;}};ws.forEach(w=>aiwLoad(w,done));return true;}
      let t=' '+s.trim()+' ',ch=false;for(const w of ws){const m=aiwMap(w)||aiwVerb(w,t);if(m!=null){t=t.replace(' '+w+' ',m?' '+m+' ':' ');ch=true;}}if(ch){AIW.busy=true;try{return s0.call(this,t.trim());}finally{AIW.busy=false;}}}
  }catch(e){console.warn('aiw',e);}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
