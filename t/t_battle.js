const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html'),B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
  for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
  await A.evaluate(()=>{CFG.name='Madison';});await B.evaluate(()=>{CFG.name='Sister';});await A.waitForTimeout(5000);
  // weapon settings stay personal
  await B.evaluate(()=>{WPN.blast=42;saveWpn();});await A.waitForTimeout(1500);console.log('A blast stays',await A.evaluate(()=>WPN.blast));
  // hangar share
  await A.evaluate(()=>{const h=LS.get('hangar',[]);h.unshift(sanitize(Object.assign({},__wds.VPRESETS.plane.bi,{name:'Red Baron'})));hangarStore(h);});await B.waitForTimeout(1500);
  console.log('B hangar:',await B.evaluate(()=>LS.get('hangar',[]).map(s=>s.name).join(', ')),' B flying:',await B.evaluate(()=>SPEC.name));
  // battle
  await A.evaluate(()=>battleStart(180,'guns'));await B.waitForTimeout(1500);
  console.log('B battle on',await B.evaluate(()=>BATTLE.on),'B weapons',await B.evaluate(()=>weaponTypes().join(',')));
  for(const p of [A,B])await p.evaluate(()=>{takeoff();__wds.step({ly:0.7},2);});
  await B.evaluate(()=>{window.__hold=setInterval(()=>{if(D.state==='flying'){D.pos.set(30,15.1,12);D.vel.set(0,0,0);}},30);});
  await A.evaluate(()=>{D.pos.set(30,15,30);D.state='flying';D.armed=true;D.yaw=0;D.gimbal=0;shotMode='gun';wCur=0;__wds.setCam('FOLLOW');});
  await A.waitForTimeout(2000);
  console.log('dbg',await A.evaluate(()=>{const pe=Object.values(__wds.mp.peers)[0];const o=mountPos(new V3());return JSON.stringify({pe:pe.p.toArray().map(v=>+v.toFixed(2)),rad:pe.rad,me:D.pos.toArray().map(v=>+v.toFixed(2)),o:o.toArray().map(v=>+v.toFixed(2)),dir:aimDir(o).toArray().map(v=>+v.toFixed(2)),st:D.state,cam:camName()});}));
  for(let i=0;i<25;i++){await A.evaluate(()=>{fire.last=0;fire();});await A.waitForTimeout(150);if(await B.evaluate(()=>D.state!=='flying'))break;}
  await A.waitForTimeout(2500);
  console.log('B hits',await B.evaluate(()=>D.hits),'A shots fired',await A.evaluate(()=>shotN),'A weapon',await A.evaluate(()=>curWeapon()),'B state',await B.evaluate(()=>D.state),'scores A',await A.evaluate(()=>JSON.stringify(BATTLE.score)),'B',await B.evaluate(()=>JSON.stringify(BATTLE.score)));
  await A.screenshot({path:'battle_a.png'});
  await B.waitForTimeout(4000);console.log('B respawned',await B.evaluate(()=>D.state));
  await A.evaluate(()=>battleStop());await B.waitForTimeout(1000);console.log('B battle on',await B.evaluate(()=>BATTLE.on));
});
