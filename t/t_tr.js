const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);
  console.log(await A.evaluate(()=>{const P=trail.getSpacedPoints(40);return 'len '+trail.getLength().toFixed(0)+' '+P.map(p=>Math.round(p.x)+','+Math.round(p.z)+(inWater(p.x,p.z)?'W':'')).join(' ');}));});
