const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  await ev(()=>{trainGoto();const g=TRAIN.cars[1].position;WALK.pos.set(g.x+2,H(g.x,g.z),g.z);trainToggle();});await A.waitForTimeout(500);
  console.log('ride shoot',await ev(async()=>{shotMode='gun';wCur=weaponTypes().indexOf('rocket');fire.last=0;fire();await new Promise(r=>setTimeout(r,1500));const L=TRAIN.cars[0].position;explode(L.clone().add(new V3(2,1,0)),6,3,true,CFG.name,mp.id);return 'train gone '+GONE.train+' brk '+TRAIN.brk.length+' riding '+TRAIN.ride;}));
  console.log('derail',await ev(async()=>{TRAIN.hold=1;TRAIN.v=8;const i=Math.round(TRAIN.u*TRAIN_PTS.length);const q=TRAIN_PTS[(i+6)%TRAIN_PTS.length];explode(new V3(q.x,H(q.x,q.z)+0.5,q.z),4,2,false,'Gizmo','bot1');await new Promise(r=>setTimeout(r,6000));return 'brk '+TRAIN.brk.length+' derailed '+!!TRAIN.derailed+' gone '+GONE.train+' btn '+$('trRe').style.display;}));
  console.log('rerail',await ev(()=>{trainRerail();return 'derailed '+!!TRAIN.derailed;}));
  console.log('pb',await ev(()=>{pbTrack();return 'brk '+TRAIN.brk.length+' items '+putBackItems().length;}));
});
