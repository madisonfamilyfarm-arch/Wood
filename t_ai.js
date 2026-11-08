// AI understanding test: sends every line of ai_corpus.txt to the AI and works out what it ACTUALLY did (from state changes + replies).
// usage: FAST=1 node t_ai.js [label]   → prints pass rate + failures, writes ai_result_<label>.json
const H=require('./harness');const fs=require('fs');
const lines=fs.readFileSync(__dirname+'/'+(process.env.CORPUS||'ai_corpus.txt'),'utf8').split('\n').filter(l=>l.trim()&&!l.startsWith('#')).map(l=>{const [m,e]=l.split('||').map(x=>x.trim());return{m,e};});
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(async()=>{if(typeof aiwLoad==='function'){await Promise.all('abcdefghijklmnopqrstuvwxyz'.split('').map(L=>new Promise(r=>aiwLoad(L,r))));}});
  await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(4);D.armed=true;D.state='flying';D.pos.y=H(D.pos.x,D.pos.z)+6;});await P.waitForTimeout(3000);
  const names=await P.evaluate(()=>{AIB.L.forEach(B=>{if(B.kind!=='drone'){try{aiSwitch(B,'drone');}catch(e){}}});return AIB.L.map(B=>B.name.replace('🤖 ',''));});
  // rename the corpus pilots to the real AI names in this game (ace/blaze/gizmo/comet → actual)
  const map={ace:names[0],blaze:names[1],gizmo:names[2],comet:names[3]||names[1],dash:names[3]||names[2]};
  const res=await P.evaluate(([lines,map])=>{
    const sub=m=>m.replace(/\b(ace|blaze|gizmo|comet|dash)\b/gi,w=>map[w.toLowerCase()]||w).replace(/\bis mo\b/,()=>{const g=map.gizmo||'';return g.length>3?g.slice(0,2).toLowerCase()+' '+g.slice(2).toLowerCase():g;});
    const tags=new Set(),replies=[];const T=t=>tags.add(t);
    const w=(name,fn)=>{const f0=window[name];if(typeof f0!=='function')return;window[name]=function(){try{fn.apply(this,arguments);}catch(e){}return f0.apply(this,arguments);};};
    w('aiSwitch',()=>T('switch'));w('sbPilotGo',(B,pl)=>T(pl&&Math.hypot(pl.x-PAD.x,pl.z-PAD.z)<6?'home':'go'));w('aiFlip',()=>T('flip'));w('aiDropTnt',()=>T('tnt'));
    w('sbSay',(x,t)=>replies.push(String(t)));w('chatSys',t=>replies.push(String(t)));
    const has=(arr,t)=>Array.isArray(arr)&&arr.some(x=>{try{return new RegExp('^'+String(x).replace(/[.*+?^$()|[\]\\]/g,'\\$&').replace(/\{me\}|\{place\}/g,'.*')+'$').test(t);}catch(e){return false;}});
    const RBk=(typeof RB!=='undefined')?RB:{};NLU.sync=true;
    const classify=(t)=>{const o=[];
      if(JOKES.some(j=>t.indexOf(j.slice(0,20))>=0))o.push('joke');if(/🧮/.test(t))o.push('math');if(/🧭|You're right at|m (north|south|east|west)/.test(t))o.push('directions');if(/⏰/.test(t))o.push('time');if(/🏆/.test(t))o.push('score');
      if(/🪙/.test(t))o.push('coin');if(/🎲/.test(t))o.push('dice');if(/🔢/.test(t))o.push('number');if(/I picked|Rock, paper|✊/.test(t))o.push('rps');if(/🤔|^Answer:/.test(t))o.push('riddle');if(/💡/.test(t))o.push('fact');if(/📖/.test(t))o.push('story');if(/🎵/.test(t))o.push('song');
      if(/LIFTOFF|\d… \d/.test(t))o.push('count');if(/You're .* of |You're at /.test(t))o.push('whereami');if(/above the ground|km\/h/.test(t))o.push('status');if(/Here now/.test(t))o.push('who');
      if(typeof HOWTO!=='undefined'&&HOWTO.some(h=>t===h[1]))o.push('howto');if(/^I can:|^Lots!|^Hmm! You could ask/.test(t))o.push('help');if(/^🎮 Left stick UP|^🔧 Menu → 🛠 Build/.test(t))o.push('howto');
      if(has(RBk.hi,t)||/^(Hi! 👋|Hey there!|Hello, pilot|Yo! What's up)/.test(t))o.push('greet');if(has(RBk.how,t)||/^(Great! The flying|Doing awesome|Super! Just zooming)/.test(t))o.push('howareyou');
      if(has(RBk.thanks,t)||/^(You're welcome|Anytime|No problem)/.test(t))o.push('thanks');if(has(RBk.bye,t)||/^See you later/.test(t))o.push('bye');
      if(/Aww, thanks|You're awesome too|made my day|Thanks, pilot/.test(t))o.push('compliment');if(/still learning|Let me try that again|be nice/.test(t))o.push('insult');if(/^(No worries! 😊|It's okay!|All good, friend)/.test(t))o.push('sorry');
      if(/Let's race! Say|Want to battle|fire tower and back|3 flips|explore the lake|Make a room/.test(t))o.push('bored');if(typeof FAV!=='undefined'&&Object.values(FAV).some(a=>a.includes(t)))o.push('favorite');
      if(/AI pilot|robot|computer pilot/.test(t))o.push('robot');if(/old as this game|birthdays/.test(t))o.push('age');if(/Nice to meet you, /.test(t))o.push('name');if(/I'll remember|I like .* too|got it 📝/.test(t))o.push('like');
      if(/^You're .*!|You like |Tell me what you like/.test(t))o.push('memory');if(/🤐/.test(t))o.push('quiet');if(/chat more/.test(t))o.push('talk');if(/here for you|robot hug|cheer up|Me too!|Best day ever|Woo-hoo|Best game ever|^So fun!/.test(t))o.push('feelings');
      if(/^Flying my|near |^I'm in a|^Hanging out/.test(t)&&!/of you/.test(t))o.push('doing');if(/Right here next to you|I'm near .* of you|POLO|^Flying my .* near /.test(t))o.push('where');if(/already in a/.test(t))o.push('switch');if(/^Go after .*They're/.test(t))o.push('advice');if(/Exploring!/.test(t))o.push('go');if(/^I'm .*! Nice to meet you/.test(t))o.push('whoareyou');if(/got your back|Stick with me/.test(t))o.push('scared');if(/marshmallows|Pizza after|s'mores/.test(t))o.push('hungry');
      if(/I LOVE it|It's the best|Heck yeah|only on Tuesdays/.test(t))o.push('dolike');if(/live right here|born in the hangar|From the cloud/.test(t))o.push('wherelive');
      if(has(RBk.yes,t)||/^(👍|Cool!|Awesome!)$/.test(t))o.push('yes');if(has(RBk.no,t)||/^Okay! 🙂$/.test(t))o.push('no');
      if(/Let's play! 🎮/.test(t))o.push('play');if(/Bring it on|Battle time|You asked for it|Target locked: you|here I come/.test(t))o.push('attack');if(/no more rockets|friends! 🤝/.test(t))o.push('peace');if(/^Tag! I'm it/.test(t))o.push('tag');if(/I'm hiding/.test(t))o.push('hide');if(/Follow the leader!/.test(t))o.push('leader');if(/^Switching to a/.test(t))o.push('switch');if(/Good game/.test(t))o.push('stopgame');if(/You're on! 🏁|Race you|Last one there/i.test(t))o.push('race');
      if(/not sure|didn't quite get|Say that again|still learning that|^Yeah\?$|I'm listening|What should I do|Did you mean/.test(t))o.push('huh');if(/Did you mean/.test(t))o.push('clarify');
      if(/blow up|go after|target|easiest|weakest|lowest/i.test(t)&&/next|try|go for|easiest|weak|low/i.test(t))o.push('advice');if(/YOUR team|own team|No teams right now/.test(t))o.push('whichteam');if(/^gg|Good game/.test(t))o.push('gg');if(/You're ON|Rematch! Let's go|This time I'm winning/.test(t))o.push('rematch');if(/\d+% (🩹|💔)|💪 \(\d+%\)/.test(t))o.push('health');if(/Nobody's scored|No battle going/.test(t))o.push('score');if(/practicing 🎯|^Thanks! 😎|You saw that/.test(t))o.push('niceshot');if(/^(😂|haha 😆|lol 🤣)$/.test(t))o.push('laugh');if(/Bring it!|Try me|Ooh, scary|Next one won't|Lucky dodge|Hold still/.test(t))o.push('taunt');if(/On my way! I'll get|I'm coming! 🚀|Coming to help/.test(t))o.push('helpme');if(/^📖|^📚|^↔️|^✅ Yep!|^🔤|isn't in my dictionary|don't know the word/.test(t))o.push('define');return o;};
    const snap=()=>({dz:DZ.ai,game:GAME.on,q:AIC.quiet,B:AIB.L.map(B=>({k:B.kind,g:B.goal&&B.goal.kind,team:B.team,hunt:B.hunt,bomb:B.bomb,hold:B.holdT,orb:B.orbT,hb:B.hBias||0,sp:B.spdK||1,spin:B.spinT,flip:B.flipT||0,loop:B.loop||0,mode:B.mode})),C:CAMPERS.L.map(C=>({d:C.dance,hx:C.hx2})),co:CAMPERS.order,tn:TNTS.length});
    const out=[];const now=()=>performance.now();
    for(const L of lines){tags.clear();replies.length=0;
      if(L.e!=='stopgame'&&GAME.on)gameStop();if(L.e==='stopgame'&&!GAME.on)gameStart('tag');DZ.ai=true;
      // reset pilots so each line starts fresh
      AIB.L.forEach(B=>{B.holdT=0;B.orbT=0;B.hBias=0;B.spdK=1;B.spinT=0;B.team=null;B.hunt=null;B.bomb=null;B.flipT=0;B.loop=0;if(B.goal&&B.goal.kind!=='go')B.goal=null;});
      const a=snap();let err='';try{chatSend(sub(L.m));}catch(e){err=e.message;}const b=snap();
      if(a.dz!==b.dz)T(b.dz?'attack':'peace');if(b.game&&a.game!==b.game)T(b.game);if(a.game&&!b.game)T('stopgame');if(a.q!==b.q)T(b.q?'quiet':'talk');if(b.tn>a.tn)T('tnt');
      if(a.co!==b.co&&b.co==='follow')T('follow');
      b.B.forEach((x,i)=>{const y=a.B[i]||{};if(x.k!==y.k)T('switch');if(x.g==='chase'&&y.g!=='chase')T('follow');if(x.g==='race')T('race');if(x.g==='land')T('land');if(x.g==='flip'||x.flip>0||x.loop>0)T('flip');
        if(x.team==='me')T('team');if(x.hunt)T('hunt');if(x.bomb)T('tnt');if(x.hold>now())T('hover');if(x.orb>now())T('circle');if(x.hb>y.hb)T('higher');if(x.hb<y.hb)T('lower');if(x.sp>y.sp)T('faster');if(x.sp<y.sp)T('slower');if(x.spin>now())T('spin');if(x.mode==='takeoff'&&y.mode!=='takeoff')T('takeoff');});
      b.C.forEach((c,i)=>{if(c.d&&c.d!==(a.C[i]||{}).d)T('dance');});
      const huhR=r=>/not sure|didn't quite get|Say that again|still learning that|I'm listening|What should I do|Did you mean/.test(r);replies.forEach(r=>classify(r).forEach(T));const rr=replies.filter(r=>!huhR(r));if(rr.some(r=>/Taking off|Wheels up|Up, up/.test(r)))T('takeoff');if(rr.some(r=>/dance|💃|🕺|🎉 Woo/i.test(r)))T('dance');if(rr.some(r=>/Coming in to land/.test(r)))T('land');
      if(rr.some(r=>/On my way to|Heading to|See you at/.test(r)))T('go');if(rr.some(r=>/Copying you|Following|right behind|follow/i.test(r)))T('follow');
      out.push({m:sub(L.m),e:L.e,got:[...tags],r:replies.slice(0,2),err});}
    return out;},[lines,map]);
  let pass=0;const fails=[];const action=new Set(['follow','come','go','race','attack','hunt','peace','team','land','takeoff','flip','spin','dance','hover','circle','higher','lower','faster','slower','home','switch','tnt','tag','hide','leader','stopgame']);
  for(const r of res){const exp=r.e.split('+');let ok;
    if(r.e==='come')ok=r.got.includes('follow')||r.got.includes('come');
    else if(r.e==='again')ok=r.got.some(t=>action.has(t));
    else if(r.e==='huh')ok=!r.got.some(t=>action.has(t))&&(r.got.includes('huh')||r.got.includes('clarify'));
    else ok=exp.every(x=>r.got.includes(x));
    r.ok=ok;if(ok)pass++;else fails.push(r);}
  const label=process.argv[2]||'run';console.log(`AI understood ${pass}/${res.length} = ${Math.round(100*pass/res.length)}%  (${label})`);
  fails.forEach(f=>console.log('✗ '+f.m.padEnd(42)+' want '+f.e.padEnd(10)+' got ['+f.got.join(',')+'] '+(f.err?'ERR '+f.err:'')+' "'+(f.r[0]||'').slice(0,50)+'"'));
  fs.writeFileSync(__dirname+'/ai_result_'+label+'.json',JSON.stringify(res,null,1));
});
