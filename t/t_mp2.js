const H=require('./harness');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html'),B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
  for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
  await A.evaluate(()=>{CFG.name='Madison';});await B.evaluate(()=>{CFG.name='Sister';});
  await A.waitForTimeout(6000);
  const st=p=>p.evaluate(()=>JSON.stringify({peers:Object.values(__wds.mp.peers).map(pe=>pe.name+':'+(pe.spec&&(pe.spec.kind||'drone'))),open:mpOpen(),links:window._relayInfo&&window._relayInfo.links}));
  console.log('A',await st(A));console.log('B',await st(B));
  // 1) both take off; put B right in front of A, A flies into B -> both crash
  for(const p of [A,B])await p.evaluate(()=>{takeoff();});
  await A.waitForTimeout(3000);
  await B.evaluate(()=>{D.pos.set(0,6,-4);D.vel.set(0,0,0);D.state='flying';D.armed=true;});
  await A.evaluate(()=>{D.pos.set(0,6,-2);D.state='flying';D.armed=true;});
  await A.waitForTimeout(2500);
  await A.evaluate(()=>{D.pos.set(0,6,-3.7);D.vel.set(0,0,-6);});
  await A.waitForTimeout(3000);
  console.log('after ram A:',await A.evaluate(()=>D.state),' B:',await B.evaluate(()=>D.state));
  // 2) chat
  await A.evaluate(()=>chatSend('hi sis'));await B.waitForTimeout(1000);
  console.log('B chat:',await B.evaluate(()=>CHAT.map(c=>c.who+': '+c.txt).join(' | ')));
  // 3) world: real-world off on B -> A
  await B.evaluate(()=>{CFG.real=false;saveCfg();realChanged();});await A.waitForTimeout(1500);
  console.log('A real:',await A.evaluate(()=>CFG.real));
  // 4) place an object on A -> B gets it
  await A.evaluate(()=>{quickFix(false);placeObj('hoop');});await B.waitForTimeout(1200);
  console.log('B objs:',await B.evaluate(()=>OBJS.map(o=>o.type+'@'+o.x.toFixed(1)).join(',')));
  // 5) rockets: A mounts a rocket launcher, fires at the ground near trees -> boom + crater on B
  await A.evaluate(()=>{wSlot('belly',3);});await A.waitForTimeout(500);
  console.log('A guns:',await A.evaluate(()=>DR.guns.map(g=>g.w+'/'+g.slot).join(',')),' B sees guns:',await B.evaluate(()=>{const pe=Object.values(__wds.mp.peers)[0];return pe.mesh.guns.map(g=>g.w).join(',');}));
  await A.evaluate(()=>{resetDrone();D.pos.set(30,15,30);D.state='flying';D.armed=true;D.yaw=0;shotMode='gun';WPN.destroy=10;WPN.blast=6;D.gimbal=-1.2;});
  await A.evaluate(()=>{__wds.setCam('FOLLOW');fire();});
  await A.waitForTimeout(3500);
  console.log('craters A:',await A.evaluate(()=>CRATERS.length),' B:',await B.evaluate(()=>CRATERS.length));
  // 6) paint: A switches to paint gun... B sits in front of A; A fires paint toward B
  await A.evaluate(()=>{wSlot('belly',-3);wSlot('nose',1);});
  await B.evaluate(()=>{quickFix(false);D.pos.set(30,14.3,12);D.state='flying';D.armed=true;D.vel.set(0,0,0);});
  await A.evaluate(()=>{quickFix(false);D.pos.set(30,15,30);D.state='flying';D.armed=true;D.yaw=0;D.gimbal=0;shotMode='gun';wCur=0;});
  await A.waitForTimeout(1500);
  for(let i=0;i<6;i++){await A.evaluate(()=>{fire.last=0;fire();});await A.waitForTimeout(200);}
  await A.waitForTimeout(1500);
  console.log('B paint on itself:',await B.evaluate(()=>(DR.splats||[]).length),' A sees paint on B:',await A.evaluate(()=>{const pe=Object.values(__wds.mp.peers)[0];return (pe.mesh.splats||[]).length;}));
  await B.evaluate(()=>__wds.setCam('CHASE'));await B.waitForTimeout(800);
  await A.screenshot({path:'mp2_a.png'});await B.screenshot({path:'mp2_b.png'});
});
