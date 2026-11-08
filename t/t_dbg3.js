const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(2);await new Promise(r=>setTimeout(r,2000));NLU.sync=true;const o=[];
const s0=sbSay;sbSay=function(w,t){o.push('SB '+t);return s0.apply(this,arguments);};
CONV.B=AIB.L[0];CONV.ask='place';CONV.askT=performance.now();
chatSend('the sea');o.push(JSON.stringify({ask:CONV.ask}));await new Promise(r=>setTimeout(r,3000));return o.join('\n');}));});
