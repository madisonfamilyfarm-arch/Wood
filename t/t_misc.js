const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html'),B=await mk('B','http://127.0.0.1:8775/woods-rc-sim.html',{width:390,height:780});
  for(const p of [A,B]){await p.waitForTimeout(2500);await p.evaluate(()=>startGame('free'));}
  await A.waitForTimeout(4000);
  console.log('start spots A',await A.evaluate(()=>D.pos.toArray().map(v=>v.toFixed(1)).join(',')));
  await A.evaluate(()=>startCourse('hoops'));await B.waitForTimeout(1500);
  console.log('race together -> B course:',await B.evaluate(()=>course&&course.key),'count',await B.evaluate(()=>count.toFixed(1)));
  await A.evaluate(()=>startCourse('free'));
  await A.evaluate(()=>walkToggle(true));await B.waitForTimeout(1500);
  console.log('B sees A walking:',await B.evaluate(()=>{const pe=Object.values(__wds.mp.peers)[0];return pe.walking&&pe.pilot&&pe.pilot.visible;}));
  await B.evaluate(()=>{menuToggle(true);});await B.waitForTimeout(800);await B.screenshot({path:'phone_menu.png'});
  await B.evaluate(()=>{menuToggle(false);chatOpen();});await B.waitForTimeout(600);await B.screenshot({path:'phone_chat.png'});
});
