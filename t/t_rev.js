const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(1500);await ev(()=>{aiSet(2);takeoff();});await A.waitForTimeout(3000);
  console.log(await ev(()=>{revSet(true);const B=AIB.L[0];D.shield=performance.now()+5000;dzBotFire(B,D.pos.clone());return 'rev '+ASSIST.revId+' em '+asEM()+' btn '+$('revBtn').textContent;}));
  await A.waitForTimeout(2500);console.log(await ev(()=>'dist '+(mp.peers[ASSIST.lock]?mp.peers[ASSIST.lock].p.distanceTo(D.pos).toFixed(0):'-')+' state '+D.state+' mode '+shotMode+' w '+curWeapon()+' lock '+ASSIST.lock+' shots '+shots.length+' menu '+mainItems().some(i=>{try{return /Revenge mode/.test(i.label())}catch(e){return false}})));
});
