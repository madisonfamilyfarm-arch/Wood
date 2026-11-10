// v77: 🔎 WORD UNDERSTANDER — works like a search engine instead of exact sentences.
//  1) every word is spell-fixed against a vocabulary (closest match: "blowin"→blowing, "firetruk"→firetruck, "blo"→blow, voice garble too)
//  2) words become MEANINGS (concepts): blow/wreck/nuke/destroy/kill/explode/hit → HURT; don't/stop/quit/no more/keep away → NOT …
//  3) every known command is scored by how many meanings it shares with what you said (rare meanings count more, like a search engine);
//     the best match is turned into a sentence the AI already knows and run. Unsure? It asks "Did you mean …?" and "yes" does it.
const WU={sug:null,sugT:0,stats:{n:0,fixed:0,asked:0}};
// ---- concept dictionary: word → meaning
const WU_C={};(function(){const add=(c,ws)=>ws.split(' ').forEach(w=>{if(w)WU_C[w]=c;});
  add('NOT','dont do not stop quit no never nobody noone cease enough nope halt cut knock without leave quitting stopping stahp');
  add('HURT','blow blew blowing blown blowed explode exploding exploded explosion boom kill killing killed shoot shooting shot shoots attack attacking attacked bomb bombs bombing bombed nuke nuking nuked destroy destroying destroyed wreck wrecking wrecked smash smashing smashed hit hitting hurt hurting fight fighting fire firing blast blasting rocket rockets missile missiles tnt dynamite murder pew zap target targeting aim aiming snipe sniping crash crashing obliterate annihilate pop popping torch burn burning');
  add('ME','me my mine myself i im us we our');add('YOU','you u ya yourself your ur');
  add('WHY','why y');add('WHO','who whom whos');add('WHERE','where wheres whereabouts');add('WHAT','what wat wut whats');
  add('FOLLOW','follow following folow chase chasing come behind tail track trail stick');add('AWAY','away distance far back off');
  add('RACE','race racing racer contest speed');add('TAG','tag it');add('HIDE','hide hiding seek');add('PLAY','play game games playing fun bored');
  add('LAND','land landing down touchdown ground alight settle');add('UP','up higher high climb rise ascend');add('LOW','lower low descend sink');
  add('TAKEOFF','takeoff launch');add('FAST','fast faster speed hurry quick quicker zoom boost');add('SLOW','slow slower easy gently careful');
  add('HOME','home base pad launchpad start');add('GO','go goto head fly drive travel move');
  add('FIX','fix repair heal broken broke crashed died dead mend patch');add('HELP','help helping assist');
  add('THANKS','thanks thank thx ty appreciate');add('GOOD','good great nice cool awesome amazing fun epic sweet best love like');add('BAD','bad mean rude awful terrible annoying hate');
  add('FRIEND','friend friends buddy pal team teammate together ally peace nice');add('SORRY','sorry apologize oops');
  add('HELLO','hi hello hey yo howdy sup hiya greetings');add('BYE','bye goodbye later cya gtg leaving goodnight');
  add('AGAIN','again repeat more another');add('WAIT','wait hold hover pause freeze stay loiter linger idle');add('LOOK','look watch see');
  add('NAME','name called');add('FEEL','feel feeling mad angry upset happy sad okay ok doing');
  add('YES','yes yeah yep yup sure ok okay alright correct right');add('NO2','no nah nope wrong');
  add('FIRETRUCK','firetruck firetrucks truck engine');add('HOUSE','house home houses building');add('CABIN','cabin hut shack');add('TREE','tree trees woods forest');
  add('TOWER','tower firetower lookout');add('CAMPER','camper campers camp tent');add('CAR','car cars jeep');add('BOAT','boat boats ship');
  add('PLANE','plane airplane jet');add('TANK','tank tanks');add('DRONE','drone quad quadcopter copter');add('HELI','helicopter heli chopper');
  add('LAKE','lake pond water');add('MEADOW','meadow field');add('AIRFIELD','airfield runway airport strip');add('STUFF','stuff things everything anything everyone everybody anyone anybody all');})();
