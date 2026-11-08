const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);await new Promise(r=>setTimeout(r,2000));const o=[];
const s0=sbSay;sbSay=function(w,t){o.push('   → '+t);return s0.apply(this,arguments);};const h0=smartHear;
for(const q of ['skedaddle home','skedaddle home','commence pirouetting','go home']){o.push(q);const r=smartHear(q);o.push(' ret '+r+' map='+aiwMap('skedaddle')+' verb='+aiwVerb('skedaddle',' skedaddle home ')+' st='+AIW.st.s);await new Promise(r=>setTimeout(r,1500));}
return o.join('\n');}));});
