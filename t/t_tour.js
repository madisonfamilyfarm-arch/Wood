const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(3000);await A.evaluate(()=>{window.__origCam=updateCam;CFG.tod=15.5;startGame('free');applyTOD();__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.aptPick('old');});await A.waitForTimeout(3000);
  const shot=async(n,f,w)=>{await A.evaluate(f);await A.waitForTimeout(w||7000);await A.screenshot({path:'tour_'+n+'.png'});};
  // 1. standing at the pilot station, plane on the runway
  await shot('1_pilot',()=>{__wds.setCam('PILOT');});
  // 2. hangar close up
  await shot('2_hangar',()=>{window.updateCam=function(){cam.position.set(-110+30,4,-68+6);cam.lookAt(-96,3,-88);};});
  // 3. take-off roll from behind (chase)
  await shot('3_takeoff',()=>{window.updateCam=window.__origCam;takeoff();takeoff();__wds.step({},2.2);__wds.setCam('CHASE');},6000);
  // 4. in the air over the field, smoke on
  await shot('4_air',()=>{__wds.step({},6);__wds.smokeToggle();for(let i=0;i<40;i++){__wds.step({rx:-0.35},0.1);tickSmoke(0.1);}},6000);
  // 5. the RC club field from above
  await shot('5_club',()=>{__wds.aptPick('club');window.updateCam=function(){cam.position.set(-110-60,50,-68+75);cam.lookAt(-110,0,-50);};},9000);
  // 6. back to the old airport, evening light
  await shot('6_evening',()=>{__wds.aptPick('old');CFG.tod=17.4;applyTOD();window.updateCam=function(){cam.position.set(-150,1.7,-52);cam.lookAt(-90,2,-80);};},9000);
});
