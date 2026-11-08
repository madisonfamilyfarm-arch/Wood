// v65: real back-and-forth chat — the AI remembers what it asked, understands short answers ("good", "not bad", "you?"),
// keeps the whole conversation, saves it when you say bye, and remembers it next time.
const CONV={B:null,ask:null,askT:0,topic:null,h:[],likes:[],mood:null,last:null};
try{const o=JSON.parse(localStorage.getItem('aiConv')||'null');if(o){CONV.last=o;CONV.likes=o.likes||[];}}catch(e){}
function convSave(){try{localStorage.setItem('aiConv',JSON.stringify({t:Date.now(),h:CONV.h.slice(-60),likes:CONV.likes.slice(-10),mood:CONV.mood,topic:CONV.topic,name:(typeof meName==='function'?meName():'')}));}catch(e){}}
function convAsk(B,q,kind){if(!B)return;CONV.B=B;CONV.ask=kind;CONV.askT=performance.now();HEARING++;try{sbSay({B},q);}finally{HEARING--;}}
const CQ=[["What's your favorite vehicle to fly or drive?",'fav'],["Did you build anything cool today? 🛠",'build'],["Want to race, play tag, or just cruise around?",'play'],["What's the best crash you've ever had? 😆",'crash'],["Day or night flying — which do you like more?",'daynight'],["Do you like the woods or the sea better?",'place']];
const POS=/ (good|great|fine|ok|okay|awesome|amazing|cool|not bad|pretty good|good good|super|excellent|alright|all right|well|nice|perfect|fantastic|epic|so good|very good|really good|doing good|doing great|im good|i m good|im great|i m great|im fine|i m fine|im ok|i m ok|good thanks|great thanks|not too bad|could be worse) /;
const NEG=/ (bad|not good|not great|terrible|awful|meh|sad|tired|bored|crashed|broken|not so good|kinda bad|horrible|not well|bleh|so so|ugh) /;
const BACKQ=/ (how about you|and you|what about you|hbu|wbu|you|u|and yours|how s yours|hows yours|how is yours|yours|how are you|how r u) $/;
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));const now=performance.now();
  // whose turn: a named pilot, else whoever I was just talking to
  const named=(nWho(s).find(w=>w.B)||{}).B;let B=named||((CONV.B&&!CONV.B.dead&&AIB.L.includes(CONV.B))?CONV.B:null)||aiNear(1e9)[0];if(!B)return s0.apply(this,arguments);
  const pend=CONV.ask&&now-CONV.askT<90000&&(!named||named===CONV.B)?CONV.ask:null;const short=s.trim().split(/\s+/).length<=7;
  const say=(t,kind,q)=>{CONV.B=B;sbSay({B},t);if(q){setTimeout(()=>convAsk(B,q,kind),1800);}else{CONV.ask=kind||null;CONV.askT=performance.now();}return true;};
  const mine=()=>PICK(['Pretty good! Just did a loop-de-loop 🔄','Awesome — battery\'s full and props are spinning 🚁','Great! The wind is calm today 🌤','Flying smooth! Not a single crash yet 😎','Good! A little scratched from that last battle 😅']);
  const nq=()=>{CONV.used=CONV.used||[];let L=CQ.filter(q=>!CONV.used.includes(q[1]));if(!L.length){CONV.used=[];L=CQ;}const q=PICK(L);CONV.used.push(q[1]);return q;};
  // "how's your aircraft / drone / day / flight"
  if(/ how s your| hows your| how is your| how are your/.test(s)&&/ (aircraft|drone|plane|heli|helicopter|copter|day|flight|flying|ride|car|tank|boat|sub|battery|thing|vehicle|ship|jet) /.test(s)){return say(mine()+' How\'s yours?','how');}
  // answering MY question "how are you / how's your aircraft"
  if(pend==='how'&&short){
    if(NEG.test(s)&&!/ not bad /.test(s)){CONV.mood='bad';const q=nq();return say(PICK(['Aww, sorry 😢 Want me to fix you up? Say "fix" or tap 🔧','Oh no! Want to do something fun to cheer up? 🎉','Hang in there, co-pilot 💪']),q[1],q[0]);}
    if(POS.test(s)||BACKQ.test(s)){CONV.mood='good';if(BACKQ.test(s)){const q=nq();return say(PICK(['Nice! 😄','Glad to hear it!','Sweet!'])+' I\'m '+mine().toLowerCase(),q[1],q[0]);}const q=nq();return say(PICK(['Nice! 😄','Awesome, glad to hear it! 🙌','Sweet! 😎','Yay! 🎉']),q[1],q[0]);}}
  // "good, how about you" even without a pending question
  if(short&&POS.test(s)&&BACKQ.test(s)){CONV.mood='good';const q=nq();return say('Glad you\'re good! Me? '+mine(),q[1],q[0]);}
  if(/ (how about you|and you|what about you|hbu|wbu) $/.test(s)&&short){return say(mine(),'how2');}
  // answers to my follow-up questions
  const GEN=/^ (me too|same|same here|so do i|ditto|lol|haha|hahaha|lmao|hehe|really|for real|wow|whoa|omg|ok|okay|k|kk|yeah|yep|yup|mhm|got it|cool|nice|sweet) $/.test(s);
  if(pend&&pend!=='how'&&short&&!(GEN&&pend!=='build')&&!/^ (what|who|why|how|where|when|do|does|did|can|could|is|are|will|would|tell|say)\b/.test(s)&&!/ (follow|come|land|attack|shoot|take off|switch|battle|menu|stop|go to|fly to) /.test(s)){
    let w=s.trim().replace(/^(i like |i love |probably |maybe |definitely |the |um |uh |hmm |i think |i d say |id say )+/,'').replace(/^(a |an |my )/,'');
    if(/^(no|nope|nah|nothing|not really|no i didn t|i didn t)\b/.test(w)){const q=nq();return say(PICK(['That\'s okay! 🙂','No worries!','Fair enough 😄']),q[1],q[0]);}
    if(/^(yes|yeah|yep|yup|sure|i did)\b/.test(w)&&pend==='build'){return say('Ooh, what did you build? 🛠','build2');}
    let pend2=pend;if(pend==='build'&&!POS.test(s)&&!NEG.test(s))pend2='build2';
    const VAL={daynight:/\b(day|night|both|sunset|morning|evening)\b/,place:/\b(woods|forest|trees|sea|ocean|water|both|beach|lake|mountains?)\b/};const ok=VAL[pend2]?VAL[pend2].test(w):!(POS.test(s)||NEG.test(s));
    if(!ok&&VAL[pend]&&!POS.test(s)&&!NEG.test(s)&&s.trim().split(/\s+/).length<=3){CONV.askT=performance.now();return say('Haha, '+w+'! 😄 But '+(pend==='daynight'?'day or night?':'woods or sea?'),pend);}
    if(ok&&(pend2==='fav'||pend2==='build2'||pend==='place'||pend==='daynight'||pend==='crash')){if(pend==='daynight')CONV.topic=w=(w.match(VAL.daynight)||[w])[0];if(pend==='place')w=(w.match(VAL.place)||[w])[0];CONV.topic=w;if(pend==='fav'||pend==='place'||pend==='daynight'){if(!CONV.likes.includes(w))CONV.likes.push(w);}convSave();
      const pd=pend2;const r={fav:['Ooh, '+w+'! Great pick 😎','Nice — '+w+' is awesome!','Same! I love '+w+' too 🙌'],build2:['Whoa, a '+w+'? That sounds awesome! 🤩','Cool! You should show me your '+w+' 😄'],place:[(w==='both'?'Both? Me too!':'The '+w+'? Me too!')+' 🌲🌊','Good choice — '+(w==='both'?'they\'re both':'the '+w+' is')+' beautiful!'],daynight:[(w==='both'?'Both':w[0].toUpperCase()+w.slice(1))+' flying is the best! ✨','Same here, '+w+' all the way!'],crash:['😂 Oh my word! That sounds epic!','Haha, that\'s a good one! 💥']}[pd];
      return say(PICK(r),'chat');}
    if(pend==='play'||pend==='next'){CONV.ask=null;const map=[[/race/,'race me'],[/tag/,'lets play tag'],[/cruise|fly around|explore|chill|just fly/,'follow me'],[/hide|seek/,'lets play hide and seek'],[/battle|fight/,'turn on battle']];for(const [re,c] of map)if(re.test(w))return s0.call(this,c);return s0.apply(this,arguments);}
    if(POS.test(s)){const q=nq();return say(PICK(['Nice! 😄','Cool! 😎','Awesome!']),q[1],q[0]);}
  }
  // generic short replies that continue the chat instead of "I don't understand"
  if(short&&CONV.B&&now-CONV.askT<120000){
    if(/^ (me too|same|same here|me as well|i do too|i also do|so do i|ditto) $/.test(s)){return say(PICK(['We\'re the same! 🤝','High five! ✋','Great minds think alike 😄']),'chat');}
    if(/^ (really|for real|seriously|no way|wow|whoa|omg|oh my word) $/.test(s)){return say(PICK(['Yep, for real! 😄','I know, right?! 🤯','100%! ✈️']),'chat');}
    if(/^ (lol|haha|hahaha|lmao|hehe|funny) $/.test(s)){return say(PICK(['😂','Haha I know! 😆','You\'re funny too 😄']),'chat');}
    if(/^ (ok|okay|k|kk|alright|sure|cool|nice|sweet|awesome|yeah|yep|yup|yes|mhm|got it) $/.test(s)&&CONV.ask==='chat'){const q=nq();return say(PICK(['😄','👍','Cool cool 😎']),q[1],q[0]);}
  }
  // memory of the chat
  if(/ (what did (we|i) (talk about|say|just say)|what were we talking about|do you remember what i said) /.test(s)){const mine2=CONV.h.filter(x=>x.me).slice(-6,-1).map(x=>'"'+x.t+'"');return say(mine2.length?'🧠 You said: '+mine2.join(', '):'🧠 We just started talking! 😄','chat');}
  if(/ (do you remember me|remember me|have we (talked|met) before|what did we talk about last time|last time) /.test(s)){const L=CONV.byeT?{t:CONV.byeT,h:CONV.h.slice(0,CONV.byeI).filter(x=>!/^(bye|goodbye|see ya|later|bye now)/i.test(x.t)),likes:CONV.likes}:CONV.last;if(L&&L.h&&L.h.length){const ago=Math.round((Date.now()-L.t)/60000);const agoS=ago<1?'just now':ago<60?ago+' min ago':Math.round(ago/60)+' h ago';const said=L.h.filter(x=>x.me).slice(-3).map(x=>'"'+x.t+'"').join(', ');return say('🧠 Of course! Last time ('+agoS+') you said '+said+(L.likes&&L.likes.length?' — and you like '+L.likes.slice(-3).join(', ')+'!':''),'chat');}return say('Hmm, I don\'t think we\'ve talked before — nice to meet you! 👋','chat');}
  // the normal brain answers; afterwards, keep the conversation going
  const isHi=/^ (hi|hey|hello|yo|sup|hiya|howdy|heya|hi there|hey there|good morning|good afternoon|good evening|what s up|whats up)( \w+)?( \w+)? $/.test(s);
  const isHowRU=/^ (how are you|how r u|how are ya|how you doing|how are you doing|hows it going|how s it going|how is it going|you good|how have you been)( \w+)? $/.test(s);
  const isBye=/ (bye|bye now|goodbye|good bye|see you|see ya|cya|gotta go|got to go|good night|goodnight|later|ttyl) /.test(s);
  const r=s0.apply(this,arguments);
  if(isHi){const L=CONV.last;CONV.B=B;setTimeout(()=>{if(L&&L.h&&L.h.length&&!CONV.saidBack){CONV.saidBack=1;const lk=L.likes&&L.likes.length?' Still into '+L.likes[L.likes.length-1]+'?':'';convAsk(B,'Welcome back! 😄'+(lk||' How\'s your aircraft flying today?'),lk?'chat':'how');}else convAsk(B,PICK(['How\'s your aircraft flying today? ✈️','How are you doing?','How\'s your day going? 😊']),'how');},1700);}
  if(isHowRU){CONV.B=B;setTimeout(()=>convAsk(B,PICK(['How about you? 😊','And you?','How are YOU doing?']),'how'),1500);}
  if(isBye){CONV.ask=null;CONV.byeT=Date.now();CONV.byeI=CONV.h.length;convSave();try{CONV.last=JSON.parse(localStorage.getItem('aiConv'));}catch(e){}CONV.saidBack=0;}
  return r;}catch(e){}return s0.apply(this,arguments);};}
// log both sides of the chat (the user's lines and the AI's replies) and save as we go
{const c0=chatSend;chatSend=function(t){try{const x=String(t||'').trim();if(x&&x[0]!=='/'){CONV.h.push({me:1,t:x.slice(0,120)});if(CONV.h.length>200)CONV.h.splice(0,100);}}catch(e){}return c0.apply(this,arguments);};}
{const s0=sbSay;sbSay=function(w,t){try{if(HEARING&&w&&w.B){CONV.B=w.B;CONV.h.push({b:w.B.name,t:String(t).slice(0,120)});convSave();}}catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
{const s0=smartHear;smartHear=function(){HEARING++;try{return s0.apply(this,arguments);}finally{HEARING--;}};}
