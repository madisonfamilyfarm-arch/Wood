const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(async()=>{const j=await (await fetch('/zfast.json')).json();ECO.up={mot:0,bat:0,frm:0};const sp=sanitize(j.spec);useSpec(sp);const s=ST;return 'w '+Math.round(s.w)+' top '+s.top.toFixed(1)+' min '+s.mins.toFixed(1)+' why='+(s.why||'')+' elec='+JSON.stringify(s.elec&&{rx:s.elec.rx,gps:s.elec.gps,board:s.elec.board});}));
  await A.evaluate(()=>{takeoff();});await A.waitForTimeout(3000);await A.evaluate(()=>{__wds.step({ly:1},3);__wds.step({ry:1},3);});
  console.log(await A.evaluate(()=>D.state+' speed '+Math.hypot(D.vel.x,D.vel.z).toFixed(1)));
  await A.evaluate(()=>__wds.setCam('CHASE'));await A.waitForTimeout(800);await A.screenshot({path:'zf.png'});
});
