const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiBrainSet('builtin');aiSet(3);});await P.waitForTimeout(2500);
  console.log(await P.evaluate(()=>{const out=[];const s0=sbSay;sbSay=function(w,t){out.push((w.B?w.B.name:w.C&&w.C.name)+': '+t);};for(const t of ['Hi','My name is madison','I like raccoons','How are you']){try{out.push('> '+t+' → '+smartHear(t));}catch(e){out.push('ERR '+e.message+' '+e.stack.split('\n')[1]);}}sbSay=s0;return out.join('\n');}));
});
