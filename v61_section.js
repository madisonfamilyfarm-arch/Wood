// ================================================================ v61: 🗣 AI pilots can TALK OUT LOUD (like voice chat with real players). Each pilot has its own voice. Off by default — turn on in 🤖 AI players, or say "talk out loud".
const TTS={on:LS.get('aiTts',false),q:[],busy:false,last:0};
function ttsOk(){return typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined';}
function ttsClean(t){return String(t||'').replace(/<[^>]+>/g,'').replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu,'').replace(/\(.*?\)/g,'').replace(/[·•]/g,',').replace(/\s+/g,' ').trim();}
function ttsSay(name,text){if(!TTS.on||!ttsOk()||document.visibilityState!=='visible')return;const t=ttsClean(text);if(!t||t.length<2)return;
  if(speechSynthesis.speaking&&TTS.q.length>1)return; // don't build up a long backlog
  try{const u=new SpeechSynthesisUtterance(t.slice(0,160));let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))>>>0;u.pitch=0.7+(h%70)/100;u.rate=1.05+((h>>>8)%25)/100;u.volume=Math.min(1,(SFX&&SFX.set?SFX.set.master/100:1)||1);
    const V=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));if(V.length)u.voice=V[h%V.length];TTS.until=performance.now()+1500+t.length*85;u.onend=u.onerror=()=>{TTS.until=0;TTS.last=performance.now();};speechSynthesis.speak(u);}catch(e){}}
{const c0=chatAdd;chatAdd=function(who,txt){const r=c0.apply(this,arguments);try{if(TTS.on&&typeof who==='string'&&/^🤖 /.test(who))ttsSay(who,txt);}catch(e){}return r;};}
function ttsSet(on){TTS.on=on;LS.set('aiTts',on);if(!on){try{speechSynthesis.cancel();}catch(e){}}toast(on?'🗣 AI pilots will talk out loud!':'🤫 AI pilots are back to text only',1800);if(on)setTimeout(()=>ttsSay('🤖 Ace','Hey! Can you hear me now?'),300);}
{const m0=mCatItems;mCatItems=function(k){const L=m0.apply(this,arguments);if(k==='ai'){try{L.splice(1,0,mItem(()=>'🗣 AI talks out loud: '+(TTS.on?'ON':'off')+(ttsOk()?'':' (not on this browser)'),()=>{ttsSet(!TTS.on);renderMenu();}));}catch(e){}}return L;};}
{const s0=smartHear;smartHear=function(txt){try{const s=nNorm(String(txt||''));
    if(/ (talk|speak) (out loud|outloud|aloud|with your voice|to me out loud)| use your (voice|voices)| turn on (ai )?(voice|voices|talking)| (can|could) you talk out loud /.test(s)){ttsSet(true);return true;}
    if(/ (stop|no more|quit|turn off) (talking out loud|talking aloud|the voices?|your voice|ai voice)| (text|type) only /.test(s)){ttsSet(false);return true;}}catch(e){}return s0.apply(this,arguments);};}
{const s0=smartHear;smartHear=function(t){return s0.call(this,vFix(t));};}
// when your 🎤 voice chat is on, don't let the mic hear the AI's own voice and think YOU said it
{const v0=voiceHeard;voiceHeard=function(t){try{if(TTS.on&&(performance.now()<(TTS.until||0)||performance.now()-TTS.last<700))return;}catch(e){}return v0.apply(this,arguments);};}
// "what can you do?" → also mention the newest tricks
{const s0=smartHear;smartHear=function(txt){const r=s0.apply(this,arguments);try{const s=nNorm(String(txt||''));if(/^ (what can you do|help|what can i say|what do you know|commands|help me out) $/.test(s)){const B=aiNear(1e9)[0];if(B)sbSay({B},'✨ Also try: "talk out loud" 🗣 · "take me to the lake" 🧭 · "what does enormous mean" 📚 · "tell me about yourself" 🎭 · "make the AI harder" 😈 · "how do I go underwater" 🐟',2600);}}catch(e){}return r;};}
