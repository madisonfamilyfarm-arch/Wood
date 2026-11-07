const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(3000);await A.evaluate(()=>{CFG.tod=14;startGame('free');applyTOD();});await A.waitForTimeout(3000);
  await A.evaluate(()=>{__wds.setCam('CHASE');});await A.waitForTimeout(5000);await A.screenshot({path:'look_pad.png'});
  await A.evaluate(()=>{__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.setCam('PILOT');});await A.waitForTimeout(6000);await A.screenshot({path:'look_runway.png'});
  await A.evaluate(()=>{takeoff();takeoff();__wds.step({},9);__wds.setCam('CHASE');});await A.waitForTimeout(6000);await A.screenshot({path:'look_air.png'});
  console.log(await A.evaluate(()=>JSON.stringify({far:scene.fog.far,camfar:cam.far,draws:renderer.info.render.calls,tris:renderer.info.render.triangles,env:!!scene.environment})));
});
