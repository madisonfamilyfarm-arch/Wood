const H=require('./harness');
H(async({mk})=>{const P=await mk('P','http://127.0.0.1:8765/woods-rc-sim.html');await P.waitForTimeout(3000);await P.evaluate(()=>{startGame('free');aiSet(2);});await P.waitForTimeout(2500);
  const R=+process.env.R||80;
  await P.evaluate(R=>{D.state='flying';D.pos.set(PAD.x,H(PAD.x,PAD.z)+25,PAD.z+R*1.6);D.vel.set(0,0,0);TNT.r=R;TNT.dr=12;const T=tntAdd('x1',new V3(PAD.x,H(PAD.x,PAD.z)+0.2,PAD.z),new V3(),true);SIM.pause=false;tntBoom(T);},R);
  for(const t of (process.env.TS||"150,500,1200").split(",").map(Number)){await P.waitForTimeout(t);await P.screenshot({path:'g_'+t+'.png'});}
  console.log(await P.evaluate(()=>'craters '+CRATERS.length+' gone '+GONE.objs.length+' boomed '+BOOMED.length+' state '+D.state));
});
