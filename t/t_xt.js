const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  console.log(await ev(()=>{xtAdd();xtAdd();const T=XT.T[0];return 'n '+XT.n+' '+T.name+' pts '+T.S.length+' blocked '+blocked(T.S[10].x,T.S[10].z)+' course '+!!courses['xt'+T.seed]+' order '+COURSE_ORDER.slice(0,6).join(',');}));
  console.log('menu',await ev(()=>mainItems().map(i=>i.label()).filter(l=>/trail|airport/i.test(l)).join(' | ')));
  console.log('dice',await ev(()=>{const a=JSON.stringify(FLD);aptDice();return a+' -> '+JSON.stringify(FLD);}));
  await ev(()=>{const T=XT.T[0];startCourse('xt'+T.seed);});await A.waitForTimeout(3000);
  await ev(()=>{takeoff();});await A.waitForTimeout(3000);await ev(()=>{__wds.step({ly:1},1.5);__wds.setCam('CHASE');});await A.waitForTimeout(2500);await A.screenshot({path:'xt.png'});
  console.log(await ev(()=>'course '+(course&&course.name)+' pos '+D.pos.x.toFixed(0)+','+D.pos.z.toFixed(0)));
});
