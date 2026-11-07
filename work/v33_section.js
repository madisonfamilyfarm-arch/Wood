// ================================================================ 🌐🧠 AI in ONLINE ROOMS: a player whose game can reach Dad's AI (computer + Play Multiplayer) shares it with every phone in the room, automatically.
// No AI computer in the room → phones use the smart built-in brain. AI pilots switch on by themselves in a room.
AIB.remote=null;AIB.remoteName='';AIB.remoteT=0;const AIREQ={n:0,wait:{}};
function aiCanShare(){return AIB.src==='local'&&AIB.ok===true&&!ON_WEB&&!AIB.remote;}
// tell the room "I can reach the AI computer"
setInterval(()=>{try{if(ONL.on&&aiCanShare())mpSend({t:'aicap',model:AIB.model||'',who:CFG.name});if(AIB.remote&&performance.now()-AIB.remoteT>25000){chatSys('🧠 Lost the shared AI from '+AIB.remoteName+' — using the built-in brain');AIB.remote=null;AIB.models=[];if(AIB.src==='local'&&ON_WEB){AIB.src='builtin';AIB.claude=false;}}}catch(e){}},8000);
MPH.aicap=function(m,pe){if(aiCanShare()&&!ON_WEB)return;const first=!AIB.remote;AIB.remote=m.id;AIB.remoteName=m.who||pe.name||'a friend';AIB.remoteT=performance.now();
  if(first){if(m.model)AIB.model=m.model;AIB.src='local';AIB.claude=true;AIB.ok=null;AIB.models=[];AIB.t=0;if(!AIB.url)AIB.url='http://192.168.128.50:11434';toast('🧠 Connected to Dad\'s AI through '+AIB.remoteName+'\'s computer!',3500);chatSys('🧠 Using Dad\'s AI ('+(m.model||'AI')+') through '+AIB.remoteName);}};
// ask through the room
function aiRoomFetch(path,opt,ms){return new Promise((res,rej)=>{const rid=mp.id+'.'+(++AIREQ.n);const t=setTimeout(()=>{delete AIREQ.wait[rid];rej(new Error('the shared AI took too long'));},ms||60000);
  AIREQ.wait[rid]={res,rej,t};mpSend({t:'aireq',to:AIB.remote,rid,path,method:(opt&&opt.method)||'GET',body:opt&&opt.body?String(opt.body):null});});}
MPH.aires=function(m){if(m.to!==mp.id)return;const w=AIREQ.wait[m.rid];if(!w)return;clearTimeout(w.t);delete AIREQ.wait[m.rid];AIB.remoteT=performance.now();if(m.err)w.rej(new Error(m.err));else w.res(m.json);};
// answer other players' AI questions (only the one they asked)
MPH.aireq=function(m){if(m.to!==mp.id||!AIB.url)return;if(!/^\/(api|v1)\//.test(String(m.path||''))){mpSend({t:'aires',to:m.id,rid:m.rid,err:'bad request'});return;}
  aiFetchJ(AIB.url+m.path,m.body?{method:'POST',headers:{'content-type':'application/json'},body:m.body}:{},60000).then(j=>mpSend({t:'aires',to:m.id,rid:m.rid,json:j})).catch(e=>mpSend({t:'aires',to:m.id,rid:m.rid,err:String(e.message||e)}));};
// every AI call: if a friend in the room has the AI, go through them
{const f0=aiFetchJ;aiFetchJ=async function(url,opt,ms){if(AIB.remote&&ONL.on&&AIB.url&&url.startsWith(AIB.url))return aiRoomFetch(url.slice(AIB.url.length),opt,ms);return f0.apply(this,arguments);};}
// the phone website may use the AI when it comes through the room
{const l0=aiListModels;aiListModels=async function(){if(ON_WEB&&AIB.remote&&ONL.on){const keep=AIB.model;const was=AIB.url;try{const j=await aiFetchJ(AIB.url+'/api/tags',{},20000);AIB.kindApi='ollama';AIB.models=(j.models||[]).map(x=>({n:x.name,size:x.size||0,fam:(x.details&&x.details.family)||'',par:(x.details&&x.details.parameter_size)||''}));if(keep&&AIB.models.some(x=>x.n===keep))AIB.model=keep;else{const x=AIB.models.find(x=>/^mistral/.test(x.n))||AIB.models[0];if(x)AIB.model=x.n;}return AIB.models;}finally{AIB.url=was;}}return l0.apply(this,arguments);};}
{const b0=aiBrainSet;aiBrainSet=function(src){if(ON_WEB&&src==='local'&&AIB.remote&&ONL.on){AIB.src='local';AIB.claude=true;AIB.ok=null;AIB.t=0;toast('🧠 Using Dad\'s AI through '+AIB.remoteName,2000);return;}return b0.apply(this,arguments);};}
// in a room: AI pilots come on by themselves
{const a0=onlAttach;onlAttach=function(){const r=a0.apply(this,arguments);try{if(!AIB.n)aiSet(3);if(aiCanShare())setTimeout(()=>mpSend({t:'aicap',model:AIB.model||'',who:CFG.name}),800);}catch(e){}return r;};}
{const l0=onlLeave;onlLeave=function(){const r=l0.apply(this,arguments);if(AIB.remote){AIB.remote=null;if(ON_WEB){AIB.src='builtin';AIB.claude=false;}}return r;};}
// the room menu shows where the AI comes from
{const i0=onlItems;onlItems=function(){const L=i0();L.splice(2,0,mInfo(()=>'🧠 AI: '+(AIB.remote?'Dad\'s AI through '+AIB.remoteName+(AIB.ok===true?' ✅':' …'):aiCanShare()?'you are sharing Dad\'s AI with the room ✅':'smart built-in brain (for Dad\'s AI, a computer started with Play Multiplayer has to join this room)')));return L;};}
