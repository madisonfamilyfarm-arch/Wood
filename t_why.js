const H=require('./harness');H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
console.log(await P.evaluate(async()=>{startGame('free');aiSet(3);DZ.on=true;DZ.ai=true;await new Promise(r=>setTimeout(r,2500));const o=[];NLU.sync=true;const s0=sbSay;sbSay=function(w,t){o.push('   → '+(w.B?w.B.name:'')+': '+t);return s0.apply(this,arguments);};
 const A=AIB.L[0],Bz=AIB.L[1];HIT.ctx={p:A.p.clone(),r:30,by:pbName(Bz),id:Bz.id};dzBotDie(A,'x');HIT.ctx=null;A.dead=0;A._dead=false;
 PB.ev=0;PB.said=0;PB.ev=-1e9;pbSay(A,pbLine('hunt',A,pbName(Bz)),true);o.push('grudge '+JSON.stringify(PB.grudge)+' last '+(PBLAST.B&&PBLAST.B.name)+' '+PBLAST.k+' '+PBLAST.x);
 for(const q of ['why','who got you','how many kills do you have','are you winning']){o.push(q);smartHear(q);await new Promise(r=>setTimeout(r,800));}
 return o.join('\n');}));});
