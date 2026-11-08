const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(2000);
  console.log(await P.evaluate(()=>['heads or tails','do it again','Ace follow me then do a flip','can you follow me','do you like pizza'].map(t=>{const c=cleanSpeech(t).text;const p=nParse(c,{});return t+' → clean "'+c+'" → '+(p?p.i:'null')+' | split '+JSON.stringify(nSplit(c));}).join('\n')));
});
