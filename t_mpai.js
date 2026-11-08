const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');const B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
 for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
 await A.evaluate(()=>{CFG.name='Madison';aiSet(3);window.__bs=0;const m0=mpSend;mpSend=function(m){if(m&&m.t==='botchat')__bs++;return m0.apply(this,arguments);};});await B.evaluate(()=>{window.__br=[];const r0=mpRecv;mpRecv=function(m){if(m&&m.t==='botchat')__br.push(m);return r0.apply(this,arguments);};});await B.evaluate(()=>{CFG.name='Sister';});await A.waitForTimeout(9000);
 const st=p=>p.evaluate(()=>JSON.stringify({bots:AIB.L.map(b=>b.name),peers:Object.values(__wds.mp.peers).map(pe=>pe.name)}));
 console.log('A',await st(A));console.log('B',await st(B));
 const n0=c=>c.length;const chatB0=await B.evaluate(()=>CHAT.length),chatA0=await A.evaluate(()=>CHAT.length);
 await B.evaluate(()=>chatSend('hey Ace whats your favorite color'));await A.waitForTimeout(4000);
 await A.evaluate(()=>chatSend('Ace follow me'));await A.waitForTimeout(4000);
 await B.evaluate(()=>chatSend('Ace which team are you on'));await A.waitForTimeout(4000);
 console.log('sent',await A.evaluate(()=>__bs),'recv',await B.evaluate(()=>JSON.stringify(__br).slice(0,300)),'hasH',await B.evaluate(()=>typeof MPH.botchat));console.log('--A chat:\n'+await A.evaluate(n=>CHAT.slice(n).map(c=>c.who+': '+c.txt).join('\n'),chatA0));
 console.log('--B chat:\n'+await B.evaluate(n=>CHAT.slice(n).map(c=>c.who+': '+c.txt).join('\n'),chatB0));
});
