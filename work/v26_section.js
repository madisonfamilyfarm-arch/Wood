// ================================================================ 🧠 Dad's AI runs the CAMPERS too, ANSWERS YOUR CHAT and does what you say · more AI settings
const AIX=Object.assign({answer:true,camp:true,every:6,talk:'little',mood:'friendly',temp:0.7},LS.get('aiX',{}));
function aixSave(){LS.set('aiX',AIX);}
function aiLocalOn(){return AIB.src==='local'&&!!AIB.url;}
// how often the AI computer is asked (the old loop asked every 5 s)
{const q0=aiAskLocal;aiAskLocal=async function(){try{return await q0.apply(this,arguments);}finally{AIB.t=Math.max(AIB.t,performance.now()+(AIX.every-5)*1000);}};}
// AI-chat volume
{const c0=chatAdd;chatAdd=function(who,txt){if(String(who||'').startsWith('🤖')&&AIX.talk==='off'&&!chatAdd.force)return;if(chatAdd.force)chatAdd.lastBot=-1e9;return c0.apply(this,arguments);};}
function aiSayAs(name,text){const B=AIB.L.find(b=>b.name.replace('🤖 ','').toLowerCase()===String(name).toLowerCase());const C=CAMPERS.L.find(c=>c.name.toLowerCase()===String(name).toLowerCase());
  chatAdd.force=true;try{if(B)chatAdd(B.name,text,AI_COLS[B.i]);else if(C)campSay(C,text);else chatAdd('🤖 '+name,text,'#bf5af2');}finally{chatAdd.force=false;}}
// campers follow orders from the AI computer
function campApply(arr){(Array.isArray(arr)?arr:[]).forEach(o=>{const C=CAMPERS.L.find(c=>c.name.toLowerCase()===String(o.name||'').toLowerCase());if(!C||C.dead)return;const d=String(o.do||'').toLowerCase();
    if(d==='fire'||d==='truck'||d==='follow'||d==='stay'||d==='home'){CAMPERS.order=d==='home'?null:d;if(d==='truck'&&typeof truckAiIn==='function'&&!TRUCK.ai)try{truckAiIn(C);}catch(e){}}
    else if(d==='go'||d==='place'){const P=aiPlaces();let q=null;if(o.place){const nm=String(o.place).toLowerCase().replace(/^the /,'');q=P.find(p=>p.n.toLowerCase().includes(nm));}const x=q?q.x:+o.x,z=q?q.z:+o.z;if(isFinite(x)&&isFinite(z)&&!inWater(x,z)){C.hx2=x+(Math.random()-0.5)*6;C.hz2=z+(Math.random()-0.5)*6;C.t=40;C.goAway=performance.now()+40000;}}
    else if(d==='dance'||d==='party'){C.dance=performance.now()+8000;}});}
// campers walking to a place the AI picked keep going there (instead of drifting back to camp)
{const c0=campersTick;campersTick=function(dt){const r=c0.apply(this,arguments);try{const now=performance.now();for(const C of CAMPERS.L){if(C.dead||!C.g.visible)continue;
    if(C.goAway>now&&C.state==='walk'&&C.hx2!=null){const dx=C.hx2-C.x,dz=C.hz2-C.z,d=Math.hypot(dx,dz);if(d>0.5){const sp=3.2*dt;C.x+=dx/d*Math.min(sp,d);C.z+=dz/d*Math.min(sp,d);C.yaw=Math.atan2(-dx,-dz)+Math.PI;C.g.position.set(C.x,H(C.x,C.z),C.z);C.g.rotation.y=C.yaw;}}
    if(C.dance>now){C.g.rotation.y+=dt*6;C.g.position.y=H(C.x,C.z)+Math.abs(Math.sin(now/150))*0.4;}}}catch(e){}return r;};}
