const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);
  console.log('ces',await A.evaluate(()=>JSON.stringify({on:CES.on,ready:CES.ready,h0:CES.h0})));
  await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  await A.evaluate(()=>{takeoff();__wds.step({ly:0.8},4);__wds.setCam('CHASE');});
  await A.waitForTimeout(6000);
  console.log('alt',await A.evaluate(()=>(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)),'state',await A.evaluate(()=>D.state));
  await A.screenshot({path:'real1.png'});
  await A.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.setCam('PILOT');takeoff();takeoff();__wds.step({},6);});
  await A.waitForTimeout(6000);await A.screenshot({path:'real2.png'});
  console.log('plane alt',await A.evaluate(()=>(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)),D=await A.evaluate(()=>D.state));
});
