const H=require('./harness');
H(async({mk})=>{
  const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(3000);
  const r=await A.evaluate(async()=>{const j=await (await fetch('/zipper.json')).json();const sp=sanitize(j.spec);const s=stats(sp);const info=partsInfo?partsInfo(sp):null;
    const keys=['w','thrust','tw','top','mins','tough','agile','tilt','vz','yaw','why','rad'];const o={};keys.forEach(k=>o[k]=typeof s[k]==='number'?+s[k].toFixed(2):s[k]);return JSON.stringify({stats:o,info});});
  console.log(r);
});
