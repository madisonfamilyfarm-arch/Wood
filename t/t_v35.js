const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);});await P.waitForTimeout(3000);
  console.log('names',await P.evaluate(()=>AIB.L.map(B=>B.name+':'+B.kind).join(', ')));
  const tests=['um so like gizmo fallow me','hey ever one race me','can you do a flit','fly over to the medal','swich to a plain','wear are you','go to the fire tour','u r awesome','hold on','go higher','circle me','i\'m bored','how do i shoot','what can you do','start the race','I want to play a game with you','the drown is cool'];
  for(const t of tests)console.log(JSON.stringify(t),'→',await P.evaluate(t=>cleanSpeech(t).text,t));
  // voice
  console.log('voice',await P.evaluate(()=>{const sent=[];const c0=chatSend;chatSend=t=>sent.push(t);voiceHeard('okay message hey everyone');voiceHeard('race me to the lake send message');voiceHeard('random words');voiceHeard('chat hello there end chat');chatSend=c0;return JSON.stringify(sent);}));
  for(const t of ['everyone hover','go higher','circle me','go faster','spin','i\'m bored','how do i shoot','what can you do','you are awesome','what time is it','are you a robot','follow me','do a flip'])
    {await P.evaluate(t=>chatSend(t),t);await P.waitForTimeout(3200);}
  await P.waitForTimeout(3000);
  console.log(await P.evaluate(()=>CHAT.slice(-30).map(c=>(c.who||'')+': '+c.txt).join('\n')));
  console.log('state',await P.evaluate(()=>AIB.L.map(B=>B.name+' hold:'+(B.holdT>0)+' orb:'+(B.orbT>0)+' k:'+B.spdK+' hb:'+B.hBias).join(' | ')));
  console.log('phone menu',await P.evaluate(()=>{const L=aiItems();return L.map(i=>typeof i.label==='function'?i.label():i.label||i.t||'').join(' / ').slice(0,600);}));
  await P.evaluate(()=>{for(let i=0;i<600;i++)aiTick(1/60);});console.log('tick ok');
});
