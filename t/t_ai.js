const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  await ev(()=>aiSet(4));await A.waitForTimeout(8000);
  console.log('bots',await ev(()=>AIB.L.map(B=>B.name+':'+B.mode+'/'+(B.goal&&B.goal.kind)+' h'+(B.p.y-H(B.p.x,B.p.z)).toFixed(0)).join(' | ')+' peers '+Object.keys(mp.peers).length+' meshes '+Object.values(mp.peers).filter(p=>p.mesh).length));
  await ev(()=>{__wds.setCam('CHASE');const B=AIB.L[0];D.pos.set(B.p.x+4,B.p.y,B.p.z+6);});await A.waitForTimeout(1200);await A.screenshot({path:'ai.png'});
  // claude without key
  console.log('claude',await ev(async()=>{AIB.claude=true;AIB.key='';AIB.t=0;await new Promise(r=>setTimeout(r,800));return AIB.ok+' '+AIB.err;}));
  console.log('claude bad key',await ev(async()=>{AIB.key='sk-bad';AIB.ok=null;AIB.t=0;await new Promise(r=>setTimeout(r,6000));return AIB.ok+' '+AIB.err;}));
  // fires: truck + campers + bots
  console.log('fire fight',await ev(()=>{AIB.claude=false;FIRE.own=true;fireAdd({id:'c1',x:20,z:-30,r:2});FIRE.L[0].int=1;return FIRE.L.length;}));
  await A.waitForTimeout(15000);
  console.log('campers',await ev(()=>CAMPERS.L.map(C=>C.name+':'+C.state+' '+Math.round(C.x)+','+Math.round(C.z)).join(' | ')+' fires '+FIRE.L.length));
  await A.screenshot({path:'campers.png'});
  // truck
  console.log('truck',await ev(()=>{resetDrone();walkToggle(true);WALK.pos.set(TRUCK.x+3,0,TRUCK.z);for(let i=0;i<3;i++)tickWalk(1/60);const b=$('truckB').style.display+' '+$('truckB').textContent;walkToggle();const x0=TRUCK.x;keys.KeyW=true;for(let i=0;i<120;i++)tickWalk(1/60);keys.KeyW=false;FIRE.btn=true;for(let i=0;i<60;i++)fireTick(1/60);FIRE.btn=false;return b+' in '+TRUCK.in+' moved '+(Math.hypot(TRUCK.x-x0,0)).toFixed(1)+' tank '+TRUCK.tank.toFixed(1)+' drops '+FIRE.drops.length;}));
  await A.waitForTimeout(1500);await A.screenshot({path:'truck.png'});
});
