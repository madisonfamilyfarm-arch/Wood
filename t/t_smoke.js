const H=require('./harness');
H(async({mk})=>{
  const a=await mk('A'),b=await mk('B');
  for(const p of [a,b]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
  await a.waitForTimeout(6000);
  console.log(await a.evaluate(()=>JSON.stringify({peers:Object.keys(__wds.mp.peers).length,open:mpOpen()})));
  // A becomes a plane, B should see a plane
  await a.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.trainer);});
  await a.waitForTimeout(5000);
  console.log('B sees A as:',await b.evaluate(()=>{const pe=Object.values(__wds.mp.peers)[0];return pe&&pe.spec?pe.spec.kind+' '+pe.spec.name:'none';}));
  // weather change on B relays to A
  await b.evaluate(()=>WX.setMode('rain'));await a.waitForTimeout(3000);
  console.log('A weather:',await a.evaluate(()=>WX.W.mode));
  await a.screenshot({path:'smoke_a.png'});
});
