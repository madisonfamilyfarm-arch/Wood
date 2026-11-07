const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{const it=mainItems().find(i=>/Take me to the fire truck/.test(i.label()));it.act();for(let i=0;i<3;i++)tickWalk(1/60);return 'walk '+WALK.on+' btn '+$('truckB').style.display+' truck at '+TRUCK.x.toFixed(0)+','+TRUCK.z.toFixed(0);}));
  await A.waitForTimeout(1500);await A.screenshot({path:'tg.png'});
});
