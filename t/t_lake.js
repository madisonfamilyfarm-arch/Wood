const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{const o=[];for(const e of [0,0.3,0.6,0.9,1.0,1.1])o.push(e+':'+H(LAKE.x+LAKE.rx*e,LAKE.z).toFixed(2));return o.join(' ')+' PONDC '+JSON.stringify(PONDC)+' H '+H(PONDC.x,PONDC.z).toFixed(2)+' fog '+(scene.fog&&scene.fog.constructor.name)+' '+JSON.stringify(scene.fog&&{n:scene.fog.near,f:scene.fog.far,d:scene.fog.density});}));
  await A.evaluate(()=>{useSpec(sanitize(VPRESETS.boat.sub));});await A.waitForTimeout(1500);
  await A.evaluate(()=>{__wds.step({ly:1},4);__wds.step({ry:-1},3);__wds.setCam('FPV');});await A.waitForTimeout(1500);await A.screenshot({path:'sub1.png'});
  console.log(await A.evaluate(()=>vkind()+' '+SPEC.style+' depth '+D.depth+' y '+D.pos.y.toFixed(2)+' cam '+cam.position.y.toFixed(2)));
  await A.evaluate(()=>{__wds.setCam('CHASE');});await A.waitForTimeout(1000);await A.screenshot({path:'sub2.png'});
});
