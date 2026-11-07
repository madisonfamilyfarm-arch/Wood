const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  await ev(()=>{useSpec(sanitize(VPRESETS.boat.sub));});await A.waitForTimeout(1200);
  await ev(()=>{seaEnter();});await A.waitForTimeout(2000);
  console.log(await ev(()=>'sea '+D.sea+' crabs '+ISL.crabs.length));
  console.log('K far:',await ev(()=>{walkToggle();return WALK.on;}));
  // drive to the dock
  console.log('K dock:',await ev(()=>{D.pos.set(ISL.x-34,SEA.y,ISL.z-2.5);D.depth=0;walkToggle();return WALK.on+' pos '+WALK.pos.x.toFixed(1)+','+WALK.pos.y.toFixed(1)+','+WALK.pos.z.toFixed(1);}));
  // walk to the X and dig
  console.log('dig:',await ev(()=>{WALK.pos.set(ISL.tx,seaH(ISL.tx,ISL.tz),ISL.tz+1);for(let i=0;i<10;i++)tickWalk(1/60);const shown=$('digB').style.display;$('digB').click();for(let i=0;i<60*3.3;i++)tickWalk(1/60);return shown+' dug '+ISL.dug+' coins '+ECO.coins;}));
  await ev(()=>{WALK.pos.set(ISL.x-10,seaH(ISL.x-10,ISL.z+8),ISL.z+8);WALK.yaw=-0.6;WALK.pitch=-0.15;});await A.waitForTimeout(2000);await A.screenshot({path:'island.png'});
  console.log('back in:',await ev(()=>{walkToggle();const a=WALK.on;WALK.pos.copy(WALK.sub);walkToggle();return a+' -> '+WALK.on;}));
});
