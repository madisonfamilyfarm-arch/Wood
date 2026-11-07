const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);await A.evaluate(()=>{CFG.tod=14;startGame('free');});await A.waitForTimeout(3000);
  console.log(await A.evaluate(()=>{cesErr(new Error('test 1'));return CES.on+' '+CES.errs;}));
  await A.waitForTimeout(2000);
  console.log(await A.evaluate(()=>{cesErr(new Error('test 2'));return CES.on+' '+CES.errs;}));
  await A.waitForTimeout(2000);
  console.log(await A.evaluate(()=>{cesErr({});return CES.on+' failed '+CES.failed+' chunks '+chunks.size;}));
  await A.evaluate(()=>{__wds.setCam('CHASE');takeoff();__wds.step({ly:0.6},3);});await A.waitForTimeout(4000);
  console.log(await A.evaluate(()=>D.state+' alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)+' chunks '+chunks.size));
  await A.screenshot({path:'cesfail.png'});
});
