const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(4);await new Promise(r=>setTimeout(r,2000));const o=[];const n=AIB.L[0].name.replace('🤖 ','');NLU.sync=true;
const s0=sbSay;sbSay=function(w,t){o.push('  say: '+t);return s0.apply(this,arguments);};
for(const q of ['hey '+n,'hi '+n,'hello '+n]){o.push(q+' parse='+JSON.stringify(nParse(q)).slice(0,150)+' split='+JSON.stringify(nSplit(q)).slice(0,150));try{chatSend(q);}catch(e){o.push('ERR '+e.message);}}return o.join('\n');}));});