function aiCampers(){return CAMPERS.L.filter(C=>!C.dead).map(C=>({name:C.name,x:Math.round(C.x),z:Math.round(C.z),doing:C.state}));}
// the regular plan also includes the campers
{const p0=aiPrompt;aiPrompt=function(){let s=p0.apply(this,arguments);const mood={friendly:'Be kind and friendly.',silly:'Be silly and goofy, make jokes.',competitive:'Be competitive and challenge the player to races and battles.'}[AIX.mood]||'';
  s+='\n'+mood+(AIX.talk==='lots'?' Chat often.':AIX.talk==='off'?' Do not chat (say "").':' Chat only sometimes.');
  if(AIX.camp)s+='\nCampers (people on foot at the campsite, they can fight fires, drive the fire truck, follow the player, go to places, dance): '+JSON.stringify(aiCampers())+'\nYou may also include "campers":[{"name":...,"do":"fire"|"truck"|"follow"|"stay"|"home"|"go"|"dance","place":"place name","say":"..."}] in your JSON.';return s;};}
// make the regular answer handle {"pilots":[...],"campers":[...]}
{const p0=aiParse;aiParse=function(txt){let o=null;try{o=JSON.parse(String(txt).slice(String(txt).indexOf('{'),String(txt).lastIndexOf('}')+1));}catch(e){}
  if(o&&!Array.isArray(o)){if(AIX.camp&&Array.isArray(o.campers)){campApply(o.campers);o.campers.forEach(c=>{if(c&&c.say&&AIX.talk!=='off')aiSayAs(c.name,String(c.say).slice(0,100));});}if(Array.isArray(o.pilots))return o.pilots;}
  return p0.apply(this,arguments);};}
