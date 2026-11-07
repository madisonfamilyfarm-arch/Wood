const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(6000);
  console.log(await A.evaluate(()=>JSON.stringify({baked:LOOK.baked,pend:EZ.pending(),info:LKT.info})));
  const url=await A.evaluate(()=>__wds.LKT.tex.image.toDataURL());require('fs').writeFileSync('atlas.png',Buffer.from(url.split(',')[1],'base64'));});
