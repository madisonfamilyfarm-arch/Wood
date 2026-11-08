// ================================================================ v52: 🧠 the AI's UNDERSTANDING ENGINE — splits "do this and then that", knows hundreds of ways to say each thing, works out words it doesn't know,
// remembers who you were talking about ("him", "you too", "do it again"), answers where it is + who to blow up next, and asks "Did you mean…?" when unsure.
const NLU={last:null,lastWho:null,pend:null,log:[]};
// every intent → the many ways people say it (phrases are matched on whole words; single words also match close misspellings)
const NLEX={
  follow:['pursue me','accompany me','follow','follow me','chase me','come with me','come along','tag along','stick with me','stay with me','stay behind me','keep up with me','be my wingman','wingman','escort me','shadow me','trail me','right behind me','on my tail','behind me','come too'],
  come:['come here','come to me','come over','over here','get over here','come back here','come closer','meet me here','where i am','come find me'],
  go:['go to','fly to','head to','head over to','drive to','move to','travel to','visit','explore','check out','go check out','go see','lets go to','make your way to','get to','go over to','zoom to','cruise to','meet me at','go explore','fly over to','sail to'],
  race:['race','race me','lets race','wanna race','raise me','beat me','i bet i can beat you','i can beat you','challenge','first one to','first one there','who is faster','who\'s faster','race you','compete'],
  attack:['attack','attack me','fight','lets fight','battle','battle time','war','bring it','bring it on','come at me','shoot me','open fire','fire away','lets go to war','start a war','fight me'],
  hunt:['go after','get','take out','take down','hunt','hunt down','blow up','destroy','annihilate','obliterate','wreck','smash','nuke','attack','shoot','target','kill','eliminate','get rid of','go get','chase down','ambush'],
  peace:['no more rocket','stop the rockets','no rockets','stop shooting','dont shoot','no shooting','peace','truce','cease fire','ceasefire','be friends','lets be friends','stop fighting','no more rockets','no more fighting','put the weapons down','stop attacking','friends'],
  team:['be on my team','join my team','my team','team up','on my side','cover me','protect me','back me up','help me fight','be my teammate','teammate','guard me','defend me','help me out'],
  advice:['who is the weakest','who is the easiest','who is losing','who has the lowest health','lowest health','who is easiest to beat','who should i fight','who should i hit','who is closest','who should i blow up','who should i attack','who should i shoot','who should i go after','who do i attack','who should i target','who\'s the easiest','who is the easiest','who is weakest','who\'s weakest','who is low on health','who to blow up','who next'],
  land:['land','touch down','come down','set down','park it','land it','landing','go down and land','put it down'],
  takeoff:['take off','takeoff','lift off','launch','get in the air','go up in the air','fly up','start flying'],
  flip:['flip','do a flip','flips','backflip','frontflip','barrel roll','loop','loop the loop','trick','show me a trick','stunt','somersault','cartwheel','roll'],
  spin:['spin in circle','spin in circles','spin','spin around','twirl','do a spin','pirouette','spin in circles'],
  dance:['dance','dance party','bust a move','boogie','groove','shake it','party','celebrate','disco'],
  hover:['wait','wait here','wait there','stay','stay there','stay here','hover','hold on','hold up','hold still','stop moving','dont move','freeze','halt','pause','stop right there','park there','sit tight','chill there'],
  circle:['circle me','circle around me','fly around me','orbit me','orbit','go around me','circle'],
  higher:['higher','go higher','fly higher','go up','climb','up high','gain altitude','ascend','rise','way up'],
  lower:['lower','go lower','fly lower','go down','get low','descend','dive','come lower','closer to the ground'],
  faster:['faster','go faster','hurry','hurry up','speed up','step on it','zoom','punch it','full speed','turbo','boost','floor it','quicker'],
  slower:['ease up','chill out','slower','go slower','slow down','not so fast','ease up','take it easy','brake','gently'],
  home:['go home','go back to the pad','back to the pad','return to base','go back home','back to base','return home','head home','go to the pad','go back to start'],
  switch:['switch to','change to','swap to','become','turn into','get in','hop in','use the','use a','take the','try the','grab a','ride the','drive the','fly the','jump in'],
  tnt:['tnt','drop tnt','drop a bomb','bomb','bombs away','dynamite','throw dynamite','drop it','drop the bomb','bomb them','bombing run','explosive'],
  tag:['play tag','tag','tag you\'re it','you\'re it','tag game','lets play tag','wanna play tag'],
  hide:['hide and seek','hide n seek','hide and go seek','play hide','hide'],
  leader:['follow the leader','copy me','do what i do','simon says','copy what i do','mirror me'],
  stopgame:['stop playing','game over','i quit','end the game','stop the game','done playing','im done','quit the game'],
  where:['where are everyone','where are everybody','where is ace','where are you','where are you guys','where\'d you go','where did you go','where you at','where is everyone','where is everybody','where are they','find you','show yourself','marco'],
  play:['play with me','play a game','lets play','want to play','play something','what game','wanna play'],
  coin:['heads or tail','flip a coin','coin flip','heads or tails','toss a coin','flip coin'],dice:['roll the dice','roll a dice','roll a die','roll dice','dice'],
  joke:['any jokes','jokes','got jokes','joke','tell me a joke','something funny','make me laugh','be funny','say something funny','know any jokes'],who:['who is here','who is playing','who is online','who is around','how many pilots','how many players','who else is here'],
  talk:['you can talk','talk again','chat with me','keep talking','say stuff','you can chat'],quiet:['be quiet','shh','shhh','stop talking','hush','zip it','quiet please'],
  again:['do it again','again','one more time','you too','him too','her too','them too','same thing','same for','me too','also you','repeat','another one']};
