const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(2000);
  await A.evaluate(()=>{__wds.useSpec(__wds.PRESETS.heavy);takeoff();__wds.step({ly:0.5},1.6);__wds.setCam('ORBIT');});
  await A.waitForTimeout(5000);await A.screenshot({path:'real3.png'});
  await A.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.sport);__wds.setCam('CHASE');takeoff();takeoff();__wds.step({},5);});
  await A.waitForTimeout(5000);await A.screenshot({path:'real4.png'});
});
