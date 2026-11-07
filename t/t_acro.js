const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  await ev(()=>{takeoff();});await A.waitForTimeout(3000);await ev(()=>__wds.step({ly:1},2));
  console.log('triple tap',await ev(()=>{rthPress();rthPress();rthPress();return 'assist='+SPEC.assist+' rth='+!!rth;}));
  const s=await ev(()=>{const o=[];const y0=D.pos.y;__wds.step({},1.5);o.push('hover dy '+(D.pos.y-y0).toFixed(2));
    __wds.step({ry:1},0.25);o.push('tilted pitch '+D.pitch.toFixed(2));__wds.step({},0.5);o.push('stays tilted '+D.pitch.toFixed(2)+' hspeed '+Math.hypot(D.vel.x,D.vel.z).toFixed(1));
    __wds.step({ry:-1},0.25);__wds.step({ly:0.3},0.5);const c0=ECO.coins;__wds.step({ly:0.6},1.0);__wds.step({rx:1},0.6);o.push('after roll state '+D.state+' roll '+D.roll.toFixed(2));return o.join(' | ');});
  console.log(s);await A.waitForTimeout(1500);console.log('coins',await ev(()=>ECO.coins),'state',await ev(()=>D.state));
  await ev(()=>{rthPress();rthPress();rthPress();});console.log('back safe',await ev(()=>SPEC.assist));
  // cage guards + rocket
  console.log(await ev(()=>{const base={parts:[{t:'body',w:6,len:10},...[45,135,225,315].map(a=>({t:'arm',a,len:12,w:1.6})),...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'motor',x,y,h:1.4,r:5,pow:6})),...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'guard',style:'cage',x,y,h:3,r:5.5})),{t:'battery',h:-3.2,w:3,len:6},{t:'rocket',y:7,w:3,len:10,pow:5}]};
    const s=stats(sanitize(base));return 'cage '+s.cage+' guards '+s.guards+' tough '+s.tough+' top '+s.top.toFixed(0)+' rFwd '+Math.round(s.info.rFwd)+' combo '+s.combo;}));
  await ev(()=>{const base={parts:[{t:'body',w:6,len:10},...[45,135,225,315].map(a=>({t:'arm',a,len:12,w:1.6})),...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'motor',x,y,h:1.4,r:5,pow:6})),...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'guard',style:'cage',x,y,h:3,r:5.5})),{t:'battery',h:-3.2,w:3,len:6}]};useSpec(sanitize(base));__wds.setCam('CHASE');});
  await A.waitForTimeout(1500);await A.screenshot({path:'cage.png'});
});
