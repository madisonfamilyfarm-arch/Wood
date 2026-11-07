const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  const j=await ev(async()=>{const j=await (await fetch('/micro.json')).json();useSpec(sanitize(j.spec));openWorkshop(true);for(let n=0;n<3;n++)wsTool('shrinkAll');WS.name='Nano drone';wsChanged();const sp=wsSpec();return JSON.stringify({type:'woods-drone',v:2,spec:sp},null,1);});
  require('fs').writeFileSync('/mnt/user-data/outputs/Nano-drone.drone.json',j);await A.waitForTimeout(1500);await A.screenshot({path:'nano_ws.png'});
  console.log(await ev(()=>{const sp=wsSpec();closeWorkshop();useSpec(sp);takeoff();return 'w '+Math.round(ST.w)+' tw '+ST.tw.toFixed(1)+' '+ST.mins.toFixed(1)+'min';}));await A.waitForTimeout(3000);
  console.log(await ev(()=>{__wds.step({ly:1},2);__wds.step({ry:1},2);return D.state+' h '+(D.pos.y-groundY(D.pos.x,D.pos.z)).toFixed(1)+' hs '+Math.hypot(D.vel.x,D.vel.z).toFixed(1);}));
});
