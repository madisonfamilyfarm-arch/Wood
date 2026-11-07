const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  await A.evaluate(()=>{fireStart(D.pos.x+20,D.pos.z-25,true);FIRE.L.forEach(F=>F.int=1);__wds.setCam('CHASE');});await A.waitForTimeout(5000);await A.screenshot({path:'fire3.png'});
});
