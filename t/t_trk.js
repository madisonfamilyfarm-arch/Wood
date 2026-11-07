const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  // car on a placed jump
  await ev(()=>{useSpec(sanitize(Object.values(VPRESETS.car)[0]));});await A.waitForTimeout(1500);
  const r=await ev(()=>{RAMPSET.steep=1.6;RAMPSET.pow=3;D.yaw=0;placeObj('ramp');const o=OBJS[OBJS.length-1];const R=RAMPS[RAMPS.length-1];
    // drive at it
    D.pos.set(o.x-R.fx*25,0,o.z-R.fz*25);D.yaw=Math.atan2(-R.fx,-R.fz);D.pos.y=groundY(D.pos.x,D.pos.z);D.vel.set(0,0,0);D.state='landed';let maxY=-99,air=0;
    for(let i=0;i<60*7;i++){tickDrone(1/60,{lx:0,ly:1,rx:0,ry:0});const h=D.pos.y-H(D.pos.x,D.pos.z);if(h>maxY)maxY=h;if(D.air)air+=1/60;}
    return 'max height '+maxY.toFixed(1)+' m, air '+air.toFixed(1)+' s, state '+D.state+' coins '+ECO.coins;});
  console.log('jump',r);
  // course editor: types, copy built-in, delete
  console.log(await ev(()=>{medOpen();MED.g=[{x:0,z:-30,y:3,t:'hoop',s:1.5},{x:10,z:-50,y:3,t:'tunnel',s:1.5},{x:25,z:-60,y:3,t:'neon',s:5},{x:40,z:-60,y:0,t:'jump',s:5}];MED.name='Test';const k=medStore();medClose();
    const n=myCourseItems().map(i=>i.label());return k+' cps '+courses[k].cps.length+' grp '+courses[k].grp.children.length+' ramps '+RAMPS.filter(r=>String(r.obj).indexOf('mc:')===0).length+' | '+n.join(' / ');}));
  console.log('vis',await ev(()=>{const C=Object.values(courses).find(c=>c.custom);setCourseVisible();const a=C.grp.visible;startCourse(C.key);const b=C.grp.visible;startCourse('free');return a+' racing:'+b;}));
  console.log('copy',await ev(()=>{trkCopy('hoops');const o=MED.g.length+' pieces '+MED.name;medClose();return o;}));
  console.log('delete',await ev(()=>{const it=myCourseItems().find(i=>/Delete "Test"/.test(i.label()));it.act();it.act();return LS.get('mycourses',[]).length+' courses left, ramps '+RAMPS.filter(r=>String(r.obj).indexOf('mc:')===0).length;}));
  console.log('place menu',await ev(()=>placeItems().map(i=>i.label()).filter(l=>/Jump|hoops|track/.test(l)).join(' | ')));
  await ev(()=>{medOpen();MED.g=[{x:-20,z:-30,y:3,t:'hoop',s:1.5},{x:-20,z:-45,y:3,t:'tunnel',s:1.5},{x:-20,z:-60,y:3,t:'neon',s:5},{x:-20,z:-80,y:0,t:'jump',s:5},{x:-20,z:-95,y:0,t:'gate',s:5}];MED.name='Look';const k=medStore();medClose();CFG.cvis='all';trkVis();D.pos.set(-12,0,-20);D.yaw=2.6;D.pos.y=groundY(D.pos.x,D.pos.z);__wds.setCam('CHASE');});
  await A.waitForTimeout(2000);await A.screenshot({path:'trk.png'});
});
