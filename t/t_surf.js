const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  // drone lands on the tower deck
  console.log('drone deck',await ev(()=>{D.pos.set(FT.x+2.9,FT.top+3,FT.z-2.9);D.state='flying';D.armed=true;D.vel.set(0,0,0);__wds.step({ly:-0.6},5);return D.state+' y '+D.pos.y.toFixed(2)+' top '+FT.top.toFixed(2);}));
  await ev(()=>{__wds.setCam('CHASE');});await A.waitForTimeout(1500);await A.screenshot({path:'deck.png'});
  // walk + climb
  console.log('climb',await ev(()=>{resetDrone();walkToggle(true);WALK.pos.set(FT.ladder.x,H(FT.ladder.x,FT.ladder.z+1.5),FT.ladder.z+1.5);WALK.yaw=0;keys.KeyW=true;for(let i=0;i<60*14;i++)tickWalk(1/60);keys.KeyW=false;return 'walk y '+WALK.pos.y.toFixed(1)+' top '+FT.top.toFixed(1)+' z '+WALK.pos.z.toFixed(1);}));
  await A.waitForTimeout(1200);await A.screenshot({path:'climb.png'});
  await ev(()=>walkToggle(false));
  // crawler climbs the cabin
  console.log('crawler',await ev(()=>{useSpec(sanitize(VPRESETS.car.crawler));const tgt={x:-14,z:12};D.pos.set(tgt.x,0,tgt.z+9);D.pos.y=groundY(D.pos.x,D.pos.z);D.yaw=0;D.state='landed';D.armed=true;let maxY=-9;for(let i=0;i<60*8;i++){tickDrone(1/60,{lx:0,ly:0.8,rx:0,ry:0});maxY=Math.max(maxY,D.pos.y-H(D.pos.x,D.pos.z));}return 'crawl '+ST.crawl+' max above ground '+maxY.toFixed(1)+' now '+D.pos.x.toFixed(1)+','+D.pos.z.toFixed(1)+' '+D.state;}));
  await ev(()=>__wds.setCam('CHASE'));await A.waitForTimeout(1200);await A.screenshot({path:'crawl.png'});
});
