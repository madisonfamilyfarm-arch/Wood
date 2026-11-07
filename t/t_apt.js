const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(3000);await A.evaluate(()=>{CFG.tod=15;startGame('free');applyTOD();__wds.useSpec(__wds.VPRESETS.plane.trainer);});await A.waitForTimeout(2000);
  console.log(await A.evaluate(()=>JSON.stringify({fld:__wds.FLD,built:__wds.FU.built,pos:D.pos.toArray().map(v=>+v.toFixed(1)),st:__wds.FU.station&&__wds.FU.station.toArray().map(v=>+v.toFixed(1))})));
  const cams=[['pilot',()=>{__wds.setCam('PILOT');}],
   ['hangar',()=>{const S=__wds.FU.station;window.updateCam=function(){cam.position.set(-110+30,8,-68+22);cam.lookAt(-96,2,-87);};}],
   ['over',()=>{window.updateCam=function(){cam.position.set(-110-75,45,-68+70);cam.lookAt(-110,0,-68);};}],
   ['low',()=>{window.updateCam=function(){cam.position.set(-110-20,1.7,-68+11);cam.lookAt(-110+30,1,-68-5);};}]];
  for(const [n,f] of cams){await A.evaluate(f);await A.waitForTimeout(6000);await A.screenshot({path:'apt_'+n+'.png'});}
});
