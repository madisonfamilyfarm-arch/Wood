const H=require('./harness');
H(async({mk})=>{console.log('start');const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');console.log('A made');const B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');console.log('B made');
 for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}console.log('started');await A.waitForTimeout(8000);
 for(const p of [A,B])console.log(await p.evaluate(()=>JSON.stringify({peers:Object.values(__wds.mp.peers).map(pe=>pe.name),open:mpOpen()})));
 await A.evaluate(()=>chatSend('hi sis'));await B.waitForTimeout(1500);console.log('B chat:',await B.evaluate(()=>CHAT.slice(-3).map(c=>c.who+': '+c.txt).join(' | ')));
 process.exit(0);});
