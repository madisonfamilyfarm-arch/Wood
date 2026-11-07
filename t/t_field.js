const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html');
  await A.waitForTimeout(8000);await A.evaluate(()=>{CFG.tod=14;startGame('free');});await A.waitForTimeout(4000);
  console.log(await A.evaluate(()=>JSON.stringify({fld:!!FU.g,h:FU.h,pos:D.pos.toArray().map(v=>+v.toFixed(1)),pilot:WALK.pilotAt&&WALK.pilotAt.toArray().map(v=>+v.toFixed(1)),cols:FU.cols.length})));
  await A.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.setCam('PILOT');});await A.waitForTimeout(5000);await A.screenshot({path:'field_pilot.png'});
  // overview: walk camera high
  await A.evaluate(()=>{walkToggle(true);WALK.pos.set(-70,0,-40);WALK.pos.y=H(-70,-40);WALK.yaw=Math.atan2(70,40)+Math.PI;WALK.pitch=-0.25;});await A.evaluate(()=>{const f=()=>{WALK.pos.y=40;};window.__hold=setInterval(f,10);});
  await A.waitForTimeout(5000);await A.screenshot({path:'field_over.png'});
  await A.evaluate(()=>{clearInterval(window.__hold);WALK.pos.set(-5,0,30);WALK.pos.y=H(-5,30);WALK.yaw=Math.PI*0.95;WALK.pitch=-0.05;});await A.waitForTimeout(5000);await A.screenshot({path:'field_pits.png'});
  await A.evaluate(()=>{walkToggle(false);__wds.setCam('CHASE');takeoff();takeoff();__wds.step({},6);});await A.waitForTimeout(5000);await A.screenshot({path:'field_takeoff.png'});
  console.log('plane after takeoff',await A.evaluate(()=>D.state+' alt '+(D.pos.y-H(D.pos.x,D.pos.z)).toFixed(1)));
});
