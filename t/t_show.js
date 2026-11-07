const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);await A.evaluate(()=>{CFG.tod=15;startGame('free');});await A.waitForTimeout(3000);
  await A.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.RADIO.smokeCol='#ff3b30';takeoff();takeoff();__wds.step({},6);__wds.smokeToggle();window.__st=[];});
  // fly a gentle turn back over the field, ticking smoke as we go
  await A.evaluate(()=>{for(let i=0;i<70;i++){__wds.step({rx:-0.4,ry:0.1},0.1);tickSmoke(0.1);}return 0;});console.log(await A.evaluate(()=>D.state+' '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)));
  await A.evaluate(()=>{__wds.setCam('CHASE');__wds.csApply(__wds.DR,[-0.5,0.3,0,0]);});await A.waitForTimeout(5000);await A.screenshot({path:'show_smoke.png'});
  await A.evaluate(()=>{__wds.setCam('PILOT');});await A.waitForTimeout(4000);await A.screenshot({path:'show_pilot.png'});
  await A.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.lesStart('pland');});await A.waitForTimeout(4000);await A.screenshot({path:'show_lesson.png'});
});
