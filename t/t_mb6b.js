const H=require('./harness');const fs=require('fs');const J=JSON.parse(fs.readFileSync('mybuild6.json'));
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);
  console.log(await A.evaluate(j=>{const sp=sanitize(j.spec);const I=partsInfo(sp);const out=['W '+I.W.toFixed(0)+' T '+I.T.toFixed(0)+' n '+I.n+' pow '+I.pow];
    sp.parts.forEach((p,k)=>{const s2=JSON.parse(JSON.stringify(sp));s2.parts.splice(k,1);const I2=partsInfo(s2);out.push(k+' '+p.t+' mass '+(I.W-I2.W).toFixed(0)+' thrust '+(I.T-I2.T).toFixed(0)+(I.struck&&I.struck.length?'':'')) ;});
    out.push('struck '+JSON.stringify((I.struck||[]).map(x=>x.id||x)).slice(0,200)+' unatt '+JSON.stringify(I.unattached||null).slice(0,200));return out.join('\n');},J));
});
