const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(3000);await A.evaluate(()=>{CFG.tod=15;startGame('free');applyTOD();__wds.useSpec(__wds.VPRESETS.plane.sport);});await A.waitForTimeout(2000);
  const shots=[['chase',()=>{takeoff();takeoff();__wds.step({},7);__wds.step({rx:-0.3},2);__wds.setCam('CHASE');}],
   ['high',()=>{window.updateCam=function(){cam.position.set(-260,120,-10);cam.lookAt(-110,0,-68);};}],
   ['sunset',()=>{CFG.tod=17.7;applyTOD();window.updateCam=function(){cam.position.set(-180,3,-55);cam.lookAt(-60,10,-75);};}],
   ['ground',()=>{CFG.tod=11;applyTOD();window.updateCam=function(){cam.position.set(-118,1.7,-56);cam.lookAt(-150,1.2,-70);};}]];
  for(const [n,f] of shots){await A.evaluate(f);await A.waitForTimeout(7000);await A.screenshot({path:'lk_'+n+'.png'});}
});
