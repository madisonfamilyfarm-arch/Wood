const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');
  await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  await ev(()=>{__wds.setCam('PILOT');});await A.waitForTimeout(1200);await A.screenshot({path:'f_pilot.png'});
  // --- space (anything goes)
  await ev(()=>{CFG.real=false;CFG.maxH=20000;useSpec({name:'Space UFO',parts:[{t:'shape',style:'disc',w:40,len:40,d:10,col:'#c0c0c0',mat:'metal'},{t:'sprop',x:-15,y:-15,r:6},{t:'sprop',x:15,y:-15,r:6},{t:'sprop',x:-15,y:15,r:6},{t:'sprop',x:15,y:15,r:6},{t:'battery',h:-5}]});takeoff();D.pos.y=5000;D.state='flying';__wds.setCam('CHASE');});
  await A.waitForTimeout(2500);await A.screenshot({path:'f_space.png'});
  await ev(()=>{CFG.real=true;CFG.maxH=120;saveCfg();});
  // --- workshop with new parts
  await ev(()=>{useSpec(sanitize({name:'UFO',parts:[{t:'shape',style:'disc',w:60,len:60,d:14,col:'#9aa0a6',mat:'metal'},{t:'shape',style:'sphere',mat:'glass',w:20,len:20,d:14,h:6,col:'#9fd3ff'},{t:'battery',h:-6},{t:'hover',x:-18,y:-18,h:-8,r:8},{t:'hover',x:18,y:-18,h:-8,r:8},{t:'hover',x:-18,y:18,h:-8,r:8},{t:'hover',x:18,y:18,h:-8,r:8},{t:'rocket',y:32,w:4,len:14},{t:'gun',style:'mg',x:20,y:-20,h:-4}]}));openWorkshop(true);});
  await A.waitForTimeout(2500);await A.screenshot({path:'f_ws.png'});
  await ev(()=>closeWorkshop());
  // --- controller setup screen
  await ev(()=>{rcSetup();});await A.waitForTimeout(500);await A.screenshot({path:'f_rc.png'});
  await ev(()=>{rcwBtn('p:dji');});await A.waitForTimeout(500);await A.screenshot({path:'f_dji.png'});
  await ev(()=>rcwClose());
});
