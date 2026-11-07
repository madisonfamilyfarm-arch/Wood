const H=require('./harness');
H(async({mk})=>{
  const a=await mk('A'),b=await mk('B');
  for(const p of [a,b]){await p.waitForTimeout(3000);await p.evaluate(()=>startGame('free'));}
  await a.waitForTimeout(8000);
  console.log('A peers',await a.evaluate(()=>Object.keys(__wds.mp.peers).length),'B peers',await b.evaluate(()=>Object.keys(__wds.mp.peers).length));
  await a.screenshot({path:'base_a.png'});
});