// ---------------------------------------------------------------- 💬 the AI answers YOUR chat and does what you ask
AIB.chatBusy=false;
async function aiChat(txt){if(!aiLocalOn()||!AIX.answer||AIB.chatBusy)return;AIB.chatBusy=true;try{if(!AIB.models.length)await aiListModels();
    const P=aiPlaces(),pilots=AIB.L.filter(B=>!B.dead).map(B=>({name:B.name.replace('🤖 ',''),vehicle:B.kind||'drone'}));
    const p='Player "'+(CFG.name||'Madison')+'" just typed in the game chat: "'+txt+'"\nThe player is '+(WALK.on?'walking':'flying a '+vkind())+' at x='+Math.round(D.pos.x)+' z='+Math.round(D.pos.z)+'.\nAI pilots: '+JSON.stringify(pilots)+'\nCampers: '+JSON.stringify(aiCampers())+'\nPlaces: '+JSON.stringify(P.map(q=>q.n))+'\nFires burning: '+FIRE.L.length+
      '\nRecent chat (oldest first): '+JSON.stringify(CHAT.slice(-10).map(c=>(c.who||'game')+': '+c.txt))+'\nUnderstand what the player MEANS even with typos or voice-typing mistakes (they are a kid using voice typing). If they talk to someone by name, that one answers.'+'\nAnswer as the pilots/campers (1 to 3 short, kind, fun chat replies from whoever was talked to or fits best) and DO what the player asked if you can.\nReply ONLY with JSON: {"replies":[{"name":"...","text":"..."}],"pilots":[{"name":...,"vehicle":"drone"|"plane"|"heli"|"boat"|"sub"|"car","do":"go"|"place"|"fire"|"chase"|"flip"|"land"|"race","place":"place name"}],"campers":[{"name":...,"do":"fire"|"truck"|"follow"|"stay"|"home"|"go"|"dance","place":"place name"}]}';
    let out;if(AIB.kindApi==='openai'){const j=await aiFetchJ(AIB.url+'/v1/chat/completions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model:AIB.model,messages:[{role:'user',content:p}],temperature:AIX.temp})},60000);out=j.choices&&j.choices[0]&&j.choices[0].message.content;}
    else{const j=await aiFetchJ(AIB.url+'/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({model:AIB.model,messages:[{role:'system',content:'You play the friendly AI characters in a kids\' RC flying game. Answer with JSON only.'},{role:'user',content:p}],stream:false,format:'json',keep_alive:'10m',options:{temperature:AIX.temp,num_ctx:4096}})},60000);out=j.message&&j.message.content;}
    let o={};try{o=JSON.parse(String(out).slice(String(out).indexOf('{'),String(out).lastIndexOf('}')+1));}catch(e){}
    (o.replies||[]).slice(0,3).forEach((r,i)=>setTimeout(()=>{if(r&&r.text)aiSayAs(r.name||'AI',String(r.text).slice(0,140));},400+i*900));
    if(Array.isArray(o.pilots))aiApply(o.pilots);if(Array.isArray(o.campers))campApply(o.campers);if(AIB.ok!==true){AIB.ok=true;}}
  catch(e){toast('❌ The AI didn\'t answer ('+(e.name==='AbortError'?'too slow':e.message)+')',3000);}AIB.chatBusy=false;}
{const s0=chatSend;chatSend=function(txt){const r=s0.apply(this,arguments);try{if(txt&&String(txt).trim())aiChat(String(txt).trim().slice(0,200));}catch(e){}return r;};}
// ---------------------------------------------------------------- ⚙️ more AI settings
function aiMoreItems(){return[mInfo('Settings for the AI computer (Dad\'s Ollama) and the built-in AI.'),
  mItem(()=>'💬 AI answers my chat + does what I say: '+(AIX.answer?'ON':'off'),()=>{AIX.answer=!AIX.answer;aixSave();}),
  mItem(()=>'🧑‍🚒 AI computer controls the campers too: '+(AIX.camp?'ON':'off'),()=>{AIX.camp=!AIX.camp;aixSave();}),
  mItem(()=>'⏱ AI thinks every '+AIX.every+' s  ◀ ▶',()=>{AIX.every=AIX.every>=30?5:AIX.every+5;aixSave();},d=>{AIX.every=clamp(AIX.every+d*5,5,60);aixSave();}),
  mItem(()=>'🗨 How much the AI chats: '+({off:'never',little:'a little',lots:'lots'}[AIX.talk]),()=>{AIX.talk={off:'little',little:'lots',lots:'off'}[AIX.talk];aixSave();}),
  mItem(()=>'😀 AI personality: '+({friendly:'😊 friendly',silly:'🤪 silly',competitive:'🏆 competitive'}[AIX.mood]),()=>{AIX.mood={friendly:'silly',silly:'competitive',competitive:'friendly'}[AIX.mood];aixSave();}),
  mItem(()=>'🎲 Creativity (temperature): '+AIX.temp.toFixed(1)+'  ◀ ▶',()=>{AIX.temp=AIX.temp>=1.2?0.2:+(AIX.temp+0.2).toFixed(1);aixSave();},d=>{AIX.temp=clamp(+(AIX.temp+d*0.1).toFixed(1),0,1.5);aixSave();}),
  mItem(()=>'🚀 AI pilots shoot rockets: '+(DZ.ai?'ON':'off'),()=>{DZ.ai=!DZ.ai;LS.set('dzAi',DZ.ai);}),
  mItem(()=>'🧑‍🚒 Campers: '+CAMPERS.L.length+' — tap to add one',()=>{try{campAdd();}catch(e){}}),
  mItem('📡 Test the AI computer now',()=>{const t=performance.now();toast('🧠 Asking the AI computer…',1500);aiListModels().then(L=>toast('✅ AI computer answered in '+Math.round(performance.now()-t)+' ms — '+L.length+' models, using '+AIB.model,4000)).catch(e=>toast('❌ No answer: '+e.message,4000));}),
  mItem('◀ Back',()=>menuBack())];}
{const i0=aiItems;aiItems=function(){const L=i0();L.splice(L.length-1,0,mItem('⚙️ More AI settings ▸',()=>menuPush('⚙️ More AI settings',aiMoreItems())));return L;};}
