const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(4);await new Promise(r=>setTimeout(r,2000));const o=[];NLU.sync=true;const n=AIB.L.map(B=>B.name.replace('🤖 ',''));
const h0=smartHear;smartHear=function(t){o.push('  hear: '+t+' → vFix: '+vFix(t));return h0.apply(this,arguments);};
for(const q of ['good gaim','attack '+n[2]+'s',n[0]+' a tack '+n[2],'lets play tack']){o.push(q);chatSend(q);}return o.join('\n');}));});
