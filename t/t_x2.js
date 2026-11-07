const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(2000);
  const ev=(f,a)=>A.evaluate(f,a);
  await A.keyboard.press('Backquote');await A.waitForTimeout(500);console.log('console',await ev(()=>CONS.open+' lines '+CONS.L.length+' | '+$('consP').innerText.slice(0,400).replace(/\n/g,' / ')));await A.screenshot({path:'cons.png'});await A.keyboard.press('Backquote');
  // fall off the tower
  console.log('tower',await ev(()=>{walkToggle(true);WALK.pos.set(FT.x,FT.top,FT.z+3);WALK.vy=0;keys.KeyW=false;for(let i=0;i<5;i++)tickWalk(1/60);WALK.yaw=Math.PI/2*-1;keys.KeyW=true;for(let i=0;i<120;i++)tickWalk(1/60);keys.KeyW=false;const still=Math.abs(WALK.pos.y-FT.top)<0.3;
    WALK.vy=4.2;keys.KeyW=true;for(let i=0;i<240;i++)tickWalk(1/60);keys.KeyW=false;return 'stayed on deck '+still+' then jumped: y '+WALK.pos.y.toFixed(1)+' leg '+HURT.leg+' heal item '+!!mainItems().find(i=>/HEAL/.test(i.label()));}));
  console.log('heal',await ev(()=>{heal();return HURT.leg;}));
  // bots of all kinds
  await ev(()=>{walkToggle(false);aiSet(6);});await A.waitForTimeout(6000);
  console.log('bots',await ev(()=>AIB.L.map(B=>B.name+':'+B.kind+' y'+B.p.y.toFixed(0)).join(' | ')+' meshes '+Object.values(mp.peers).filter(p=>p.mesh).length));
  // missions
  console.log('missions',await ev(()=>{hikerStart();pkgStart();XTRA.chalNew();return xtraItems().map(i=>i.label()).join(' | ').slice(0,500)+' chal '+XTRA.chal.L.map(c=>c.n).join(',');}));
  console.log('pkg',await ev(()=>{const P=XTRA.pkg;takeoff();D.state='flying';D.pos.copy(P.box.position);xtraTick(1/60);const c=P.carried;D.pos.set(P.tx,H(P.tx,P.tz)+1,P.tz);xtraTick(1/60);return c+' delivered '+!XTRA.pkg+' coins '+ECO.coins;}));
  console.log('hiker',await ev(()=>{const h=XTRA.hiker;D.pos.set(h.x,H(h.x,h.z)+3,h.z+2);xtraTick(1/60);return !XTRA.hiker;}));
  await ev(()=>{fireworks(4);CFG.tod=22;applyTOD();});await A.waitForTimeout(2500);await A.screenshot({path:'night.png'});
  console.log('night ufo',await ev(()=>!!XTRA.ufo&&XTRA.ufo.visible)+' trophies '+JSON.stringify(TROPHY));
});