// "fire" alone next to truck words, or "the fire" when nothing else burns, means the fire truck
const WU_FILL=new Set('the a an to of on at in it is are was be been please pls plz just really very so that this those these and or but now then there here keep keeps kept gonna going get getting got can could would will should do does did dont im it s ll ve d its'.split(' '));
let WU_V=null;function wuVocab(){if(WU_V)return WU_V;const S=new Set(Object.keys(WU_C));try{AIB.L.forEach(b=>S.add(pbName(b).toLowerCase()));}catch(e){}try{aiPlaces().forEach(p=>String(p.n).toLowerCase().split(/\W+/).forEach(w=>w.length>2&&S.add(w)));}catch(e){}
  'follow race land stop blow fire truck please again thanks repair'.split(' ').forEach(w=>S.add(w));WU_V=[...S];return WU_V;}
function wuSkel(w){return w[0]+w.slice(1).replace(/[aeiouyh]/g,'').replace(/(.)\1+/g,'$1');}
function wuFix(w){if(WU_C[w]||WU_FILL.has(w)||w.length<3||/\d/.test(w))return w;let names=[];try{names=AIB.L.map(b=>pbName(b).toLowerCase());}catch(e){}if(names.includes(w))return w;
  if(typeof SPEECH_KEEP_BASE!=='undefined'&&SPEECH_KEEP_BASE.has(w))return w;
  // strip endings: blowin → blow, shootn → shoot
  for(const suf of ['ing','in','n','ed','s','es','er']){if(w.endsWith(suf)&&WU_C[w.slice(0,-suf.length)])return w.slice(0,-suf.length);}
  const V=wuVocab(),lim=w.length>=4?2:1,sk=wuSkel(w);let best=null,bd=9;
  for(const v of V){if(v.length<3||Math.abs(v.length-w.length)>lim+1)continue;let d=levD(w,v)+Math.abs(v.length-w.length)*0.3;if(v[0]!==w[0])d+=1;if(wuSkel(v)===sk&&v.slice(0,2)===w.slice(0,2)&&Math.abs(v.length-w.length)<=1)d=Math.min(d,1);if(d<bd){bd=d;best=v;}}
  return best&&bd<=lim+0.35?best:w;}
// text → {words (spell-fixed), concepts set}
function wuParse(t){const raw=String(t||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\b2\b/g,'to').replace(/\b4\b/g,'for').trim();
  const SH={hier:'higher',hiher:'higher',hire:'higher',lowr:'lower',watcha:'what are you',whatcha:'what are you',wachu:'what are you',doin:'doing',goin:'going',comin:'coming',y:'why',u:'you',r:'are',ur:'your',ya:'you',wat:'what',wut:'what',pls:'please',plz:'please',bc:'because',cuz:'because',dnt:'dont',stp:'stop'};const ws=raw.split(/\s+/).filter(Boolean);let fixed=0;const ADV=/^(should|how|can|could|what)$/;ws.forEach((w,i)=>{if(SH[w]){ws[i]=SH[w];fixed++;}});const out=ws.map(w=>{const f=wuFix(w);if(f!==w&&WU_C[f]){fixed++;return f;}return w;});
  // joined words: "fire truck" → firetruck, "take off" → takeoff, "keep away" → NOT
  const j=(' '+out.join(' ')+' ').replace(/ fire truck /g,' firetruck ').replace(/ fire engine /g,' firetruck ').replace(/ take off /g,' takeoff ').replace(/ fire tower /g,' firetower ').replace(/ launch pad /g,' launchpad ').replace(/ how come /g,' why ').replace(/ no more /g,' stop ').replace(/ keep away /g,' stop ').replace(/ back off /g,' stop ').replace(/ leave (\w+) be /g,' stop hurt $1 ').replace(/ cut it out /g,' stop ').replace(/ leave (.+?) be /g,' stop hurting $1 ');
  const words=j.trim().split(/\s+/);const C=new Set();words.forEach(w=>{const c=WU_C[w];if(c&&c!=='NO2')C.add(c);if(w==='no'&&words.length>1)C.add('NOT');if(w==='no'&&words.length===1)C.add('NO2');});
  // "blow up the fire" → the fire truck (nothing else in the game is called "fire")
  if(C.has('HURT')&&/ the fire( |$)/.test(' '+words.join(' ')+' ')&&!C.has('FIRETRUCK')){C.add('FIRETRUCK');const i=words.lastIndexOf('fire');if(i>=0){words[i]='firetruck';fixed++;}}
  // "fire" as the target of hurt is a thing, not the verb
  let who=null;try{const names=AIB.L.filter(b=>!b.dead).map(b=>pbName(b).toLowerCase());who=words.find((w,i)=>names.includes(w)&&(i>0||/^(blow|shoot|kill|attack|hit|nuke|follow|chase|get|leave)$/.test(words[i-1]||'')))||null;}catch(e){}
  return {words,C,who,fixed,txt:words.join(' ').replace(/firetruck/g,'fire truck').replace(/takeoff/g,'take off')};}
