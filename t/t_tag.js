const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);await ev(()=>{aiSet(4);__wds.setCam('CHASE');DZ.ai=false;});await A.waitForTimeout(4000);
  await ev(()=>{const B=AIB.L.find(b=>!b.dead);__wds.setCam('FPV');D.pos.set(B.p.x+30,B.p.y+4,B.p.z+30);D.yaw=Math.atan2(30,30);});await A.waitForTimeout(800);await A.screenshot({path:'tags.png'});console.log(await ev(()=>Object.values(mp.peers).filter(p=>p.tag).map(p=>p.tag.scale.x.toFixed(1)).join(',')));});
