const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  console.log('cycle',await ev(()=>{const o=[];for(let i=0;i<6;i++){cycleShot();o.push(shotMode+':'+$('bShot').textContent);}return o.join(' | ');}));
  console.log('settings',await ev(()=>fireItems().map(i=>i.label()).filter(l=>/fast|grow|Most|tank/.test(l)).join(' | ')+' || flight: '+flightItems()[1].label()));
  // trees catch
  console.log('trees',await ev(()=>{FIRE.own=true;FIRE.set.catch=4;const ch=[...chunks.values()].find(c=>c.trees&&c.trees.length>20);const t=ch.trees[0];fireAdd({id:'x1',x:t.x+3,z:t.z,r:2});FIRE.L[0].int=1;for(let i=0;i<60*20;i++)fireTick(1/60);return 'fires '+FIRE.L.length+' tree fires '+FIRE.L.filter(f=>f.tree).length+' burnt '+[...chunks.values()].reduce((a,c)=>a+(c.trees||[]).filter(t=>t.burnt).length,0)+' hot '+FIRE.hot.size;}));
  await ev(()=>{const F=FIRE.L.find(f=>f.tree)||FIRE.L[0];D.pos.set(F.x+14,F.gy+6,F.z+14);D.yaw=Math.atan2(14,14);__wds.setCam('FPV');});await A.waitForTimeout(3000);await A.screenshot({path:'treefire.png'});
  // water shutter mode
  console.log('water mode',await ev(()=>{while(shotMode!=='water')cycleShot();takeoff();return shotMode;}));await A.waitForTimeout(3000);
  console.log(await ev(()=>{FIRE.tank=1;shutter(true);const a=FIRE.held;for(let i=0;i<30;i++)fireTick(1/60);shutter(false);return 'held '+a+' tank '+FIRE.tank.toFixed(2);}));
  console.log('dig',await ev(()=>{while(shotMode!=='dig')cycleShot();resetDrone();walkToggle(true);shutter(true);return 'ok';}));await A.waitForTimeout(1500);
  console.log('sx',await ev(()=>{openWorkshop(true);WS.sel=WS.parts.findIndex(p=>p.t==='camera'||p.t==='motor');const p=WS.parts[WS.sel];wsTool('wide');wsTool('wide');wsTool('long');const r=p.t+' sx '+p.sx+' sz '+p.sz+' r '+p.r;closeWorkshop();return r;}));
});