// ---- known commands: meanings → a sentence the AI already understands (slots: {obj} thing, {who} pilot)
const WU_OBJS={FIRETRUCK:'the fire truck',HOUSE:'the house',CABIN:'the cabin',TREE:'the trees',TOWER:'the fire tower',CAMPER:'the campers',CAR:'the car',BOAT:'the boat',PLANE:'the plane',TANK:'the tank'};
const WU_I=[
 {need:['NOT','HURT','ME'],say:"don't blow me up"},{need:['NOT','HURT','OBJ'],say:"don't blow up {obj}"},{need:['NOT','HURT','WHO'],say:"leave {who} alone"},{need:['NOT','HURT','STUFF'],say:"don't blow up anyone"},{need:['NOT','HURT'],say:"stop shooting"},
 {need:['WHY','HURT','ME'],say:'why did you blow me up'},{need:['WHY','HURT','OBJ'],say:'why did you blow up {obj}'},{need:['WHY','HURT'],say:'why did you do that'},
 {need:['WHO','HURT','ME'],say:'who blew me up'},{need:['WHO','HURT'],say:'who did that'},
 {need:['HURT','WHO'],say:'blow up {who}',not:['NOT','WHY','WHO']},{need:['HURT','YOU','ME'],say:'you blew me up',not:['NOT','WHY','WHO']},
 {need:['NOT','FOLLOW'],say:'stop following me'},{need:['FOLLOW','ME'],say:'follow me',not:['NOT']},{need:['FOLLOW','WHO'],say:'follow {who}',not:['NOT']},{need:['FOLLOW'],say:'follow me',not:['NOT']},
 {need:['NOT','ME'],say:"don't blow me up",not:['FOLLOW']},{need:['AWAY','ME'],say:'leave me alone'},{need:['AWAY'],say:'go away',not:['ME']},
 {need:['RACE'],say:'race me',not:['NOT']},{need:['TAG'],say:"let's play tag",not:['NOT']},{need:['HIDE'],say:"let's play hide and seek",not:['NOT']},{need:['PLAY'],say:"let's play"},
 {need:['LAND'],say:'land',not:['NOT','WHERE']},{need:['TAKEOFF'],say:'take off'},{need:['UP'],say:'fly higher',not:['NOT']},{need:['LOW'],say:'fly lower'},{need:['FAST'],say:'go faster',not:['SLOW']},{need:['SLOW'],say:'slow down'},
 {need:['HOME'],say:'go home',not:['FIRETRUCK','HOUSE']},{need:['GO','LAKE'],say:'go to the lake'},{need:['GO','MEADOW'],say:'go to the meadow'},{need:['GO','AIRFIELD'],say:'go to the airfield'},{need:['GO','TOWER'],say:'go to the fire tower'},{need:['LAKE'],say:'go to the lake'},
 {need:['FIX'],say:'fix me'},{need:['HELP'],say:'help me',not:['NOT']},{need:['THANKS'],say:'thanks'},{need:['SORRY'],say:'sorry'},{need:['FRIEND'],say:'are you my friend',not:['NOT','HURT']},
 {need:['BAD'],say:"that's mean"},{need:['GOOD','YOU'],say:'you are cool',not:['NOT','BAD']},{need:['GOOD'],say:'nice',not:['NOT','BAD']},
 {need:['HELLO'],say:'hi'},{need:['BYE'],say:'bye'},{need:['AGAIN'],say:'do it again'},{need:['WAIT'],say:'wait for me'},{need:['LOOK'],say:'watch this'},
 {need:['WHERE','YOU'],say:'where are you'},{need:['WHERE'],say:'where are you'},{need:['WHAT','NAME'],say:"what's your name"},{need:['FEEL','YOU'],say:'how are you'},{need:['NOT'],say:'stop'}];
