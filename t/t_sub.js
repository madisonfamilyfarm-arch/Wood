const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  console.log('lake center H',await ev(()=>H(LAKE.x,LAKE.z).toFixed(2)),'uw',await ev(()=>!!UW.g+' fish '+UW.fish.length+' chests '+UW.chests.length));
  await ev(()=>{useSpec(sanitize(VPRESETS.boat.sub));});await A.waitForTimeout(1500);
  await ev(()=>{__wds.step({ly:1},4);__wds.step({ry:-1},5);__wds.setCam('CHASE');});await A.waitForTimeout(2500);
  console.log(await ev(()=>'depth '+D.depth.toFixed(1)+' y '+D.pos.y.toFixed(1)+' UW.on '+UW.on));
  await A.screenshot({path:'sub_lake.png'});
  // drive to the portal
  await ev(()=>{const P=UW.portal;D.pos.set(P.x,P.y,P.z+6);D.depth=WATER_Y-D.pos.y;D.yaw=0;D.vel.set(0,0,0);});await A.waitForTimeout(1500);await A.screenshot({path:'sub_portal.png'});
  await ev(()=>{const P=UW.portal;D.pos.set(P.x,P.y,P.z);});await A.waitForTimeout(2500);
  console.log('sea',await ev(()=>D.sea+' y '+D.pos.y.toFixed(1)+' built '+SEA.built+' fish '+UW.fish.length));
  await ev(()=>{__wds.step({ly:1},3);});await A.waitForTimeout(2500);await A.screenshot({path:'sea1.png'});
  await ev(()=>{const C=UW.chests.find(c=>c.coins===50);D.pos.set(C.x+3,C.y+1.5,C.z+6);D.depth=SEA.y-D.pos.y;D.yaw=0.4;});await A.waitForTimeout(2000);await A.screenshot({path:'sea_wreck.png'});
  await ev(()=>{D.pos.set(SEA.x+40,SEA.y,SEA.z+10);D.depth=0;D.yaw=-1.6;});await A.waitForTimeout(2000);await A.screenshot({path:'sea_top.png'});
  await ev(()=>{seaExit();});await A.waitForTimeout(1500);console.log('back',await ev(()=>D.sea+' y '+D.pos.y.toFixed(1)));
});
