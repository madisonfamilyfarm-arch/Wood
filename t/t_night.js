const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);await A.evaluate(()=>{CFG.tod=20.3;startGame('free');__wds.setCam('CHASE');});await A.waitForTimeout(6000);await A.screenshot({path:'night.png'});
  await A.evaluate(()=>{CFG.tod=13;WX.set('wind',5);__wds.setCam('CHASE');});await A.waitForTimeout(6000);await A.screenshot({path:'day.png'});
});