// rarer meanings weigh more (like a search engine's IDF)
const WU_W={};WU_I.forEach(it=>it.need.forEach(c=>WU_W[c]=(WU_W[c]||0)+1));
function wuMatch(P){const C=new Set(P.C);const objK=Object.keys(WU_OBJS).find(k=>C.has(k));if(objK)C.add('OBJ');if(P.who)C.add('WHO');
  let best=null,bs=0,second=0;for(const it of WU_I){if(it.not&&it.not.some(c=>C.has(c)))continue;let got=0,tot=0;it.need.forEach(c=>{const w=1/Math.sqrt(WU_W[c]||1)+(c==='OBJ'||c==='WHO'||c==='ME'?0.6:0);tot+=w;if(C.has(c))got+=w;});
    if(got<tot)continue;const extra=[...C].filter(c=>!it.need.includes(c)&&!['OBJ','WHO','STUFF','YOU','GO'].includes(c)&&!Object.keys(WU_OBJS).includes(c)).length;const sc=it.need.length*1.0-extra*0.35+tot*0.2;
    if(sc>bs){second=bs;bs=sc;best=it;}else if(sc>second)second=sc;}
  if(!best)return null;const say=best.say.replace('{obj}',objK?WU_OBJS[objK]:'it').replace('{who}',P.who?P.who[0].toUpperCase()+P.who.slice(1):'them');return {say,score:bs,margin:bs-second,it:best};}
