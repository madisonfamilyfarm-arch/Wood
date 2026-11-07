const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  // a quad with a rocket on the back, 4 wheels, a water prop and wings = everything
  const sp={name:'Combo test',flyAs:'combo',parts:[{t:'body',w:6,len:10,col:'#ff8800'},
    ...[[45,-1],[135,1],[225,1],[315,-1]].map(([a])=>({t:'arm',x:0,y:0,a,len:12,w:1.6})),
    ...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'motor',x,y,h:1.4,r:5,pow:8})),
    {t:'battery',h:-3.2,w:3,len:6},{t:'rocket',y:7,w:3,len:10,pow:5},{t:'wheel',x:-4,y:-4,h:-4,r:2,w:1},{t:'wheel',x:4,y:-4,h:-4,r:2,w:1},{t:'wheel',x:-4,y:4,h:-4,r:2,w:1},{t:'wheel',x:4,y:4,h:-4,r:2,w:1},
    {t:'wing',w:30,len:6,d:1,h:2},{t:'wprop',y:6,h:-3,r:2,pow:5}]};
  console.log('stats',await ev(s=>{useSpec(sanitize(s));return JSON.stringify({combo:ST.combo,kind:vkind(),tw:ST.tw.toFixed(1),top:ST.top.toFixed(1),why:ST.why,desc:comboDesc(ST),rF:Math.round(ST.info.rFwd),wheels:ST.info.wheels.length,wp:ST.info.wp});},sp));
  // drive on wheels (landed, motors off)
  const p0=await ev(()=>[D.pos.x,D.pos.z,D.state]);
  await ev(()=>{for(let i=0;i<120;i++)tickDrone(1/60,{lx:0,ly:0,rx:0,ry:1});});
  const p1=await ev(()=>[D.pos.x,D.pos.z,D.state,CB.wv.toFixed(1)]);console.log('drive',JSON.stringify(p0),'->',JSON.stringify(p1));
  // fly + boost
  await ev(()=>{takeoff();});await A.waitForTimeout(3000);await ev(()=>__wds.step({ly:1},2));
  const b0=await ev(()=>[D.pos.x,D.pos.y,D.pos.z]);
  await ev(()=>{CB.btn=true;for(let i=0;i<90;i++){tickDrone(1/60,{lx:0,ly:0.3,rx:0,ry:0});}});
  const b1=await ev(()=>[D.pos.x,D.pos.y,D.pos.z,D.state,CB.u.toFixed(2),CB.fuel.toFixed(2),CB.bv.length().toFixed(1)]);await ev(()=>{CB.btn=false;});
  console.log('boost moved',Math.hypot(b1[0]-b0[0],b1[2]-b0[2]).toFixed(1),'m in 1.5s',JSON.stringify(b1));
  await ev(()=>{CB.btn=true;});await A.waitForTimeout(700);await ev(()=>__wds.setCam('CHASE'));await A.waitForTimeout(500);await A.screenshot({path:'combo.png'});await ev(()=>{CB.btn=false;});
  // alt-tab: keys let go
  console.log('blur',await ev(()=>{keys.KeyW=true;touch.ly=1;window.dispatchEvent(new Event('blur'));return keys.KeyW+' '+touch.ly;}));
  // workshop shows combo
  console.log('ws',await ev(()=>{openWorkshop(true);const t=$('wsStats').innerText.slice(0,160);closeWorkshop();return t;}));
  // auto: plain drone stays plain
  console.log('plain mini combo?',await ev(()=>{useSpec(sanitize(PRESETS.mini));return !!ST.combo+' '+vkind();}));
});
