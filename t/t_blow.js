const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);const ev=(f,x)=>A.evaluate(f,x);
  await ev(()=>startGame('free'));await A.waitForTimeout(3000);
  console.log('targets',await ev(()=>blowables().map(t=>t.k).join(',')));
  console.log(await ev(()=>{const T=blowables();const tr=T.find(t=>t.k==='train'),bd=T.find(t=>t.k==='bird'),bl=T.find(t=>t.k==='balloon');
    [tr,bd,bl].forEach(t=>{if(t)explode(t.p.clone().add(new V3(2,0,0)),6,3,true,CFG.name,mp.id);});return 'gone train '+GONE.train+' birds '+GONE.birds.length+' balloons '+GONE.balloons.length;}));
  // rocket fuse on a balloon
  console.log('fuse',await ev(async()=>{const b=XTRA.balloons.find(b=>!b.dead);if(!b)return 'no balloon';const p=b.g.position.clone().add(new V3(0,4,0));spawnShot('rocket',p.clone().add(new V3(-40,0,5)),new V3(60,0,0),0xffffff,true,'x'+Math.random(),mp.id);await new Promise(r=>setTimeout(r,2500));return 'balloons gone '+GONE.balloons.length;}));
  console.log(await ev(()=>{putBack();return 'after put back train '+GONE.train+' birds '+GONE.birds.length+' balloons '+GONE.balloons.length+' visible '+(TRAIN.cars[0].parent?1:0);}));
});
