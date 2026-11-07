const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);DZ.on=true;DZ.ai=true;});await P.waitForTimeout(3000);
  const step=(n,dt)=>P.evaluate(([n,dt])=>{for(let i=0;i<n;i++){tntTick(dt);bigTick(dt);}},[n,dt]);
  for(const k of ['classic','cluster','timer','sticky','mega']){const r=await P.evaluate(k=>{TNT.kind=k;TNT.r=20;TNT.fuse=2;D.state='flying';D.pos.set(PAD.x+200,H(PAD.x+200,PAD.z)+12,PAD.z);D.vel.set(0,0,0);
      if(k==='sticky'){const B=AIB.L.find(b=>!b.dead);if(B){D.pos.copy(B.p).add(new V3(0,3,0));}}
      let booms=0;const e0=explode;window._e0=e0;explode=function(p,r){booms++;window._lr=r;return e0.apply(this,arguments);};window._bc=()=>booms;tntDrop();return TNTS.length+' '+(TNTS[TNTS.length-1]||{}).kind;},k);
    await step(80,0.05);const res=await P.evaluate(()=>{const b=window._bc();explode=window._e0;return 'booms '+b+' lastR '+window._lr+' left '+TNTS.length;});console.log(k,r,'→',res);await step(60,0.05);}
  console.log('fix',await P.evaluate(()=>{const before='craters '+CRATERS.length+' gone '+GONE.objs.length+' scorch '+BIG.scorch.length+' fires '+FIRE.L.length+' truck '+GONE.truck+' trk '+TRAIN.brk.length;fixAll();return before+' → craters '+CRATERS.length+' gone '+GONE.objs.length+' scorch '+BIG.scorch.length+' fires '+FIRE.L.length+' truck '+GONE.truck+' trk '+TRAIN.brk.length;}));
  for(const t of ['Ace be on my team','everyone attack Blaze','what is 7 times 8','where is the lake','how high am I','flip a coin','tell me a riddle','I pick rock','give me a fun fact','what\'s your favorite animal','Ace drop tnt on Blaze','who is here','what\'s the score','zoom zoom','chopper time ascend','count to 5','I\'m sad','tell me a story'])
    {await P.evaluate(t=>chatSend(t),t);await P.waitForTimeout(2900);}
  await P.waitForTimeout(4000);console.log(await P.evaluate(()=>CHAT.slice(-40).map(c=>(c.who||'')+': '+c.txt).join('\n')));
  console.log(await P.evaluate(()=>AIB.L.map(B=>B.name+' team:'+B.team+' hunt:'+B.hunt+' bomb:'+B.bomb+' k:'+B.spdK).join(' | ')));
});
