const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,1500));return (process_list=>process_list.map(t=>{const p=WU.parse(t);const m=WU.match(t);return t+' => ['+p.txt+'] '+[...p.C].join(',')+' who='+p.who+' => '+(m?m.say+' '+m.score.toFixed(2):'none');}).join('\n'))(["fly hier","watcha doin"]);}));});
