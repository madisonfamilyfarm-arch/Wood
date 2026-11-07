const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');const B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
  await A.waitForTimeout(4000);await A.evaluate(()=>startGame('free'));await B.evaluate(()=>startGame('free'));await A.waitForTimeout(6000);
  console.log('peers',await A.evaluate(()=>Object.keys(__wds.mp.peers).length),await B.evaluate(()=>Object.keys(__wds.mp.peers).length));
  await A.evaluate(()=>{const it=mapItems().find(i=>i.label().includes('Classic'));it.act();});
  await A.waitForTimeout(25000);
  const ga=async(P)=>{try{return await P.evaluate(()=>curMap()+' started='+started+' look='+LOOK.on);}catch(e){return 'ERR '+e.message.slice(0,60);}};
  console.log('A',await ga(A),'| B',await ga(B));
});
