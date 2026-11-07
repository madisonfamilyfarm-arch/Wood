const H=require('./harness');
H(async({mk})=>{const A=await mk('A','http://127.0.0.1:8765/woods-rc-sim.html');await A.waitForTimeout(2500);
  console.log(await A.evaluate(()=>['192.168.128.50','http://1.2.3.4:8080','https://dads-ai.example.com','https://dads-ai.example.com/api/tags','http://x.ts.net/','100.64.1.2'].map(aiUrlFix).join(' | ')));});