// meaning groups for fancy / unknown words → the intent they probably mean
const NSYN={attack:['annihilate','obliterate','demolish','decimate','eradicate','vaporize','atomize','pulverize','wreck','trash','smash','crush','pummel','bombard','assault','strike','raid','ambush','blast','zap','fry','torch','nuke','frag','snipe'],
  follow:['accompany','pursue','shadow','tail','trail','escort','tag-along'],go:['proceed','journey','travel','venture','relocate','commute','navigate','roam','wander','explore','scout','investigate'],
  hover:['linger','idle','loiter','remain','wait','stall','park'],faster:['accelerate','expedite','hasten','sprint','dash','rush','bolt','zoom'],slower:['decelerate','brake','slacken','dawdle'],
  higher:['ascend','elevate','soar','levitate','rise','climb'],lower:['descend','plummet','sink','dip','drop'],land:['alight','touchdown','dock','settle'],flip:['somersault','tumble','backflip','frontflip','loop'],
  peace:['surrender','forgive','reconcile','befriend','pacify'],dance:['boogie','jive','shimmy','groove','tango','waltz','twerk'],race:['compete','duel','contest']};
const NSTOP=new Set('the a an please pls can could would will you u ya ye guys hey ok okay so um uh like just now right go to me my i it that this some'.split(' '));
function nNorm(t){let s=' '+String(t||'').toLowerCase().replace(/[“”"]/g,'').replace(/[’']/g,"'").replace(/[!?.;:]+/g,' ').replace(/\s+/g,' ')+' ';
  const C=[[/ what's /g,' what is '],[/ whats /g,' what is '],[/ where's /g,' where is '],[/ wheres /g,' where is '],[/ who's /g,' who is '],[/ whos /g,' who is '],[/ how's /g,' how is '],[/ it's /g,' it is '],[/ i'm /g,' i am '],[/ im /g,' i am '],[/ you're /g,' you are '],[/ youre /g,' you are '],[/ ur /g,' you are '],[/ let's /g,' lets '],[/ don't /g,' dont '],[/ can't /g,' cant '],[/ won't /g,' wont '],[/ where'd /g,' where did '],[/ wanna /g,' want to '],[/ gonna /g,' going to '],[/ gotta /g,' got to '],[/ y'all /g,' everyone '],[/ yall /g,' everyone '],[/ u /g,' you '],[/ r /g,' are ']];
  C.forEach(([r,v])=>{s=s.replace(r,v).replace(r,v);});return s;}
function nWords(s){return s.trim().split(' ').filter(Boolean);}
function nStem(w){return w.replace(/(ing|ed|es|s|er|ly)$/,'').replace(/(.)\1$/,'$1');}
// does phrase p appear in normalized sentence s? (whole words; single words may be misspelled a little)
function nHas(s,p){if(s.indexOf(' '+p+' ')>=0)return 2+p.split(' ').length;if(p.indexOf(' ')<0&&p.length>=5){for(const w of nWords(s)){if(w.length<4)continue;if(nStem(w)===nStem(p)&&nStem(w).length>=4)return 1.8;if(!SPEECH_KEEP.has(w)&&levD(w,p)<=1)return 1.5;}}return 0;}
// work out a word nobody taught it: synonyms, stems, joined/split words, sound-alikes
function nDecode(w){for(const k in NSYN)if(NSYN[k].includes(w)||NSYN[k].includes(nStem(w)))return k;if(SPEECH_KEEP.has(w)||SPEECH_WORDS.includes(w))return null;
  for(const k in NSYN)for(const x of NSYN[k])if(w.length>=5&&levD(w,x)<=1)return k;return null;}
function nWho(s){const out=[];for(const B of AIB.L){if(B.dead)continue;const n=B.name.replace('🤖 ','').toLowerCase();if(s.indexOf(' '+n+' ')>=0)out.push({B,at:s.indexOf(' '+n+' ')});}
  for(const C of CAMPERS.L){if(C.dead)continue;const n=String(C.name).toLowerCase();if(s.indexOf(' '+n+' ')>=0)out.push({C,at:s.indexOf(' '+n+' ')});}return out.sort((a,b)=>a.at-b.at);}
function nPlace(s){try{return sbPlace(s);}catch(e){return null;}}
function nVeh(s){try{return sbVeh(s);}catch(e){return null;}}
function nScore(s){const sc={};for(const k in NLEX){let best=0;for(const p of NLEX[k]){const h=nHas(s,p);if(h>best)best=h;}if(best)sc[k]=best;}
  for(const w of nWords(s)){if(w.length<5||NSTOP.has(w))continue;let known=false;for(const k in NLEX)if(NLEX[k].some(p=>p===w))known=true;if(known)continue;const k=nDecode(w);if(k){const kk=k==='attack'&&nWho(s).length?'hunt':k;sc[kk]=Math.max(sc[kk]||0,1.6);}}return sc;}
// one clause → one command
function nParse(clause,ctx){const s=nNorm(clause);const who=nWho(s),place=nPlace(s),veh=nVeh(s),sc=nScore(s);let sq=s;for(const w of who){const n=nName(w).toLowerCase();sq=sq.replace(' '+n+' ',' ');}sq=sq.replace(/^ (can|could|will|would) you (please )?/,' ').replace(/^ please /,' ');const q=/^ (where|how|what|who|which|why|when|wear) /.test(sq)||/^ (is|are|did|have|has) (you|i|we|there|it|he|she|they|anyone|everyone) /.test(sq)||/^ (do|does|can|could|will|would) (you|i|we|they|anyone|everyone) /.test(sq);
  // --- grammar rules that beat plain word scores
  const tgt=who.filter(w=>w.B).map(w=>w.B);
  if(sc.advice)return{i:'advice',s};
  // little games + chat go to the normal brain in words it knows
  if(sc.coin)return{i:'say',s,txt:'flip a coin'};if(sc.dice)return{i:'say',s,txt:'roll the dice'};if(sc.who)return{i:'say',s,txt:'who\'s here'};if(sc.talk)return{i:'say',s,txt:'you can talk again'};if(sc.quiet)return{i:'say',s,txt:'be quiet'};if(sc.again&&!q)return{i:'again',s,who};
  if(sc.joke&&!/ (riddle|story|fact) /.test(s))return{i:'say',s,txt:'tell me a joke'};if(sc.play&&!sc.tag&&!sc.hide&&!sc.leader&&!/ (rock|paper|scissors|race) /.test(s))return{i:'say',s,txt:'lets play a game'};
  if(/ you are (so |really |super |very |kind of |kinda )*(slow|dumb|stupid|bad|annoying|mean|lame|terrible|trash|noob|boring) /.test(s))return{i:'say',s,txt:'you are dumb'};
  if(/ i am (so |really |super |very |kinda )*bored /.test(s)||/ (so|really) bored /.test(s))return{i:'say',s,txt:'i am bored'};
  {const m=s.match(/ my name(?: is|'s| 's|s) ([a-z][a-z'-]{1,15}) /)||s.match(/ (?:call me|i am called|they call me) ([a-z][a-z'-]{1,15}) /);if(m)return{i:'say',s,txt:'my name is '+m[1]};}
  if(/ (fact|did you know|teach me|something cool|tell me something) /.test(s)&&!/ joke /.test(s))return{i:'say',s,txt:'tell me a fact'};
  if(/ how (is|was|has been) your (day|night|morning) | how are you doing | how you doing | how have you been /.test(s))return{i:'say',s,txt:'how are you'};
  if(q&&!place&&/ how (do|can|to|should) (i|you|we) /.test(sq)){const h=HOWTO.find(([r])=>r.test(' '+synNorm(s)+' '));if(h)return{i:'tell',s,txt:h[1]};return null;}
  if(/ (what are you up to|what are you doing|whatcha doing|what you doing|wyd) /.test(s))return{i:'say',s,txt:'what are you doing'};
  if(/ where (do|did) you (come from|live|grow up) | where are you from /.test(s))return{i:'say',s,txt:'where do you live'};
  if(q&&place&&/ (where|how far|which way|which direction|how do i get|how to get|directions) /.test(sq))return{i:'say',s,txt:'where is '+place.n};
  if(/ you are (so |really |super |very |the )*(cool|awesome|great|amazing|the best|best|good|smart|funny|nice|epic|fast|sick|legend)/.test(s))return{i:'say',s,txt:'you\'re awesome'};
  if(/ i am (so |really |super |very )*(happy|excited|glad|having fun|pumped) /.test(s))return{i:'say',s,txt:'i\'m happy'};if(/ i am (so |really |super |very )*(sad|upset|mad|angry|lonely|bummed) /.test(s))return{i:'say',s,txt:'i\'m sad'};
  if(q&&sc.where&&!place)return{i:'where',s,who};
  if(q&&!/ go | fly | head | race /.test(s))return null; // other questions: the normal brain answers them (directions, math, score…)
  if(sc.again)return{i:'again',s,who};
  if(sc.stopgame)return{i:'stopgame',s};if(sc.leader)return{i:'leader',s,who};if(sc.hide&&/ seek | hide /.test(s))return{i:'hide',s,who};if(sc.tag&&!/ tag along /.test(s)&&(/ play /.test(s)||/ tag /.test(s)||/ it /.test(s)))return{i:'tag',s,who};
  if(sc.tnt){const on=/ (on|at) /.test(s);return{i:'tnt',s,who,target:on?(/ on me | at me /.test(s)?'me':tgt[tgt.length-1]):null};}
  if(sc.home&&!/ race /.test(s))return{i:'home',s,who};
  if(sc.race){return{i:'race',s,who,place};}
  if(sc.hunt&&(tgt.length>=1&&(/ (go after|get|take out|take down|hunt|blow up|destroy|attack|shoot|target|kill|eliminate|nuke|smash|wreck|ambush|chase down) [a-z]+ $/.test(s)||tgt.length>=2||(who.length&&s.indexOf(' '+tgt[tgt.length-1].name.replace('🤖 ','').toLowerCase()+' ')>s.search(/ (go after|get|take|hunt|blow|destroy|attack|shoot|target|kill|eliminate|annihilate|obliterate|nuke|smash|wreck)/))))){
    const target=tgt[tgt.length-1];const hunters=who.filter(w=>w.B&&w.B!==target);if(target)return{i:'hunt',s,who:hunters,target};}
  if(sc.peace)return{i:'peace',s};
  if(sc.team)return{i:'team',s,who};
  if(sc.attack)return{i:'attack',s,who};
  if(veh&&(sc.switch||/ (get|use|take|hop|jump|ride|switch|change|become|try|grab) /.test(s)))return{i:'switch',s,who,veh};
  if(place&&(sc.go||sc.come||/ (to|at) /.test(s)))return{i:'go',s,who,place};
  if(sc.go&&/ (explore|wander|roam|scout|look around) /.test(s)){const P=aiPlaces().filter(p=>!/truck|fire$/.test(p.n));return{i:'go',s,who,place:P[Math.floor(Math.random()*P.length)],explore:true};}
  if(sc.come&&!sc.go)return{i:'come',s,who};
  if(sc.follow)return{i:'follow',s,who};
  // body moves — the strongest one wins
  const moves=['land','takeoff','flip','spin','dance','hover','circle','higher','lower','faster','slower'];let best=null,bv=0,second=null,sv=0;
  for(const k of moves){const v=sc[k]||0;if(v>bv){second=best;sv=bv;best=k;bv=v;}else if(v>sv){second=k;sv=v;}}
  if(best){if(best==='hover'&&sc.land)best='land';if(best==='lower'&&sc.land)best='land';if(best==='higher'&&sc.takeoff)best='takeoff';return{i:best,s,who,alt:second&&sv>=bv-0.3?second:null};}
  if(place&&sc.where)return null;
  return null;}
// split "do this and then that" into separate commands (only when both halves are commands)
function nSplit(t){const parts=String(t).split(/\s*(?:,|;|\band then\b|\bthen\b|\bafter that\b|\band also\b|\band\b)\s*/i).filter(x=>x&&x.trim());if(parts.length<2)return[t];
  const cmds=[];let cur='',curI=null;for(const p of parts){const test=nParse(p,{});if(test&&!['again'].includes(test.i)&&cur&&curI&&test.i!==curI&&!(curI==='land'&&test.i==='lower')&&!(curI==='lower'&&test.i==='land')){cmds.push(cur);cur=p;curI=test.i;}else{cur=cur?cur+' and '+p:p;if(test&&!curI)curI=test.i;}}if(cur)cmds.push(cur);return cmds.length>1?cmds:[t];}
// pick who does it: named → those; "everyone"; nobody named → whoever you talked to last (if recent) → nearest pilot
function nTargets(c){if(c.who&&c.who.length)return c.who;if(/ (everyone|everybody|all of you|you all|guys) /.test(c.s))return AIB.L.filter(B=>!B.dead).map(B=>({B}));
  if(/ (him|her|them|he|she|they) /.test(c.s)&&NLU.lastWho)return NLU.lastWho;if(NLU.lastWho&&performance.now()-NLU.lastT<45000)return NLU.lastWho;return null;}
const NPH={follow:'follow me',come:'come here',land:'land',takeoff:'take off',flip:'do a flip',spin:'spin',dance:'dance',hover:'hover',circle:'circle me',higher:'go higher',lower:'go lower',faster:'go faster',slower:'go slower',home:'go home',attack:'attack',peace:'stop shooting',team:'be on my team'};
function nName(w){return w.B?w.B.name.replace('🤖 ',''):w.C?w.C.name:'';}
function nRun(c,base){const T=nTargets(c);const pre=T?T.map(nName).join(' and ')+' ':'';
  const say=(w,t,d)=>{try{sbSay(w,t,d||400);}catch(e){}};
  switch(c.i){
    case 'go':{const r=base.call(this,pre+'go to '+c.place.n);if(c.explore){const L=T&&T.length?T:[{B:aiNear(1e9)[0]}];L.forEach((w,i)=>say(w,'Exploring! I\'ll check out '+c.place.n+' 🧭',1200+i*400));}return r;}
    case 'race':{const r=base.call(this,pre+'race me');if(c.place){const L=T&&T.length?T:[{B:aiNear(1e9)[0]}];L.forEach((w,i)=>{if(w.B){sbPilotGo(w.B,c.place);w.B.spdK=1.2;}say(w,'Race you to '+c.place.n+'! 3… 2… 1… GO! 🏁',900+i*400);});}return r;}
    case 'switch':{const L=T&&T.length?T:[{B:aiNear(1e9)[0]}];let any=false;L.forEach((w,i)=>{if(w.B&&w.B.kind===c.veh.replace('heli','heli')){say(w,'I\'m already in a '+c.veh+'! '+(AI_VIC[c.veh]||''),400+i*500);}else any=true;});return any?base.call(this,pre+'switch to a '+(c.veh==='heli'?'helicopter':c.veh==='sub'?'submarine':c.veh)):true;}
    case 'hunt':{const target=c.target;const H=(c.who&&c.who.length?c.who.map(w=>w.B).filter(Boolean):AIB.L.filter(B=>!B.dead&&B!==target&&(B.team==='me'||/ everyone | all /.test(c.s)))).slice(0,6);
      const hunters=H.length?H:[aiNear(1e9).find(B=>B!==target)].filter(Boolean);DZ.on=true;DZ.ai=true;LS.set('dzAi',true);hunters.forEach((B,i)=>{B.hunt=target.id;say({B},PICK(['Going after '+target.name.replace('🤖 ','')+'! 🎯','Target locked: '+target.name.replace('🤖 ','')+' 🚀','Here I come, '+target.name.replace('🤖 ','')+'! 😈']),400+i*500);});
      say({B:target},PICK(['Uh oh… 😬','Come and get me! 😜','Not if I get you first!']),1400);return true;}
    case 'tnt':{const L=(T&&T.length?T:[{B:aiNear(1e9)[0]}]).filter(w=>w.B);L.forEach((w,i)=>{const B=w.B;const go=()=>{if(c.target&&c.target!==B){B.bomb=c.target==='me'?'me':c.target.id;say(w,'💣 Bombing run on '+(c.target==='me'?'you':c.target.name.replace('🤖 ',''))+'!',300);}else{aiDropTnt(B);say(w,PICK(['Bombs away! 💣','TNT incoming! 💥','Look out below!']),300);}};
        if(B.kind==='drone'||B.kind==='heli')go();else{say(w,'Switching to a drone so I can drop it! 🚁',300+i*400);try{aiSwitch(B,'drone');}catch(e){}setTimeout(()=>{const nb=AIB.L.find(x=>x.name===B.name&&!x.dead);if(nb){w.B=nb;go.call(null);}},1500);aiDropTnt(B);}});return true;}
    case 'tag':gameStart('tag',T&&T[0]&&T[0].B);return true;case 'hide':gameStart('hide',T&&T[0]&&T[0].B);return true;case 'leader':gameStart('leader',T&&T[0]&&T[0].B);return true;
    case 'stopgame':if(GAME.on){gameStop('Good game! 🤝');}else say({B:aiNear(1e9)[0]},'We\'re not playing anything right now — want to? Say "tag" or "hide and seek"!');return true;
    case 'where':{if(GAME.on==='hide')return base.call(this,'where are you');const L=T&&T.length?T:AIB.L.filter(B=>!B.dead).slice(0,4).map(B=>({B}));const me=dzMe()||D.pos;L.forEach((w,i)=>{if(!w.B)return;const B=w.B,pl=aiPlaces().reduce((a,q)=>Math.hypot(q.x-B.p.x,q.z-B.p.z)<Math.hypot(a.x-B.p.x,a.z-B.p.z)?q:a);const d=Math.round(B.p.distanceTo(me));
        say(w,(/marco/.test(c.s)?'POLO! 😆 ':'')+(d<15?'Right here next to you! 👋':'I\'m near '+pl.n+' — '+d+' m '+compass(B.p.x-me.x,B.p.z-me.z)+' of you 📍'),400+i*600);});return true;}
    case 'advice':{const me=dzMe()||D.pos;const C=AIB.L.filter(B=>!B.dead&&B.team!=='me').map(B=>({B,d:B.p.distanceTo(me),hp:B.hpMax?B.hp/B.hpMax:1}));
      if(!C.length){say({B:aiNear(1e9)[0]},'Nobody to blow up — everyone\'s on your team! 🤝');return true;}C.sort((a,b)=>(a.hp*200+a.d)-(b.hp*200+b.d));const t=C[0],adv=aiNear(1e9).find(B=>B!==t.B)||t.B;
      say({B:adv},'Go after '+t.B.name.replace('🤖 ','')+'! They\'re '+Math.round(t.d)+' m '+compass(t.B.p.x-me.x,t.B.p.z-me.z)+' of you'+(t.hp<0.7?' and low on health 💔':' in a '+t.B.kind+' '+(AI_VIC[t.B.kind]||''))+' 🎯');return true;}
    case 'again':{if(!NLU.last){say({B:aiNear(1e9)[0]},'Do what again? 🤔 Tell me what to do!');return true;}const c2=Object.assign({},NLU.last);const nw=c.who&&c.who.length?c.who:(/ (you|you too|also you) /.test(c.s)?[{B:aiNear(1e9).find(B=>!(NLU.lastWho||[]).some(w=>w.B===B))||aiNear(1e9)[0]}]:null);
      c2.who=nw||NLU.last.who;c2.s=NLU.last.s;return nRun(c2,base);}
    case 'say':return base.call(this,c.txt);
    case 'tell':say({B:aiNear(1e9)[0]},c.txt);return true;
    default:if(NPH[c.i])return base.call(this,pre+NPH[c.i]);}
  return false;}
{const s0=smartHear;smartHear=function(txt){try{const raw=String(txt||'');
    // answering a "Did you mean…?" question
    if(NLU.pend&&performance.now()-NLU.pend.t<40000){const s=nNorm(raw);const k=/ (first|1|one|the first) /.test(s)?0:/ (second|2|two|the second|other) /.test(s)?1:NLU.pend.opts.findIndex(o=>s.indexOf(' '+o.word+' ')>=0);
      if(k>=0&&NLU.pend.opts[k]){const c=NLU.pend.opts[k].c;NLU.pend=null;NLU.last=c;return nRun(c,s0);}if(/ (no|nope|neither|never mind|nevermind) /.test(s)){NLU.pend=null;sbSay({B:aiNear(1e9)[0]},'Okay! 👍');return true;}NLU.pend=null;}
    const clauses=nSplit(raw);const cmds=clauses.map(c=>nParse(c,{}));
    if(cmds.length>1&&cmds.every(Boolean)){let lastWho=null;cmds.forEach((c,i)=>{if((!c.who||!c.who.length)&&lastWho)c.who=lastWho;if(c.who&&c.who.length)lastWho=c.who;const run=()=>{try{nRun(c,s0);}catch(e){}};if(i===0||NLU.sync)run();else setTimeout(run,i*(cmds[i-1]&&cmds[i-1].i==='go'?5000:2200));NLU.last=c;});
      NLU.lastWho=lastWho||NLU.lastWho;NLU.lastT=performance.now();return true;}
    const c=cmds[0];if(c){if(c.who&&c.who.length){NLU.lastWho=c.who;NLU.lastT=performance.now();}
      // two moves almost tied → ask
      if(c.alt&&c.i!==c.alt&&!/ (and|then) /.test(nNorm(raw))){const nm={land:'land',takeoff:'take off',flip:'do a flip',spin:'spin',dance:'dance',hover:'wait right there',circle:'circle you',higher:'go higher',lower:'go lower',faster:'go faster',slower:'go slower'};
        NLU.pend={t:performance.now(),opts:[{c,word:c.i},{c:Object.assign({},c,{i:c.alt}),word:c.alt}]};sbSay({B:(c.who&&c.who[0]&&c.who[0].B)||aiNear(1e9)[0]},'Did you mean '+nm[c.i]+' or '+nm[c.alt]+'? 🤔');return true;}
      if(c.i!=='again')NLU.last=c;const r=nRun(c,s0);if(r!==false)return r;}
    // the normal brain gets everything else (questions, chat, games…)
    const r=s0.call(this,raw);if(r===false&&AIB.L.some(B=>!B.dead)&&!Object.keys(mp.peers).some(id=>!/^bot|~|^tg|^tst/.test(id))){const B=aiNear(1e9)[0];sbSay({B},PICK(['Hmm, I didn\'t quite get that 🤔 Try "follow me", "race me", "let\'s play tag" or "what can you do"!','Say that again? I want to get it right 👂','I\'m still learning that one 😅 Try "what can you do"!']));return true;}return r;}catch(e){console.warn('nlu',e);return s0.apply(this,arguments);}};}
// games always find a pilot (switching one into a drone if needed)
{const g0=gameStart;gameStart=function(kind,B){if(!B||!(B.kind==='drone'||B.kind==='heli')){const fl=aiNear(1e9,true)[0];if(fl)B=fl;else{const any=B||aiNear(1e9)[0];if(any){try{aiSwitch(any,'drone');}catch(e){}B=AIB.L.find(x=>x.name===any.name&&!x.dead)||any;B.kind='drone';}}}return g0.call(this,kind,B);};}
