const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  const ev=(f,a)=>A.evaluate(f,a);
  console.log(await ev(()=>{campAdd();campAdd();return 'campers '+CAMPERS.L.length+' names '+CAMPERS.L.map(c=>c.name).join(',');}));
  // far fire: someone should drive the truck there
  console.log(await ev(()=>{FIRE.own=true;FIRE.set.spread=0.25;FIRE.set.catch=0.25;fireAdd({id:'far1',x:105,z:-4,r:2});FIRE.L[0].int=1;chatSend('Help! Put out the fire! The trees are on fire');return 'order '+CAMPERS.order;}));
  for(let k=0;k<6;k++){await A.waitForTimeout(5000);console.log(await ev(()=>'truck ai '+(TRUCK.ai&&TRUCK.ai.name)+' at '+TRUCK.x.toFixed(0)+','+TRUCK.z.toFixed(0)+' tank '+TRUCK.tank.toFixed(0)+' fires '+FIRE.L.length+' int '+(FIRE.L[0]?FIRE.L[0].int.toFixed(2):'-')+' states '+CAMPERS.L.map(c=>c.state[0]).join('')));}
  console.log('chat',await ev(()=>CHAT.slice(-6).map(c=>(c.who||'')+': '+c.txt).join(' / ')));
  await ev(()=>{__wds.setCam('CHASE');D.pos.set(TRUCK.x+10,H(TRUCK.x,TRUCK.z)+6,TRUCK.z+10);});await A.waitForTimeout(1500);await A.screenshot({path:'camp2.png'});
  console.log('follow',await ev(()=>{chatSend('follow me');return CAMPERS.order;}),'shout menu',await ev(()=>shoutItems().length+' '+mainItems().map(i=>i.label()).filter(l=>/Shout|campers/.test(l)).join(' | ')));
});
