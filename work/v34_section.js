// ================================================================ 🌍 Dad's AI from ANYWHERE: accept his remote address (https web address, custom port, path), optional key, clear errors
aiUrlFix=function(u){u=String(u||'').trim();if(!u)return'';const hadScheme=/^https?:\/\//i.test(u);if(!hadScheme)u='http://'+u;u=u.replace(/\/+$/,'').replace(/\/(api|v1)(\/.*)?$/,'');const host=u.replace(/^https?:\/\//,'').split('/')[0];
  if(/^http:/i.test(u)&&!/:\d+$/.test(host))u=u.replace(host,host+':11434');return u;};
AIB.key2=LS.get('aiKey2','');
// optional key (for remote setups that need one)
{const f0=aiFetchJ;aiFetchJ=function(url,opt,ms){if(AIB.key2&&AIB.url&&String(url).startsWith(AIB.url)){opt=Object.assign({},opt||{});opt.headers=Object.assign({},opt.headers||{},{Authorization:'Bearer '+AIB.key2});}return f0.call(this,url,opt,ms);};}
// clear messages for what went wrong
function aiWhy(e){const m=String(e&&e.message||e);if(ON_WEB&&/^http:/i.test(AIB.url||''))return'the phone website can only use an https:// AI address (Dad\'s remote address must start with https://)';
  if(/Failed to fetch|NetworkError|Load failed|blocked/i.test(m))return'couldn\'t reach '+AIB.url.replace(/^https?:\/\//,'')+' — wrong address, the AI computer is off, or it isn\'t allowing websites (Dad: set OLLAMA_ORIGINS=*)';
  if(/HTTP 401|HTTP 403/.test(m))return'the AI said "not allowed" — it may need a key (Menu → 🤖 AI pilots → 🔑 AI key)';if(/HTTP 404/.test(m))return'that model name isn\'t on the AI computer — pick one under 🧩 AI model';return m;}
{const l0=aiListModels;aiListModels=async function(){try{return await l0.apply(this,arguments);}catch(e){throw new Error(aiWhy(e));}};}
// on the phone website an https address is allowed (only plain http:// is blocked by iPhones)
{const b0=aiBrainSet;aiBrainSet=function(src){if(ON_WEB&&src==='local'&&/^https:/i.test(AIB.url||'')){AIB.src='local';AIB.claude=true;LS.set('aiSrc','local');AIB.ok=null;AIB.t=0;toast('🧠 Connecting to AI…',1500);return;}return b0.apply(this,arguments);};}
if(ON_WEB&&/^https:/i.test(AIB.url||'')&&LS.get('aiSrc','')==='local'){AIB.src='local';AIB.claude=true;}
// menu: 🌍 remote address + 🔑 key
{const i0=aiItems;aiItems=function(){const L=i0();const k=L.findIndex(it=>{try{return /AI computer address/.test(it.label());}catch(e){return false;}});
  L.splice(k+1,0,mItem(()=>'🌍 Dad\'s address from far away'+(LS.get('aiUrlRemote','')?': '+LS.get('aiUrlRemote','').replace(/^https?:\/\//,''):' (tap to type it)'),()=>{const v=prompt('Type the address Dad uses to reach his AI from far away (for the phone it has to start with https://), like https://dads-ai.example.com',LS.get('aiUrlRemote','')||'https://');if(!v||v==='https://')return;const u=aiUrlFix(v);LS.set('aiUrlRemote',u);AIB.url=u;LS.set('aiUrl',u);AIB.models=[];AIB.ok=null;toast('🧠 Connecting to AI at '+u.replace(/^https?:\/\//,'')+'…',2000);
      aiListModels().then(L2=>{toast('✅ Found Dad\'s AI — '+L2.length+' models, using '+AIB.model,3500);aiBrainSet('local');}).catch(e=>toast('❌ '+e.message,7000));}),
    mItem(()=>'🏠 Use the home address ('+'192.168.128.50'+')',()=>{AIB.url=aiUrlFix('192.168.128.50');LS.set('aiUrl',AIB.url);AIB.models=[];AIB.ok=null;toast('🏠 Using the home address',1500);}),
    mItem(()=>'🔑 AI key (only if Dad\'s remote setup needs one): '+(AIB.key2?'saved':'none'),()=>{const v=prompt('Key for Dad\'s AI (leave empty for none)',AIB.key2||'');if(v==null)return;AIB.key2=v.trim();LS.set('aiKey2',AIB.key2);AIB.ok=null;}));return L;};}
// Open WebUI support (https web page Dad may use remotely): models at /api/models, chat at /api/chat/completions, needs its API key
{const l0=aiListModels;aiListModels=async function(){try{AIB.owui=false;return await l0.apply(this,arguments);}catch(e){if(!AIB.url)throw e;
  try{const j=await aiFetchJ(AIB.url+'/api/models',{},10000);const L=(j.data||j.models||[]).map(m=>({n:m.id||m.name,size:0,fam:'',par:''})).filter(m=>m.n);if(!L.length)throw e;AIB.owui=true;AIB.kindApi='openai';AIB.models=L;
    if(!AIB.model||!L.some(m=>m.n===AIB.model)){const m=L.find(m=>/^mistral/.test(m.n))||L[0];AIB.model=m.n;}LS.set('aiModel',AIB.model);return L;}catch(e2){throw e;}}};}
{const f0=aiFetchJ;aiFetchJ=function(url,opt,ms){if(AIB.owui&&AIB.url&&String(url).startsWith(AIB.url+'/v1/chat/completions'))url=AIB.url+'/api/chat/completions';return f0.call(this,url,opt,ms);};}
