const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');});await P.waitForTimeout(1500);
  console.log(await P.evaluate(()=>mainItems().map((x,i)=>i+': '+String(x.label()).replace(/<[^>]+>/g,'')+(x.info?' [info]':'')+(x.range?' [range]':'')).join('\n')));
});
