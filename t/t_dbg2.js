const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);});await P.waitForTimeout(2500);
  await P.evaluate(()=>{window._log=[];const a0=sbSay;sbSay=function(w,t,d){_log.push('sbSay '+(w.B&&w.B.name)+' '+t+' d'+d);return a0.apply(this,arguments);};const q0=aiSayAs;aiSayAs=function(n,t){_log.push('say '+n+' '+t);return q0.apply(this,arguments);};chatSend('Hi');});
  await P.waitForTimeout(9000);console.log(await P.evaluate(()=>_log.join('\n')+'\nQ='+SAYQ.length+' CHAT: '+CHAT.map(c=>c.who+':'+c.txt).join(' / ')));
});
