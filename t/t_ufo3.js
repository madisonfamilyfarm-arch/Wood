const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(async()=>{const j=await (await fetch('/ufo2.json')).json();ECO.up={mot:0,bat:0,frm:0};useSpec(sanitize(j.spec));return 'tw '+ST.tw.toFixed(2)+' why='+ST.why+' imb '+JSON.stringify(ST.imb)+' fc '+JSON.stringify(ST.fc&&{head:ST.fc.head,alpha:ST.fc.alpha,mismatch:ST.fc.mismatch,yawRes:ST.fc.yawRes});}));
  await A.evaluate(()=>takeoff());await A.waitForTimeout(3000);await A.evaluate(()=>{__wds.step({ly:1},2);__wds.step({ry:1},3);const y0=D.pos.y;CB.btn=true;__wds.step({},2);CB.btn=false;window._boostUp=(D.pos.y-y0).toFixed(1);__wds.setCam('CHASE');});
  console.log(await A.evaluate(()=>'boost up '+window._boostUp+' '+D.state+' h '+(D.pos.y-groundY(D.pos.x,D.pos.z)).toFixed(1)+' hs '+Math.hypot(D.vel.x,D.vel.z).toFixed(1)));
  await A.waitForTimeout(1500);await A.screenshot({path:'ufo.png'});
});