WU.parse=wuParse;WU.match=t=>wuMatch(wuParse(t));
// ---- plug in: run the AI normally; if it was going to say "say that again / didn't get that" (or nothing), use the word understander instead
const WU_FALLBACK=/Say that again\? I want to get it right|didn't quite get that|still learning that one|I'm not sure! Try|What should I do\? \(follow me|Good question! I can follow you|Hmm, I'm not sure/;
let WU_CAP=null;
{const s0=sbSay;sbSay=function(w,t){if(WU_CAP){WU_CAP.push([this,arguments,s0]);return;}return s0.apply(this,arguments);};WU.say0=s0;}
{const a0=aiSayAs;const raw0=aiSayAs.__raw;aiSayAs=function(n,t){if(WU_CAP){WU_CAP.push([this,[null,t,n],(w,tt)=>a0.call(this,n,tt)]);return;}return a0.apply(this,arguments);};aiSayAs.__raw=raw0;}
{const s0=smartHear;smartHear=function(txt){const raw=String(txt||'');
  // "yes" to "Did you mean …?"
  if(WU.sug&&performance.now()-WU.sugT<30000&&/^\s*(yes|yeah|yep|yup|sure|ok|okay|correct|right|yes please|that|do it|uh huh)\b/i.test(raw)){const s=WU.sug;WU.sug=null;return smartHear(s);}
  if(WU.sug&&/^\s*(no|nope|nah|wrong)\b/i.test(raw)&&performance.now()-WU.sugT<30000){WU.sug=null;const B=aiNear(1e9)[0];if(B)WU.say0({B},'Okay! Try saying it another way 🙂');return true;}
  if(WU_CAP)return s0.apply(this,arguments);   // nested call: no double-checking
  const P=wuParse(raw);WU.stats.n++;
  // a misspelled sentence gets spell-fixed first, so all the normal handlers can read it
  const fixedTxt=P.fixed?P.txt:raw;if(P.fixed)WU.stats.fixed++;
  if(P.C.has('HURT')&&(P.C.has('NOT')||P.C.has('WHY')||(P.C.has('WHO')&&!P.who))&&!/ (should|how do|how to|how can|can i|what should|which) /.test(' '+P.txt+' ')){const M0=wuMatch(P);if(M0&&M0.score>=1.2){const cp=[];WU_CAP=cp;let r0;try{r0=s0.call(this,M0.say);}finally{WU_CAP=null;}const good=cp.filter(([th,a])=>!WU_FALLBACK.test(String(a[1]||'')));if(good.length){good.forEach(([th,a,f])=>f.apply(th,a));return true;}}}
  const cap=[];WU_CAP=cap;let r;try{r=s0.call(this,fixedTxt);}finally{WU_CAP=null;}
  const said=cap.map(([th,a])=>String(a[1]||''));const failed=(!r&&!cap.length)||(cap.length&&said.every(x=>WU_FALLBACK.test(x)));
  if(!failed){cap.filter(([th,a])=>!WU_FALLBACK.test(String(a[1]||''))).forEach(([th,a,f])=>f.apply(th,a));return r;}
  // the normal brain didn't get it → search for the closest known command
  const M=wuMatch(P);const B=aiNear(1e9)[0];
  if(M&&M.score>=1.2&&M.say.toLowerCase()!==fixedTxt.toLowerCase()){const cap2=[];WU_CAP=cap2;let r2;try{r2=s0.call(this,M.say);}finally{WU_CAP=null;}const ok2=cap2.length&&!cap2.map(([th,a])=>String(a[1]||'')).every(x=>WU_FALLBACK.test(x));
    if(ok2||r2){cap2.filter(([th,a])=>!WU_FALLBACK.test(String(a[1]||''))).forEach(([th,a,f])=>f.apply(th,a));return true;}}
  if(M&&B&&M.score>=0.7){WU.sug=M.say;WU.sugT=performance.now();WU.stats.asked++;WU.say0({B},'🤔 Did you mean "'+M.say+'"? (say yes)');return true;}
  cap.forEach(([th,a,f])=>f.apply(th,a));return r;};}
{const s0=smartHear;smartHear=function(){HEARING++;try{return s0.apply(this,arguments);}finally{HEARING--;}};}
// late "I didn't get that" replies (some come a moment later): catch them too and use the word understander instead
WU.lastTxt='';WU.lastT=0;WU.busy=false;
{const s0=smartHear;smartHear=function(txt){if(!WU.busy){WU.lastTxt=String(txt||'');WU.lastT=performance.now();}return s0.apply(this,arguments);};}
function wuRescue(text){try{if(WU.busy||!WU_FALLBACK.test(String(text))||performance.now()-WU.lastT>4000||!WU.lastTxt)return false;const t=WU.lastTxt;WU.lastTxt='';const M=WU.match(t);if(!M)return false;
  if(M.score>=1.2){WU.busy=true;try{smartHear(M.say);}finally{WU.busy=false;}return true;}
  if(M.score>=0.7){const B=aiNear(1e9)[0];WU.sug=M.say;WU.sugT=performance.now();if(B)WU.say0({B},'🤔 Did you mean "'+M.say+'"? (say yes)');return true;}}catch(e){}return false;}
{const s0=sbSay;sbSay=function(w,t){if(!WU_CAP&&wuRescue(t))return;return s0.apply(this,arguments);};}
{const a0=aiSayAs;const raw0=aiSayAs.__raw;aiSayAs=function(n,t){if(!WU_CAP&&wuRescue(t))return;return a0.apply(this,arguments);};aiSayAs.__raw=raw0;}
{const c0=chatAdd;chatAdd=function(who,txt,col){if(!WU_CAP&&typeof who==='string'&&/🤖/.test(who)&&wuRescue(txt))return;return c0.apply(this,arguments);};}
