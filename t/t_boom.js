const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await ev(()=>{walkToggle(true);WALK.pos.set(40,H(40,5),5);WALK.yaw=-Math.PI/2;['house','wall','tower','hoop'].forEach((t,i)=>{WALK.pos.z=5+i*3;placeObj(t);});return 'objs '+OBJS.length;}));
  await A.waitForTimeout(500);
  console.log(await ev(()=>{const o=OBJS[0];explode(new V3(o.x,H(o.x,o.z)+1,o.z+4),6,4,false,'Gizmo','bot1');return 'after boom objs '+OBJS.length+' boomed '+BOOMED.length+' craters '+CRATERS.length;}));
  await A.waitForTimeout(800);
  console.log(await ev(()=>{putBack();return 'put back objs '+OBJS.length+' boomed '+BOOMED.length+' craters '+CRATERS.length;}));
});
