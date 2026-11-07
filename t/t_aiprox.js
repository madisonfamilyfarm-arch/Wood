const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8790/');await A.waitForTimeout(4000);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await ev(async()=>{AIB.url=aiUrlFix('127.0.0.1:11435');try{const L=await aiListModels();aiBrainSet('local');aiSet(3);return 'models '+L.map(m=>m.n).join(',')+' via '+AIB.via;}catch(e){return 'ERR '+e.message;}}));
  await A.waitForTimeout(8000);console.log(await ev(()=>'ok '+AIB.ok+' err '+AIB.err+' kinds '+AIB.L.map(b=>b.kind).join(',')));
});
