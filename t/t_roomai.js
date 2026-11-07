const H=require('./harness');
H(async({mk})=>{const PJ='/tmp/claude-0/-home-claude/45cffd64-7151-5ab5-acd7-339a16c71f6a/scratchpad/pj_test.js';
  const A=await mk('A','http://127.0.0.1:8790/');const B=await mk('B','http://127.0.0.1:8765/woods-rc-sim.html');
  for(const P of [A,B])await P.route('**/peerjs.min.js',r=>r.fulfill({path:PJ,contentType:'text/javascript'}));
  await A.waitForTimeout(4000);for(const P of [A,B])await P.evaluate(()=>{startGame('free');});
  // A = the computer that reaches Dad's AI
  console.log('A ai',await A.evaluate(async()=>{AIB.url=aiUrlFix('127.0.0.1:11435');AIB.models=[];aiBrainSet('local');await aiListModels();AIB.ok=true;return AIB.model+' share '+aiCanShare();}));
  // B = the phone: can't reach it
  await B.evaluate(()=>{AIB.url='http://10.255.255.1:11434';aiBrainSet('builtin');AIB.models=[];});
  await A.evaluate(()=>onlHost());await A.waitForTimeout(4000);const code=await A.evaluate(()=>ONL.code);
  await B.evaluate(c=>onlJoin(c),code);await B.waitForTimeout(14000);
  console.log('B',await B.evaluate(()=>'remote '+(AIB.remote?AIB.remoteName:'none')+' src '+AIB.src+' ok '+AIB.ok+' err '+AIB.err+' model '+AIB.model+' bots '+AIB.L.length));
  await B.evaluate(()=>chatSend('Sam go to the meadow'));await B.waitForTimeout(9000);
  console.log('B chat',await B.evaluate(()=>CHAT.slice(-5).map(c=>(c.who||'')+': '+c.txt).join(' / ')));
});
