const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);
  await P.evaluate(()=>{startGame('free');DZ.on=true;});await P.waitForTimeout(1500);
  // build a tank from the kit and drive it
  await P.evaluate(()=>{bsOpen('tank',null);bsClose();useSpec(wsSpec());closeWorkshop();});await P.waitForTimeout(2000);
  console.log(await P.evaluate(()=>'kind '+vhKind()+' armor '+vhArmor().toFixed(2)+' hp '+VH.hp+'/'+VH.max));
  for(let i=0;i<8;i++){const r=await P.evaluate(()=>{D.shield=0;const p=D.pos.clone().add(new V3(1,0,0));explode(p,6,2,false,'Tester','tst');return 'hp '+Math.round(VH.hp)+' dead '+!!DZ.dead+' dmg '+Object.keys(D.dmg||{}).join(',');});console.log('rocket',i+1,r);if(/dead true/.test(r))break;await P.waitForTimeout(200);}
  console.log(await P.evaluate(()=>{dzRespawn();D.shield=0;const p=D.pos.clone();explode(p,32,5,false,'Tester','tst');return 'MASSIVE: dead '+!!DZ.dead;}));
  // drone: one rocket
  console.log(await P.evaluate(()=>{dzRespawn();useSpec({name:'Mini',parts:null});return 'x';}).catch(e=>'skip'));
});
