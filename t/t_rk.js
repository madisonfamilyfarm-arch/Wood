const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  await A.evaluate(()=>{wSlot('belly',3);resetDrone();D.pos.set(30,15,30);D.state='flying';D.armed=true;D.yaw=0;shotMode='gun';WPN.destroy=10;WPN.blast=6;D.gimbal=-1.2;__wds.setCam('FOLLOW');fire();});
  for(let i=0;i<6;i++){await A.waitForTimeout(600);console.log(await A.evaluate(()=>JSON.stringify({sh:(typeof SHOTS!=='undefined'?SHOTS:[]).map(s=>s.p?s.p.toArray().map(v=>+v.toFixed(1)):s),cr:CRATERS.length,map:curMap?curMap():'-'})));}
});
