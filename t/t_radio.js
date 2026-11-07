const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  const B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html');
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await B.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  // close-up of each plane type with surfaces deflected
  for(const k of ['trainer','sport','jet','bi','wing']){
    const ok=await ev(k=>{const P=__wds.VPRESETS.plane[k];if(!P)return 'missing';__wds.useSpec(P);__wds.setCam('CHASE');__wds.csApply(__wds.DR,[0.8,0.8,0.8,1]);
      const S=__wds.DR.surf;return Object.keys(S).join(',');},k);
    console.log(k,'surf',ok);
    await A.waitForTimeout(1800);await A.screenshot({path:'plane_'+k+'.png'});
  }
  // radio: rates, expo, trim -> surfaces follow sticks on the ground (preflight check)
  const r1=await ev(()=>{__wds.useSpec(__wds.VPRESETS.plane.sport);__wds.RADIO.expo=0;__wds.RADIO.rate='high';__wds.step({rx:1},0.5);const a=__wds.DR.surf.ail[1].rotation.x;__wds.RADIO.rate='low';__wds.step({rx:1},0.5);const b=__wds.DR.surf.ail[1].rotation.x;__wds.RADIO.rate='high';__wds.RADIO.expo=30;return[a.toFixed(3),b.toFixed(3)];});
  console.log('aileron high/low',r1);
  // throttle cut stops the motor
  const r2=await ev(()=>{takeoff();__wds.cutSet(true,true);__wds.step({ly:1},1);const t=__wds.D.thr;__wds.cutSet(false,true);return t;});
  console.log('thr with cut',r2);
  // fly, flaps -> slower stall, smoke trail, multiplayer relay
  const r3=await ev(()=>{const D=__wds.D;takeoff();__wds.step({},8);const alt=D.pos.y;__wds.flapSet(1,true);__wds.smokeToggle();__wds.step({ry:0.3},2);for(let i=0;i<40;i++){__wds.step({},0.05);}return{alt:alt.toFixed(1),state:D.state,flaps:D.flaps,smk:__wds.SMK.length};});
  console.log('fly',JSON.stringify(r3));
  await A.waitForTimeout(3000);
  const rb=await B.evaluate(()=>{const pe=Object.values(__wds.mp.peers)[0];return pe?{cs:pe.cs,sm:pe.sm,smk:__wds.SMK.length}:null;});
  console.log('B sees',JSON.stringify(rb));
  await A.evaluate(()=>__wds.setCam('CHASE'));await A.waitForTimeout(1500);await A.screenshot({path:'smoke.png'});
  // pause / slow-mo
  const r4=await ev(async()=>{__wds.pauseToggle();const p=__wds.D.pos.clone();await new Promise(r=>setTimeout(r,1500));const d=p.distanceTo(__wds.D.pos);__wds.pauseToggle();__wds.slowCycle();const s=__wds.SIM.speed;__wds.slowCycle();__wds.slowCycle();return{movedWhilePaused:d.toFixed(3),slow:s,back:__wds.SIM.speed};});
  console.log('pause',JSON.stringify(r4));
  // rescue from a steep bank
  const r5=await ev(()=>{const D=__wds.D;__wds.step({rx:1},0.6);const b0=D.roll;__wds.rescue();__wds.step({},2.5);return{before:b0.toFixed(2),after:D.roll.toFixed(2),state:D.state};});
  console.log('rescue',JSON.stringify(r5));
  // lesson: take-off lesson with the autopilot take-off
  const r6=await ev(()=>{const D=__wds.D;__wds.useSpec(__wds.VPRESETS.plane.trainer);__wds.lesStart('ptake');const s0=__wds.LES.step;takeoff();takeoff();let steps=[];for(let i=0;i<200&&__wds.LES.on;i++){__wds.step({ly:0.2},0.1);tickLessons(0.1);steps.push(__wds.LES.step);}return{s0,end:__wds.LES.on,last:__wds.LES.step,alt:D.pos.y.toFixed(1),box:document.getElementById('lesBox').textContent.slice(0,80)};});
  console.log('lesson',JSON.stringify(r6));
  await A.waitForTimeout(2500);
  const r7=await ev(()=>({on:__wds.LES.on,step:__wds.LES.step,box:document.getElementById('lesBox').textContent.slice(0,120)}));
  console.log('lesson2',JSON.stringify(r7));
  await A.screenshot({path:'lesson.png'});
  // menus render
  await ev(()=>{__wds.menuToggle(true);__wds.menuPush('📻 Radio',radioItems());});await A.waitForTimeout(800);await A.screenshot({path:'radio_menu.png'});
  await ev(()=>{__wds.menuToggle(false);__wds.menuToggle(true);__wds.menuPush('🎓 Flight lessons',lessonItems());});await A.waitForTimeout(800);await A.screenshot({path:'lesson_menu.png'});
  await ev(()=>__wds.menuToggle(false));
});
