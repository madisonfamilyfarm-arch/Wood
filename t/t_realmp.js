const H=require('./hreal');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/real.html'),B=await mk('B','http://127.0.0.1:8775/real.html');
  await A.waitForTimeout(9000);for(const p of [A,B])await p.evaluate(()=>startGame('free'));
  await A.waitForTimeout(5000);
  console.log('peers',await A.evaluate(()=>Object.keys(__wds.mp.peers).length),await B.evaluate(()=>Object.keys(__wds.mp.peers).length));
  await A.evaluate(()=>cesGoto('38.2527, -85.7585'));await B.waitForTimeout(4000);
  console.log('B origin',await B.evaluate(()=>JSON.stringify(CES.origin)));
  await A.evaluate(()=>{takeoff();__wds.step({ly:0.8},2);D.pos.set(0,20,30);D.yaw=0;wSlot('belly',3);shotMode='gun';});
  await B.evaluate(()=>{takeoff();__wds.step({ly:0.8},2);D.pos.set(0,20,10);});
  await A.waitForTimeout(2000);
  for(let i=0;i<3;i++){await A.evaluate(()=>{fire.last=0;fire();});await A.waitForTimeout(400);}
  await A.waitForTimeout(3000);
  console.log('B state after rockets',await B.evaluate(()=>D.state));
  await A.evaluate(()=>{placeObj('gate');chatSend('hello from Louisville');});await B.waitForTimeout(1500);
  console.log('B objs',await B.evaluate(()=>OBJS.length),'chat',await B.evaluate(()=>CHAT.slice(-1)[0].txt));
  await B.evaluate(()=>__wds.setCam('CHASE'));await B.waitForTimeout(2500);await B.screenshot({path:'realmp_b.png'});
});
