const H0=require('./harness');
H0(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,1500));NLU.sync=true;const o=[];const n0=swNorm;swNorm=function(t){const r=n0(t);o.push('['+t+'] -> ['+r+']');return r;};chatSend("don't blow up the trees");await new Promise(r=>setTimeout(r,500));return o.join('\n');}));});
