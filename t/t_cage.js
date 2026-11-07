const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);await A.evaluate(()=>startGame('free'));await A.waitForTimeout(1500);
  console.log(await A.evaluate(()=>{const base={name:'Cage test',parts:[{t:'body',w:6,len:10},...[45,135,225,315].map(a=>({t:'arm',a,len:12,w:1.6})),...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'motor',x,y,h:1.4,r:5,pow:6})),...[[8.5,-8.5],[8.5,8.5],[-8.5,8.5],[-8.5,-8.5]].map(([x,y])=>({t:'guard',style:'cage',x,y,h:3,r:5.5})),{t:'battery',h:-3.2,w:3,len:6}]};useSpec(sanitize(base));openWorkshop(true);return SPEC.name+' '+SPEC.parts.length;}));
  await A.waitForTimeout(2000);await A.screenshot({path:'cage2.png'});
});
