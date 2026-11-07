const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  for(const [k,ang] of [['trainer',0.7],['sport',2.4],['wing',0.9],['bi',-0.8]]){
    await A.evaluate(([k,ang])=>{__wds.useSpec(__wds.VPRESETS.plane[k]);__wds.setCam('CHASE');__wds.csApply(__wds.DR,[0.9,0.8,0.8,1]);
      window.updateCam=function(){const p=__wds.DR.g.getWorldPosition(new THREE.Vector3());const r=1.9;cam.position.set(p.x+Math.sin(ang)*r,p.y+r*0.45,p.z+Math.cos(ang)*r);cam.lookAt(p.x,p.y+0.05,p.z);};},[k,ang]);
    await A.waitForTimeout(2200);await A.screenshot({path:'close_'+k+'.png'});
  }
});
