const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);
  await ev(()=>{walkToggle(true);WALK.pos.set(5,H(5,5),5);WALK.yaw=0;});await A.waitForTimeout(500);
  await ev(()=>{keys.KeyW=true;window.__p=WALK.pos.clone();window.__t=performance.now();});await A.waitForTimeout(2000);
  console.log(await ev(()=>{keys.KeyW=false;const d=WALK.pos.distanceTo(__p);return 'moved '+d.toFixed(1)+' in '+((performance.now()-__t)/1000).toFixed(1)+'s menu '+menu.open+' BM '+BM.on+' ride '+TRAIN.ride+' dzdead '+DZ.dead+' pause '+SIM.pause;}));
});
