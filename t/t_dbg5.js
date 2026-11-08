const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(2000);
  console.log(await P.evaluate(()=>['Ace pursue me','sit tight','stay right there Ace','ease up','whats your favorite place','i really like trains','where do you come from','my name\'s maddie','spin in circles','who\'s the weakest'].map(t=>{const c=cleanSpeech(t).text;return t+' → clean "'+c+'" → syn "'+synNorm(c)+'" → nlu '+((nParse(c,{})||{}).i||'null');}).join('\n')));
});
