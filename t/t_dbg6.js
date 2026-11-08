const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(3);});await P.waitForTimeout(2000);
  console.log(await P.evaluate(()=>{const t='how do i drop tnt';const c=cleanSpeech(t).text;const out=['clean '+c,'nlu '+JSON.stringify((nParse(c,{})||{}).i),'syn '+synNorm(c),'howto '+(HOWTO.find(([r])=>r.test(' '+synNorm(c)+' '))||[])[1]];return out.join('\n');}));
});
