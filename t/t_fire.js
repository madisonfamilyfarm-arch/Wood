const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  await ev(()=>{takeoff();});await A.waitForTimeout(3000);
  console.log(await ev(()=>{const it=fireItems();it[1].act();FIRE.tank=1;fireStart(D.pos.x,D.pos.z-15,false);return 'fires '+FIRE.L.length+' on '+FIRE.on+' menu '+mainItems().map(i=>i.label()).filter(l=>/Fires/.test(l)).join('');}));
  await A.waitForTimeout(4000);
  await ev(()=>{const F=FIRE.L[0];D.pos.set(F.x,F.gy+8,F.z+1);D.vel.set(0,0,0);__wds.setCam('CHASE');});await A.waitForTimeout(1500);await A.screenshot({path:'fire1.png'});
  await ev(()=>{FIRE.btn=true;});for(let k=0;k<7;k++){await A.waitForTimeout(500);console.log(await ev(()=>D.state+' tank '+FIRE.tank.toFixed(2)+' drops '+FIRE.drops.length+' held '+FIRE.held+' y '+D.pos.y.toFixed(1)));}await ev(()=>{FIRE.btn=false;});await A.waitForTimeout(2000);
  console.log(await ev(()=>'after drop: fires '+FIRE.L.length+' int '+(FIRE.L[0]?FIRE.L[0].int.toFixed(2):'-')+' tank '+FIRE.tank.toFixed(2)+' coins '+ECO.coins+' chip '+$('cFire').textContent));
  await A.screenshot({path:'fire2.png'});
  // scoop at the lake
  console.log(await ev(()=>{FIRE.tank=0;D.pos.set(LAKE.x,WATER_Y+1,LAKE.z);D.state='flying';for(let i=0;i<120;i++)fireTick(1/60);return 'tank after 2s scoop '+FIRE.tank.toFixed(2);}));
  console.log(await ev(()=>{fireItems()[3].act();return 'big fire '+FIRE.L.length;}));
});
