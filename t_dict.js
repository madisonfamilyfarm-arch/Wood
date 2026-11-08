const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,2000));const o=[];
const s0=sbSay;sbSay=function(w,t){o.push('   → '+t);return s0.apply(this,arguments);};const n=AIB.L[1].name.replace('🤖 ','');
const tg=()=>AIB.L.map(B=>(B.hBias||0).toFixed(1)+'/'+(B.goal&&B.goal.kind)+'/'+(B.hunt||'')+'/'+(B.spdK||1).toFixed(1)).join(' ');
for(const q of ['what does enormous mean','define obliterate','another word for fast','opposite of happy','is flabbergasted a word','how do you spell rhinoceros','how many words do you know','what is a quadcopter','what does skedaddle mean',
 'everyone ascend','please decelerate','obliterate '+n,'commence pirouetting','skedaddle home','what does asdfqwer mean','what is tnt']){o.push(q+'  ['+tg()+']');smartHear(q);await new Promise(r=>setTimeout(r,1500));o.push('  after ['+tg()+']');}
return o.join('\n');}));});
